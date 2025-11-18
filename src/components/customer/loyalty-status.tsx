
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import Image from "next/image";

export function LoyaltyStatus() {
    const currentStamps = 7;
    const stampsForReward = 10;
    const progress = (currentStamps / stampsForReward) * 100;
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

    useEffect(() => {
        const savedLogo = localStorage.getItem("loyaltyCardLogo");
        if (savedLogo) {
            setLogoUrl(savedLogo);
        }
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Votre statut de fidélité</CardTitle>
                <CardDescription>Vous avez {currentStamps} tampons. Encore {stampsForReward - currentStamps} pour une récompense gratuite !</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {logoUrl && (
                    <div className="border rounded-lg p-6 bg-secondary flex flex-col items-center justify-center text-center">
                         <Image src={logoUrl} alt="Logo du restaurant" width={80} height={80} className="rounded-full mb-4" />
                    </div>
                )}
                <Progress value={progress} className="w-full" />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>0 tampons</span>
                    <span>{stampsForReward} tampons</span>
                </div>
            </CardContent>
        </Card>
    );
}
