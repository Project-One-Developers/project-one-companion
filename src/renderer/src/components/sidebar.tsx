import { Code2Icon, LucideEye, PlusIcon, Settings } from 'lucide-react'
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

const rosterItems = [
    {
        title: 'Visualizza Roster',
        url: '/roster',
        icon: LucideEye
    },
    {
        title: 'Aggiungi player',
        url: '/add-player',
        icon: PlusIcon
    },
    {
        title: 'Aggiungi droptimizer',
        url: '/droptimizer',
        icon: Code2Icon
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
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Roster</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {rosterItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
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
                    <SidebarGroupLabel>Weakauras</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {weakaurasItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <div className="mt-auto p-4 flex justify-start items-center">
                    {/* <ThemeSwitcher /> */}
                    <a href="/config" className="flex items-center gap-2">
                        <Settings />
                        <span>Settings</span>
                    </a>
                </div>
            </SidebarContent>
        </Sidebar>
    )
}
