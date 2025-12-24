import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ModeToggle } from "./mode-toggle";
import { LanguageToggle } from "./LanguageToggle";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface HeaderProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

export default function Header({ collapsed, setCollapsed }: HeaderProps) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <header className="w-full border-b bg-background px-4 py-2 flex items-center justify-between min-h-16">
            {/* LEFT */}
            <div className="flex items-center gap-3">
                {/* Mobile hamburger */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <Menu className="h-5 w-5" />
                </Button>

                {/* Text Logo */}
                <div
                    className="cursor-pointer select-none"
                    onClick={() => navigate("/")}
                >
                    <span className="text-lg font-semibold tracking-tight">
                        {t('common.appName')}
                    </span>
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">
                <LanguageToggle />
                <ModeToggle />

                {/* Avatar dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-0 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs font-medium hover:text-black">
                                    U
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate("/profile")}>
                            {t('header.profile')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/settings")}>
                            {t('header.settings')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate("/login")}>
                            {t('header.logout')}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
