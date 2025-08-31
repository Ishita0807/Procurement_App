'use client';


import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Leaf, 
  Upload, 
  TrendingUp, 
  Award, 
  Globe, 
  Factory,
  ChevronRight,
  Zap
} from "lucide-react";

import MetricsCards from "@/components/dashboard/MetricsCard";
import SustainabilityChart from "@/components/dashboard/SustainabilityChart";
import TopPerformers from "@/components/dashboard/TopPerformers";
import SectorBreakdown from "@/components/dashboard/SectorBreakdown";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { Supplier } from "@/types";

export default function Dashboard() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string|null>(null)

  useEffect(() => {
    loadSuppliers();
  }, []);

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

  const metrics = {
    totalSuppliers: suppliers.length,
    avgSustainabilityScore: suppliers.length > 0 
      ? (suppliers.reduce((sum, s) => sum + (s.score || 0), 0) / suppliers.length).toFixed(1)
      : 0,
    topPerformerScore: suppliers.length > 0 ? (suppliers[0]?.score || 0).toFixed(1) : 0,
    certifiedSuppliers: suppliers.filter(s => s.is_iso14001 || s.is_bcorp || s.is_fairtrade).length,
    avgEmissionsIntensity: suppliers.length > 0 
      ? (suppliers.reduce((sum, s) => sum + (s.s1_intensity || 0) + (s.s2_intensity || 0), 0) / suppliers.length).toFixed(2)
      : 0,
    suppliersWithTargets: suppliers.filter(s => s.has_decarb_target).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Sustainability Dashboard
            </h1>
            <p className="text-slate-600 text-lg">
              Monitor and optimize your supplier sustainability performance
            </p>
          </div>
          <div className="flex gap-3">
            <Link href={'/upload'}>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload Data
              </Button>
            </Link>
            <Link href={'/rankings'}>
              <Button variant="outline" className="border-slate-300 hover:bg-slate-50">
                <Award className="w-4 h-4 mr-2" />
                View Rankings
              </Button>
            </Link>
            
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <MetricsCards
            title="Total Suppliers"
            value={metrics.totalSuppliers}
            icon={Factory}
            bgColor="from-blue-500 to-blue-600"
            textColor="text-blue-700"
            bgAccent="bg-blue-50"
          />
          <MetricsCards
            title="Avg Sustainability"
            value={`${metrics.avgSustainabilityScore}/100`}
            icon={Leaf}
            bgColor="from-emerald-500 to-emerald-600"
            textColor="text-emerald-700"
            bgAccent="bg-emerald-50"
          />
          <MetricsCards
            title="Top Performer"
            value={`${metrics.topPerformerScore}/100`}
            icon={Award}
            bgColor="from-amber-500 to-amber-600"
            textColor="text-amber-700"
            bgAccent="bg-amber-50"
          />
          <MetricsCards
            title="Certified"
            value={`${metrics.certifiedSuppliers}/${metrics.totalSuppliers}`}
            icon={Globe}
            bgColor="from-green-500 to-green-600"
            textColor="text-green-700"
            bgAccent="bg-green-50"
          />
          <MetricsCards
            title="Emissions Intensity"
            value={`${metrics.avgEmissionsIntensity} tCO₂e/M$`}
            icon={Zap}
            bgColor="from-orange-500 to-orange-600"
            textColor="text-orange-700"
            bgAccent="bg-orange-50"
          />
          <MetricsCards
            title="With Targets"
            value={`${metrics.suppliersWithTargets}/${metrics.totalSuppliers}`}
            icon={TrendingUp}
            bgColor="from-purple-500 to-purple-600"
            textColor="text-purple-700"
            bgAccent="bg-purple-50"
          />
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SustainabilityChart suppliers={suppliers} isLoading={isLoading} />
          </div>
          <div>
            <TopPerformers suppliers={suppliers} isLoading={isLoading} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          <SectorBreakdown suppliers={suppliers} isLoading={isLoading} />
          <RecentActivity suppliers={suppliers} isLoading={isLoading} />
        </div>

        {/* Quick Actions */}
        {suppliers.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl border border-slate-200/60 p-8 max-w-md mx-auto shadow-sm">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Get Started</h3>
              <p className="text-slate-600 mb-6">
                Upload your supplier data to start analyzing sustainability performance
              </p>
              <Link href={'/upload'}>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Upload Supplier Data
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}