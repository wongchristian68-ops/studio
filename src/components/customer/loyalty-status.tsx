import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function LoyaltyStatus() {
    const currentStamps = 7;
    const stampsForReward = 10;
    const progress = (currentStamps / stampsForReward) * 100;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Loyalty Status</CardTitle>
                <CardDescription>You have {currentStamps} stamps. Only {stampsForReward - currentStamps} more to go for a free reward!</CardDescription>
            </CardHeader>
            <CardContent>
                <Progress value={progress} className="w-full" />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>0 stamps</span>
                    <span>{stampsForReward} stamps</span>
                </div>
            </CardContent>
        </Card>
    );
}
