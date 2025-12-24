import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function Layout() {
    const [collapsed, setCollapsed] = useState(() =>
        localStorage.getItem('sidebarCollapsed') === 'true'
    );

    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', String(collapsed));
    }, [collapsed]);

    return (
        <div className="flex flex-col h-screen min-w-full overflow-hidden bg-background text-foreground">
            <div className="flex flex-1 overflow-hidden relative">
                <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

                {/* Main content area */}
                <div className="flex flex-col flex-1 min-h-0">
                    <Header collapsed={collapsed} setCollapsed={setCollapsed} />

                    <main className="flex-1 overflow-y-auto">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}
