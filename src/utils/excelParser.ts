import * as XLSX from "xlsx";
import type { GuideType, LikertValue, YesNoValue } from "@/types/nom35";
import type { ImportedResponse, ImportValidation, ValidationError, ValidationWarning } from "@/types/import";

// Valid Likert scale values
const VALID_LIKERT_VALUES: LikertValue[] = [
    "Siempre",
    "Casi siempre",
    "Algunas veces",
    "Casi nunca",
    "Nunca",
];

// Valid Yes/No values
const VALID_YESNO_VALUES: YesNoValue[] = ["Sí", "No"];

// Total questions per guide
const TOTAL_QUESTIONS_BY_GUIDE: Record<GuideType, number> = {
    I: 15,
    II: 46,
    III: 72,
};

/**
 * Parse Excel file and extract responses
 */
export async function parseExcelFile(
file: File, selectedGuide: string,
    //guideType: GuideType
): Promise<ImportedResponse[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: "binary" });

                // Get first sheet
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // Convert to JSON
                const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
                    header: ["QuestionNumber", "Answer", "Notes"],
                    range: 1, // Skip header row
                });

                // Parse and normalize data - FIXED TYPE ISSUE
                const responses: ImportedResponse[] = [];

                jsonData.forEach((row) => {
                    // Skip empty rows
                    if (!row.QuestionNumber && !row.Answer) return;

                    const questionNumber = parseInt(String(row.QuestionNumber), 10);

                    // Skip if question number is invalid
                    if (isNaN(questionNumber)) return;

                    const answer = String(row.Answer || "").trim();
                    const notes = row.Notes ? String(row.Notes).trim() : undefined;

                    responses.push({
                        questionNumber,
                        answer: answer as LikertValue | YesNoValue,
                        ...(notes && { notes }), // Only add notes if it exists
                    });
                });

                resolve(responses);
            } catch (error) {
                reject(new Error("Failed to parse Excel file. Please check the format."));
            }
        };

        reader.onerror = () => {
            reject(new Error("Failed to read file"));
        };

        reader.readAsBinaryString(file);
    });
}

/**
 * Validate imported responses
 */
export function validateImportedData(
    responses: ImportedResponse[],
    guideType: GuideType
): ImportValidation {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const validResponses: ImportedResponse[] = [];
    const invalidResponses: ImportedResponse[] = [];

    const totalQuestions = TOTAL_QUESTIONS_BY_GUIDE[guideType];
    const answeredQuestionNumbers = new Set<number>();

    responses.forEach((response, index) => {
        const row = index + 2; // Excel row (header is 1, data starts at 2)
        const { questionNumber, answer } = response;

        // Validate question number range
        if (questionNumber < 0 || questionNumber > totalQuestions) {
            errors.push({
                row,
                questionNumber,
                message: `Question number out of range (0-${totalQuestions})`,
                value: String(questionNumber),
            });
            invalidResponses.push(response);
            return;
        }

        // Validate answer format
        const isValidLikert = VALID_LIKERT_VALUES.includes(answer as LikertValue);
        const isValidYesNo = VALID_YESNO_VALUES.includes(answer as YesNoValue);

        if (!isValidLikert && !isValidYesNo) {
            // Try to find close match for suggestion
            const suggestion = findClosestMatch(answer, [
                ...VALID_LIKERT_VALUES,
                ...VALID_YESNO_VALUES,
            ]);

            errors.push({
                row,
                questionNumber,
                message: `Invalid answer value: "${answer}"`,
                value: answer,
            });

            if (suggestion) {
                warnings.push({
                    row,
                    questionNumber,
                    message: `Did you mean "${suggestion}"?`,
                    suggestion,
                });
            }

            invalidResponses.push(response);
            return;
        }

        // Check for duplicate question numbers
        if (answeredQuestionNumbers.has(questionNumber)) {
            warnings.push({
                row,
                questionNumber,
                message: `Duplicate answer for question ${questionNumber}. Using latest value.`,
            });
        }

        answeredQuestionNumbers.add(questionNumber);
        validResponses.push(response);
    });

    // Get missing questions
    const missingQuestions = getMissingQuestions(
        Array.from(answeredQuestionNumbers),
        guideType
    );

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        validResponses,
        invalidResponses,
        missingQuestions,
        totalQuestions,
        answeredQuestions: answeredQuestionNumbers.size,
    };
}

/**
 * Get missing question numbers
 */
export function getMissingQuestions(
    answeredQuestions: number[],
    guideType: GuideType
): number[] {
    const totalQuestions = TOTAL_QUESTIONS_BY_GUIDE[guideType];
    const allQuestions = Array.from({ length: totalQuestions }, (_, i) => i + 1);

    return allQuestions.filter((q) => !answeredQuestions.includes(q));
}

/**
 * Find closest match for a string (simple Levenshtein distance)
 */
function findClosestMatch(input: string, options: string[]): string | null {
    const normalized = input.toLowerCase().trim();

    let closestMatch: string | null = null;
    let minDistance = Infinity;

    options.forEach((option) => {
        const distance = levenshteinDistance(normalized, option.toLowerCase());
        if (distance < minDistance && distance <= 3) {
            // Allow max 3 character differences
            minDistance = distance;
            closestMatch = option;
        }
    });

    return closestMatch;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[b.length][a.length];
}
