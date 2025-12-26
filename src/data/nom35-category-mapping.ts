import type { GuideType } from "@/types/nom35";

export interface CategoryMapping {
    categoryId: string;
    categoryName_es: string;
    categoryName_en: string;
    questions: number[];
    maxScore: number;
    thresholds: {
        nulo: number;
        bajo: number;
        medio: number;
        alto: number;
        muyAlto: number;
    };
}

export interface GuideMapping {
    guide: GuideType;
    categories: CategoryMapping[];
}

export const GUIDE_I_MAPPING: GuideMapping = {
    guide: "I",
    categories: [
        {
            categoryId: "traumatic-events",
            categoryName_es: "Acontecimientos Traumáticos Severos",
            categoryName_en: "Severe Traumatic Events",
            questions: [1, 2, 3],
            maxScore: 3,
            thresholds: {
                nulo: 0,
                bajo: 0,
                medio: 0,
                alto: 1,
                muyAlto: 3,
            },
        },
        {
            categoryId: "re-experiencing",
            categoryName_es: "Recuerdos Persistentes",
            categoryName_en: "Persistent Memories",
            questions: [4, 5, 6],
            maxScore: 3,
            thresholds: {
                nulo: 0,
                bajo: 0,
                medio: 1,
                alto: 2,
                muyAlto: 3,
            },
        },
        {
            categoryId: "avoidance",
            categoryName_es: "Esfuerzos por Evitar Circunstancias",
            categoryName_en: "Avoidance Efforts",
            questions: [7, 8, 9],
            maxScore: 3,
            thresholds: {
                nulo: 0,
                bajo: 0,
                medio: 1,
                alto: 2,
                muyAlto: 3,
            },
        },
        {
            categoryId: "hyperarousal",
            categoryName_es: "Afectación",
            categoryName_en: "Impact & Hyperarousal",
            questions: [10, 11, 12, 13, 14, 15],
            maxScore: 6,
            thresholds: {
                nulo: 0,
                bajo: 1,
                medio: 3,
                alto: 5,
                muyAlto: 6,
            },
        },
    ],
};

export const GUIDE_II_MAPPING: GuideMapping = {
    guide: "II",
    categories: [
        {
            categoryId: "work-environment",
            categoryName_es: "Ambiente de Trabajo",
            categoryName_en: "Work Environment",
            questions: [1, 2, 3, 4],
            maxScore: 16,
            thresholds: {
                nulo: 0,
                bajo: 3,
                medio: 5,
                alto: 7,
                muyAlto: 9,
            },
        },
        {
            categoryId: "workload-time",
            categoryName_es: "Factores de la Tarea",
            categoryName_en: "Task Factors & Workload",
            questions: [5, 6, 7, 8, 9, 10, 11, 12],
            maxScore: 32,
            thresholds: {
                nulo: 0,
                bajo: 6,
                medio: 9,
                alto: 12,
                muyAlto: 16,
            },
        },
        {
            categoryId: "leadership",
            categoryName_es: "Liderazgo y Relaciones",
            categoryName_en: "Leadership & Relations",
            questions: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
            maxScore: 84,
            thresholds: {
                nulo: 0,
                bajo: 10,
                medio: 14,
                alto: 19,
                muyAlto: 28,
            },
        },
        {
            categoryId: "organizational-control",
            categoryName_es: "Control sobre el Trabajo",
            categoryName_en: "Control over Work",
            questions: [34, 35, 36, 37, 38, 39, 40],
            maxScore: 28,
            thresholds: {
                nulo: 0,
                bajo: 5,
                medio: 8,
                alto: 11,
                muyAlto: 14,
            },
        },
        {
            categoryId: "violence",
            categoryName_es: "Violencia",
            categoryName_en: "Violence",
            questions: [41, 42, 43, 44, 45, 46],
            maxScore: 24,
            thresholds: {
                nulo: 0,
                bajo: 3,
                medio: 5,
                alto: 7,
                muyAlto: 12,
            },
        },
    ],
};

export const GUIDE_III_MAPPING: GuideMapping = {
    guide: "III",
    categories: [
        {
            categoryId: "work-conditions",
            categoryName_es: "Condiciones en el Ambiente de Trabajo",
            categoryName_en: "Work Environment Conditions",
            questions: [1, 2, 3, 4, 5, 6, 7, 8],
            maxScore: 32,
            thresholds: {
                nulo: 0,
                bajo: 5,
                medio: 9,
                alto: 11,
                muyAlto: 14,
            },
        },
        {
            categoryId: "workload",
            categoryName_es: "Carga de Trabajo",
            categoryName_en: "Workload",
            questions: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            maxScore: 48,
            thresholds: {
                nulo: 0,
                bajo: 12,
                medio: 16,
                alto: 20,
                muyAlto: 24,
            },
        },
        {
            categoryId: "work-pace",
            categoryName_es: "Falta de Control sobre el Trabajo",
            categoryName_en: "Lack of Control over Work",
            questions: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
            maxScore: 40,
            thresholds: {
                nulo: 0,
                bajo: 8,
                medio: 11,
                alto: 14,
                muyAlto: 17,
            },
        },
        {
            categoryId: "work-day",
            categoryName_es: "Jornada de Trabajo",
            categoryName_en: "Work Schedule",
            questions: [31, 32, 33, 34, 35, 36],
            maxScore: 24,
            thresholds: {
                nulo: 0,
                bajo: 1,
                medio: 2,
                alto: 4,
                muyAlto: 6,
            },
        },
        {
            categoryId: "interference",
            categoryName_es: "Interferencia Trabajo-Familia",
            categoryName_en: "Work-Family Interference",
            questions: [37, 38, 39, 40],
            maxScore: 16,
            thresholds: {
                nulo: 0,
                bajo: 1,
                medio: 2,
                alto: 4,
                muyAlto: 6,
            },
        },
        {
            categoryId: "leadership",
            categoryName_es: "Liderazgo",
            categoryName_en: "Leadership",
            questions: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56],
            maxScore: 64,
            thresholds: {
                nulo: 0,
                bajo: 9,
                medio: 12,
                alto: 16,
                muyAlto: 20,
            },
        },
        {
            categoryId: "workplace-relations",
            categoryName_es: "Relaciones en el Trabajo",
            categoryName_en: "Workplace Relations",
            questions: [57, 58, 59, 60, 61, 62, 63, 64, 65],
            maxScore: 36,
            thresholds: {
                nulo: 0,
                bajo: 5,
                medio: 7,
                alto: 10,
                muyAlto: 13,
            },
        },
        {
            categoryId: "violence",
            categoryName_es: "Violencia",
            categoryName_en: "Violence",
            questions: [66, 67, 68, 69, 70, 71, 72],
            maxScore: 28,
            thresholds: {
                nulo: 0,
                bajo: 7,
                medio: 10,
                alto: 13,
                muyAlto: 16,
            },
        },
    ],
};

export const CATEGORY_MAPPINGS: Record<GuideType, GuideMapping> = {
    I: GUIDE_I_MAPPING,
    II: GUIDE_II_MAPPING,
    III: GUIDE_III_MAPPING,
};

export function getCategoryMapping(guideType: GuideType): GuideMapping {
    return CATEGORY_MAPPINGS[guideType];
}
