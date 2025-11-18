
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface LoggedInUser {
    phone: string;
}

export function RewardsSection() {
    const [rewards, setRewards] = useState<string[]>([]);
    const [user, setUser] = useState<LoggedInUser | null>(null);
    const { toast } = useToast();

    const fetchRewards = () => {
        const userStr = sessionStorage.getItem('loggedInUser');
        if (userStr) {
            const parsedUser = JSON.parse(userStr);
            setUser(parsedUser);
            const rewardsKey = `referral_rewards_${parsedUser.phone}`;
            const storedRewards = JSON.parse(localStorage.getItem(rewardsKey) || '[]');
            setRewards(storedRewards);
        }
    };

    useEffect(() => {
        fetchRewards();
        window.addEventListener('storage', fetchRewards);
        return () => {
            window.removeEventListener('storage', fetchRewards);
        };
    }, []);

    const handleClaimReward = (rewardToClaim: string, indexToClaim: number) => {
        if (!user) return;

        const updatedRewards = rewards.filter((_, index) => index !== indexToClaim);
        const rewardsKey = `referral_rewards_${user.phone}`;
        localStorage.setItem(rewardsKey, JSON.stringify(updatedRewards));
        setRewards(updatedRewards);

        toast({
            title: "Récompense réclamée !",
            description: `Montrez ce message pour obtenir : "${rewardToClaim}".`,
            duration: 10000, 
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Vos récompenses de parrainage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {rewards.length > 0 ? rewards.map((reward, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Gift className="h-5 w-5 text-primary" />
                            <div>
                                <p className="font-semibold">{reward}</p>
                            </div>
                        </div>
                        <Button size="sm" onClick={() => handleClaimReward(reward, index)}>Réclamer</Button>
                    </div>
                )) : (
                    <p className="text-muted-foreground text-center">Aucune récompense de parrainage pour le moment.</p>
                )}
            </CardContent>
        </Card>
    );
}
