
'use client';

import { LoyaltyStatus } from "@/components/customer/loyalty-status";
import { ReferralCard } from "@/components/customer/referral-card";
import { RewardsSection } from "@/components/customer/rewards-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Star, Gift } from "lucide-react";
import { useEffect, useState } from "react";

const history: any[] = [];

interface LoggedInUser {
    name: string;
    phone: string;
    role: string;
}

interface LoyaltySettings {
    stampCount: number;
    rewardDescription: string;
}

export default function CustomerPage() {
    const [user, setUser] = useState<LoggedInUser | null>(null);
    const [loyaltySettings, setLoyaltySettings] = useState<LoyaltySettings | null>(null);

    useEffect(() => {
        const storedUser = sessionStorage.getItem('loggedInUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        
        const storedLoyaltySettings = localStorage.getItem("loyaltySettings");
        if (storedLoyaltySettings) {
            setLoyaltySettings(JSON.parse(storedLoyaltySettings));
        } else {
            setLoyaltySettings({ stampCount: 10, rewardDescription: 'Une boisson chaude offerte' });
        }
    }, []);

    return (
        <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Bienvenue, {user?.name || 'Client'} !</CardTitle>
                        <CardDescription>
                            Gérez votre programme de fidélité et vos récompenses ici. <br />
                            Numéro de téléphone : {user?.phone}
                        </CardDescription>
                    </CardHeader>
                </Card>
                <LoyaltyStatus />
                {loyaltySettings && (
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Gift className="h-5 w-5 text-primary"/>
                                Prochaine Récompense
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg font-medium text-center p-4 bg-secondary rounded-lg">
                                {loyaltySettings.rewardDescription}
                            </p>
                        </CardContent>
                    </Card>
                )}
                <Card>
                    <CardHeader>
                        <CardTitle>Historique</CardTitle>
                        <CardDescription>Votre activité de fidélité récente.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {history.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">Points</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {history.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.date}</TableCell>
                                            <TableCell>{item.description}</TableCell>
                                            <TableCell className="text-right font-medium">{item.points}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="text-muted-foreground text-center">Aucune activité pour le moment.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-8">
                <Card className="text-center">
                    <CardHeader>
                        <CardTitle>Vous appréciez votre expérience ?</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <p className="text-muted-foreground">Aidez-nous en laissant un avis sur Google !</p>
                        <Button size="lg" className="w-full bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground">
                            <Star className="mr-2 h-4 w-4" />
                            Laissez un avis
                        </Button>
                    </CardContent>
                </Card>
                <ReferralCard />
                <RewardsSection />
            </div>
        </div>
    )
}
