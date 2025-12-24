import type { GuideType, LikertValue, YesNoValue } from "./nom35";

export type ImportSource = "manual" | "upload";

export interface ImportedResponse {
    questionNumber: number;
    answer: LikertValue | YesNoValue;
    notes?: string;
}

export interface ImportValidation {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
    validResponses: ImportedResponse[];
    invalidResponses: ImportedResponse[];
    missingQuestions: number[];
    totalQuestions: number;
    answeredQuestions: number;
}

export interface ValidationError {
    row: number;
    questionNumber: number;
    message: string;
    value?: string;
}

export interface ValidationWarning {
    row: number;
    questionNumber: number;
    message: string;
    suggestion?: string;
}

export interface ImportMetadata {
    fileName: string;
    fileSize: number;
    uploadedAt: string;
    guideType: GuideType;
    source: ImportSource;
}
