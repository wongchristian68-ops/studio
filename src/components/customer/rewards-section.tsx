import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

const rewards = [
    { id: 1, title: "Café gratuit", points: 10, available: false },
    { id: 2, title: "50% de réduction sur la pâtisserie", points: 15, available: true },
    { id: 3, title: "Repas gratuit", points: 50, available: true },
];

export function RewardsSection() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Récompenses disponibles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {rewards.map(reward => (
                    <div key={reward.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Gift className="h-5 w-5 text-primary" />
                            <div>
                                <p className="font-semibold">{reward.title}</p>
                                <p className="text-sm text-muted-foreground">{reward.points} points</p>
                            </div>
                        </div>
                        <Button size="sm" disabled={!reward.available}>Réclamer</Button>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
