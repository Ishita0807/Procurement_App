import React from 'react';
import { Card, CardHeader } from "../../components/ui/card";

export default function MetricsCards({ title, value, icon: Icon, bgColor, textColor, bgAccent }: { title: string; value: string | number; icon: React.ComponentType<{ className?: string }>; bgColor: string; textColor: string; bgAccent: string }) {
  return (
    <Card className="relative overflow-hidden border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300">
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${bgColor} opacity-10 rounded-full transform translate-x-6 -translate-y-6`} />
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{title}</p>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
          </div>
          <div className={`p-2 rounded-lg ${bgAccent}`}>
            <Icon className={`w-4 h-4 ${textColor}`} />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}