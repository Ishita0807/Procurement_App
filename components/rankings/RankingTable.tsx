import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Leaf, Globe, Edit2, CheckCircle } from "lucide-react";

export default function RankingsTable({ suppliers, isLoading }: { suppliers: any[]; isLoading: boolean; onSupplierUpdate: (supplierId: number, updatedData: any) => void }) {
  const [editingRow, setEditingRow] = useState(null);

  if (isLoading) {
    return (
      <Card className="border-slate-200/60 shadow-sm">
        <CardHeader>
          <CardTitle>Supplier Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(10).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-8 h-8 rounded" />
                  <Skeleton className="w-32 h-4" />
                  <Skeleton className="w-20 h-4" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="w-16 h-6 rounded-full" />
                  <Skeleton className="w-12 h-6 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Award className="w-4 h-4 text-amber-500" />;
    if (rank <= 3) return <Award className="w-4 h-4 text-slate-400" />;
    return <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-slate-600">{rank}</span>;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-700 bg-emerald-100";
    if (score >= 60) return "text-yellow-700 bg-yellow-100";
    if (score >= 40) return "text-orange-700 bg-orange-100";
    return "text-red-700 bg-red-100";
  };

  const getCertificationBadges = (supplier: any) => {
    const badges = [];
    if (supplier.is_iso14001) badges.push("ISO");
    if (supplier.is_bcorp) badges.push("B-Corp");
    if (supplier.is_fairtrade) badges.push("FT");
    return badges;
  };

  return (
    <Card className="border-slate-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <Award className="w-5 h-5 text-emerald-600" />
          Supplier Rankings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold">Rank</TableHead>
                <TableHead className="font-semibold">Supplier</TableHead>
                <TableHead className="font-semibold">Score</TableHead>
                <TableHead className="font-semibold">Sector</TableHead>
                <TableHead className="font-semibold">ESG</TableHead>
                <TableHead className="font-semibold">Emissions</TableHead>
                <TableHead className="font-semibold">Certs</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow 
                  key={supplier.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getRankIcon(supplier.rank)}
                      <span className="font-medium">#{supplier.rank}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-slate-900">{supplier.name}</p>
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Globe className="w-3 h-3" />
                        {supplier.country}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-emerald-500" />
                      <Badge className={getScoreColor(supplier.score)}>
                        {supplier.score?.toFixed(1)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {supplier.sector}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-slate-700">
                      {supplier.esg_total?.toFixed(0)}/100
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-slate-600">
                      <div>S1: {supplier.s1_intensity?.toFixed(1)}</div>
                      <div>S2: {supplier.s2_intensity?.toFixed(1)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {getCertificationBadges(supplier).map((cert, i) => (
                        <Badge key={i} variant="outline" className="text-xs px-1 py-0">
                          {cert}
                        </Badge>
                      ))}
                      {supplier.has_decarb_target && (
                        <CheckCircle className="w-3 h-3 text-emerald-500">
                            <title>Has climate target</title>
                        </CheckCircle>
                        )}
   
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setEditingRow(supplier.id)}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {suppliers.length === 0 && (
          <div className="text-center py-12">
            <Award className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Suppliers Found</h3>
            <p className="text-slate-600">Upload supplier data to see rankings here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}