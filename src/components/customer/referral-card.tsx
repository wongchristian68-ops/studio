"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const QrCodeSvg = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full rounded-md">
        <path fill="currentColor" d="M0 0h30v30H0zM10 10h10v10H10zM40 0h30v30H40zM50 10h10v10H50zM70 0h30v30H70zM80 10h10v10H80zM0 40h30v30H0zM10 50h10v10H10zM0 70h30v30H0zM10 80h10v10H10zM40 70h30v30H40zM50 80h10v10H50zM70 40h30v30H70zM70 70h30v30H70zM80 80h10v10H80zM40 40h10v10H40zM50 50h10v10H50zM40 60h10v10H40zM60 40h10v10H60zM60 60h10v10H60zM45 25h10v10H45zM25 45h10v10H25zM25 25h10v10H25z"/>
    </svg>
)

export function ReferralCard() {
    const { toast } = useToast();
    const referralCode = "JANE-D-8B3C";
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralCode);
        toast({
            title: "Copied to clipboard!",
            description: "Your referral code has been copied.",
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Refer a Friend</CardTitle>
                <CardDescription>Share your code and you both get rewards!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted flex justify-center">
                    <div className="w-24 h-24 text-foreground">
                        <QrCodeSvg />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Input value={referralCode} readOnly />
                    <Button variant="outline" size="icon" onClick={copyToClipboard} aria-label="Copy referral code">
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
