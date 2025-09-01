import React from 'react';
import { Label } from "../../components/ui/label";
import { Slider } from "../../components/ui/slider";

export default function WeightControl({ title, description, color, value, onChange }: { title: string; description: string; color: string; value: number; onChange: (value: number[]) => void }) {
  const colorMap: {
    [key: string]: string
  } = {
    emerald: "text-emerald-600",
    red: "text-red-600", 
    orange: "text-orange-600",
    yellow: "text-yellow-600",
    blue: "text-blue-600",
    purple: "text-purple-600"
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <Label className={`font-semibold ${colorMap[color]}`}>
            {title}
          </Label>
          <p className="text-sm text-slate-600 mt-1">{description}</p>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-slate-900">{value}%</span>
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={onChange}
        max={50}
        min={0}
        step={5}
        className="w-full"
      />
    </div>
  );
}