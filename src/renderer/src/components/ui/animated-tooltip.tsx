'use client'

import { classIcon } from '@renderer/lib/class-icon'
import { cn } from '@renderer/lib/utils'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useState, type JSX } from 'react'
import type { Character, Player } from 'shared/types/types'
import { CharacterForm } from '../character-form'

export const AnimatedTooltip = ({
    items,
    player,
    className
}: {
    items: Character[]
    player: Player
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

    return (
        <div className={cn('flex items-center gap-2', className)}>
            {items.slice(0, 5).map((item) => (
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
                                    {item.characterName}
                                </div>
                                <div className="text-muted-foreground text-xs">{item.class}</div>
                                {item.droptimizer?.length ? (
                                    <div className="text-muted-foreground text-xs">
                                        Last droptimizer:
                                        {new Date(
                                            item.droptimizer[item.droptimizer.length - 1].date
                                        ).toLocaleDateString()}
                                    </div>
                                ) : null}
                                {item.droptimizer?.length ? (
                                    <div className="text-muted-foreground text-xs">
                                        Last droptimizer:{' '}
                                        {new Date(
                                            item.droptimizer[item.droptimizer.length - 1].date
                                        ).toLocaleDateString()}
                                    </div>
                                ) : null}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <img
                        onMouseMove={handleMouseMove}
                        height={50}
                        width={50}
                        src={classIcon.get(item.class)}
                        alt={item.class}
                        className="object-cover !m-0 !p-0 object-top rounded-full h-12 w-12 border group-hover:scale-105 group-hover:z-30 border-background relative transition duration-500"
                    />
                </div>
            ))}
            <div className="ml-3">
                <CharacterForm playerName={player.playerName} />
            </div>
        </div>
    )
}
