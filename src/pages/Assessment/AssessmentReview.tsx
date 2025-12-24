import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, AlertCircle, ArrowRight, FileText } from "lucide-react";
import { useAssessment } from "@/context/AssessmentContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { LikertValue, YesNoValue, NOM35Guide } from "@/types/nom35";

// Import guide data
import guide1Data from "@/data/nom35-guide1.json";
import guide2Data from "@/data/nom35-guide2.json";
import guide3Data from "@/data/nom35-guide3.json";

const guides = {
    I: guide1Data as NOM35Guide,
    II: guide2Data as NOM35Guide,
    III: guide3Data as NOM35Guide,
};

export default function AssessmentReview() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const {
        selectedGuide,
        getResponse,
        conditionalAnswers,
        importMetadata,
        completeAssessment,
    } = useAssessment();

    // Redirect if no guide selected
    useEffect(() => {
        if (!selectedGuide) {
            navigate("/assessment");
        }
    }, [selectedGuide, navigate]);

    if (!selectedGuide) return null;

    const currentGuide = guides[selectedGuide];
    const categories = currentGuide.categories;

    // Get all questions with their current answers
    const getAllQuestions = () => {
        const allQuestions: Array<{
            categoryId: string;
            categoryName: string;
            questionNumber: number;
            questionText: string;
            answer?: LikertValue | YesNoValue;
            type: "likert" | "yesno";
            isConditional: boolean;
        }> = [];

        categories.forEach((category) => {
            category.questions.forEach((question) => {
                // Handle conditional questions
                if (question.conditional) {
                    if (question.conditional.dependsOn === "ServiceClients") {
                        if (conditionalAnswers.ServiceClients !== "Sí") return;
                    }
                    if (question.conditional.dependsOn === "Boss") {
                        if (conditionalAnswers.Boss !== "Sí") return;
                    }
                }

                let answer: LikertValue | YesNoValue | undefined;

                if (question.number === 0) {
                    // Conditional trigger question
                    if (category.id === "client-service") {
                        answer = conditionalAnswers.ServiceClients;
                    } else if (category.id === "subordinate-management") {
                        answer = conditionalAnswers.Boss;
                    }
                } else {
                    answer = getResponse(question.number);
                }

                allQuestions.push({
                    categoryId: category.id,
                    categoryName: i18n.language === "es" ? category.name_es : category.name_en,
                    questionNumber: question.number,
                    questionText: i18n.language === "es" ? question.text_es : question.text_en,
                    answer,
                    type: question.type as "likert" | "yesno",
                    isConditional: !!question.conditional,
                });
            });
        });

        return allQuestions;
    };

    const allQuestions = getAllQuestions();
    const answeredQuestions = allQuestions.filter((q) => q.answer !== undefined);
    const missingQuestions = allQuestions.filter((q) => q.answer === undefined);

    const handleContinueToReport = () => {
        if (missingQuestions.length > 0) {
            // Show warning but allow to continue
            const confirmed = window.confirm(
                i18n.language === "es"
                    ? `Hay ${missingQuestions.length} preguntas sin responder. ¿Deseas continuar de todos modos?`
                    : `There are ${missingQuestions.length} unanswered questions. Do you want to continue anyway?`
            );
            if (!confirmed) return;
        }

        completeAssessment();
        navigate("/report");
    };

    const handleEditAssessment = () => {
        navigate("/assessment");
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            {t("assessment.reviewTitle")}
                        </h1>
                        <p className="text-muted-foreground">
                            {t("assessment.reviewSubtitle")}
                        </p>
                    </div>
                    {importMetadata && (
                        <Badge variant="outline" className="text-sm">
                            <FileText className="h-3 w-3 mr-1" />
                            {importMetadata.fileName}
                        </Badge>
                    )}
                </div>

                {/* Summary Card */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 rounded-lg bg-primary/10">
                                <div className="text-3xl font-bold text-primary">
                                    {allQuestions.length}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                    {t("assessment.totalQuestions")}
                                </div>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950">
                                <div className="text-3xl font-bold text-green-600">
                                    {answeredQuestions.length}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                    {t("assessment.answered")}
                                </div>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950">
                                <div className="text-3xl font-bold text-yellow-600">
                                    {missingQuestions.length}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                    {t("assessment.missing")}
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">
                                    {t("assessment.completionProgress")}
                                </span>
                                <span className="text-sm font-bold">
                                    {Math.round((answeredQuestions.length / allQuestions.length) * 100)}%
                                </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                                <div
                                    className="bg-primary rounded-full h-3 transition-all"
                                    style={{
                                        width: `${(answeredQuestions.length / allQuestions.length) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Missing Questions Alert */}
            {missingQuestions.length > 0 && (
                <Alert className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {i18n.language === "es"
                            ? `Hay ${missingQuestions.length} preguntas sin responder. Puedes editarlas o continuar al reporte.`
                            : `There are ${missingQuestions.length} unanswered questions. You can edit them or continue to the report.`}
                    </AlertDescription>
                </Alert>
            )}

            {/* Questions by Category */}
            {categories.map((category) => {
                const categoryQuestions = allQuestions.filter(
                    (q) => q.categoryId === category.id
                );

                if (categoryQuestions.length === 0) return null;

                const categoryAnswered = categoryQuestions.filter((q) => q.answer).length;

                return (
                    <Card key={category.id} className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>
                                    {i18n.language === "es" ? category.name_es : category.name_en}
                                </span>
                                <Badge
                                    variant={
                                        categoryAnswered === categoryQuestions.length
                                            ? "default"
                                            : "secondary"
                                    }
                                >
                                    {categoryAnswered} / {categoryQuestions.length}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {categoryQuestions.map((q, index) => (
                                <div key={q.questionNumber}>
                                    <div
                                        className={`p-3 rounded-lg border ${
                                            q.answer
                                                ? "border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/30"
                                                : "border-yellow-200 bg-yellow-50/50 dark:border-yellow-900 dark:bg-yellow-950/30"
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant="outline" className="text-xs">
                                                        Q{q.questionNumber}
                                                    </Badge>
                                                    {q.answer && (
                                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    {q.questionText}
                                                </p>
                                                <p className="text-base font-semibold">
                                                    {q.answer || (
                                                        <span className="text-yellow-600">
                                                            {t("assessment.notAnswered")}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {index < categoryQuestions.length - 1 && (
                                        <Separator className="my-3" />
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                );
            })}

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
                <Button variant="outline" onClick={handleEditAssessment} size="lg">
                    {t("assessment.editAnswers")}
                </Button>
                <Button onClick={handleContinueToReport} className="flex-1" size="lg">
                    {t("assessment.continueToReport")}
                    <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}
