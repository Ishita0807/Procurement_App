import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Clock, TrendingUp, FileCheck } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "../../components/ui/skeleton";

export default function RecentActivity({ suppliers, isLoading }: { suppliers: any[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="border-slate-200/60 shadow-sm">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-24 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mock recent activity data
  const recentActivities = [
    {
      id: 1,
      type: "upload",
      message: "New supplier data uploaded",
      count: suppliers.length,
      timestamp: new Date(),
      icon: FileCheck,
      color: "emerald"
    },
    {
      id: 2,
      type: "analysis",
      message: "Sustainability analysis completed",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      icon: TrendingUp,
      color: "blue"
    }
  ];

  const colorMap:{
    [key: string]: string
  } = {
    emerald: "bg-emerald-100 text-emerald-600",
    blue: "bg-blue-100 text-blue-600",
    amber: "bg-amber-100 text-amber-600"
  };

  return (
    <Card className="border-slate-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <div key={activity.id} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${colorMap[activity.color]} flex items-center justify-center`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    {activity.message}
                    {activity.count && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        {activity.count} suppliers
                      </Badge>
                    )}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    {format(activity.timestamp, 'MMM d, h:mm a')}
                  </div>
                </div>
              </div>
            );
          })}
          
          {suppliers.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <FileCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent activity</p>
              <p className="text-xs">Upload supplier data to get started</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}