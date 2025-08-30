"use client";

import React, { useState, useRef } from "react";
// import { ExtractDataFromUploadedFile, UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  AlertCircle,
  ArrowLeft,
  FileSpreadsheet,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import FileUploadZone from "@/components/upload/FileUploadZone";
import FileList from "@/components/upload/FileList";
import DataPreview from "@/components/upload/DataPreview";
import ProcessingStatus from "@/components/upload/ProcessingStatus";
import { useRouter } from "next/navigation";
import { useFileUpload } from "@/hooks/useFileUpload";

type Supplier = {
  supplier_id: string; // required
  name: string; // required
  country?: string;
  sector?: string;
  revenue_usd_m?: number;
  scope1_tco2e?: number;
  scope2_tco2e?: number;
  scope3_tco2e?: number;
  esg_total?: number;
  esg_e?: number;
  esg_s?: number;
  esg_g?: number;
  is_iso14001?: boolean;
  is_bcorp?: boolean;
  is_fairtrade?: boolean;
  has_decarb_target?: boolean;
  s1_intensity?: number;
  s2_intensity?: number;
  s3_intensity?: number;
  esg_total_norm?: number;
  s1_norm_cost?: number;
  s2_norm_cost?: number;
  s3_norm_cost?: number;
  certs_norm?: number;
  policy_norm?: number;
  score?: number;
  rank?: number;
};

export default function UploadPage() {
  const navigate = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<{
    suppliers: Supplier[];
    totalCount: number;
  } | null>(null);
  const [processedSuppliers, setProcessedSuppliers] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, processFile, isUploading, isProcessing, progress } =
    useFileUpload();

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file: File) =>
        file.name.endsWith(".csv") ||
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".xls")
    );

    if (droppedFiles.length > 0) {
      setFiles(droppedFiles);
      setError(null);
    } else {
      setError("Please upload CSV or Excel files only");
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    setFiles(selectedFiles);
  };

  const processUploadedFile = async () => {
    if (files.length === 0) return;

    try {
      setError(null);

      // Upload file
      const uploadResult = await uploadFile(files[0]);

      // Process file
      const processResult = await processFile(uploadResult.file_url);

      console.log("Extracted Data:", processResult.output);
      setProcessing(true);

      // Calculate sustainability scores
      const suppliersWithScores = processResult.output.map(
        (supplier: Supplier) => {
          return calculateSustainabilityScore(supplier);
        }
      );

      // Sort by score descending and assign ranks
      suppliersWithScores.sort(
        (a: Supplier, b: Supplier) => (b.score || 0) - (a.score || 0)
      );
      suppliersWithScores.forEach((supplier: Supplier, index: number) => {
        supplier.rank = index + 1;
      });

      console.log("Suppliers with Scores:", suppliersWithScores);

      setProcessedSuppliers(suppliersWithScores);
      setExtractedData({
        suppliers: suppliersWithScores,
        totalCount: suppliersWithScores.length,
      });

      setProcessing(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Error processing file: ${err.message}`);
      } else {
        setError("Unknown error occurred");
      }
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    setExtractedData(null);
    setProcessedSuppliers([]);
  };

  const calculateSustainabilityScore = (supplier: Supplier) => {
    // Implement the sustainability scoring algorithm
    const weights = {
      esg: 0.3,
      scope1: 0.2,
      scope2: 0.15,
      scope3: 0.15,
      certs: 0.1,
      policy: 0.1,
    };

    // Calculate intensities
    const s1_intensity = supplier.scope1_tco2e! / supplier.revenue_usd_m!;
    const s2_intensity = supplier.scope2_tco2e! / supplier.revenue_usd_m!;
    const s3_intensity = supplier.scope3_tco2e
      ? supplier.scope3_tco2e / supplier.revenue_usd_m!
      : 0;

    // Simple normalization (in real implementation, would use dataset min/max)
    const esg_norm = supplier.esg_total! / 100;
    const s1_norm = Math.max(0, 1 - s1_intensity / 100);
    const s2_norm = Math.max(0, 1 - s2_intensity / 100);
    const s3_norm = s3_intensity ? Math.max(0, 1 - s3_intensity / 100) : 0.5;

    // Certifications score
    let certs_score = 0;
    if (supplier.is_iso14001) certs_score += 0.6;
    if (supplier.is_bcorp) certs_score += 0.3;
    if (supplier.is_fairtrade) certs_score += 0.1;
    certs_score = Math.min(1, certs_score);

    // Policy score
    const policy_score = supplier.has_decarb_target ? 1 : 0;

    // Final weighted score
    const score =
      (weights.esg * esg_norm +
        weights.scope1 * s1_norm +
        weights.scope2 * s2_norm +
        weights.scope3 * s3_norm +
        weights.certs * certs_score +
        weights.policy * policy_score) *
      100;

    return {
      ...supplier,
      s1_intensity,
      s2_intensity,
      s3_intensity,
      esg_total_norm: esg_norm,
      s1_norm_cost: s1_norm,
      s2_norm_cost: s2_norm,
      s3_norm_cost: s3_norm,
      certs_norm: certs_score,
      policy_norm: policy_score,
      score: Math.round(score * 10) / 10,
    };
  };

  const saveSuppliers = async () => {
    if (processedSuppliers.length === 0) return;

    try {
      setProcessing(true);

      const res = await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(processedSuppliers),
      });

      if (!res.ok) throw new Error("Failed to save suppliers");

      navigate.push("/");
    } catch (error: any) {
      setError(`Error saving suppliers: ${error.message}`);
    }

    setProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate.push("/")}
            className="border-slate-300"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Upload Supplier Data
            </h1>
            <p className="text-slate-600 mt-1">
              Import your supplier sustainability data for analysis
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Upload Section */}
        {!extractedData && (
          <Card className="border-slate-200/60 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                Upload Supplier Data File
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <FileUploadZone
                  onFileSelect={handleFileInput}
                  dragActive={dragActive}
                  fileInputRef={fileInputRef}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* File List */}
        {files.length > 0 && !extractedData && (
          <FileList
            files={files}
            removeFile={removeFile}
            onProcess={processUploadedFile}
            processing={processing}
          />
        )}

        {/* Processing Status */}
        {processing && <ProcessingStatus progress={uploadProgress} />}

        {/* Data Preview */}
        {extractedData && (
          <DataPreview
            data={extractedData}
            onSave={saveSuppliers}
            onCancel={() => {
              setExtractedData(null);
              setProcessedSuppliers([]);
              setFiles([]);
            }}
            isProcessing={processing}
          />
        )}
      </div>
    </div>
  );
}
