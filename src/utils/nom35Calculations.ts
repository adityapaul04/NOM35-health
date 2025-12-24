import type {
    GuideType,
    NOM35Response,
    LikertValue,
    YesNoValue,
    RiskLevel,
    CategoryRisk,
    NOM35Result,
} from "@/types/nom35";

// Likert scale scoring (for negative questions - higher score = more risk)
const LIKERT_SCORES: Record<LikertValue, number> = {
    Siempre: 4,
    "Casi siempre": 3,
    "Algunas veces": 2,
    "Casi nunca": 1,
    Nunca: 0,
};

// Reverse scoring for positive questions (lower score = more risk)
const LIKERT_SCORES_REVERSE: Record<LikertValue, number> = {
    Siempre: 0,
    "Casi siempre": 1,
    "Algunas veces": 2,
    "Casi nunca": 3,
    Nunca: 4,
};

// Yes/No scoring for Guide I (traumatic events)
const YESNO_SCORES: Record<YesNoValue, number> = {
    Sí: 1,
    No: 0,
};

// Questions that need reverse scoring (positive questions where "Siempre" is good)
const REVERSE_SCORE_QUESTIONS = [
    18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, // Guide II
    1, 4, 23, 24, 25, 26, 27, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 55, 56, 57, // Guide III
];

/**
 * Calculate score for a single response
 */
function calculateResponseScore(
    questionNumber: number,
    answer: LikertValue | YesNoValue
): number {
    // Yes/No questions (Guide I)
    if (answer === "Sí" || answer === "No") {
        return YESNO_SCORES[answer as YesNoValue];
    }

    // Likert questions - check if reverse scoring needed
    const useReverse = REVERSE_SCORE_QUESTIONS.includes(questionNumber);
    const scoreMap = useReverse ? LIKERT_SCORES_REVERSE : LIKERT_SCORES;

    return scoreMap[answer as LikertValue];
}

/**
 * Determine risk level based on score and thresholds
 */
function determineRiskLevel(score: number, guideType: GuideType): RiskLevel {
    let level: RiskLevel["level"];
    let level_en: RiskLevel["level_en"];
    let color: string;
    let description_es: string;
    let description_en: string;

    if (guideType === "I") {
        // Guide I: Traumatic Events (0-15 points)
        if (score === 0) {
            level = "Nulo";
            level_en = "None";
            color = "text-green-600";
            description_es = "No se identificaron síntomas de estrés postraumático";
            description_en = "No post-traumatic stress symptoms identified";
        } else if (score <= 5) {
            level = "Bajo";
            level_en = "Low";
            color = "text-blue-600";
            description_es = "Síntomas mínimos de estrés postraumático";
            description_en = "Minimal post-traumatic stress symptoms";
        } else if (score <= 10) {
            level = "Medio";
            level_en = "Medium";
            color = "text-yellow-600";
            description_es = "Síntomas moderados de estrés postraumático - se recomienda seguimiento";
            description_en = "Moderate post-traumatic stress symptoms - follow-up recommended";
        } else {
            level = "Alto";
            level_en = "High";
            color = "text-red-600";
            description_es = "Síntomas significativos de estrés postraumático - se requiere atención profesional";
            description_en = "Significant post-traumatic stress symptoms - professional attention required";
        }
    } else if (guideType === "II") {
        // Guide II: Medium companies (approximate thresholds based on NOM-035)
        if (score < 20) {
            level = "Nulo";
            level_en = "None";
            color = "text-green-600";
            description_es = "Nulo o despreciable riesgo psicosocial";
            description_en = "No or negligible psychosocial risk";
        } else if (score < 45) {
            level = "Bajo";
            level_en = "Low";
            color = "text-blue-600";
            description_es = "Bajo riesgo psicosocial - se recomienda prevención";
            description_en = "Low psychosocial risk - prevention recommended";
        } else if (score < 70) {
            level = "Medio";
            level_en = "Medium";
            color = "text-yellow-600";
            description_es = "Riesgo psicosocial medio - se requieren acciones de prevención";
            description_en = "Medium psychosocial risk - prevention actions required";
        } else if (score < 90) {
            level = "Alto";
            level_en = "High";
            color = "text-orange-600";
            description_es = "Alto riesgo psicosocial - se requiere intervención";
            description_en = "High psychosocial risk - intervention required";
        } else {
            level = "Muy Alto";
            level_en = "Very High";
            color = "text-red-600";
            description_es = "Muy alto riesgo psicosocial - se requiere intervención urgente";
            description_en = "Very high psychosocial risk - urgent intervention required";
        }
    } else {
        // Guide III: Large companies (approximate thresholds)
        if (score < 25) {
            level = "Nulo";
            level_en = "None";
            color = "text-green-600";
            description_es = "Nulo o despreciable riesgo psicosocial";
            description_en = "No or negligible psychosocial risk";
        } else if (score < 60) {
            level = "Bajo";
            level_en = "Low";
            color = "text-blue-600";
            description_es = "Bajo riesgo psicosocial - se recomienda prevención";
            description_en = "Low psychosocial risk - prevention recommended";
        } else if (score < 100) {
            level = "Medio";
            level_en = "Medium";
            color = "text-yellow-600";
            description_es = "Riesgo psicosocial medio - se requieren acciones de prevención";
            description_en = "Medium psychosocial risk - prevention actions required";
        } else if (score < 130) {
            level = "Alto";
            level_en = "High";
            color = "text-orange-600";
            description_es = "Alto riesgo psicosocial - se requiere intervención";
            description_en = "High psychosocial risk - intervention required";
        } else {
            level = "Muy Alto";
            level_en = "Very High";
            color = "text-red-600";
            description_es = "Muy alto riesgo psicosocial - se requiere intervención urgente";
            description_en = "Very high psychosocial risk - urgent intervention required";
        }
    }

    return { level, level_en, color, description_es, description_en };
}

/**
 * Calculate category risk scores
 */
function calculateCategoryRisks(
    responses: NOM35Response[],
    guideType: GuideType
): CategoryRisk[] {
    // This is a simplified implementation
    // In a real application, you would map questions to specific categories
    // and calculate risk per category based on NOM-035 official methodology

    const categoryRisks: CategoryRisk[] = [];

    // For now, return overall assessment as single category
    // In future, implement proper category-based scoring
    const totalScore = responses.reduce((sum, response) => {
        return sum + calculateResponseScore(response.questionNumber, response.answer);
    }, 0);

    const overallRisk = determineRiskLevel(totalScore, guideType);

    categoryRisks.push({
        categoryId: "overall",
        categoryName_es: "Evaluación General",
        categoryName_en: "Overall Assessment",
        score: totalScore,
        riskLevel: overallRisk,
    });

    return categoryRisks;
}

/**
 * Main function to generate NOM-35 results
 */
export function generateNOM35Report(
    guideType: GuideType,
    responses: NOM35Response[],
    totalQuestions: number
): NOM35Result {
    // Calculate total score
    const totalScore = responses.reduce((sum, response) => {
        return sum + calculateResponseScore(response.questionNumber, response.answer);
    }, 0);

    // Determine overall risk level
    const overallRisk = determineRiskLevel(totalScore, guideType);

    // Calculate category risks
    const categoryRisks = calculateCategoryRisks(responses, guideType);

    return {
        guideType,
        overallRisk,
        overallScore: totalScore,
        categoryRisks,
        totalQuestions,
        answeredQuestions: responses.length,
        completionDate: new Date().toISOString(),
    };
}

/**
 * Get recommendations based on risk level
 */
export function getRecommendations(
    riskLevel: RiskLevel["level"],
    language: "es" | "en"
): string[] {
    const recommendations: Record<RiskLevel["level"], { es: string[]; en: string[] }> = {
        Nulo: {
            es: [
                "Mantener las buenas prácticas actuales",
                "Continuar monitoreando el ambiente laboral",
                "Promover la comunicación abierta entre equipos",
            ],
            en: [
                "Maintain current good practices",
                "Continue monitoring the work environment",
                "Promote open communication between teams",
            ],
        },
        Bajo: {
            es: [
                "Implementar programas de prevención",
                "Capacitar a supervisores en liderazgo positivo",
                "Fomentar el equilibrio vida-trabajo",
            ],
            en: [
                "Implement prevention programs",
                "Train supervisors in positive leadership",
                "Encourage work-life balance",
            ],
        },
        Medio: {
            es: [
                "Realizar intervenciones preventivas específicas",
                "Evaluar cargas de trabajo y redistribuir si es necesario",
                "Establecer canales de comunicación efectivos",
                "Ofrecer apoyo psicológico a empleados",
            ],
            en: [
                "Conduct specific preventive interventions",
                "Evaluate workloads and redistribute if necessary",
                "Establish effective communication channels",
                "Offer psychological support to employees",
            ],
        },
        Alto: {
            es: [
                "Implementar plan de acción inmediato",
                "Intervención con profesionales especializados",
                "Revisar políticas y procedimientos organizacionales",
                "Proporcionar apoyo psicológico profesional",
                "Realizar seguimiento cada 3 meses",
            ],
            en: [
                "Implement immediate action plan",
                "Intervention with specialized professionals",
                "Review organizational policies and procedures",
                "Provide professional psychological support",
                "Follow up every 3 months",
            ],
        },
        "Muy Alto": {
            es: [
                "Acción urgente requerida",
                "Consulta inmediata con especialistas en salud ocupacional",
                "Implementar cambios organizacionales significativos",
                "Apoyo psicológico inmediato y continuo",
                "Evaluación médica si es necesario",
                "Seguimiento mensual obligatorio",
            ],
            en: [
                "Urgent action required",
                "Immediate consultation with occupational health specialists",
                "Implement significant organizational changes",
                "Immediate and ongoing psychological support",
                "Medical evaluation if necessary",
                "Mandatory monthly follow-up",
            ],
        },
    };

    return recommendations[riskLevel]?.[language] || [];
}
