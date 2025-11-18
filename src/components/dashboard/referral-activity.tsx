
'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Referral } from "@/lib/types";
import { useEffect, useState } from "react";

export function ReferralActivity() {
  const [referralActivity, setReferralActivity] = useState<Referral[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedActivity = JSON.parse(localStorage.getItem('referralActivity') || '[]');
      setReferralActivity(storedActivity);
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité de parrainage</CardTitle>
        <CardDescription>Suivez les parrainages récents de vos clients.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Parrain</TableHead>
              <TableHead>Filleul</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referralActivity.length > 0 ? referralActivity.map((referral) => (
              <TableRow key={referral.id}>
                <TableCell className="font-medium">{referral.referrer}</TableCell>
                <TableCell>{referral.referred}</TableCell>
                <TableCell>{referral.date}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={
                      referral.status === 'Complété' ? 'default' :
                      referral.status === 'En attente' ? 'secondary' : 'destructive'
                    }
                    className={cn(
                        referral.status === 'Complété' && 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
                        referral.status === 'En attente' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
                        referral.status === 'Expiré' && 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                    )}
                  >
                    {referral.status}
                  </Badge>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">Aucune activité de parrainage pour le moment.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
