
'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, QrCode, Gift, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import type { Referral } from "@/lib/types";
import { getActivityLog } from "@/lib/activity-log";

export function OverviewStats() {
  const [stats, setStats] = useState({
    totalClients: 0,
    stampsValidated: 0,
    rewardsClaimed: 0,
    activeReferrals: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const totalClients = users.filter((u: any) => u.role === 'customer').length;
    
    const referralActivity: Referral[] = JSON.parse(localStorage.getItem('referralActivity') || '[]');
    const completedReferrals = referralActivity.filter(r => r.status === 'Complété').length;

    const activityLog = getActivityLog();
    const stampsValidated = activityLog.filter(e => e.type === 'stamp').length;
    const rewardsClaimed = activityLog.filter(e => e.type === 'reward').length;

    setStats({
      totalClients,
      activeReferrals: completedReferrals,
      stampsValidated,
      rewardsClaimed,
    });

  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clients Totaux</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalClients.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tampons Validés</CardTitle>
          <QrCode className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.stampsValidated.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Récompenses Réclamées</CardTitle>
          <Gift className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.rewardsClaimed.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Parrainages Actifs</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeReferrals.toLocaleString()}</div>
        </CardContent>
      </Card>
    </div>
  );
}
