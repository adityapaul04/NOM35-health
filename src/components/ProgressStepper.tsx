import { useTranslation } from "react-i18next";

interface ProgressStepperProps {
    currentStep: number;
    totalSteps: number;
    currentCategoryName: string;
    completedCategories: number[];
}

export default function ProgressStepper({
    currentStep,
    totalSteps,
    currentCategoryName,
    completedCategories,
}: ProgressStepperProps) {
    const { t } = useTranslation();

    const percentComplete = Math.round(
        (completedCategories.length / totalSteps) * 100
    );

    return (
        <div className="space-y-4">
            {/* Progress text */}
            <div className="flex justify-between items-center">
                <p className="text-sm font-medium">
                    {t("assessment.progress", {
                        current: currentStep + 1,
                        total: totalSteps,
                        categoryName: currentCategoryName,
                    })}
                </p>
                <p className="text-sm text-muted-foreground">
                    {t("assessment.percentComplete", { percent: percentComplete })}
                </p>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${percentComplete}%` }}
                />
            </div>

            {/* Step indicators */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2">
                {Array.from({ length: totalSteps }).map((_, index) => (
                    <div
                        key={index}
                        className={`flex-shrink-0 h-2 rounded-full transition-all ${completedCategories.includes(index)
                                ? "bg-primary w-8"
                                : index === currentStep
                                    ? "bg-primary/50 w-12"
                                    : "bg-muted w-6"
                            }`}
                        title={`Step ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
