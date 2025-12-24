import { useTranslation } from "react-i18next";
import type { LikertValue } from "@/types/nom35";

interface LikertScaleProps {
    questionNumber: number;
    value?: LikertValue;
    onChange: (value: LikertValue) => void;
}

export default function LikertScale({
    questionNumber,
    value,
    onChange,
}: LikertScaleProps) {
    const { t } = useTranslation();

    const options: LikertValue[] = [
        "Siempre",
        "Casi siempre",
        "Algunas veces",
        "Casi nunca",
        "Nunca",
    ];

    const optionLabels = {
        Siempre: t("assessment.likertAlways"),
        "Casi siempre": t("assessment.likertAlmostAlways"),
        "Algunas veces": t("assessment.likertSometimes"),
        "Casi nunca": t("assessment.likertAlmostNever"),
        Nunca: t("assessment.likertNever"),
    };

    return (
        <div className="space-y-3">
            {options.map((option) => (
                <label
                    key={option}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${value === option
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                        }`}
                >
                    <input
                        type="radio"
                        name={`question-${questionNumber}`}
                        value={option}
                        checked={value === option}
                        onChange={() => onChange(option)}
                        className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium flex-1">
                        {optionLabels[option]}
                    </span>
                </label>
            ))}
        </div>
    );
}
