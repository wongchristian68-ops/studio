import { OverviewStats } from "@/components/dashboard/overview-stats";
import { EngagementChart } from "@/components/dashboard/engagement-chart";
import { RecentReviews } from "@/components/dashboard/recent-reviews";

export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <OverviewStats />
        <EngagementChart />
      </div>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8">
        <RecentReviews />
      </div>
    </div>
  );
}
