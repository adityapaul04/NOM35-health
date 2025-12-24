import { useTranslation } from "react-i18next";
import type { YesNoValue } from "@/types/nom35";

interface YesNoToggleProps {
    questionNumber: number;
    value?: YesNoValue;
    onChange: (value: YesNoValue) => void;
}

export default function YesNoToggle({
    questionNumber,
    value,
    onChange,
}: YesNoToggleProps) {
    const { t } = useTranslation();

    const options: YesNoValue[] = ["Sí", "No"];

    const optionLabels = {
        Sí: t("common.yes"),
        No: t("common.no"),
    };

    return (
        <div className="flex gap-4 max-w-md">
            {options.map((option) => (
                <label
                    key={option}
                    className={`
            flex-1 flex items-center justify-center gap-3 p-4 rounded-lg border-2 
            cursor-pointer transition-all
            ${value === option
                            ? "border-primary bg-primary/10 shadow-sm"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }
          `}
                >
                    <input
                        type="radio"
                        name={`question-${questionNumber}`}
                        value={option}
                        checked={value === option}
                        onChange={() => onChange(option)}
                        className="w-5 h-5 text-primary focus:ring-primary cursor-pointer"
                    />
                    <span className={`text-base font-semibold ${value === option ? "text-primary" : ""}`}>
                        {optionLabels[option]}
                    </span>
                </label>
            ))}
        </div>
    );
}
