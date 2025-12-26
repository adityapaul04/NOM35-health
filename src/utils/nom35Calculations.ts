import type {
    GuideType,
    LikertValue,
    YesNoValue,
    NOM35Response,
    NOM35Result,
    RiskLevel,
    CategoryRisk,
} from "@/types/nom35";
import { getCategoryMapping, type CategoryMapping } from "@/data/nom35-category-mapping";

// Likert scale scoring (for negative questions - higher score = more risk)
const LIKERT_SCORES: Record<LikertValue, number> = {
    Siempre: 4,
    "Casi siempre": 3,
    "Algunas veces": 2,
    "Casi nunca": 1,
    Nunca: 0,
};

const YESNO_SCORES: Record<YesNoValue, number> = {
    Sí: 1,
    No: 0,
};

const GUIDE_II_REVERSE_QUESTIONS = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33];
const GUIDE_III_REVERSE_QUESTIONS = [
    1, 4, 23, 24, 25, 26, 27, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57
];

function getReverseScore(score: number): number {
    return 4 - score;
}

function getQuestionScore(
    response: NOM35Response,
    guideType: GuideType
): number {
    const answer = response.answer;
    let score = 0;

    if (answer in LIKERT_SCORES) {
        score = LIKERT_SCORES[answer as LikertValue];
    } else if (answer in YESNO_SCORES) {
        score = YESNO_SCORES[answer as YesNoValue];
    }

    const isReversed =
        (guideType === "II" && GUIDE_II_REVERSE_QUESTIONS.includes(response.questionNumber)) ||
        (guideType === "III" && GUIDE_III_REVERSE_QUESTIONS.includes(response.questionNumber));

    return isReversed ? getReverseScore(score) : score;
}

function determineRiskLevelByThresholds(
    score: number,
    thresholds: CategoryMapping["thresholds"]
): RiskLevel {
    if (score >= thresholds.muyAlto) {
        return {
            level: "Muy Alto",
            level_en: "Very High",
            color: "#dc2626",
            description_es: "Requiere intervención inmediata y medidas correctivas urgentes",
            description_en: "Requires immediate intervention and urgent corrective measures",
        };
    } else if (score >= thresholds.alto) {
        return {
            level: "Alto",
            level_en: "High",
            color: "#ea580c",
            description_es: "Requiere intervención a corto plazo y medidas correctivas",
            description_en: "Requires short-term intervention and corrective measures",
        };
    } else if (score >= thresholds.medio) {
        return {
            level: "Medio",
            level_en: "Medium",
            color: "#eab308",
            description_es: "Requiere intervención a mediano plazo y medidas preventivas",
            description_en: "Requires medium-term intervention and preventive measures",
        };
    } else if (score >= thresholds.bajo) {
        return {
            level: "Bajo",
            level_en: "Low",
            color: "#3b82f6",
            description_es: "Requiere medidas de prevención y seguimiento periódico",
            description_en: "Requires prevention measures and periodic monitoring",
        };
    } else {
        return {
            level: "Nulo",
            level_en: "None",
            color: "#10b981",
            description_es: "El riesgo resulta despreciable, no requiere medidas adicionales",
            description_en: "Risk is negligible, no additional measures required",
        };
    }
}

function determineOverallRiskLevel(score: number, guideType: GuideType): RiskLevel {
    if (guideType === "I") {
        if (score >= 5) {
            return {
                level: "Alto",
                level_en: "High",
                color: "#ea580c",
                description_es: "Se requiere atención psicológica especializada urgente",
                description_en: "Urgent specialized psychological care required",
            };
        } else if (score >= 3) {
            return {
                level: "Medio",
                level_en: "Medium",
                color: "#eab308",
                description_es: "Se recomienda evaluación y seguimiento psicológico",
                description_en: "Psychological evaluation and follow-up recommended",
            };
        } else {
            return {
                level: "Nulo",
                level_en: "None",
                color: "#10b981",
                description_es: "No se identifican síntomas significativos",
                description_en: "No significant symptoms identified",
            };
        }
    } else if (guideType === "II") {
        if (score >= 90) {
            return {
                level: "Muy Alto",
                level_en: "Very High",
                color: "#dc2626",
                description_es: "Requiere intervención inmediata y medidas correctivas urgentes",
                description_en: "Requires immediate intervention and urgent corrective measures",
            };
        } else if (score >= 75) {
            return {
                level: "Alto",
                level_en: "High",
                color: "#ea580c",
                description_es: "Requiere intervención a corto plazo y medidas correctivas",
                description_en: "Requires short-term intervention and corrective measures",
            };
        } else if (score >= 50) {
            return {
                level: "Medio",
                level_en: "Medium",
                color: "#eab308",
                description_es: "Requiere intervención a mediano plazo y medidas preventivas",
                description_en: "Requires medium-term intervention and preventive measures",
            };
        } else if (score >= 20) {
            return {
                level: "Bajo",
                level_en: "Low",
                color: "#3b82f6",
                description_es: "Requiere medidas de prevención y seguimiento periódico",
                description_en: "Requires prevention measures and periodic monitoring",
            };
        } else {
            return {
                level: "Nulo",
                level_en: "None",
                color: "#10b981",
                description_es: "El riesgo resulta despreciable, no requiere medidas adicionales",
                description_en: "Risk is negligible, no additional measures required",
            };
        }
    } else {
        if (score >= 130) {
            return {
                level: "Muy Alto",
                level_en: "Very High",
                color: "#dc2626",
                description_es: "Requiere intervención inmediata y medidas correctivas urgentes",
                description_en: "Requires immediate intervention and urgent corrective measures",
            };
        } else if (score >= 100) {
            return {
                level: "Alto",
                level_en: "High",
                color: "#ea580c",
                description_es: "Requiere intervención a corto plazo y medidas correctivas",
                description_en: "Requires short-term intervention and corrective measures",
            };
        } else if (score >= 70) {
            return {
                level: "Medio",
                level_en: "Medium",
                color: "#eab308",
                description_es: "Requiere intervención a mediano plazo y medidas preventivas",
                description_en: "Requires medium-term intervention and preventive measures",
            };
        } else if (score >= 25) {
            return {
                level: "Bajo",
                level_en: "Low",
                color: "#3b82f6",
                description_es: "Requiere medidas de prevención y seguimiento periódico",
                description_en: "Requires prevention measures and periodic monitoring",
            };
        } else {
            return {
                level: "Nulo",
                level_en: "None",
                color: "#10b981",
                description_es: "El riesgo resulta despreciable, no requiere medidas adicionales",
                description_en: "Risk is negligible, no additional measures required",
            };
        }
    }
}

export function generateNOM35Report(
    guideType: GuideType,
    responses: NOM35Response[],
    totalQuestions: number
): NOM35Result {
    const categoryMapping = getCategoryMapping(guideType);
    const categoryRisks: CategoryRisk[] = [];

    let totalScore = 0;

    categoryMapping.categories.forEach((category) => {
        let categoryScore = 0;

        category.questions.forEach((questionNumber) => {
            const response = responses.find((r) => r.questionNumber === questionNumber);
            if (response) {
                categoryScore += getQuestionScore(response, guideType);
            }
        });

        totalScore += categoryScore;

        const categoryRiskLevel = determineRiskLevelByThresholds(
            categoryScore,
            category.thresholds
        );

        categoryRisks.push({
            categoryId: category.categoryId,
            categoryName_es: category.categoryName_es,
            categoryName_en: category.categoryName_en,
            score: categoryScore,
            riskLevel: categoryRiskLevel,
        });
    });

    const overallRisk = determineOverallRiskLevel(totalScore, guideType);

    return {
        guideType,
        overallRisk,
        overallScore: totalScore,
        categoryRisks,
        totalQuestions,
        answeredQuestions: responses.filter((r) => r.questionNumber > 0).length,
        completionDate: new Date().toISOString(),
    };
}

export function getRecommendations(riskLevel: RiskLevel["level"]): string[] {
    const recommendations: Record<RiskLevel["level"], string[]> = {
        "Muy Alto": [
            "Implementar acciones correctivas inmediatas",
            "Realizar evaluaciones individuales del personal",
            "Desarrollar programas de intervención especializados",
            "Establecer comités de seguimiento continuo",
            "Consultar con expertos en salud ocupacional",
        ],
        Alto: [
            "Implementar medidas preventivas y correctivas a corto plazo",
            "Realizar capacitación en manejo de estrés",
            "Establecer canales de comunicación efectivos",
            "Revisar cargas de trabajo y distribución de tareas",
        ],
        Medio: [
            "Implementar acciones preventivas a mediano plazo",
            "Promover actividades de integración del equipo",
            "Establecer programas de reconocimiento",
            "Realizar evaluaciones periódicas del clima laboral",
        ],
        Bajo: [
            "Mantener las condiciones actuales",
            "Realizar seguimiento periódico",
            "Promover la comunicación abierta",
            "Fomentar el equilibrio vida-trabajo",
        ],
        Nulo: [
            "Mantener las buenas prácticas actuales",
            "Realizar evaluaciones anuales de seguimiento",
            "Continuar fomentando un ambiente laboral saludable",
        ],
    };

    return recommendations[riskLevel] || [];
}
