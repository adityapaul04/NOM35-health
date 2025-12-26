// import { createContext, useContext, useState, type ReactNode } from "react";
// import type {
//     GuideType,
//     LikertValue,
//     YesNoValue,
//     NOM35Response,
//     NOM35Assessment,
// } from "@/types/nom35";

// interface AssessmentContextType {
//     // NOM-35 Assessment
//     assessment: NOM35Assessment | null;
//     setAssessment: (assessment: NOM35Assessment) => void;

//     // Guide selection
//     selectedGuide: GuideType | null;
//     setSelectedGuide: (guide: GuideType | null) => void;

//     // Current progress
//     currentCategoryIndex: number;
//     setCurrentCategoryIndex: (index: number) => void;

//     // Responses
//     responses: NOM35Response[];
//     addResponse: (questionNumber: number, answer: LikertValue | YesNoValue) => void;
//     getResponse: (questionNumber: number) => LikertValue | YesNoValue | undefined;

//     // Conditional answers
//     conditionalAnswers: {
//         ServiceClients?: YesNoValue;
//         Boss?: YesNoValue;
//     };
//     setConditionalAnswer: (key: "ServiceClients" | "Boss", value: YesNoValue) => void;

//     // Completed categories
//     completedCategories: number[];
//     markCategoryCompleted: (categoryIndex: number) => void;

//     // Navigation
//     canGoToCategory: (categoryIndex: number) => boolean;

//     // Reset
//     clearAssessment: () => void;

//     // Completion
//     completeAssessment: () => void;
// }

// const AssessmentContext = createContext<AssessmentContextType | undefined>(
//     undefined
// );

// interface AssessmentProviderProps {
//     children: ReactNode;
// }

// export function AssessmentProvider({ children }: AssessmentProviderProps) {
//     const [assessment, setAssessment] = useState<NOM35Assessment | null>(null);
//     const [selectedGuide, setSelectedGuide] = useState<GuideType | null>(null);
//     const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
//     const [responses, setResponses] = useState<NOM35Response[]>([]);
//     const [conditionalAnswers, setConditionalAnswersState] = useState<{
//         ServiceClients?: YesNoValue;
//         Boss?: YesNoValue;
//     }>({});
//     const [completedCategories, setCompletedCategories] = useState<number[]>([]);

//     const addResponse = (questionNumber: number, answer: LikertValue | YesNoValue) => {
//         setResponses((prev) => {
//             const existing = prev.findIndex((r) => r.questionNumber === questionNumber);
//             if (existing >= 0) {
//                 // Update existing response
//                 const updated = [...prev];
//                 updated[existing] = { questionNumber, answer };
//                 return updated;
//             }
//             // Add new response
//             return [...prev, { questionNumber, answer }];
//         });
//     };

//     const getResponse = (questionNumber: number): LikertValue | YesNoValue | undefined => {
//         const response = responses.find((r) => r.questionNumber === questionNumber);
//         return response?.answer;
//     };

//     const setConditionalAnswer = (key: "ServiceClients" | "Boss", value: YesNoValue) => {
//         setConditionalAnswersState((prev) => ({
//             ...prev,
//             [key]: value,
//         }));
//     };

//     const markCategoryCompleted = (categoryIndex: number) => {
//         if (!completedCategories.includes(categoryIndex)) {
//             setCompletedCategories((prev) => [...prev, categoryIndex]);
//         }
//     };

//     const canGoToCategory = (categoryIndex: number): boolean => {
//         // User can go to current category or any completed category
//         return categoryIndex <= currentCategoryIndex || completedCategories.includes(categoryIndex);
//     };

//     const clearAssessment = () => {
//         setAssessment(null);
//         setSelectedGuide(null);
//         setCurrentCategoryIndex(0);
//         setResponses([]);
//         setConditionalAnswersState({});
//         setCompletedCategories([]);
//     };

//     const completeAssessment = () => {
//         if (!selectedGuide) return;

//         const completedAssessment: NOM35Assessment = {
//             guideType: selectedGuide,
//             responses,
//             currentCategoryIndex,
//             completedCategories,
//             conditionalAnswers,
//             startedAt: assessment?.startedAt || new Date().toISOString(),
//             completedAt: new Date().toISOString(),
//         };

//         setAssessment(completedAssessment);
//     };

//     const contextValue: AssessmentContextType = {
//         assessment,
//         setAssessment,
//         selectedGuide,
//         setSelectedGuide,
//         currentCategoryIndex,
//         setCurrentCategoryIndex,
//         responses,
//         addResponse,
//         getResponse,
//         conditionalAnswers,
//         setConditionalAnswer,
//         completedCategories,
//         markCategoryCompleted,
//         canGoToCategory,
//         clearAssessment,
//         completeAssessment,
//     };

//     return (
//         <AssessmentContext.Provider value={contextValue}>
//             {children}
//         </AssessmentContext.Provider>
//     );
// }

// export function useAssessment() {
//     const context = useContext(AssessmentContext);
//     if (!context) {
//         throw new Error("useAssessment must be used within AssessmentProvider");
//     }
//     return context;
// }


import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";
import type {
    GuideType,
    LikertValue,
    YesNoValue,
    NOM35Response,
    NOM35Assessment,
} from "@/types/nom35";
import type { ImportedResponse, ImportSource, ImportMetadata } from "@/types/import";

interface AssessmentContextType {
    assessments: NOM35Assessment[];
    currentAssessment: NOM35Assessment | null;

    selectedGuide: GuideType | null;
    setSelectedGuide: (guide: GuideType | null) => void;

    currentCategoryIndex: number;
    setCurrentCategoryIndex: (index: number) => void;

    responses: NOM35Response[];
    addResponse: (questionNumber: number, answer: LikertValue | YesNoValue) => void;
    getResponse: (questionNumber: number) => LikertValue | YesNoValue | undefined;

    conditionalAnswers: {
        ServiceClients?: YesNoValue;
        Boss?: YesNoValue;
    };
    setConditionalAnswer: (key: "ServiceClients" | "Boss", value: YesNoValue) => void;

    completedCategories: number[];
    markCategoryCompleted: (categoryIndex: number) => void;

    canGoToCategory: (categoryIndex: number) => boolean;

    importedData: ImportedResponse[] | null;
    setImportedData: (data: ImportedResponse[] | null) => void;
    importSource: ImportSource;
    setImportSource: (source: ImportSource) => void;
    importMetadata: ImportMetadata | null;
    setImportMetadata: (metadata: ImportMetadata | null) => void;

    hasDraft: boolean;
    clearDraft: () => void;

    clearAssessment: () => void;
    completeAssessment: () => void;
    loadAssessment: (assessmentId: string) => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

interface AssessmentProviderProps {
    children: ReactNode;
}

const STORAGE_KEY_ASSESSMENTS = "wellpedia_assessments";
const STORAGE_KEY_DRAFT = "wellpedia_assessment_draft";

function generateId(): string {
    return `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function AssessmentProvider({ children }: AssessmentProviderProps) {
    const loadFromStorage = (key: string) => {
        try {
            const stored = localStorage.getItem(key);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.error(`Error loading from localStorage (${key}):`, error);
        }
        return null;
    };

    const savedAssessments = loadFromStorage(STORAGE_KEY_ASSESSMENTS) || [];
    const savedDraft = loadFromStorage(STORAGE_KEY_DRAFT);

    const [assessments, setAssessments] = useState<NOM35Assessment[]>(savedAssessments);
    const [currentAssessment, setCurrentAssessment] = useState<NOM35Assessment | null>(null);

    const [selectedGuide, setSelectedGuide] = useState<GuideType | null>(
        savedDraft?.selectedGuide || null
    );
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(
        savedDraft?.currentCategoryIndex || 0
    );
    const [responses, setResponses] = useState<NOM35Response[]>(
        savedDraft?.responses || []
    );
    const [conditionalAnswers, setConditionalAnswersState] = useState<{
        ServiceClients?: YesNoValue;
        Boss?: YesNoValue;
    }>(savedDraft?.conditionalAnswers || {});
    const [completedCategories, setCompletedCategories] = useState<number[]>(
        savedDraft?.completedCategories || []
    );

    const [importedData, setImportedData] = useState<ImportedResponse[] | null>(null);
    const [importSource, setImportSource] = useState<ImportSource>("manual");
    const [importMetadata, setImportMetadata] = useState<ImportMetadata | null>(null);

    const hasDraft = selectedGuide !== null && responses.length > 0 && !currentAssessment?.completedAt;

    const completionInProgress = useRef(false);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY_ASSESSMENTS, JSON.stringify(assessments));
        } catch (error) {
            console.error("Error saving assessments to localStorage:", error);
        }
    }, [assessments]);

    useEffect(() => {
        if (hasDraft && !currentAssessment?.completedAt) {
            const draft = {
                selectedGuide,
                currentCategoryIndex,
                responses,
                conditionalAnswers,
                completedCategories,
                lastSaved: new Date().toISOString(),
            };

            try {
                localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(draft));
            } catch (error) {
                console.error("Error saving draft to localStorage:", error);
            }
        }
    }, [selectedGuide, currentCategoryIndex, responses, conditionalAnswers, completedCategories, hasDraft, currentAssessment]);

    const addResponse = (questionNumber: number, answer: LikertValue | YesNoValue) => {
        setResponses((prev) => {
            const existing = prev.findIndex((r) => r.questionNumber === questionNumber);
            if (existing >= 0) {
                const updated = [...prev];
                updated[existing] = { questionNumber, answer };
                return updated;
            }
            return [...prev, { questionNumber, answer }];
        });
    };

    const getResponse = (questionNumber: number): LikertValue | YesNoValue | undefined => {
        const response = responses.find((r) => r.questionNumber === questionNumber);
        return response?.answer;
    };

    const setConditionalAnswer = (key: "ServiceClients" | "Boss", value: YesNoValue) => {
        setConditionalAnswersState((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const markCategoryCompleted = (categoryIndex: number) => {
        if (!completedCategories.includes(categoryIndex)) {
            setCompletedCategories((prev) => [...prev, categoryIndex]);
        }
    };

    const canGoToCategory = (categoryIndex: number): boolean => {
        return categoryIndex <= currentCategoryIndex || completedCategories.includes(categoryIndex);
    };

    const clearDraft = () => {
        try {
            localStorage.removeItem(STORAGE_KEY_DRAFT);
        } catch (error) {
            console.error("Error clearing draft from localStorage:", error);
        }
    };

    const clearAssessment = () => {
        setCurrentAssessment(null);
        setSelectedGuide(null);
        setCurrentCategoryIndex(0);
        setResponses([]);
        setConditionalAnswersState({});
        setCompletedCategories([]);
        setImportedData(null);
        setImportSource("manual");
        setImportMetadata(null);
        clearDraft();
        completionInProgress.current = false;
    };

    const completeAssessment = () => {
        if (!selectedGuide || completionInProgress.current) return;

        completionInProgress.current = true;

        const completedAssessment: NOM35Assessment = {
            id: generateId(),
            guideType: selectedGuide,
            responses,
            currentCategoryIndex,
            completedCategories,
            conditionalAnswers,
            status: "completed",
            startedAt: savedDraft?.lastSaved || new Date().toISOString(),
            completedAt: new Date().toISOString(),
        };

        setAssessments((prev) => {
            const exists = prev.some(a => a.id === completedAssessment.id);
            if (exists) return prev;
            return [completedAssessment, ...prev];
        });

        setCurrentAssessment(completedAssessment);
        clearDraft();

        setTimeout(() => {
            completionInProgress.current = false;
        }, 100);
    };

    const loadAssessment = (assessmentId: string) => {
        const assessment = assessments.find((a) => a.id === assessmentId);
        if (assessment) {
            setCurrentAssessment(assessment);
        }
    };

    const contextValue: AssessmentContextType = {
        assessments,
        currentAssessment,
        selectedGuide,
        setSelectedGuide,
        currentCategoryIndex,
        setCurrentCategoryIndex,
        responses,
        addResponse,
        getResponse,
        conditionalAnswers,
        setConditionalAnswer,
        completedCategories,
        markCategoryCompleted,
        canGoToCategory,
        clearAssessment,
        completeAssessment,
        importedData,
        setImportedData,
        importSource,
        setImportSource,
        importMetadata,
        setImportMetadata,
        hasDraft,
        clearDraft,
        loadAssessment,
    };

    return (
        <AssessmentContext.Provider value={contextValue}>
            {children}
        </AssessmentContext.Provider>
    );
}

export function useAssessment() {
    const context = useContext(AssessmentContext);
    if (!context) {
        throw new Error("useAssessment must be used within AssessmentProvider");
    }
    return context;
}
