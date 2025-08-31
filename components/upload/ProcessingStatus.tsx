import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

export default function ProcessingStatus({ progress }: { progress: number }) {
  const getStatusText = () => {
    if (progress < 30) return "Uploading file...";
    if (progress < 60) return "Extracting supplier data...";
    if (progress < 90) return "Calculating sustainability scores...";
    return "Finalizing results...";
  };

  return (
    <Card className="border-slate-200/60 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
          <div>
            <h3 className="font-semibold text-slate-900">Processing Your Data</h3>
            <p className="text-sm text-slate-600">{getStatusText()}</p>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-slate-500 mt-2 text-right">{progress}% complete</p>
      </CardContent>
    </Card>
  );
}