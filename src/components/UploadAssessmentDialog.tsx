import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { GuideType } from "@/types/nom35";
import type { ImportedResponse, ImportValidation } from "@/types/import";
import { parseExcelFile, validateImportedData } from "@/utils/excelParser";

interface UploadAssessmentDialogProps {
    onImportComplete: (
        responses: ImportedResponse[],
        validation: ImportValidation,
        fileName: string,
        fileSize: number,
        guideType: GuideType
    ) => void;
}

export default function UploadAssessmentDialog({ onImportComplete }: UploadAssessmentDialogProps) {
    const { t, i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const [selectedGuide, setSelectedGuide] = useState<GuideType | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validation, setValidation] = useState<ImportValidation | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // Validate file type
        const validExtensions = [".xlsx", ".xls"];
        const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf(".")).toLowerCase();

        if (!validExtensions.includes(fileExtension)) {
            setError(
                i18n.language === "es"
                    ? "Formato de archivo inválido. Por favor sube un archivo Excel (.xlsx o .xls)"
                    : "Invalid file format. Please upload an Excel file (.xlsx or .xls)"
            );
            return;
        }

        // Validate file size (max 10MB)
        if (selectedFile.size > 10 * 1024 * 1024) {
            setError(
                i18n.language === "es"
                    ? "El archivo es demasiado grande. Tamaño máximo: 10MB"
                    : "File is too large. Maximum size: 10MB"
            );
            return;
        }

        setFile(selectedFile);
        setError(null);
        setValidation(null);
    };

    const handleUpload = async () => {
        if (!file || !selectedGuide) return;

        setUploading(true);
        setError(null);

        try {
            // Parse Excel file
            const responses = await parseExcelFile(file, selectedGuide);

            // Validate responses
            const validationResult = validateImportedData(responses, selectedGuide);
            setValidation(validationResult);

            // If valid or has valid responses, proceed
            if (validationResult.isValid || validationResult.validResponses.length > 0) {
                onImportComplete(
                    validationResult.validResponses,
                    validationResult,
                    file.name,
                    file.size,
                    selectedGuide
                );

                // Close dialog after successful import
                setTimeout(() => {
                    setOpen(false);
                    resetDialog();
                }, 2000);
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : i18n.language === "es"
                        ? "Error al procesar el archivo. Verifica el formato."
                        : "Error processing file. Please check the format."
            );
        } finally {
            setUploading(false);
        }
    };

    const resetDialog = () => {
        setSelectedGuide(null);
        setFile(null);
        setError(null);
        setValidation(null);
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            resetDialog();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" size="lg">
                    <Upload className="h-5 w-5 mr-2" />
                    {t("assessment.uploadAssessment")}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5" />
                        {t("assessment.uploadAssessment")}
                    </DialogTitle>
                    <DialogDescription>
                        {t("assessment.uploadDescription")}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Guide Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="guide-select" className="text-base font-semibold">
                            {t("assessment.selectGuide")}
                        </Label>
                        <div className="grid grid-cols-3 gap-3">
                            {(["I", "II", "III"] as GuideType[]).map((guide) => (
                                <button
                                    key={guide}
                                    type="button"
                                    onClick={() => setSelectedGuide(guide)}
                                    className={`
                                        p-4 rounded-lg border-2 transition-all text-center
                                        ${selectedGuide === guide
                                            ? "border-primary bg-primary/10 shadow-sm"
                                            : "border-border hover:border-primary/50"
                                        }
                                    `}
                                >
                                    <div className="font-semibold text-lg">
                                        {t(`assessment.guide${guide}`)}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {guide === "I" && "15 " + t("common.questions")}
                                        {guide === "II" && "46 " + t("common.questions")}
                                        {guide === "III" && "72 " + t("common.questions")}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* File Upload */}
                    {selectedGuide && (
                        <div className="space-y-2">
                            <Label htmlFor="file-upload" className="text-base font-semibold">
                                {t("assessment.selectFile")}
                            </Label>
                            <div className="relative">
                                <Input
                                    id="file-upload"
                                    type="file"
                                    accept=".xlsx,.xls"
                                    onChange={handleFileChange}
                                    className="cursor-pointer"
                                />
                            </div>
                            {file && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                                    <FileSpreadsheet className="h-4 w-4" />
                                    <span>{file.name}</span>
                                    <span className="text-xs">
                                        ({(file.size / 1024).toFixed(2)} KB)
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Error Alert */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Validation Results */}
                    {validation && (
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                {/* Summary */}
                                <div className="flex items-start gap-3">
                                    {validation.isValid ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                                    ) : (
                                        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                                    )}
                                    <div className="flex-1">
                                        <h4 className="font-semibold">
                                            {validation.isValid
                                                ? t("assessment.validationSuccess")
                                                : t("assessment.validationWarning")}
                                        </h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {t("assessment.answeredQuestions")}: {validation.answeredQuestions} /{" "}
                                            {validation.totalQuestions}
                                        </p>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950">
                                        <div className="text-2xl font-bold text-green-600">
                                            {validation.validResponses.length}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {t("assessment.valid")}
                                        </div>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-950">
                                        <div className="text-2xl font-bold text-red-600">
                                            {validation.invalidResponses.length}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {t("assessment.invalid")}
                                        </div>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950">
                                        <div className="text-2xl font-bold text-yellow-600">
                                            {validation.missingQuestions.length}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {t("assessment.missing")}
                                        </div>
                                    </div>
                                </div>

                                {/* Errors */}
                                {validation.errors.length > 0 && (
                                    <div>
                                        <h5 className="text-sm font-semibold text-red-600 mb-2">
                                            {t("assessment.errors")}:
                                        </h5>
                                        <div className="space-y-1 max-h-32 overflow-y-auto">
                                            {validation.errors.slice(0, 5).map((err, idx) => (
                                                <div key={idx} className="text-xs text-muted-foreground">
                                                    <Badge variant="destructive" className="mr-2">
                                                        Q{err.questionNumber}
                                                    </Badge>
                                                    {err.message}
                                                </div>
                                            ))}
                                            {validation.errors.length > 5 && (
                                                <p className="text-xs text-muted-foreground italic">
                                                    +{validation.errors.length - 5} {t("common.more")}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Warnings */}
                                {validation.warnings.length > 0 && (
                                    <div>
                                        <h5 className="text-sm font-semibold text-yellow-600 mb-2">
                                            {t("assessment.warnings")}:
                                        </h5>
                                        <div className="space-y-1 max-h-32 overflow-y-auto">
                                            {validation.warnings.slice(0, 3).map((warn, idx) => (
                                                <div key={idx} className="text-xs text-muted-foreground">
                                                    <Badge variant="outline" className="mr-2">
                                                        Q{warn.questionNumber}
                                                    </Badge>
                                                    {warn.message}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Success message */}
                                {validation.validResponses.length > 0 && (
                                    <Alert>
                                        <CheckCircle2 className="h-4 w-4" />
                                        <AlertDescription>
                                            {validation.missingQuestions.length > 0
                                                ? t("assessment.partialImportSuccess")
                                                : t("assessment.importSuccess")}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button
                            onClick={handleUpload}
                            disabled={!file || !selectedGuide || uploading}
                            className="flex-1"
                        >
                            {uploading ? (
                                <>
                                    <XCircle className="h-4 w-4 mr-2 animate-spin" />
                                    {t("common.processing")}
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4 mr-2" />
                                    {t("assessment.import")}
                                </>
                            )}
                        </Button>
                        {!validation && (
                            <Button variant="outline" onClick={() => handleOpenChange(false)}>
                                {t("common.cancel")}
                            </Button>
                        )}
                    </div>

                    {/* Template Download Link */}
                    <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                            {t("assessment.needTemplate")}
                        </p>
                        <Button variant="link" className="px-0 h-auto" asChild>
                            <a href="/templates/nom35-template.xlsx" download>
                                {t("assessment.downloadTemplate")}
                            </a>
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
