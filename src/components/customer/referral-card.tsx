
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import type { Referral } from "@/lib/types";
import { Alert, AlertDescription } from "../ui/alert";

const REFERRAL_REWARD_POINTS = 2; // e.g., 2 bonus stamps

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
    const [pendingReferralRewards, setPendingReferralRewards] = useState(0);
    
    const fetchUserData = () => {
        const userStr = sessionStorage.getItem('loggedInUser');
        if (userStr) {
            try {
                const parsedUser: LoggedInUser = JSON.parse(userStr);
                setCurrentUser(parsedUser);
                setReferralCode(parsedUser.referralCode || 'N/A');

                const rewardsKey = `pending_referral_rewards_${parsedUser.phone}`;
                const pendingRewards = parseInt(localStorage.getItem(rewardsKey) || '0', 10);
                setPendingReferralRewards(pendingRewards);
            } catch (error) {
                console.error("Failed to parse user data from session storage", error);
                setReferralCode('ERREUR');
            }
        } else {
            setReferralCode('Non trouvé');
        }
    };

    useEffect(() => {
        // We need to make sure this runs only on the client
        fetchUserData();
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
        if (!currentUser || !enteredCode) return;

        const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const referrer = allUsers.find((user: any) => user.referralCode === enteredCode.trim() && user.phone !== currentUser.phone);

        if (referrer) {
            const referredRewardsKey = `pending_referral_rewards_${currentUser.phone}`;
            const currentReferredRewards = parseInt(localStorage.getItem(referredRewardsKey) || '0', 10);
            localStorage.setItem(referredRewardsKey, (currentReferredRewards + 1).toString());
            
            const referrerRewardsKey = `pending_referral_rewards_${referrer.phone}`;
            const currentReferrerRewards = parseInt(localStorage.getItem(referrerRewardsKey) || '0', 10);
            localStorage.setItem(referrerRewardsKey, (currentReferrerRewards + 1).toString());
            
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
                description: `Une récompense de parrainage est en attente pour vous et ${referrer.name} !`
            });
            
            fetchUserData();
            setEnteredCode("");
            window.dispatchEvent(new Event('storage'));

        } else {
            toast({
                variant: "destructive",
                title: "Code invalide",
                description: "Ce code de parrainage n'est pas valide ou c'est votre propre code."
            })
        }
    }

    const handleClaimReward = () => {
        if (!currentUser || pendingReferralRewards <= 0) return;

        const totalStampsToAdd = pendingReferralRewards * REFERRAL_REWARD_POINTS;

        const stampsKey = `stamps_${currentUser.phone}`;
        const currentStamps = parseInt(localStorage.getItem(stampsKey) || '0', 10);
        localStorage.setItem(stampsKey, (currentStamps + totalStampsToAdd).toString());

        const rewardsKey = `pending_referral_rewards_${currentUser.phone}`;
        localStorage.setItem(rewardsKey, '0');

        setPendingReferralRewards(0);

        toast({
            title: "Récompenses récupérées !",
            description: `Vous avez reçu ${totalStampsToAdd} tampons bonus.`
        });
        
        window.dispatchEvent(new Event('storage'));
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Parrainer un ami</CardTitle>
                    <CardDescription>Partagez votre code et vous obtenez tous les deux des récompenses !</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {pendingReferralRewards > 0 && (
                         <Alert className="border-green-500 bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                             <Gift className="h-4 w-4 !text-green-600" />
                            <AlertDescription className="flex justify-between items-center">
                                <span>
                                    Vous avez {pendingReferralRewards} récompense{pendingReferralRewards > 1 ? 's' : ''} de parrainage !
                                </span>
                                <Button size="sm" variant="outline" onClick={handleClaimReward} className="bg-background/80 hover:bg-background">Récupérer</Button>
                            </AlertDescription>
                        </Alert>
                    )}
                    <div className="flex items-center space-x-2">
                         <div className="flex-grow p-2 border rounded-md bg-muted text-center font-mono text-lg tracking-widest">
                            {referralCode}
                        </div>
                        <Button variant="outline" size="icon" onClick={copyToClipboard} aria-label="Copier le code de parrainage" disabled={referralCode === '...'}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Utiliser un code</CardTitle>
                    <CardDescription>Un ami vous a parrainé ? Entrez son code ici.</CardDescription>
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
