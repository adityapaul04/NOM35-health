import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { GuideType } from "@/types/nom35";

interface GuideSelectorProps {
    onSelectGuide: (guide: GuideType) => void;
}

export default function GuideSelector({ onSelectGuide }: GuideSelectorProps) {
    const { t } = useTranslation();

    const guides = [
        {
            type: "I" as GuideType,
            icon: <FileText className="h-8 w-8 text-primary" />,
            title: t("assessment.guide1"),
            description: t("assessment.guide1Desc"),
            size: t("assessment.guide1Size"),
            color: "border-blue-200 hover:border-blue-400 dark:border-blue-800 dark:hover:border-blue-600",
        },
        {
            type: "II" as GuideType,
            icon: <Users className="h-8 w-8 text-primary" />,
            title: t("assessment.guide2"),
            description: t("assessment.guide2Desc"),
            size: t("assessment.guide2Size"),
            color: "border-green-200 hover:border-green-400 dark:border-green-800 dark:hover:border-green-600",
        },
        {
            type: "III" as GuideType,
            icon: <Building2 className="h-8 w-8 text-primary" />,
            title: t("assessment.guide3"),
            description: t("assessment.guide3Desc"),
            size: t("assessment.guide3Size"),
            color: "border-purple-200 hover:border-purple-400 dark:border-purple-800 dark:hover:border-purple-600",
        },
    ];

    return (
        <div className="p-2 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-semibold">
                    {t("assessment.title")}
                </h1>
                <p className="text-muted-foreground text-sm">
                    {t("assessment.subtitle")}
                </p>
            </div>

            {/* Guide Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {guides.map((guide) => (
                    <Card
                        key={guide.type}
                        className={`border-2 transition-all cursor-pointer ${guide.color}`}
                        onClick={() => onSelectGuide(guide.type)}
                    >
                        <CardHeader>
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="p-4 rounded-full bg-primary/10">
                                    {guide.icon}
                                </div>
                                <CardTitle className="text-lg">
                                    {guide.title}
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground text-center min-h-[60px]">
                                {guide.description}
                            </p>
                            <div className="text-center">
                                <span className="inline-block px-3 py-1 rounded-full bg-muted text-xs font-medium">
                                    {guide.size}
                                </span>
                            </div>
                            <Button
                                className="w-full cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectGuide(guide.type);
                                }}
                            >
                                {t("assessment.startGuide")}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
