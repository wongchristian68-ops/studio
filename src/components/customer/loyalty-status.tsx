
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Stamp } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoyaltyStatus() {
    const currentStamps = 7;
    const stampsForReward = 10;
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
                <CardTitle>Votre carte de fidélité</CardTitle>
                <CardDescription>Encore {stampsForReward - currentStamps} tampon(s) pour votre prochaine récompense !</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4">
                {logoUrl && (
                    <div className="border rounded-lg p-6 bg-secondary flex flex-col items-center justify-center text-center w-full">
                         <Image src={logoUrl} alt="Logo du restaurant" width={80} height={80} className="rounded-full mb-4" />
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
                )}
                 {!logoUrl && (
                    <div className="grid grid-cols-5 gap-4 w-full">
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
                )}
                <div className="text-sm text-muted-foreground mt-2">
                    {currentStamps} / {stampsForReward} tampons
                </div>
            </CardContent>
        </Card>
    );
}
