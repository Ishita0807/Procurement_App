import React from 'react';
import { Card, CardContent } from "../../components/ui/card";
import { Filter, Users, TrendingUp } from "lucide-react";

export default function RankingsStats({ totalSuppliers, filteredCount, averageScore }: { totalSuppliers: number; filteredCount: number; averageScore: number }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card className="border-slate-200/60 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Suppliers</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{totalSuppliers}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200/60 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Showing</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{filteredCount}</p>
            </div>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Filter className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200/60 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Score</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{averageScore.toFixed(1)}</p>
            </div>
            <div className="p-2 bg-amber-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}