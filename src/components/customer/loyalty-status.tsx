
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Stamp, Award, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { logRewardClaimActivity } from "@/lib/activity-log";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RestaurantProfile {
    name: string;
    address: string;
}

export function LoyaltyStatus() {
    const [currentStamps, setCurrentStamps] = useState(0);
    const [stampsForReward, setStampsForReward] = useState(10);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [restaurantProfile, setRestaurantProfile] = useState<RestaurantProfile | null>(null);
    const [showReviewPrompt, setShowReviewPrompt] = useState(false);
    const { toast } = useToast();

    const fetchLoyaltyData = () => {
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

        const storedProfile = localStorage.getItem("restaurantProfile");
        if (storedProfile) {
            setRestaurantProfile(JSON.parse(storedProfile));
        } else {
            setRestaurantProfile({ name: "le restaurant", address: "" });
        }
    };

    useEffect(() => {
        fetchLoyaltyData();
        
        window.addEventListener('storage', fetchLoyaltyData);
        return () => {
            window.removeEventListener('storage', fetchLoyaltyData);
        };
    }, []);
    
    const isRewardAvailable = currentStamps >= stampsForReward;
    const remainingStamps = isRewardAvailable ? 0 : stampsForReward - currentStamps;

    const handleClaimReward = () => {
        const user = sessionStorage.getItem('loggedInUser');
        if (user) {
            const parsedUser = JSON.parse(user);
            // This resets stamps after claiming one reward.
            const newStampCount = currentStamps - stampsForReward;
            localStorage.setItem(`stamps_${parsedUser.phone}`, newStampCount.toString());
            setCurrentStamps(newStampCount);
            logRewardClaimActivity(); // Log the reward claim

            toast({
                title: "Récompense réclamée !",
                description: "Félicitations ! Vos tampons ont été utilisés."
            });

            // Prompt for review
            setShowReviewPrompt(true);
        }
    };

    const handleReviewClick = () => {
        if (restaurantProfile && restaurantProfile.name) {
            const query = encodeURIComponent(`${restaurantProfile.name} ${restaurantProfile.address}`);
            const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
            window.open(url, '_blank');
        }
        setShowReviewPrompt(false);
    }


    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Votre carte de fidélité</CardTitle>
                    <CardDescription>
                        {isRewardAvailable
                            ? `Félicitations ! Vous avez ${Math.floor(currentStamps / stampsForReward)} récompense(s) disponible(s).`
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
                                        index < (currentStamps % stampsForReward) ? "bg-primary text-primary-foreground" : "bg-muted"
                                    )}
                                >
                                    <Stamp className={cn("w-2/3 h-2/3", index < (currentStamps % stampsForReward) ? "opacity-100" : "opacity-25")} />
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
                            {currentStamps % stampsForReward} / {stampsForReward} tampons
                        </div>
                    )}
                </CardContent>
            </Card>
            <AlertDialog open={showReviewPrompt} onOpenChange={setShowReviewPrompt}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Merci pour votre fidélité !</AlertDialogTitle>
                        <AlertDialogDescription>
                            Vous avez apprécié votre expérience ? Aidez-nous en laissant un avis sur Google. Votre soutien compte énormément !
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Plus tard</AlertDialogCancel>
                        <AlertDialogAction onClick={handleReviewClick}>
                           <Star className="mr-2 h-4 w-4" /> Laisser un avis
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
