
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Stamp } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoyaltyStatus() {
    const currentStamps = 7;
    const [stampsForReward, setStampsForReward] = useState(10);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

    useEffect(() => {
        const savedLogo = localStorage.getItem("loyaltyCardLogo");
        if (savedLogo) {
            setLogoUrl(savedLogo);
        }

        const savedLoyaltySettings = localStorage.getItem("loyaltySettings");
        if (savedLoyaltySettings) {
            const { stampCount } = JSON.parse(savedLoyaltySettings);
            if (stampCount > 0) {
                setStampsForReward(stampCount);
            }
        }
    }, []);

    const remainingStamps = stampsForReward - currentStamps > 0 ? stampsForReward - currentStamps : 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Votre carte de fidélité</CardTitle>
                <CardDescription>
                    {remainingStamps > 0 
                        ? `Encore ${remainingStamps} tampon(s) pour votre prochaine récompense !`
                        : "Félicitations ! Vous avez une récompense."
                    }
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4">
                <div className={cn("w-full border rounded-lg p-6 flex flex-col items-center justify-center text-center", logoUrl ? "bg-secondary" : "")}>
                     {logoUrl && (
                         <Image src={logoUrl} alt="Logo du restaurant" width={80} height={80} className="rounded-full mb-4" />
                     )}
                     <div className="grid grid-cols-5 gap-2 w-full max-w-sm">
                        {Array.from({ length: stampsForReward }).map((_, index) => (
                            <div 
                                key={index}
                                className={cn(
                                    "aspect-square rounded-full flex items-center justify-center",
                                    index < currentStamps ? "bg-primary text-primary-foreground" : "bg-muted"
                                )}
                            >
                                <Stamp className={cn("w-2/3 h-2/3", index < currentStamps ? "opacity-100" : "opacity-25")} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                    {currentStamps} / {stampsForReward} tampons
                </div>
            </CardContent>
        </Card>
    );
}
