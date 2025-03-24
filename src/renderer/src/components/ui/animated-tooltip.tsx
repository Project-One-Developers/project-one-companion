'use client'

import { cn } from '@renderer/lib/utils'
import { classIcon } from '@renderer/lib/wow-icon'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useState, type JSX } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Character } from 'shared/types/types'

export const AnimatedTooltip = ({
    items,
    className
}: {
    items: Character[]
    className?: string
}): JSX.Element => {
    const [hoveredIndex, setHoveredIndex] = useState<string | null>(null)
    const springConfig = { stiffness: 100, damping: 5 }
    const x = useMotionValue(0)
    const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig)
    const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), springConfig)
    const handleMouseMove = (event): void => {
        const halfWidth = event.target.offsetWidth / 2
        x.set(event.nativeEvent.offsetX - halfWidth)
    }

    const navigate = useNavigate()

    return (
        <div className={cn('flex items-center gap-2', className)}>
            {items
                .sort((a, b) => (b.main ? 1 : 0) - (a.main ? 1 : 0)) // main char first
                .map(item => (
                    <div
                        className="-mr-4 relative group"
                        key={item.id}
                        onMouseEnter={() => setHoveredIndex(item.id)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <AnimatePresence mode="popLayout">
                            {hoveredIndex === item.id && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20, scale: 0.6 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        scale: 1,
                                        transition: {
                                            type: 'spring',
                                            stiffness: 260,
                                            damping: 10
                                        }
                                    }}
                                    exit={{ opacity: 0, y: 20, scale: 0.6 }}
                                    style={{
                                        translateX: translateX,
                                        rotate: rotate,
                                        whiteSpace: 'nowrap'
                                    }}
                                    className="absolute -top-16 -left-1/2 translate-x-1/2 flex text-xs flex-col items-center justify-center rounded-md bg-foreground z-50 shadow-xl px-4 py-2"
                                >
                                    <div className="absolute inset-x-10 z-30 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px" />
                                    <div className="absolute left-10 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px" />
                                    <div className="font-bold text-background relative z-30 text-base">
                                        {item.name}
                                    </div>
                                    <div className="text-muted-foreground text-xs">
                                        {item.main ? 'Main' : 'Alt'}
                                    </div>
                                    <div className="text-muted-foreground text-xs">
                                        {item.realm.replaceAll('-', ' ')}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div
                            className="cursor-pointer"
                            onClick={() => navigate(`/roster/${item.id}`)}
                        >
                            <img
                                onMouseMove={handleMouseMove}
                                height={50}
                                width={50}
                                src={classIcon.get(item.class)}
                                alt={item.class}
                                className={cn(
                                    'object-cover !m-0 !p-0 object-top rounded-full h-12 w-12 border group-hover:scale-105 group-hover:z-30 relative transition duration-500',
                                    item.main ? 'border-red-500' : 'border-background'
                                )}
                            />
                        </div>
                    </div>
                ))}
        </div>
    )
}
