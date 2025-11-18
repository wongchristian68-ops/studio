import { OverviewStats } from "@/components/dashboard/overview-stats";
import { EngagementChart } from "@/components/dashboard/engagement-chart";
import { RecentReviews } from "@/components/dashboard/recent-reviews";

export default function DashboardPage() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        <div className="lg:col-span-2 grid auto-rows-max items-start gap-4 md:gap-8">
          <OverviewStats />
          <EngagementChart />
        </div>
        <div className="grid auto-rows-max items-start gap-4 md:gap-8">
          <RecentReviews />
        </div>
      </div>
    </div>
  );
}
