'use client'

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, Filter, ArrowLeft } from "lucide-react";

import RankingsTable from "@/components/rankings/RankingTable";
import RankingsFilters from "@/components/rankings/RankingFilters";
import RankingsStats from "@/components/rankings/RankingStats";
import { useRouter } from "next/navigation";

export default function RankingsPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    sector: "all",
    country: "all",
    minScore: "",
    maxScore: "",
    certifications: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const loadSuppliers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/suppliers");
      if (!res.ok) throw new Error("Failed to load suppliers");
      const data = await res.json();
      setSuppliers(data);
    } catch (error: any) {
      setError(`Error loading suppliers: ${error.message}`);
      return [];
    } finally{  
      setIsLoading(false)
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = suppliers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sector filter
    if (filters.sector !== "all") {
      filtered = filtered.filter(supplier => supplier.sector === filters.sector);
    }

    // Country filter
    if (filters.country !== "all") {
      filtered = filtered.filter(supplier => supplier.country === filters.country);
    }

    // Score range filter
    if (filters.minScore) {
      filtered = filtered.filter(supplier => supplier.score >= parseFloat(filters.minScore));
    }
    if (filters.maxScore) {
      filtered = filtered.filter(supplier => supplier.score <= parseFloat(filters.maxScore));
    }

    // Certifications filter
    if (filters.certifications.length > 0) {
      filtered = filtered.filter(supplier => {
        return filters.certifications.some(cert => {
          switch (cert) {
            case "iso14001": return supplier.is_iso14001;
            case "bcorp": return supplier.is_bcorp;
            case "fairtrade": return supplier.is_fairtrade;
            case "decarb_target": return supplier.has_decarb_target;
            default: return false;
          }
        });
      });
    }

    setFilteredSuppliers(filtered);
  }, [suppliers, searchTerm, filters]); // Dependencies for useCallback

  useEffect(() => {
    loadSuppliers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]); // Dependency is the memoized applyFilters function

  const downloadResults = () => {
    const csvHeaders = [
      "Rank", "Supplier Name", "Country", "Sector", "Sustainability Score",
      "ESG Total", "Scope 1 Intensity", "Scope 2 Intensity", "Scope 3 Intensity",
      "ISO 14001", "B-Corp", "Fair Trade", "Decarbonization Target"
    ];

    const csvRows = filteredSuppliers.map(supplier => [
      supplier.rank,
      supplier.name,
      supplier.country,
      supplier.sector,
      supplier.score,
      supplier.esg_total,
      supplier.s1_intensity?.toFixed(2) || "N/A",
      supplier.s2_intensity?.toFixed(2) || "N/A", 
      supplier.s3_intensity?.toFixed(2) || "N/A",
      supplier.is_iso14001 ? "Yes" : "No",
      supplier.is_bcorp ? "Yes" : "No",
      supplier.is_fairtrade ? "Yes" : "No",
      supplier.has_decarb_target ? "Yes" : "No"
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'supplier_sustainability_rankings.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push('/')}
              className="border-slate-300"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Supplier Rankings</h1>
              <p className="text-slate-600">Ranked by sustainability performance</p>
            </div>
          </div>
          <Button
            onClick={downloadResults}
            className="bg-emerald-600 hover:bg-emerald-700"
            disabled={filteredSuppliers.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Results
          </Button>
        </div>

        {/* Stats */}
        <RankingsStats 
          totalSuppliers={suppliers.length}
          filteredCount={filteredSuppliers.length}
          averageScore={
            filteredSuppliers.length > 0 
              ? filteredSuppliers.reduce((sum, s) => sum + s.score, 0) / filteredSuppliers.length
              : 0
          }
        />

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search suppliers, sectors, or countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-slate-300"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="mt-6 border-t border-slate-200 pt-6">
              <RankingsFilters 
                filters={filters}
                setFilters={setFilters}
                suppliers={suppliers}
              />
            </div>
          )}
        </div>

        {/* Rankings Table */}
        <RankingsTable 
          suppliers={filteredSuppliers}
          isLoading={isLoading}
          onSupplierUpdate={loadSuppliers}
        />
      </div>
    </div>
  );
}
