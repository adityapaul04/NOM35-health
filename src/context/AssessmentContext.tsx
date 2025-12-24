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


import { createContext, useContext, useState, type ReactNode } from "react";
import type {
    GuideType,
    LikertValue,
    YesNoValue,
    NOM35Response,
    NOM35Assessment,
} from "@/types/nom35";
import type { ImportedResponse, ImportSource, ImportMetadata } from "@/types/import";

interface AssessmentContextType {
    // NOM-35 Assessment
    assessment: NOM35Assessment | null;
    setAssessment: (assessment: NOM35Assessment) => void;

    // Guide selection
    selectedGuide: GuideType | null;
    setSelectedGuide: (guide: GuideType | null) => void;

    // Current progress
    currentCategoryIndex: number;
    setCurrentCategoryIndex: (index: number) => void;

    // Responses
    responses: NOM35Response[];
    addResponse: (questionNumber: number, answer: LikertValue | YesNoValue) => void;
    getResponse: (questionNumber: number) => LikertValue | YesNoValue | undefined;

    // Conditional answers
    conditionalAnswers: {
        ServiceClients?: YesNoValue;
        Boss?: YesNoValue;
    };
    setConditionalAnswer: (key: "ServiceClients" | "Boss", value: YesNoValue) => void;

    // Completed categories
    completedCategories: number[];
    markCategoryCompleted: (categoryIndex: number) => void;

    // Navigation
    canGoToCategory: (categoryIndex: number) => boolean;

    // Import-related state
    importedData: ImportedResponse[] | null;
    setImportedData: (data: ImportedResponse[] | null) => void;
    importSource: ImportSource;
    setImportSource: (source: ImportSource) => void;
    importMetadata: ImportMetadata | null;
    setImportMetadata: (metadata: ImportMetadata | null) => void;

    // Reset
    clearAssessment: () => void;

    // Completion
    completeAssessment: () => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(
    undefined
);

interface AssessmentProviderProps {
    children: ReactNode;
}

export function AssessmentProvider({ children }: AssessmentProviderProps) {
    const [assessment, setAssessment] = useState<NOM35Assessment | null>(null);
    const [selectedGuide, setSelectedGuide] = useState<GuideType | null>(null);
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const [responses, setResponses] = useState<NOM35Response[]>([]);
    const [conditionalAnswers, setConditionalAnswersState] = useState<{
        ServiceClients?: YesNoValue;
        Boss?: YesNoValue;
    }>({});
    const [completedCategories, setCompletedCategories] = useState<number[]>([]);

    // Import-related state
    const [importedData, setImportedData] = useState<ImportedResponse[] | null>(null);
    const [importSource, setImportSource] = useState<ImportSource>("manual");
    const [importMetadata, setImportMetadata] = useState<ImportMetadata | null>(null);

    const addResponse = (questionNumber: number, answer: LikertValue | YesNoValue) => {
        setResponses((prev) => {
            const existing = prev.findIndex((r) => r.questionNumber === questionNumber);
            if (existing >= 0) {
                // Update existing response
                const updated = [...prev];
                updated[existing] = { questionNumber, answer };
                return updated;
            }
            // Add new response
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
        // User can go to current category or any completed category
        return categoryIndex <= currentCategoryIndex || completedCategories.includes(categoryIndex);
    };

    const clearAssessment = () => {
        setAssessment(null);
        setSelectedGuide(null);
        setCurrentCategoryIndex(0);
        setResponses([]);
        setConditionalAnswersState({});
        setCompletedCategories([]);
        
        // Clear import data
        setImportedData(null);
        setImportSource("manual");
        setImportMetadata(null);
    };

    const completeAssessment = () => {
        if (!selectedGuide) return;

        const completedAssessment: NOM35Assessment = {
            guideType: selectedGuide,
            responses,
            currentCategoryIndex,
            completedCategories,
            conditionalAnswers,
            startedAt: assessment?.startedAt || new Date().toISOString(),
            completedAt: new Date().toISOString(),
        };

        setAssessment(completedAssessment);
    };

    const contextValue: AssessmentContextType = {
        assessment,
        setAssessment,
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
        
        // Import properties
        importedData,
        setImportedData,
        importSource,
        setImportSource,
        importMetadata,
        setImportMetadata,
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
