import { LoyaltyStatus } from "@/components/customer/loyalty-status";
import { ReferralCard } from "@/components/customer/referral-card";
import { RewardsSection } from "@/components/customer/rewards-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Star } from "lucide-react";

const history = [
    { id: 1, date: "2024-07-20", description: "Stamp Earned", points: "+1" },
    { id: 2, date: "2024-07-15", description: "Reward Claimed: Free Coffee", points: "-10" },
    { id: 3, date: "2024-07-12", description: "Stamp Earned", points: "+1" },
    { id: 4, date: "2024-07-11", description: "Referral Bonus", points: "+5" },
    { id: 5, date: "2024-07-10", description: "Stamp Earned", points: "+1" },
];

export default function CustomerPage() {
    return (
        <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-8">
                <LoyaltyStatus />
                <Card>
                    <CardHeader>
                        <CardTitle>History</CardTitle>
                        <CardDescription>Your recent loyalty activity.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Points</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {history.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell className="text-right font-medium">{item.points}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-8">
                <Card className="text-center">
                    <CardHeader>
                        <CardTitle>Enjoying your experience?</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <p className="text-muted-foreground">Help us by leaving a review on Google!</p>
                        <Button size="lg" className="w-full bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground">
                            <Star className="mr-2 h-4 w-4" />
                            Leave a Review
                        </Button>
                    </CardContent>
                </Card>
                <ReferralCard />
                <RewardsSection />
            </div>
        </div>
    )
}
