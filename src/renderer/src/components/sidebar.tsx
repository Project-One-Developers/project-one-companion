import { Code2Icon, ListRestart, LucideEye } from 'lucide-react'
import { toast } from './hooks/use-toast'
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
        title: 'Roster',
        url: '/roster',
        icon: LucideEye
    },
    {
        title: 'Droptimizer',
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
    const upsertJsonData = async (): Promise<void> => {
        await window.api
            .upsertJsonData()
            .then(() => {
                toast({
                    title: 'Resources updated',
                    description: 'Data from JSON files has been updated in the database.'
                })
            })
            .catch(() => {
                toast({
                    title: 'Resources not updated',
                    description: `Could not update resources.`
                })
            })
    }

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Raid</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {rosterItems.map((item) => (
                                <SidebarMenuItem key={item.title} className="hover:bg-muted">
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
                                <SidebarMenuItem key={item.title} className="hover:bg-muted">
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
                <SidebarGroup className="mt-auto">
                    <button
                        onClick={upsertJsonData}
                        className="p-2 rounded-full hover:bg-muted w-fit focus:outline-none"
                    >
                        <ListRestart />
                    </button>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
