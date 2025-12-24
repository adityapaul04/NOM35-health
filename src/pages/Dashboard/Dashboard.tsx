import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ClipboardList,
    TrendingUp,
    ArrowRight,
    Calendar,
    FileText,
    Download,
    Droplets,
    Activity,
    Moon,
    Heart,
    BarChart3,
    CheckCircle2,
    Clock,
    ShieldCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAssessment } from "@/context/AssessmentContext";
import { generateNOM35Report } from "@/utils/nom35Calculations";
import CircularProgress from "@/components/CircularProgress";

// Import guide data
import guide1Data from "@/data/nom35-guide1.json";
import guide2Data from "@/data/nom35-guide2.json";
import guide3Data from "@/data/nom35-guide3.json";

export default function Dashboard() {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { assessment } = useAssessment();
    const isSpanish = i18n.language === "es";

    // Generate report if assessment exists
    const reportData = assessment
        ? (() => {
            const getTotalQuestions = () => {
                if (assessment.guideType === "I") {
                    return guide1Data.categories.reduce((sum, cat) => sum + cat.questions.length, 0);
                } else if (assessment.guideType === "II") {
                    return guide2Data.categories.reduce((sum, cat) => sum + cat.questions.length, 0);
                } else {
                    return guide3Data.categories.reduce((sum, cat) => sum + cat.questions.length, 0);
                }
            };
            return generateNOM35Report(
                assessment.guideType,
                assessment.responses,
                getTotalQuestions()
            );
        })()
        : null;

    const wellnessTips = [
        {
            icon: <Droplets className="h-7 w-7" />,
            title: t("dashboard.tipHydration"),
            description: t("dashboard.tipHydrationDesc"),
            iconColor: "text-blue-600 dark:text-blue-400",
        },
        {
            icon: <Activity className="h-7 w-7" />,
            title: t("dashboard.tipActive"),
            description: t("dashboard.tipActiveDesc"),
            iconColor: "text-green-600 dark:text-green-400",
        },
        {
            icon: <Moon className="h-7 w-7" />,
            title: t("dashboard.tipSleep"),
            description: t("dashboard.tipSleepDesc"),
            iconColor: "text-purple-600 dark:text-purple-400",
        },
        {
            icon: <Heart className="h-7 w-7" />,
            title: isSpanish ? "Maneja el Estrés" : "Manage Stress",
            description: isSpanish
                ? "Practica técnicas de relajación como meditación o respiración profunda"
                : "Practice relaxation techniques like meditation or deep breathing",
            iconColor: "text-red-600 dark:text-red-400",
        },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Welcome Section - NO LOGO */}
            <div className="space-y-1">
                <p className="text-2xl font-semibold">{t("dashboard.title")}</p>
                <p className="text-muted-foreground">
                    {reportData
                        ? t("dashboard.subtitle", { score: reportData.overallScore })
                        : t("dashboard.subtitleNew")}
                </p>
            </div>

            {/* Stats Row - Kept as requested */}
            {reportData && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Stat 1: Total Assessments */}
                    <Card className="border-2 border-primary/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {isSpanish ? "Evaluaciones" : "Assessments"}
                                    </p>
                                    <p className="text-3xl font-bold text-primary">1</p>
                                </div>
                                <BarChart3 className="h-10 w-10 text-primary opacity-60" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stat 2: Last Score */}
                    <Card className="border-2 border-secondary/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {isSpanish ? "Puntuación" : "Score"}
                                    </p>
                                    <p className="text-3xl font-bold text-secondary">
                                        {reportData.overallScore}
                                    </p>
                                </div>
                                <TrendingUp className="h-10 w-10 text-secondary opacity-60" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stat 3: Completion Rate */}
                    <Card className="border-2 border-accent/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {isSpanish ? "Completado" : "Completed"}
                                    </p>
                                    <p className="text-2xl font-bold text-accent">
                                        {reportData.answeredQuestions}/{reportData.totalQuestions}
                                    </p>
                                </div>
                                <ClipboardList className="h-10 w-10 text-accent opacity-60" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stat 4: Progress Percentage */}
                    <Card className="border-2 border-green-500/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {isSpanish ? "Progreso" : "Progress"}
                                    </p>
                                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                        100%
                                    </p>
                                </div>
                                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400 opacity-60" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* MY RISK SCORE - Full Width Hero */}
            {/* MY RISK SCORE - Full Width Hero with 2 Columns */}
            <Card className="border-2 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        {t("dashboard.myRiskScore")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {reportData ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* LEFT COLUMN: Circular Progress + Score + Badge */}
                            <div className="flex flex-col items-center justify-center space-y-6 py-4">
                                <CircularProgress
                                    percentage={(reportData.overallScore / 150) * 100}
                                    size={180}
                                    strokeWidth={12}
                                    color="auto"
                                />
                                <div className="text-center space-y-3">
                                    <Badge
                                        variant={
                                            reportData.overallRisk.level === "Alto" ||
                                                reportData.overallRisk.level === "Muy Alto"
                                                ? "destructive"
                                                : reportData.overallRisk.level === "Medio"
                                                    ? "default"
                                                    : "secondary"
                                        }
                                        className="text-lg px-4 py-2 font-semibold"
                                    >
                                        {isSpanish
                                            ? reportData.overallRisk.level
                                            : reportData.overallRisk.level_en}
                                    </Badge>
                                    <p className="text-sm text-muted-foreground max-w-xs">
                                        {isSpanish
                                            ? reportData.overallRisk.description_es
                                            : reportData.overallRisk.description_en}
                                    </p>
                                </div>
                            </div>

                            {/* RIGHT COLUMN: Category Bars + Last Updated + Button */}
                            <div className="flex flex-col justify-between space-y-6">
                                <div className="space-y-6">
                                    {/* Category Breakdown */}
                                    <div className="space-y-3">
                                        <p className="text-sm font-medium">
                                            {isSpanish ? "Desglose por Categoría" : "Category Breakdown"}
                                        </p>
                                        {reportData.categoryRisks.map((category, idx) => (
                                            <div key={idx} className="space-y-1">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-muted-foreground">
                                                        {isSpanish ? category.categoryName_es : category.categoryName_en}
                                                    </span>
                                                    <span className="font-medium">{category.score}</span>
                                                </div>
                                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
                                                        style={{
                                                            width: `${Math.min((category.score / 150) * 100, 100)}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Last Updated */}
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            {t("dashboard.lastUpdated", {
                                                date: new Date(reportData.completionDate).toLocaleDateString(
                                                    isSpanish ? "es-MX" : "en-US",
                                                    { year: "numeric", month: "long", day: "numeric" }
                                                ),
                                            })}
                                        </span>
                                    </div>
                                </div>

                                {/* View Report Button - At Bottom of Right Column */}
                                <Button
                                    onClick={() => navigate("/report")}
                                    className="w-full cursor-pointer bg-primary hover:bg-primary/90"
                                >
                                    <FileText className="h-4 w-4 mr-2" />
                                    {isSpanish ? "Ver Reporte Completo" : "View Full Report"}
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                                <TrendingUp className="h-10 w-10 text-primary" />
                            </div>
                            <p className="text-muted-foreground text-sm mb-4">
                                {t("dashboard.noScoreYet")}
                            </p>
                            <Button
                                onClick={() => navigate("/assessment")}
                                size="sm"
                                className="cursor-pointer bg-primary hover:bg-primary/90"
                            >
                                {t("dashboard.beginAssessment")}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Recent Assessments + Start New Assessment - 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT: Recent Assessments */}
                <Card className="border-2 border-primary/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            {t("dashboard.recentAssessments")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {assessment ? (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 rounded-lg border-2 border-primary/20 hover:border-primary/40 transition-all">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="border-primary/50">
                                                {isSpanish ? "Guía" : "Guide"} {assessment.guideType}
                                            </Badge>
                                            {reportData && (
                                                <Badge
                                                    variant={
                                                        reportData.overallRisk.level === "Alto" ||
                                                            reportData.overallRisk.level === "Muy Alto"
                                                            ? "destructive"
                                                            : reportData.overallRisk.level === "Medio"
                                                                ? "default"
                                                                : "secondary"
                                                    }
                                                >
                                                    {isSpanish
                                                        ? reportData.overallRisk.level
                                                        : reportData.overallRisk.level_en}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(assessment.completedAt || "").toLocaleDateString(
                                                isSpanish ? "es-MX" : "en-US",
                                                { year: "numeric", month: "long", day: "numeric" }
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => navigate("/report")}
                                            variant="ghost"
                                            size="sm"
                                            className="cursor-pointer text-primary hover:text-primary hover:bg-primary/10"
                                        >
                                            <FileText className="h-4 w-4 mr-1" />
                                            {isSpanish ? "Ver" : "View"}
                                        </Button>
                                        <Button
                                            onClick={() => window.print()}
                                            variant="ghost"
                                            size="sm"
                                            className="cursor-pointer hover:bg-primary/10"
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                                    <FileText className="h-8 w-8 text-primary" />
                                </div>
                                <p className="text-muted-foreground text-sm">
                                    {t("dashboard.noAssessmentsYet")}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* RIGHT: Start New Assessment - Clean & Simple */}
                <Card className="border-2 border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ClipboardList className="h-5 w-5 text-primary" />
                            {t("dashboard.startAssessment")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Simple Icon */}
                        <div className="flex justify-center">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20">
                                <ClipboardList className="h-12 w-12 text-primary" />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="text-center space-y-3">
                            <p className="text-sm text-muted-foreground">
                                {t("dashboard.startAssessmentDesc")}
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                                <Badge variant="outline" className="text-xs border-primary/50">
                                    {isSpanish ? "Guía I" : "Guide I"}
                                </Badge>
                                <Badge variant="outline" className="text-xs border-primary/50">
                                    {isSpanish ? "Guía II" : "Guide II"}
                                </Badge>
                                <Badge variant="outline" className="text-xs border-primary/50">
                                    {isSpanish ? "Guía III" : "Guide III"}
                                </Badge>
                            </div>
                        </div>

                        {/* Features/Benefits */}
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                                <span>{isSpanish ? "Duración: 10-20 minutos" : "Duration: 10-20 minutes"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0" />
                                <span>{isSpanish ? "100% Confidencial" : "100% Confidential"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                                <span>{isSpanish ? "Reporte Instantáneo" : "Instant Report"}</span>
                            </div>
                        </div>

                        {/* Simple Solid Button */}
                        <Button
                            onClick={() => navigate("/assessment")}
                            className="w-full cursor-pointer bg-primary hover:bg-primary/90"
                            size="lg"
                        >
                            {t("dashboard.beginAssessment")}
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Wellness Tips - Full Width */}
            <Card className="border-2 border-accent/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-accent" />
                        {t("dashboard.wellnessTips")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {wellnessTips.map((tip, index) => (
                            <div
                                key={index}
                                className="p-4 rounded-lg border-2 border-muted hover:border-primary/20 transition-all"
                            >
                                <div className={`${tip.iconColor} mb-3`}>{tip.icon}</div>
                                <p className="font-semibold text-sm mb-1">{tip.title}</p>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    {tip.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
