

'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Review } from '@/lib/types';
import { generateReviewResponse } from '@/ai/flows/generate-review-response';
import type { GenerateReviewResponseInput } from '@/ai/flows/types';
import { Loader2 } from 'lucide-react';

interface ReviewResponseDialogProps {
  review: Review | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReviewResponseDialog({ review, isOpen, onOpenChange }: ReviewResponseDialogProps) {
  const { toast } = useToast();
  const [response, setResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const handleGenerateResponse = async () => {
      if (!review) return;

      // If a response is already generated and stored, use it.
      if (review.aiResponse) {
        setResponse(review.aiResponse);
        return;
      }

      // Otherwise, generate a new one.
      setIsGenerating(true);
      try {
          const input: GenerateReviewResponseInput = {
              customerName: review.customerName,
              rating: review.rating,
              comment: review.comment,
          };
          const generatedText = await generateReviewResponse(input);
          setResponse(generatedText);
          // Here you might want to update the source data `recentReviews`
          // but for this simulation, we'll just set it in the state.
          // In a real app, you'd have a function `updateReview(review.id, { aiResponse: generatedText })`
          if(review) {
            review.aiResponse = generatedText; // Mutating for demo purposes
          }

      } catch (error) {
          console.error("Failed to generate AI response:", error);
          toast({
              variant: "destructive",
              title: "Erreur de génération",
              description: "Impossible de générer une réponse pour le moment.",
          });
      }
      setIsGenerating(false);
    };

    if (isOpen && review) {
      handleGenerateResponse();
    } else {
      // Reset response when dialog is closed or no review
      setResponse('');
    }
  }, [review, isOpen, toast]);


  const handleSendResponse = () => {
    toast({
      title: 'Réponse envoyée !',
      description: 'Votre réponse a été publiée sur Google.',
    });
    onOpenChange(false);
  };
  
  if (!review) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Répondre à {review.customerName}</DialogTitle>
          <DialogDescription>
            Voici l'avis du client. L'IA a généré une suggestion de réponse.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="italic text-muted-foreground border-l-4 pl-4">
            "{review.comment}"
          </div>
          <div className="space-y-2">
            <Label htmlFor="response">Votre Réponse</Label>
            {isGenerating ? (
                <div className="flex items-center justify-center h-24 bg-muted rounded-md">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <Textarea
                  id="response"
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Écrivez votre réponse ici..."
                  rows={5}
                />
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSendResponse} disabled={!response || isGenerating}>Envoyer la réponse</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
