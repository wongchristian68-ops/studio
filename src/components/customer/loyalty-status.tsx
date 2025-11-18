import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function LoyaltyStatus() {
    const currentStamps = 7;
    const stampsForReward = 10;
    const progress = (currentStamps / stampsForReward) * 100;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Votre statut de fidélité</CardTitle>
                <CardDescription>Vous avez {currentStamps} tampons. Encore {stampsForReward - currentStamps} pour une récompense gratuite !</CardDescription>
            </CardHeader>
            <CardContent>
                <Progress value={progress} className="w-full" />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>0 tampons</span>
                    <span>{stampsForReward} tampons</span>
                </div>
            </CardContent>
        </Card>
    );
}
