import {
    Code2Icon,
    LucideEye,
    LucideGauge,
    LucideHandshake,
    LucideSkull,
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
    SidebarMenuItem
} from './ui/sidebar'

import type { JSX } from 'react'

const rosterItems = [
    {
        title: 'Roster',
        url: '/roster',
        icon: LucideEye
    },
    {
        title: 'Droptimizer',
        url: '/droptimizer',
        icon: LucideGauge
    },
    {
        title: 'Loot Table',
        url: '/loot-table',
        icon: LucideSkull
    },
    {
        title: 'Raid Session',
        url: '/raid-session',
        icon: LucideSwords
    },
    {
        title: 'Tierset',
        url: '/tierset',
        icon: LucideHandshake
    }
]

const weakaurasItems = [
    {
        title: 'Placeholder 1',
        url: '#',
        icon: Code2Icon
    },
    {
        title: 'Placeholder 2',
        url: '#',
        icon: Code2Icon
    }
]

export default function ProjectOneSidebar(): JSX.Element {
    const location = useLocation()

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Raid</SidebarGroupLabel>
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
    )
}
