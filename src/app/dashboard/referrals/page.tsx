
import { ReferralActivity } from '@/components/dashboard/referral-activity';
import { ReferralSettings } from '@/components/dashboard/referral-settings';

export default function ReferralsPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <ReferralActivity />
      </div>
      <div>
        <ReferralSettings />
      </div>
    </div>
  );
}
