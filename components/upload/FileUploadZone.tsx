import React from 'react';
import { Button } from "../ui/button";
import { FileSpreadsheet, Upload, Database } from "lucide-react";

export default function FileUploadZone({ onFileSelect, dragActive, fileInputRef }: { onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void; dragActive: boolean; fileInputRef: React.RefObject<HTMLInputElement|null> }) {
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`p-8 transition-all duration-200 ${
      dragActive ? "bg-emerald-50 border-emerald-200" : "bg-slate-50"
    }`}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={onFileSelect}
        className="hidden"
      />
      
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-emerald-100 rounded-2xl flex items-center justify-center">
          <FileSpreadsheet className="w-10 h-10 text-emerald-600" />
        </div>
        
        <h3 className="text-2xl font-bold text-slate-900 mb-3">
          Upload Your Supplier Data
        </h3>
        <p className="text-slate-600 mb-8">
          Drag and drop your CSV or Excel file here, or click to browse
        </p>
        
        <Button
          onClick={handleBrowseClick}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg"
        >
          <Upload className="w-5 h-5 mr-2" />
          Choose File
        </Button>
        
        <div className="mt-8 grid md:grid-cols-3 gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600" />
            <span>CSV & Excel supported</span>
          </div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Auto data extraction</span>
          </div>
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-emerald-600" />
            <span>Secure processing</span>
          </div>
        </div>
      </div>
    </div>
  );
}