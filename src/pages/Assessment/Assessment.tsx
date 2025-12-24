import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";
import { useAssessment } from "@/context/AssessmentContext";
import GuideSelector from "@/components/GuideSelector";
import QuestionCard from "@/components/QuestionCard";
import ProgressStepper from "@/components/ProgressStepper";
import UploadAssessmentDialog from "@/components/UploadAssessmentDialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { GuideType, LikertValue, YesNoValue, NOM35Guide, Question } from "@/types/nom35";
import type { ImportedResponse, ImportValidation } from "@/types/import";

// Import guide data
import guide1Data from "@/data/nom35-guide1.json";
import guide2Data from "@/data/nom35-guide2.json";
import guide3Data from "@/data/nom35-guide3.json";

const guides: Record<GuideType, NOM35Guide> = {
    I: guide1Data as NOM35Guide,
    II: guide2Data as NOM35Guide,
    III: guide3Data as NOM35Guide,
};

export default function Assessment() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const {
        selectedGuide,
        setSelectedGuide,
        currentCategoryIndex,
        setCurrentCategoryIndex,
        addResponse,
        getResponse,
        conditionalAnswers,
        setConditionalAnswer,
        completedCategories,
        clearAssessment,
        completeAssessment,
        setImportedData,
        setImportSource,
        setImportMetadata,
    } = useAssessment();

    const [validationError, setValidationError] = useState<string | null>(null);

    const currentGuide = selectedGuide ? guides[selectedGuide] : null;
    const categories = currentGuide?.categories || [];
    const currentCategory = categories[currentCategoryIndex];

    // Scroll to top when category changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentCategoryIndex]);

    const handleGuideSelect = (guide: GuideType) => {
        clearAssessment();
        setSelectedGuide(guide);
        setCurrentCategoryIndex(0);
    };

    const handleImportComplete = (
        importedResponses: ImportedResponse[],
        _validation: ImportValidation,
        fileName: string,
        fileSize: number,
        guideType: GuideType
    ) => {
        // Set guide type
        setSelectedGuide(guideType);

        // Store import metadata
        setImportMetadata({
            fileName,
            fileSize,
            uploadedAt: new Date().toISOString(),
            guideType,
            source: "upload",
        });

        // Set import source
        setImportSource("upload");

        // Store imported data
        setImportedData(importedResponses);

        // Add all valid responses to context
        importedResponses.forEach((response) => {
            addResponse(response.questionNumber, response.answer);
        });

        // Navigate to review page
        navigate("/assessment/review");
    };

    const getFilteredQuestions = (): Question[] => {
        if (!currentCategory) return [];

        return currentCategory.questions.filter((q) => {
            // Always show non-conditional questions
            if (!q.conditional) return true;

            // Handle ServiceClients conditional
            if (q.conditional.dependsOn === "ServiceClients") {
                return conditionalAnswers.ServiceClients === "Sí";
            }

            // Handle Boss conditional
            if (q.conditional.dependsOn === "Boss") {
                return conditionalAnswers.Boss === "Sí";
            }

            return true;
        });
    };

    const filteredQuestions = getFilteredQuestions();

    const getAnsweredCount = () => {
        return filteredQuestions.filter((q) => {
            if (q.number === 0) {
                // Conditional trigger questions
                if (currentCategory.id === "client-service") {
                    return conditionalAnswers.ServiceClients !== undefined;
                }
                if (currentCategory.id === "subordinate-management") {
                    return conditionalAnswers.Boss !== undefined;
                }
            }
            return getResponse(q.number) !== undefined;
        }).length;
    };

    const answeredCount = getAnsweredCount();

    const handleAnswer = (questionNumber: number, answer: LikertValue | YesNoValue) => {
        // Handle conditional trigger questions
        if (questionNumber === 0) {
            if (currentCategory.id === "client-service") {
                setConditionalAnswer("ServiceClients", answer as YesNoValue);
            } else if (currentCategory.id === "subordinate-management") {
                setConditionalAnswer("Boss", answer as YesNoValue);
            }
        }

        addResponse(questionNumber, answer);
        setValidationError(null);
    };

    const validateCurrentCategory = (): boolean => {
        const unanswered = filteredQuestions.filter((q) => {
            if (q.number === 0) {
                if (currentCategory.id === "client-service") {
                    return conditionalAnswers.ServiceClients === undefined;
                }
                if (currentCategory.id === "subordinate-management") {
                    return conditionalAnswers.Boss === undefined;
                }
            }
            return getResponse(q.number) === undefined;
        });

        if (unanswered.length > 0) {
            setValidationError(
                i18n.language === "es"
                    ? `Por favor responde todas las preguntas antes de continuar. (${unanswered.length} pendientes)`
                    : `Please answer all questions before continuing. (${unanswered.length} remaining)`
            );
            return false;
        }

        setValidationError(null);
        return true;
    };

    const handleNext = () => {
        if (!validateCurrentCategory()) return;

        if (currentCategoryIndex < categories.length - 1) {
            setCurrentCategoryIndex(currentCategoryIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentCategoryIndex > 0) {
            setCurrentCategoryIndex(currentCategoryIndex - 1);
        }
    };

    const handleSubmit = () => {
        if (!validateCurrentCategory()) return;

        completeAssessment();
        navigate("/report");
    };

    const isLastCategory = currentCategoryIndex === categories.length - 1;

    // If no guide selected, show guide selector
    if (!selectedGuide) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">{t("assessment.title")}</h1>
                    <p className="text-muted-foreground">{t("assessment.subtitle")}</p>
                </div>

                <div className="mb-8">
                    <UploadAssessmentDialog onImportComplete={handleImportComplete} />
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {t("assessment.startNewAssessment")}
                    </h2>
                </div>

                <GuideSelector onSelectGuide={handleGuideSelect} />
            </div>
        );
    }

    // Show assessment questions
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl pb-32">
            {/* Progress Stepper - FIXED */}
            <ProgressStepper
                currentStep={currentCategoryIndex}
                totalSteps={categories.length}
                currentCategoryName={
                    i18n.language === "es"
                        ? currentCategory.name_es
                        : currentCategory.name_en
                }
                completedCategories={completedCategories}
            />

            {/* Category Header */}
            <div className="mb-8 mt-8">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-2">
                            {i18n.language === "es"
                                ? currentCategory.name_es
                                : currentCategory.name_en}
                        </h2>
                        <p className="text-muted-foreground">
                            {i18n.language === "es"
                                ? currentCategory.description_es
                                : currentCategory.description_en}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                            {t("assessment.answered")}
                        </div>
                        <div className="text-2xl font-bold">
                            {answeredCount} / {filteredQuestions.length}
                        </div>
                    </div>
                </div>
            </div>

            {/* Questions */}
            <div className="space-y-6">
                {filteredQuestions.map((question) => {
                    const value =
                        question.number === 0
                            ? currentCategory.id === "client-service"
                                ? conditionalAnswers.ServiceClients
                                : conditionalAnswers.Boss
                            : getResponse(question.number);

                    return (
                        <QuestionCard
                            key={question.number}
                            question={question}
                            value={value}
                            onChange={(answer) => handleAnswer(question.number, answer)}
                        />
                    );
                })}
            </div>

            {/* Validation Error */}
            {validationError && (
                <Alert variant="destructive" className="mt-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{validationError}</AlertDescription>
                </Alert>
            )}

            {/* Navigation Footer (Sticky) */}
            <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-10">
                <div className="container mx-auto px-4 py-4 max-w-4xl">
                    <div className="flex items-center justify-between gap-4">
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={currentCategoryIndex === 0}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            {t("common.previous")}
                        </Button>

                        <div className="text-sm text-muted-foreground">
                            {currentCategoryIndex + 1} / {categories.length}
                        </div>

                        {isLastCategory ? (
                            <Button onClick={handleSubmit} size="lg">
                                {t("assessment.submit")}
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        ) : (
                            <Button onClick={handleNext}>
                                {t("common.next")}
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
