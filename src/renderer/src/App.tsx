import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProjectOneSidebar from './components/sidebar'
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar'
import { Toaster } from './components/ui/toaster'
import AddPlayer from './pages/add-player'
import DroptimizerForm from './pages/droptimizer'

function App(): JSX.Element {
    return (
        <>
            <SidebarProvider defaultOpen={true}>
                <ProjectOneSidebar />
                <SidebarTrigger />
                <BrowserRouter>
                    <Routes>
                        <Route path="/add-player" element={<AddPlayer />} />
                        <Route path="/droptimizer" element={<DroptimizerForm />} />
                    </Routes>
                </BrowserRouter>
                <Toaster />
            </SidebarProvider>
        </>
    )
}

export default App
