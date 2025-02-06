import {
    Code2Icon,
    LucideAccessibility,
    LucideGauge,
    LucideMedal,
    LucidePuzzle,
    LucideScrollText,
    LucideSwords,
    Settings
} from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar
} from './ui/sidebar'

import type { JSX } from 'react'

const rosterItems = [
    {
        title: 'Roster',
        url: '/roster',
        icon: LucideAccessibility
    },
    {
        title: 'Droptimizer',
        url: '/droptimizer',
        icon: LucideGauge
    },
    {
        title: 'Loot Table',
        url: '/loot-table',
        icon: LucideScrollText
    },
    {
        title: 'Raid Session',
        url: '/raid-session',
        icon: LucideSwords
    },
    {
        title: 'Tierset',
        url: '/tierset',
        icon: LucidePuzzle
    },
    {
        title: 'Assign',
        url: '/assign',
        icon: LucideMedal
    }
]

const weakaurasItems = [
    {
        title: 'Nerubar',
        url: 'https://wago.io/F5xeJMMVb',
        icon: Code2Icon
    },
    {
        title: 'Liberation of Undermine',
        url: '#',
        icon: Code2Icon
    }
]

export default function ProjectOneSidebar(): JSX.Element {
    const location = useLocation()

    const { open } = useSidebar()

    if (!open) {
        return <SidebarTrigger className="absolute left-2 z-10" />
    }

    return (
        <>
            <Sidebar>
                <SidebarTrigger className="ml-2" />
                <SidebarContent>
                    <SidebarGroup>
                        {/* <SidebarGroupLabel>Raid</SidebarGroupLabel> */}
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {rosterItems.map((item) => (
                                    <SidebarMenuItem
                                        key={item.title}
                                        className={`hover:bg-muted ${location.pathname === item.url ? 'bg-muted' : ''}`}
                                    >
                                        <SidebarMenuButton asChild>
                                            <NavLink to={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </NavLink>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Weakauras</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {weakaurasItems.map((item) => (
                                    <SidebarMenuItem
                                        key={item.title}
                                        className={`hover:bg-muted ${location.pathname === item.url ? 'bg-muted' : ''}`}
                                    >
                                        <SidebarMenuButton asChild>
                                            <NavLink to={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </NavLink>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup className="mt-auto">
                        <button className="p-2 rounded-full hover:bg-muted w-fit focus:outline-none">
                            <NavLink to="/config">
                                <Settings />
                            </NavLink>
                        </button>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </>
    )
}
