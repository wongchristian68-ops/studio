
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import type { Referral } from "@/lib/types";

const QrCodeSvg = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full rounded-md">
        <path fill="currentColor" d="M0 0h30v30H0zM10 10h10v10H10zM40 0h30v30H40zM50 10h10v10H50zM70 0h30v30H70zM80 10h10v10H80zM0 40h30v30H0zM10 50h10v10H10zM0 70h30v30H0zM10 80h10v10H10zM40 70h30v30H40zM50 80h10v10H50zM70 40h30v30H70zM70 70h30v30H70zM80 80h10v10H80zM40 40h10v10H40zM50 50h10v10H50zM40 60h10v10H40zM60 40h10v10H60zM60 60h10v10H60zM45 25h10v10H45zM25 45h10v10H25zM25 25h10v10H25z"/>
    </svg>
)

const REFERRAL_REWARD_POINTS = 2; // e.g., 2 bonus stamps

export function ReferralCard() {
    const { toast } = useToast();
    const [referralCode, setReferralCode] = useState("");
    const [enteredCode, setEnteredCode] = useState("");
    const [currentUser, setCurrentUser] = useState<any>(null);
    
    useEffect(() => {
        const user = sessionStorage.getItem('loggedInUser');
        if (user) {
            const parsedUser = JSON.parse(user);
            setCurrentUser(parsedUser);
            if (parsedUser.referralCode) {
                setReferralCode(parsedUser.referralCode);
            }
        }
    }, []);

    const copyToClipboard = () => {
        if(!referralCode) return;
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
            // Give reward to the referred (current user)
            const referredStampsKey = `stamps_${currentUser.phone}`;
            const currentReferredStamps = parseInt(localStorage.getItem(referredStampsKey) || '0', 10);
            localStorage.setItem(referredStampsKey, (currentReferredStamps + REFERRAL_REWARD_POINTS).toString());
            
            // Give reward to the referrer
            const referrerStampsKey = `stamps_${referrer.phone}`;
            const currentReferrerStamps = parseInt(localStorage.getItem(referrerStampsKey) || '0', 10);
            localStorage.setItem(referrerStampsKey, (currentReferrerStamps + REFERRAL_REWARD_POINTS).toString());

            // Log the referral activity
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
                description: `Félicitations ! Vous et ${referrer.name} avez reçu ${REFERRAL_REWARD_POINTS} tampons bonus.`
            });
             // Dispatch a storage event to notify other components (like loyalty status)
            window.dispatchEvent(new Event('storage'));
            setEnteredCode("");

        } else {
            toast({
                variant: "destructive",
                title: "Code invalide",
                description: "Ce code de parrainage n'est pas valide ou c'est votre propre code."
            })
        }
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Parrainer un ami</CardTitle>
                    <CardDescription>Partagez votre code et vous obtenez tous les deux des récompenses !</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg bg-muted flex justify-center">
                        <div className="w-24 h-24 text-foreground">
                            <QrCodeSvg />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Input value={referralCode} readOnly />
                        <Button variant="outline" size="icon" onClick={copyToClipboard} aria-label="Copier le code de parrainage" disabled={!referralCode}>
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
                            onChange={(e) => setEnteredCode(e.target.value)}
                        />
                        <Button type="submit">Valider</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
