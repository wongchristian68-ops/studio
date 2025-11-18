
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Stamp, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

export function LoyaltyStatus() {
    const [currentStamps, setCurrentStamps] = useState(0);
    const [stampsForReward, setStampsForReward] = useState(10);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const user = sessionStorage.getItem('loggedInUser');
        if (user) {
            const parsedUser = JSON.parse(user);
            const savedStamps = localStorage.getItem(`stamps_${parsedUser.phone}`);
            setCurrentStamps(savedStamps ? parseInt(savedStamps, 10) : 0);
        }

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
    
    const isRewardAvailable = currentStamps >= stampsForReward;
    const remainingStamps = stampsForReward - currentStamps;

    const handleClaimReward = () => {
        const user = sessionStorage.getItem('loggedInUser');
        if (user) {
            const parsedUser = JSON.parse(user);
            const newStampCount = 0;
            localStorage.setItem(`stamps_${parsedUser.phone}`, newStampCount.toString());
            setCurrentStamps(newStampCount);

            toast({
                title: "Récompense réclamée !",
                description: "Félicitations ! Vos tampons ont été réinitialisés."
            });
        }
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle>Votre carte de fidélité</CardTitle>
                <CardDescription>
                    {isRewardAvailable
                        ? "Félicitations ! Vous avez une récompense disponible."
                        : `Encore ${remainingStamps} tampon(s) pour votre prochaine récompense !`
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
                 {isRewardAvailable ? (
                    <Button onClick={handleClaimReward} size="lg" className="mt-4">
                        <Award className="mr-2 h-5 w-5" />
                        Réclamer ma récompense
                    </Button>
                ) : (
                    <div className="text-sm text-muted-foreground mt-2">
                        {currentStamps} / {stampsForReward} tampons
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
