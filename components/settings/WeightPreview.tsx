import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS:{
    [key: string]: string
} = {
  esg: '#10b981',
  scope1: '#ef4444',
  scope2: '#f97316', 
  scope3: '#eab308',
  certifications: '#3b82f6',
  policy: '#8b5cf6'
};

export default function WeightPreview({ weights }: { weights: { [key: string]: number } }) {
  const data = Object.entries(weights).map(([key, value]) => ({
    name: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
    value,
    key
  }));

  return (
    <Card className="border-slate-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-900">
          Weight Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={60}
                dataKey="value"
                label={({ value }) => `${value}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.key]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}