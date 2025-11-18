import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { recentReviews } from "@/lib/data";
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="h-4 w-4 fill-primary text-primary" />
      ))}
      {halfStar && <StarHalf className="h-4 w-4 fill-primary text-primary" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 fill-muted stroke-muted-foreground" />
      ))}
    </div>
  );
};


export function RecentReviews() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Avis Récents</CardTitle>
        <CardDescription>Derniers commentaires des clients de Google.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[390px]">
          <div className="space-y-4 pr-4">
            {recentReviews.map((review) => (
              <div key={review.id} className={cn("flex items-start gap-4 p-3 rounded-lg border", review.rating < 3 && "bg-destructive/10 border-destructive/20")}>
                <Avatar className="mt-1">
                  <AvatarImage src={`https://picsum.photos/seed/${review.customerName.replace(' ', '')}/40/40`} />
                  <AvatarFallback>{review.customerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{review.customerName}</p>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-sm text-muted-foreground leading-snug">{review.comment}</p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
