"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { engagementData } from "@/lib/data";

const chartConfig = {
  stamps: {
    label: "Tampons",
    color: "hsl(var(--primary))",
  },
  referrals: {
    label: "Parrainages",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;


export function EngagementChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement de fidélité</CardTitle>
        <CardDescription>Tampons collectés vs parrainages effectués par mois.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart accessibilityLayer data={engagementData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="stamps" fill="var(--color-stamps)" radius={4} />
            <Bar dataKey="referrals" fill="var(--color-referrals)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
