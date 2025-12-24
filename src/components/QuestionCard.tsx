import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import LikertScale from "./LikertScale";
import YesNoToggle from "./YesNoToggle";
import type { Question, LikertValue, YesNoValue } from "@/types/nom35";

interface QuestionCardProps {
    question: Question;
    value?: LikertValue | YesNoValue;
    onChange: (value: LikertValue | YesNoValue) => void;
}

export default function QuestionCard({
    question,
    value,
    onChange,
}: QuestionCardProps) {
    const { i18n } = useTranslation();
    const isSpanish = i18n.language === "es";

    return (
        <Card className="border-2">
            <CardHeader>
                <div className="space-y-2">
                    {/* Question number */}
                    {question.number > 0 && (
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                            {question.number}
                        </span>
                    )}

                    {/* Question text in both languages */}
                    <div className="space-y-1">
                        <p className="text-base font-medium leading-relaxed">
                            {isSpanish ? question.text_es : question.text_en}
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {isSpanish ? question.text_en : question.text_es}
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                {question.type === "likert" ? (
                    <LikertScale
                        questionNumber={question.number}
                        value={value as LikertValue}
                        onChange={onChange as (value: LikertValue) => void}
                    />
                ) : (
                    <YesNoToggle
                        questionNumber={question.number}
                        value={value as YesNoValue}
                        onChange={onChange as (value: YesNoValue) => void}
                    />
                )}
            </CardContent>
        </Card>
    );
}
