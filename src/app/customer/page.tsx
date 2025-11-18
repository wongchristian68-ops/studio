
'use client';

import { LoyaltyStatus } from "@/components/customer/loyalty-status";
import { ReferralCard } from "@/components/customer/referral-card";
import { RewardsSection } from "@/components/customer/rewards-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

const history = [
    { id: 1, date: "2024-07-20", description: "Tampon gagné", points: "+1" },
    { id: 2, date: "2024-07-15", description: "Récompense réclamée : Café gratuit", points: "-10" },
    { id: 3, date: "2024-07-12", description: "Tampon gagné", points: "+1" },
    { id: 4, date: "2024-07-11", description: "Bonus de parrainage", points: "+5" },
    { id: 5, date: "2024-07-10", description: "Tampon gagné", points: "+1" },
];

interface LoggedInUser {
    name: string;
    phone: string;
    role: string;
}

export default function CustomerPage() {
    const [user, setUser] = useState<LoggedInUser | null>(null);

    useEffect(() => {
        const storedUser = sessionStorage.getItem('loggedInUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
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
                <Card>
                    <CardHeader>
                        <CardTitle>Historique</CardTitle>
                        <CardDescription>Votre activité de fidélité récente.</CardDescription>
                    </CardHeader>
                    <CardContent>
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
