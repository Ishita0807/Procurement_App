import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TopPerformers({ suppliers, isLoading }: { suppliers: any[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="border-slate-200/60 shadow-sm">
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16 mt-1" />
                  </div>
                </div>
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const topSuppliers = suppliers.slice(0, 5);
  const iconMap = [Trophy, Medal, Award, Award, Award];

  return (
    <Card className="border-slate-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900">
          Top Performers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topSuppliers.map((supplier, index) => {
            const IconComponent = iconMap[index];
            const iconColors = [
              'text-amber-500',
              'text-slate-400', 
              'text-amber-600',
              'text-emerald-600',
              'text-blue-600'
            ];

            return (
              <div key={supplier.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center`}>
                    <IconComponent className={`w-4 h-4 ${iconColors[index]}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{supplier.name}</p>
                    <p className="text-xs text-slate-500">{supplier.sector} • {supplier.country}</p>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className="bg-emerald-50 text-emerald-700 border-emerald-200"
                >
                  {supplier.score?.toFixed(1)}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}