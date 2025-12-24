import { Home, ClipboardList, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const menuItems = [
        { label: t('sidebar.dashboard'), icon: <Home className="w-5 h-5" />, path: "/" },
        { label: t('sidebar.assessment'), icon: <ClipboardList className="w-5 h-5" />, path: "/assessment" },
    ];

    return (
        <>
            {/* Mobile backdrop */}
            {!collapsed && (
                <div
                    className="fixed inset-0 z-30 bg-black/75 md:hidden"
                    onClick={() => setCollapsed(true)}
                />
            )}

            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 flex flex-col border-r transition-all duration-300",
                    collapsed
                        ? "-translate-x-full md:translate-x-0 w-16"
                        : "translate-x-0 w-60",
                    "bg-background md:bg-muted/30 md:relative"
                )}
            >
                {/* Top bar */}
                <div className="flex items-center justify-between px-4 py-2 h-16 border-b">
                    {!collapsed && (
                        <span className="text-base font-semibold tracking-tight">
                            {t('common.appName')}
                        </span>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 flex flex-col gap-1 px-2 py-4">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;

                        return (
                            <Button
                                key={item.path}
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full",
                                    collapsed ? "justify-center px-0" : "justify-start"
                                )}
                                onClick={() => {
                                    navigate(item.path);
                                    setCollapsed(true);
                                }}
                            >
                                {item.icon}
                                {!collapsed && (
                                    <span className="ml-3">{item.label}</span>
                                )}
                            </Button>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-2 mt-auto">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full",
                            collapsed ? "justify-center px-0" : "justify-start"
                        )}
                        onClick={() => navigate("/login")}
                    >
                        <LogOut className="h-5 w-5" />
                        {!collapsed && <span className="ml-3">{t('sidebar.logout')}</span>}
                    </Button>
                </div>
            </aside>
        </>
    );
}
