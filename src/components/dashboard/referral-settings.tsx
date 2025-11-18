
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "../ui/switch";
import { useState, useEffect } from "react";

export function ReferralSettings() {
    const { toast } = useToast();
    const [referrerReward, setReferrerReward] = useState("5 points bonus");
    const [referredReward, setReferredReward] = useState("5 points bonus");
    const [isEnabled, setIsEnabled] = useState(true);

    useEffect(() => {
        const savedSettings = localStorage.getItem("referralSettings");
        if (savedSettings) {
            const { referrerReward, referredReward, isEnabled } = JSON.parse(savedSettings);
            setReferrerReward(referrerReward);
            setReferredReward(referredReward);
            setIsEnabled(isEnabled);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newSettings = {
            referrerReward,
            referredReward,
            isEnabled,
        };
        localStorage.setItem("referralSettings", JSON.stringify(newSettings));
        toast({
            title: "Paramètres sauvegardés",
            description: "Vos paramètres de parrainage ont été mis à jour.",
        });
    };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Programme de parrainage</CardTitle>
          <CardDescription>Configurez les récompenses pour les parrains et les filleuls.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                    <Label htmlFor="enable-program">Activer le programme</Label>
                    <p className="text-xs text-muted-foreground">
                        Permettre aux clients de parrainer leurs amis.
                    </p>
                </div>
                <Switch 
                    id="enable-program"
                    checked={isEnabled}
                    onCheckedChange={setIsEnabled}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="referrer-reward">Récompense du parrain</Label>
                <Input 
                    id="referrer-reward" 
                    type="text" 
                    placeholder="Ex: Un café offert" 
                    value={referrerReward}
                    onChange={(e) => setReferrerReward(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="referred-reward">Récompense du filleul</Label>
                <Input 
                    id="referred-reward" 
                    type="text" 
                    placeholder="Ex: -10% sur la première commande" 
                    value={referredReward}
                    onChange={(e) => setReferredReward(e.target.value)}
                />
            </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Sauvegarder</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
