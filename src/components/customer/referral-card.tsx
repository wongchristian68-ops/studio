
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const QrCodeSvg = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full rounded-md">
        <path fill="currentColor" d="M0 0h30v30H0zM10 10h10v10H10zM40 0h30v30H40zM50 10h10v10H50zM70 0h30v30H70zM80 10h10v10H80zM0 40h30v30H0zM10 50h10v10H10zM0 70h30v30H0zM10 80h10v10H10zM40 70h30v30H40zM50 80h10v10H50zM70 40h30v30H70zM70 70h30v30H70zM80 80h10v10H80zM40 40h10v10H40zM50 50h10v10H50zM40 60h10v10H40zM60 40h10v10H60zM60 60h10v10H60zM45 25h10v10H45zM25 45h10v10H25zM25 25h10v10H25z"/>
    </svg>
)

const generateReferralCode = (name: string): string => {
    if (!name) return 'USER-XXXX';
    const namePart = name.split(' ')[0].toUpperCase().substring(0, 4);
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${namePart}-${randomPart}`;
};


export function ReferralCard() {
    const { toast } = useToast();
    const [referralCode, setReferralCode] = useState("");
    
    useEffect(() => {
        const user = sessionStorage.getItem('loggedInUser');
        if (user) {
            const parsedUser = JSON.parse(user);
            setReferralCode(generateReferralCode(parsedUser.name));
        } else {
            setReferralCode("USER-A1B2");
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
    
    const handleValidateReferral = () => {
        toast({
            title: "Code de parrainage validé !",
            description: "Vous et votre ami(e) avez reçu votre récompense."
        })
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
                        <Input placeholder="CODE-AMI" />
                        <Button type="submit">Valider</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
