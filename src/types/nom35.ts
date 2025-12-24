export type GuideType = "I" | "II" | "III";

export type ResponseType = "likert" | "yesno";

export type LikertValue = "Siempre" | "Casi siempre" | "Algunas veces" | "Casi nunca" | "Nunca";
export type YesNoValue = "Sí" | "No";

export interface Question {
    number: number;
    text_es: string;
    text_en: string;
    type: ResponseType;
    conditional?: {
        dependsOn: string; // question ID (e.g., "ServiceClients")
        showIf: YesNoValue;
    };
}

export interface Category {
    id: string;
    name_es: string;
    name_en: string;
    description_es: string;
    description_en: string;
    questions: Question[];
}

export interface NOM35Guide {
    guide: GuideType;
    title_es: string;
    title_en: string;
    description_es: string;
    description_en: string;
    companySize_es: string;
    companySize_en: string;
    categories: Category[];
}

export interface NOM35Response {
    questionNumber: number;
    answer: LikertValue | YesNoValue;
}

export interface NOM35Assessment {
    guideType: GuideType;
    responses: NOM35Response[];
    currentCategoryIndex: number;
    completedCategories: number[];
    conditionalAnswers: {
        ServiceClients?: YesNoValue;
        Boss?: YesNoValue;
    };
    startedAt: string;
    completedAt?: string;
}

export interface RiskLevel {
    level: "Nulo" | "Bajo" | "Medio" | "Alto" | "Muy Alto";
    level_en: "None" | "Low" | "Medium" | "High" | "Very High";
    color: string;
    description_es: string;
    description_en: string;
}

export interface CategoryRisk {
    categoryId: string;
    categoryName_es: string;
    categoryName_en: string;
    score: number;
    riskLevel: RiskLevel;
}

export interface NOM35Result {
    guideType: GuideType;
    overallRisk: RiskLevel;
    overallScore: number;
    categoryRisks: CategoryRisk[];
    totalQuestions: number;
    answeredQuestions: number;
    completionDate: string;
}
