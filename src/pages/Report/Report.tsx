import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, FileText, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAssessment } from "@/context/AssessmentContext";
import { generateNOM35Report } from "@/utils/nom35Calculations";

// Import guide data to get total questions
import guide1Data from "@/data/nom35-guide1.json";
import guide2Data from "@/data/nom35-guide2.json";
import guide3Data from "@/data/nom35-guide3.json";
import NOM35Report from "@/components/NOM35Report";

export default function Report() {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { assessment, clearAssessment } = useAssessment();
    const isSpanish = i18n.language === "es";

    // Redirect if no assessment data
    useEffect(() => {
        if (!assessment) {
            navigate("/assessment");
        }
    }, [assessment, navigate]);

    if (!assessment) {
        return null;
    }

    // Get total questions based on guide type
    const getTotalQuestions = () => {
        if (assessment.guideType === "I") {
            return guide1Data.categories.reduce((sum, cat) => sum + cat.questions.length, 0);
        } else if (assessment.guideType === "II") {
            return guide2Data.categories.reduce((sum, cat) => sum + cat.questions.length, 0);
        } else {
            return guide3Data.categories.reduce((sum, cat) => sum + cat.questions.length, 0);
        }
    };

    // Generate NOM-35 report
    const reportData = generateNOM35Report(
        assessment.guideType,
        assessment.responses,
        getTotalQuestions()
    );

    const handleEdit = () => {
        navigate("/assessment");
    };

    const handlePrint = () => {
        window.print();
    };

    const handleNewAssessment = () => {
        clearAssessment();
        navigate("/assessment");
    };

    const handleBackToDashboard = () => {
        navigate("/");
    };

    // Get guide title
    const getGuideTitle = () => {
        const guideData =
            assessment.guideType === "I"
                ? guide1Data
                : assessment.guideType === "II"
                    ? guide2Data
                    : guide3Data;

        return isSpanish ? guideData.title_es : guideData.title_en;
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
                <div>
                    <h1 className="text-2xl font-semibold">{t("report.title")}</h1>
                    <p className="text-sm text-muted-foreground">{t("report.subtitle")}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleBackToDashboard}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {t("sidebar.dashboard")}
                    </Button>
                    <Button variant="outline" onClick={handleEdit}>
                        <Edit className="h-4 w-4 mr-2" />
                        {t("report.editDetails")}
                    </Button>
                    <Button variant="outline" onClick={handlePrint}>
                        <FileText className="h-4 w-4 mr-2" />
                        {t("report.printDownload")}
                    </Button>
                </div>
            </div>

            {/* Main Content - Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Assessment Summary */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                {t("report.assessmentDetails")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Guide Information */}
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    {t("assessment.selectGuide")}
                                </p>
                                <p className="font-medium">{getGuideTitle()}</p>
                            </div>

                            {/* Completion Date */}
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    {t("report.completionDate")}
                                </p>
                                <p className="font-medium">
                                    {new Date(assessment.completedAt || "").toLocaleDateString(
                                        isSpanish ? "es-MX" : "en-US",
                                        {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        }
                                    )}
                                </p>
                            </div>

                            {/* Questions Stats */}
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-xs text-muted-foreground mb-1">
                                        {t("report.totalQuestions")}
                                    </p>
                                    <p className="text-2xl font-bold">{reportData.totalQuestions}</p>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-xs text-muted-foreground mb-1">
                                        {t("report.answeredQuestions")}
                                    </p>
                                    <p className="text-2xl font-bold">{reportData.answeredQuestions}</p>
                                </div>
                            </div>

                            {/* Conditional Answers Summary */}
                            {(assessment.conditionalAnswers.ServiceClients ||
                                assessment.conditionalAnswers.Boss) && (
                                    <div className="pt-2 border-t">
                                        <p className="text-sm font-medium mb-2">
                                            {isSpanish ? "Información Adicional" : "Additional Information"}
                                        </p>
                                        <div className="space-y-1 text-sm">
                                            {assessment.conditionalAnswers.ServiceClients && (
                                                <p>
                                                    <span className="text-muted-foreground">
                                                        {isSpanish
                                                            ? "Atiende clientes/usuarios:"
                                                            : "Serves clients/users:"}{" "}
                                                    </span>
                                                    <span className="font-medium">
                                                        {assessment.conditionalAnswers.ServiceClients}
                                                    </span>
                                                </p>
                                            )}
                                            {assessment.conditionalAnswers.Boss && (
                                                <p>
                                                    <span className="text-muted-foreground">
                                                        {isSpanish
                                                            ? "Es jefe de otros trabajadores:"
                                                            : "Manages other workers:"}{" "}
                                                    </span>
                                                    <span className="font-medium">
                                                        {assessment.conditionalAnswers.Boss}
                                                    </span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                        </CardContent>
                    </Card>

                    {/* Response Summary Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {isSpanish ? "Resumen de Respuestas" : "Response Summary"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {assessment.responses
                                    .filter((r) => r.questionNumber > 0)
                                    .sort((a, b) => a.questionNumber - b.questionNumber)
                                    .map((response) => (
                                        <div
                                            key={response.questionNumber}
                                            className="flex justify-between items-center p-2 rounded bg-muted/30 text-sm"
                                        >
                                            <span className="text-muted-foreground">
                                                {isSpanish ? "Pregunta" : "Question"} {response.questionNumber}
                                            </span>
                                            <span className="font-medium">{response.answer}</span>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: NOM-35 Report */}
                <div className="space-y-6">
                    <NOM35Report result={reportData} />
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-center gap-4 print:hidden pt-6 border-t">
                <Button onClick={handleBackToDashboard} variant="outline">
                    {isSpanish ? "Volver al Panel" : "Back to Dashboard"}
                </Button>
                <Button onClick={handleNewAssessment}>
                    {t("report.startNewAssessment")}
                </Button>
            </div>

            {/* Print Styles */}
            <style>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
        </div>
    );
}
