
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import type { Referral } from "@/lib/types";
import { Alert, AlertDescription } from "../ui/alert";
import { logReferralBonusActivity, logReferralClaimActivity } from "@/lib/activity-log";

interface LoggedInUser {
    name: string;
    phone: string;
    role: string;
    referralCode?: string;
}

export function ReferralCard() {
    const { toast } = useToast();
    const [referralCode, setReferralCode] = useState<string>('...');
    const [enteredCode, setEnteredCode] = useState("");
    const [currentUser, setCurrentUser] = useState<LoggedInUser | null>(null);
    const [pendingReferralRewards, setPendingReferralRewards] = useState<string[]>([]);
    const [referralRewardDescription, setReferralRewardDescription] = useState("un cadeau");
    const [referredRewardDescription, setReferredRewardDescription] = useState("un cadeau");
    
    const fetchUserData = () => {
        const userStr = sessionStorage.getItem('loggedInUser');
        if (userStr) {
            try {
                const parsedUser: LoggedInUser = JSON.parse(userStr);
                setCurrentUser(parsedUser);
                setReferralCode(parsedUser.referralCode || 'N/A');

                const rewardsKey = `pending_referral_rewards_${parsedUser.phone}`;
                const pendingRewards: string[] = JSON.parse(localStorage.getItem(rewardsKey) || '[]');
                setPendingReferralRewards(pendingRewards);

                const referralSettingsStr = localStorage.getItem('referralSettings');
                 if (referralSettingsStr) {
                    const settings = JSON.parse(referralSettingsStr);
                    setReferralRewardDescription(settings.referrerReward || "un cadeau");
                    setReferredRewardDescription(settings.referredReward || "un cadeau");
                }

            } catch (error) {
                console.error("Failed to parse user data from session storage", error);
                setReferralCode('ERREUR');
            }
        } else {
            setReferralCode('Non trouvé');
        }
    };

    useEffect(() => {
        fetchUserData();

        const handleStorageChange = () => {
            fetchUserData();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const copyToClipboard = () => {
        if(!referralCode || referralCode === '...' || referralCode === 'N/A') return;
        navigator.clipboard.writeText(referralCode);
        toast({
            title: "Copié dans le presse-papiers !",
            description: "Votre code de parrainage a été copié.",
        });
    };
    
    const handleValidateReferral = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !enteredCode.trim()) return;

        const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const referrer = allUsers.find((user: any) => user.referralCode === enteredCode.trim() && user.phone !== currentUser.phone);

        if (referrer) {
            // Check if user has already used a referral code
            const alreadyReferredKey = `has_used_referral_${currentUser.phone}`;
            if (localStorage.getItem(alreadyReferredKey)) {
                toast({
                    variant: "destructive",
                    title: "Code déjà utilisé",
                    description: "Vous avez déjà utilisé un code de parrainage."
                });
                return;
            }

            // --- Give reward to the new user (referred) ---
            if (referredRewardDescription) {
                const referredRewardsKey = `referral_rewards_${currentUser.phone}`;
                const existingReferredRewards: string[] = JSON.parse(localStorage.getItem(referredRewardsKey) || '[]');
                existingReferredRewards.push(referredRewardDescription);
                localStorage.setItem(referredRewardsKey, JSON.stringify(existingReferredRewards));
                logReferralBonusActivity(currentUser.phone, referredRewardDescription);
            }
            localStorage.setItem(alreadyReferredKey, 'true'); // Mark that user has used a referral code
            
            // --- Give reward to the referrer (pending) ---
            if(referralRewardDescription) {
                const referrerPendingRewardsKey = `pending_referral_rewards_${referrer.phone}`;
                const currentPendingRewardsStr = localStorage.getItem(referrerPendingRewardsKey);
                const currentPendingRewards: string[] = currentPendingRewardsStr ? JSON.parse(currentPendingRewardsStr) : [];
                currentPendingRewards.push(referralRewardDescription);
                localStorage.setItem(referrerPendingRewardsKey, JSON.stringify(currentPendingRewards));
            }

            // --- Log referral activity ---
            const referralActivity: Referral[] = JSON.parse(localStorage.getItem('referralActivity') || '[]');
            const newReferral: Referral = {
                id: `ref-${Date.now()}`,
                referrer: referrer.name,
                referred: currentUser.name,
                date: new Date().toLocaleDateString('fr-FR'),
                status: 'Complété'
            };
            referralActivity.push(newReferral);
            localStorage.setItem('referralActivity', JSON.stringify(referralActivity));

            toast({
                title: "Code de parrainage validé !",
                description: `Vous avez reçu une nouvelle récompense : "${referredRewardDescription}" !`
            });
            
            // --- Update UI ---
            setEnteredCode("");
            // Manually dispatch storage event to notify other components like loyalty card and dashboard stats
            window.dispatchEvent(new Event('storage')); 

        } else {
            toast({
                variant: "destructive",
                title: "Code invalide",
                description: "Ce code de parrainage n'est pas valide ou c'est votre propre code."
            })
        }
    }

    const handleClaimRewards = () => {
        if (!currentUser || pendingReferralRewards.length <= 0) return;

        // Move rewards from pending to actual rewards list
        const rewardsToClaim = pendingReferralRewards;
        const rewardsKey = `referral_rewards_${currentUser.phone}`;
        const existingRewards: string[] = JSON.parse(localStorage.getItem(rewardsKey) || '[]');
        const updatedRewards = [...existingRewards, ...rewardsToClaim];
        localStorage.setItem(rewardsKey, JSON.stringify(updatedRewards));
        
        // Log each claimed reward
        rewardsToClaim.forEach(rewardDesc => {
            logReferralClaimActivity(currentUser.phone, rewardDesc);
        });

        // Clear pending rewards
        const pendingRewardsKey = `pending_referral_rewards_${currentUser.phone}`;
        localStorage.setItem(pendingRewardsKey, '[]');

        toast({
            title: "Récompenses récupérées !",
            description: `Vous avez ${rewardsToClaim.length} nouvelle(s) récompense(s) disponible(s) dans votre section cadeaux.`
        });
        
        // Update UI
        fetchUserData(); // Refetches all user data including pending rewards
        window.dispatchEvent(new Event('storage')); // Trigger update for other components
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Parrainer un ami</CardTitle>
                    <CardDescription>Partagez votre code et obtenez tous les deux une récompense !</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {pendingReferralRewards.length > 0 && (
                         <Alert className="border-green-500 bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                             <Gift className="h-4 w-4 !text-green-600" />
                            <AlertDescription className="flex justify-between items-center">
                                <span>
                                    Vous avez {pendingReferralRewards.length} récompense{pendingReferralRewards.length > 1 ? 's' : ''} de parrainage en attente !
                                </span>
                                <Button size="sm" variant="outline" onClick={handleClaimRewards} className="bg-background/80 hover:bg-background">Récupérer</Button>
                            </AlertDescription>
                        </Alert>
                    )}
                     <div className="text-sm text-muted-foreground">Votre récompense : <span className="font-semibold text-foreground">{referralRewardDescription}</span></div>
                    <div className="flex items-center space-x-2">
                         <div className="flex-grow p-2 border rounded-md bg-muted text-center font-mono text-lg tracking-widest">
                            {referralCode}
                        </div>
                        <Button variant="outline" size="icon" onClick={copyToClipboard} aria-label="Copier le code de parrainage" disabled={referralCode === '...' || referralCode === 'N/A'}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Utiliser un code</CardTitle>
                    <CardDescription>Un ami vous a parrainé ? Entrez son code ici pour recevoir votre cadeau : <span className="font-semibold text-foreground">{referredRewardDescription}</span>.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleValidateReferral} className="flex items-center space-x-2">
                        <Input 
                            placeholder="CODE-AMI" 
                            value={enteredCode}
                            onChange={(e) => setEnteredCode(e.target.value.toUpperCase())}
                        />
                        <Button type="submit" disabled={!enteredCode}>Valider</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

    