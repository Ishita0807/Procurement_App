import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, Award, Leaf } from "lucide-react";

export default function DataPreview({ data, onSave, onCancel, isProcessing }: { data: any; onSave: () => void; onCancel: () => void; isProcessing: boolean }) {
  const { suppliers, totalCount } = data;
  const previewSuppliers = suppliers.slice(0, 5);
  
  const getCertificationBadges = (supplier: any) => {
    const badges = [];
    if (supplier.is_iso14001) badges.push({ label: "ISO 14001", color: "green" });
    if (supplier.is_bcorp) badges.push({ label: "B-Corp", color: "blue" });
    if (supplier.is_fairtrade) badges.push({ label: "Fair Trade", color: "purple" });
    if (supplier.has_decarb_target) badges.push({ label: "Climate Target", color: "emerald" });
    return badges;
  };

  return (
    <Card className="border-slate-200/60 shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900">
              Data Preview & Results
            </CardTitle>
            <p className="text-slate-600 mt-1">
              Successfully processed {totalCount} suppliers with sustainability rankings
            </p>
          </div>
          <Badge className="bg-emerald-100 text-emerald-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            Ready to Import
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold">Rank</TableHead>
                <TableHead className="font-semibold">Supplier</TableHead>
                <TableHead className="font-semibold">Score</TableHead>
                <TableHead className="font-semibold">Sector</TableHead>
                <TableHead className="font-semibold">Certifications</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewSuppliers.map((supplier: { supplier_id: React.Key | null | undefined; rank: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; country: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; score: number; sector: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, index: any) => (
                <TableRow key={supplier.supplier_id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-500" />
                      #{supplier.rank}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-900">{supplier.name}</p>
                      <p className="text-sm text-slate-500">{supplier.country}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-emerald-500" />
                      <span className="font-semibold text-emerald-700">
                        {supplier.score.toFixed(1)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{supplier.sector}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {getCertificationBadges(supplier).map((badge, i) => (
                        <Badge 
                          key={i} 
                          variant="outline" 
                          className={`text-xs bg-${badge.color}-50 text-${badge.color}-700`}
                        >
                          {badge.label}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {totalCount > 5 && (
          <p className="text-sm text-slate-500 mt-3 text-center">
            Showing 5 of {totalCount} suppliers. All data will be imported.
          </p>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end gap-3 bg-slate-50">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="border-slate-300"
        >
          <XCircle className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          onClick={onSave}
          disabled={isProcessing}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          {isProcessing ? "Importing..." : "Import Data"}
        </Button>
      </CardFooter>
    </Card>
  );
}