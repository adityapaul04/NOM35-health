import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

export function LanguageToggle() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Change language">
                    <Globe className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="space-y-1">
                <DropdownMenuItem
                    onClick={() => changeLanguage("es")}
                    className={i18n.language === "es" ? "bg-accent text-white" : ""}
                >
                    🇲🇽 Español
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => changeLanguage("en")}
                    className={i18n.language === "en" ? "bg-accent text-white" : ""}
                >
                    🇺🇸 English
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
