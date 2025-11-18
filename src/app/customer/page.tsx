
'use client';

import { LoyaltyStatus } from "@/components/customer/loyalty-status";
import { ReferralCard } from "@/components/customer/referral-card";
import { RewardsSection } from "@/components/customer/rewards-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Star, Gift } from "lucide-react";
import { useEffect, useState } from "react";
import type { ActivityEvent } from "@/lib/activity-log";
import { getActivityLog } from "@/lib/activity-log";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface LoggedInUser {
    name: string;
    phone: string;
    role: string;
}

interface LoyaltySettings {
    stampCount: number;
    rewardDescription: string;
}

interface RestaurantProfile {
    name: string;
    address: string;
}

const getHistoryDescription = (event: ActivityEvent, settings: LoyaltySettings | null): string => {
    switch(event.type) {
        case 'stamp':
            return 'Tampon validé';
        case 'reward':
            return `Récompense obtenue (${settings?.rewardDescription || ''})`;
        case 'referral_claim':
            return `Récompense de parrainage récupérée`;
        case 'referral_bonus':
            return `Bonus de parrainage reçu`;
        default:
            return 'Activité inconnue';
    }
};

export default function CustomerPage() {
    const [user, setUser] = useState<LoggedInUser | null>(null);
    const [loyaltySettings, setLoyaltySettings] = useState<LoyaltySettings | null>(null);
    const [restaurantProfile, setRestaurantProfile] = useState<RestaurantProfile | null>(null);
    const [history, setHistory] = useState<ActivityEvent[]>([]);

    const loadData = () => {
        const storedUser = sessionStorage.getItem('loggedInUser');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            const userActivity = getActivityLog().filter(event => event.userPhone === parsedUser.phone);
            setHistory(userActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        }
        
        const storedLoyaltySettings = localStorage.getItem("loyaltySettings");
        if (storedLoyaltySettings) {
            setLoyaltySettings(JSON.parse(storedLoyaltySettings));
        } else {
            setLoyaltySettings({ stampCount: 10, rewardDescription: 'Une boisson chaude offerte' });
        }

        const storedProfile = localStorage.getItem("restaurantProfile");
        if (storedProfile) {
            setRestaurantProfile(JSON.parse(storedProfile));
        } else {
            setRestaurantProfile({ name: "le restaurant", address: "" });
        }
    };

    useEffect(() => {
        loadData();
        window.addEventListener('storage', loadData);
        return () => {
            window.removeEventListener('storage', loadData);
        };
    }, []);

    const handleReviewClick = () => {
        if (restaurantProfile && restaurantProfile.name) {
            const query = encodeURIComponent(`${restaurantProfile.name} ${restaurantProfile.address}`);
            const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
            window.open(url, '_blank');
        }
    }

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
                                {loyaltySettings.stampCount} tampons = {loyaltySettings.rewardDescription}
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
                                    {history.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{format(new Date(item.date), 'dd/MM/yyyy HH:mm', { locale: fr })}</TableCell>
                                            <TableCell>{getHistoryDescription(item, loyaltySettings)}</TableCell>
                                            <TableCell className="text-right font-medium">
                                                {item.type === 'stamp' ? '+1' : 
                                                 item.type === 'referral_claim' || item.type === 'referral_bonus' ? `+${item.points}` : 
                                                 item.type === 'reward' ? `-${loyaltySettings?.stampCount}` : ''}
                                            </TableCell>
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
                        <p className="text-muted-foreground">Aidez {restaurantProfile?.name || 'le restaurant'} en laissant un avis sur Google !</p>
                        <Button size="lg" className="w-full bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground" onClick={handleReviewClick}>
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
