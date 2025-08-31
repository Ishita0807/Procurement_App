import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileSpreadsheet, X, Play } from "lucide-react";

export default function FileList({ files, removeFile, onProcess, processing }: { files: File[]; removeFile: (index: number) => void; onProcess: () => void; processing: boolean }) {
  return (
    <Card className="border-slate-200/60 shadow-sm">
      <CardHeader>
        <h3 className="font-semibold text-slate-900">
          Selected Files ({files.length})
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-white"
          >
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
              <div>
                <p className="font-medium text-slate-900">{file.name}</p>
                <p className="text-sm text-slate-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                {file.name.endsWith('.csv') ? 'CSV' : 'Excel'}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFile(index)}
                disabled={processing}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        
        <Button
          onClick={onProcess}
          disabled={processing || files.length === 0}
          className="w-full bg-emerald-600 hover:bg-emerald-700"
        >
          <Play className="w-4 h-4 mr-2" />
          {processing ? "Processing..." : "Process File"}
        </Button>
      </CardContent>
    </Card>
  );
}