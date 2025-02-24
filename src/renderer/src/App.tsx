import { QueryClientProvider } from '@tanstack/react-query'
import type { JSX } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import ProjectOneSidebar from './components/sidebar'
import { SidebarProvider } from './components/ui/sidebar'
import { Toaster } from './components/ui/toaster'
import { queryClient } from './lib/tanstack-query/client'
import { CharacterPage } from './pages/character'
import DroptimizerForm from './pages/droptimizer'
import HomePage from './pages/home'
import LootAssign from './pages/loot-assign'
import BisListPage from './pages/loot-bis'
import LootTable from './pages/loot-table'
import { RaidSessionPage } from './pages/raid-session'
import RaidSessionListPage from './pages/raid-session-list'
import RosterPage from './pages/roster'
import SettingsPage from './pages/settings'
import SummaryPage from './pages/summary'

function App(): JSX.Element {
    return (
        <QueryClientProvider client={queryClient}>
            <SidebarProvider defaultOpen={true}>
                <HashRouter>
                    <ProjectOneSidebar />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/roster" element={<RosterPage />} />
                        <Route path="/roster/:characterId" element={<CharacterPage />} />
                        <Route path="/droptimizer" element={<DroptimizerForm />} />
                        <Route path="/loot-table" element={<LootTable />} />
                        <Route path="/raid-session" element={<RaidSessionListPage />} />
                        <Route path="/raid-session/:raidSessionId" element={<RaidSessionPage />} />
                        <Route path="/assign" element={<LootAssign />} />
                        <Route path="/bis-list" element={<BisListPage />} />
                        <Route path="/summary" element={<SummaryPage />} />
                        <Route path="/config" element={<SettingsPage />} />
                    </Routes>
                </HashRouter>
                <Toaster />
            </SidebarProvider>
        </QueryClientProvider>
    )
}

export default App
