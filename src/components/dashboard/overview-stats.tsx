
'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, QrCode, Gift, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { referralActivity } from "@/lib/data";

const initialStats = {
  totalClients: 0,
  stampsValidated: 0,
  rewardsClaimed: 0,
  activeReferrals: 0,
};

export function OverviewStats() {
  const [stats, setStats] = useState(initialStats);

  useEffect(() => {
    // In a real app, this would be an API call. Here we simulate it with localStorage and data files.
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const totalClients = users.filter((u: any) => u.role === 'customer').length;
    
    const completedReferrals = referralActivity.filter(r => r.status === 'Complété').length;

    // Calculate stats based on available data
    setStats({
      totalClients,
      activeReferrals: completedReferrals,
      stampsValidated: 0, // Resetting to 0 as there is no data source
      rewardsClaimed: 0, // Resetting to 0 as there is no data source
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
