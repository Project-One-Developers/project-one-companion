import {
    Code2Icon,
    FileSpreadsheet,
    LucideAccessibility,
    LucideBot,
    LucideCpu,
    LucideGauge,
    LucideMedal,
    LucideScrollText,
    LucideSnail,
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

const preparationItems = [
    {
        title: 'Roster',
        url: '/roster',
        icon: LucideAccessibility
    },
    {
        title: 'Droptimizer',
        url: '/droptimizer',
        icon: LucideBot
    },
    {
        title: 'Loot Gains',
        url: '/loot-gains',
        icon: LucideGauge
    },
    {
        title: 'Loot Table',
        url: '/loot-table',
        icon: LucideScrollText
    },
    {
        title: 'Raid Progression',
        url: '/raid-progression',
        icon: LucideSnail
    },
    {
        title: 'Summary',
        url: '/summary',
        icon: LucideCpu
    }
]

const raidItems = [
    {
        title: 'Raid Session',
        url: '/raid-session',
        icon: LucideSwords
    },
    {
        title: 'Assign',
        url: '/assign',
        icon: LucideMedal
    }
]

const weakaurasItems = [
    {
        title: 'Project One',
        url: 'https://wago.io/_vARNxg02',
        icon: Code2Icon
    },
    {
        title: 'Reloe',
        url: 'https://wago.io/search/imports/wow/all?q=User%3A%22Reloe%22',
        icon: Code2Icon
    },
    {
        title: 'Northern Sky',
        url: 'https://wago.io/Y7yEWhBqV',
        icon: Code2Icon
    },
    {
        title: 'Liquid',
        url: 'https://wago.io/LiquidManaforge',
        icon: Code2Icon
    }
]

const spreadsheetItems = [
    {
        title: 'Split',
        url: 'https://docs.google.com/spreadsheets/d/1kA2AIMB65xXnOY-dHKhOkaecwbmymdXP_jLg1Bu7xTI/edit?gid=2067098323#gid=2067098323',
        icon: FileSpreadsheet
    },
    {
        title: 'Farm 11.1',
        url: 'https://docs.google.com/spreadsheets/d/1U8kKbRJQ13-cdH93otDlmc-6qbzQ1g55q9lRokvwSME/edit?pli=1&gid=0#gid=0',
        icon: FileSpreadsheet
    },
    {
        title: 'Ulria PI/Tier',
        url: 'https://docs.google.com/spreadsheets/d/1exJeu5eVe4bTmyg3WFx5PTxIWvDLi0j-WW-XWpGoG88/htmlview?gid=8138119#',
        icon: FileSpreadsheet
    },
    {
        title: 'WoW Audit',
        url: 'https://docs.google.com/spreadsheets/d/1oXDiksY6UFl6QEW0cFqF0iuxUE3ZM3g5WrrCBIx4OTA/edit?gid=0#gid=0',
        icon: FileSpreadsheet
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
                        <SidebarGroupLabel>Preparation</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {preparationItems.map(item => (
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
                        <SidebarGroupLabel>Raid</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {raidItems.map(item => (
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
                                {weakaurasItems.map(item => (
                                    <SidebarMenuItem
                                        key={item.title}
                                        className={`hover:bg-muted ${location.pathname === item.url ? 'bg-muted' : ''}`}
                                    >
                                        <SidebarMenuButton asChild>
                                            <a href={item.url} rel="noreferrer" target="_blank">
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Spreadsheet</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {spreadsheetItems.map(item => (
                                    <SidebarMenuItem
                                        key={item.title}
                                        className={`hover:bg-muted ${location.pathname === item.url ? 'bg-muted' : ''}`}
                                    >
                                        <SidebarMenuButton asChild>
                                            <a href={item.url} rel="noreferrer" target="_blank">
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </a>
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
