
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
import { useEffect, useState } from "react";
import type { EngagementData, Referral } from "@/lib/types";
import { getActivityLog } from "@/lib/activity-log";
import { subMonths, format } from 'date-fns';

const chartConfig = {
  stamps: {
    label: "Tampons",
    color: "hsl(340 90% 70%)",
  },
  referrals: {
    label: "Parrainages",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;


export function EngagementChart() {
  const [engagementData, setEngagementData] = useState<EngagementData[]>([]);

  useEffect(() => {
     if (typeof window === 'undefined') return;

    // Initialize data for the last 6 months
    const last6Months: EngagementData[] = [];
    for (let i = 5; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        last6Months.push({
            month: format(date, 'MMM'),
            stamps: 0,
            referrals: 0,
        });
    }
    
    // Process stamp activity
    const activityLog = getActivityLog();
    activityLog.forEach(event => {
        if (event.type === 'stamp') {
            try {
                const month = format(new Date(event.date), 'MMM');
                const monthData = last6Months.find(d => d.month === month);
                if (monthData) {
                    monthData.stamps += 1;
                }
            } catch (e) {
                // Ignore invalid date formats
            }
        }
    });

    // Process referral activity
    const referralActivity: Referral[] = JSON.parse(localStorage.getItem('referralActivity') || '[]');
    referralActivity.forEach(referral => {
        if (referral.status === 'Complété') {
            try {
                 // Assuming date is 'dd/mm/yyyy'
                const dateParts = referral.date.split('/');
                const dateObject = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
                const month = format(dateObject, 'MMM');
                const monthData = last6Months.find(d => d.month === month);
                if (monthData) {
                    monthData.referrals += 1;
                }
            } catch(e) {
                 // Ignore invalid date formats
            }
        }
    });
    
    setEngagementData(last6Months);

  }, []);

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
              tickFormatter={(value) => value}
            />
            <YAxis allowDecimals={false} />
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
