import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, TrendingUp, Calendar, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { NOM35Result } from "@/types/nom35";
import { getRecommendations } from "@/utils/nom35Calculations";

interface NOM35ReportProps {
  result: NOM35Result;
}

export default function NOM35Report({ result }: NOM35ReportProps) {
  const { i18n } = useTranslation();
  const isSpanish = i18n.language === "es";

  const recommendations = getRecommendations(result.overallRisk.level);

  const getRiskIcon = () => {
    if (
      result.overallRisk.level === "Alto" ||
      result.overallRisk.level === "Muy Alto"
    ) {
      return <AlertTriangle className="h-6 w-6" />;
    }
    return <CheckCircle className="h-6 w-6" />;
  };

  const getRiskVariant = () => {
    if (result.overallRisk.level === "Muy Alto") return "destructive";
    if (result.overallRisk.level === "Alto") return "destructive";
    if (result.overallRisk.level === "Medio") return "default";
    return "secondary";
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            {isSpanish ? "Resumen de Riesgo" : "Risk Summary"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div
              className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${result.overallRisk.color}20` }}
            >
              <div style={{ color: result.overallRisk.color }}>
                {getRiskIcon()}
              </div>
            </div>
            <div className="flex-1">
              <Badge variant={getRiskVariant()} className="mb-2 text-base px-3 py-1">
                {isSpanish
                  ? result.overallRisk.level
                  : result.overallRisk.level_en}
              </Badge>
              <p className="text-3xl font-bold">{result.overallScore}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {isSpanish
                  ? result.overallRisk.description_es
                  : result.overallRisk.description_en}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                {isSpanish ? "Guía de Referencia" : "Reference Guide"}
              </p>
              <p className="font-semibold">
                {isSpanish ? "Guía" : "Guide"} {result.guideType}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                {isSpanish ? "Fecha de Evaluación" : "Assessment Date"}
              </p>
              <p className="font-semibold flex items-center gap-1 text-sm">
                <Calendar className="h-3 w-3" />
                {new Date(result.completionDate).toLocaleDateString(
                  isSpanish ? "es-MX" : "en-US",
                  { year: "numeric", month: "short", day: "numeric" }
                )}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                {isSpanish ? "Total de Preguntas" : "Total Questions"}
              </p>
              <p className="font-semibold">{result.totalQuestions}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                {isSpanish ? "Preguntas Respondidas" : "Questions Answered"}
              </p>
              <p className="font-semibold">{result.answeredQuestions}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {isSpanish ? "Desglose por Categoría" : "Category Breakdown"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.categoryRisks.map((category, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border"
              style={{ borderColor: `${category.riskLevel.color}30` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">
                    {isSpanish
                      ? category.categoryName_es
                      : category.categoryName_en}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isSpanish
                      ? category.riskLevel.description_es
                      : category.riskLevel.description_en}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <Badge
                    variant={
                      category.riskLevel.level === "Alto" ||
                        category.riskLevel.level === "Muy Alto"
                        ? "destructive"
                        : category.riskLevel.level === "Medio"
                          ? "default"
                          : "secondary"
                    }
                    className="mb-2"
                  >
                    {isSpanish
                      ? category.riskLevel.level
                      : category.riskLevel.level_en}
                  </Badge>
                  <p className="text-2xl font-bold">{category.score}</p>
                </div>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min((category.score / 50) * 100, 100)}%`,
                    backgroundColor: category.riskLevel.color,
                  }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {isSpanish ? "Recomendaciones" : "Recommendations"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">{recommendation}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Alert>
        <AlertDescription className="text-xs text-muted-foreground">
          {isSpanish
            ? "Este reporte es generado automáticamente basado en la NOM-035-STPS-2018. Se recomienda consultar con un especialista en salud ocupacional para la interpretación completa de los resultados y el diseño de intervenciones específicas."
            : "This report is automatically generated based on NOM-035-STPS-2018. It is recommended to consult with an occupational health specialist for complete interpretation of results and design of specific interventions."}
        </AlertDescription>
      </Alert>
    </div>
  );
}
