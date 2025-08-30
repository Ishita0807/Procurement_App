'use client'
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, RotateCcw } from "lucide-react";

import WeightControl from "@/components/settings/WeightControl";
import WeightPreview from "@/components/settings/WeightPreview";
import { useRouter } from "next/navigation";

const DEFAULT_WEIGHTS:{
    [key: string]: number
} = {
  esg: 30,
  scope1: 20,
  scope2: 15,
  scope3: 15,
  certifications: 10,
  policy: 10
};

export default function SettingsPage() {
  const router = useRouter();
  const [weights, setWeights] = useState<{
    [key: string]: number
  }>(DEFAULT_WEIGHTS);
  const [hasChanges, setHasChanges] = useState(false);

  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);

  const updateWeight = (key: string, value: any[]) => {
    setWeights(prev => ({
      ...prev,
      [key]: value[0]
    }));
    setHasChanges(true);
  };

  const resetWeights = () => {
    setWeights(DEFAULT_WEIGHTS);
    setHasChanges(true);
  };

  const saveWeights = () => {
    // In a real implementation, this would save to backend/localStorage
    console.log("Saving weights:", weights);
    setHasChanges(false);
  };

  const weightConfigs:{
    index: string;
    title: string;
    description: string;
    color: string;
  }[] = [
    {
      index: "esg",
      title: "ESG Score",
      description: "Overall Environmental, Social & Governance performance",
      color: "emerald"
    },
    {
      index: "scope1",
      title: "Scope 1 Emissions",
      description: "Direct emissions from owned or controlled sources",
      color: "red"
    },
    {
      index: "scope2",
      title: "Scope 2 Emissions", 
      description: "Indirect emissions from purchased energy",
      color: "orange"
    },
    {
      index: "scope3",
      title: "Scope 3 Emissions",
      description: "All other indirect emissions in value chain",
      color: "yellow"
    },
    {
      index: "certifications",
      title: "Certifications",
      description: "ISO 14001, B-Corp, Fair Trade certifications",
      color: "blue"
    },
    {
      index: "policy",
      title: "Climate Policy",
      description: "Formal decarbonization targets and commitments",
      color: "purple"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
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
              <h1 className="text-3xl font-bold text-slate-900">Weighting Settings</h1>
              <p className="text-slate-600">Configure how sustainability criteria are prioritized</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={resetWeights}
              className="border-slate-300"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={saveWeights}
              disabled={!hasChanges || totalWeight !== 100}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Weight Total Indicator */}
        <div className={`p-4 rounded-lg border ${
          totalWeight === 100 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          <div className="flex justify-between items-center">
            <span className="font-medium">
              Total Weight: {totalWeight}%
            </span>
            {totalWeight !== 100 && (
              <span className="text-sm">
                {totalWeight > 100 ? 'Reduce by' : 'Add'} {Math.abs(totalWeight - 100)}% to equal 100%
              </span>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Weight Controls */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-200/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900">
                  Criteria Weights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {weightConfigs.map((config, idx) => (
                  <WeightControl
                    key={idx}
                    {...config}
                    value={weights[config.index]}
                    onChange={(value) => updateWeight(config.index, value)}
                  />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <WeightPreview weights={weights} />
            
            <Card className="border-slate-200/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-900">
                  Impact Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-slate-600">
                  <p className="mb-3">Your current weighting prioritizes:</p>
                  <ul className="space-y-2">
                    {weightConfigs
                      .sort((a, b) => weights[b.index] - weights[a.index])
                      .slice(0, 3)
                      .map((config, index) => (
                        <li key={config.index} className="flex justify-between">
                          <span>{index + 1}. {config.title}</span>
                          <span className="font-medium">{weights[config.index]}%</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}