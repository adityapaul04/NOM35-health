import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getRecommendations } from "@/utils/nom35Calculations";
import type { NOM35Result } from "@/types/nom35";

interface NOM35ReportProps {
  result: NOM35Result;
}

export default function NOM35Report({ result }: NOM35ReportProps) {
  const { t, i18n } = useTranslation();
  const isSpanish = i18n.language === "es";

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "Nulo":
      case "None":
      case "Bajo":
      case "Low":
        return <CheckCircle2 className="h-5 w-5" />;
      case "Medio":
      case "Medium":
        return <Info className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getRiskBadgeVariant = (level: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (level) {
      case "Nulo":
      case "None":
        return "outline";
      case "Bajo":
      case "Low":
        return "secondary";
      case "Medio":
      case "Medium":
        return "default";
      default:
        return "destructive";
    }
  };

  const recommendations = getRecommendations(
    result.overallRisk.level,
    isSpanish ? "es" : "en"
  );

  return (
    <div className="space-y-6">
      {/* Overall Risk Summary */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getRiskIcon(result.overallRisk.level)}
            {t("report.riskSummary")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t("report.overallRisk")}
              </p>
              <Badge
                variant={getRiskBadgeVariant(result.overallRisk.level)}
                className="text-base px-4 py-2"
              >
                {isSpanish ? result.overallRisk.level : result.overallRisk.level_en}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-2">
                {t("report.overallScore")}
              </p>
              <p className="text-3xl font-bold">{result.overallScore}</p>
            </div>
          </div>

          <Separator />

          <Alert>
            <AlertDescription className={result.overallRisk.color}>
              {isSpanish
                ? result.overallRisk.description_es
                : result.overallRisk.description_en}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Completion Info */}
      <Card>
        <CardHeader>
          <CardTitle>{t("report.assessmentDetails")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">{t("report.guideType")}</p>
              <p className="font-medium">{isSpanish ? "Guía" : "Guide"} {result.guideType}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("report.totalQuestions")}</p>
              <p className="font-medium">{result.totalQuestions}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("report.answeredQuestions")}</p>
              <p className="font-medium">{result.answeredQuestions}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("report.completionDate")}</p>
              <p className="font-medium">
                {new Date(result.completionDate).toLocaleDateString(
                  isSpanish ? "es-MX" : "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>{t("report.recommendations")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm">{recommendation}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs">
          {t("report.disclaimer")}
        </AlertDescription>
      </Alert>
    </div>
  );
}
