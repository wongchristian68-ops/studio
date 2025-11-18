"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ChartTooltipContent, ChartLegendContent } from "@/components/ui/chart";
import { engagementData } from "@/lib/data";

export function EngagementChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement de fidélité</CardTitle>
        <CardDescription>Tampons collectés vs parrainages effectués par mois.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={engagementData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                stroke="hsl(var(--foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Legend content={<ChartLegendContent />} />
              <Bar dataKey="stamps" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Tampons" />
              <Bar dataKey="referrals" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Parrainages" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
