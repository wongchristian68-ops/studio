
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
    // Reset response when a new review is selected
    if (review) {
      setResponse('');
    }
  }, [review]);

  const handleGenerateResponse = async () => {
    if (!review) return;
    setIsGenerating(true);
    try {
      const generatedText = await generateReviewResponse({
        customerName: review.customerName,
        rating: review.rating,
        comment: review.comment,
      });
      setResponse(generatedText);
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.message && (error.message.includes('overloaded') || error.message.includes('503'))
        ? 'Le service est actuellement surchargé. Veuillez réessayer dans quelques instants.'
        : 'Impossible de générer une réponse pour le moment.';

      toast({
        variant: 'destructive',
        title: "Erreur de l'IA",
        description: errorMessage,
      });
    } finally {
      setIsGenerating(false);
    }
  };

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
            Voici l'avis du client. Générez une réponse ou écrivez la vôtre.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="italic text-muted-foreground border-l-4 pl-4">
            "{review.comment}"
          </div>
          <div className="space-y-2">
            <Label htmlFor="response">Votre Réponse</Label>
            <Textarea
              id="response"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Écrivez votre réponse ici..."
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleGenerateResponse} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Générer avec l'IA
          </Button>
          <Button onClick={handleSendResponse} disabled={!response}>Envoyer la réponse</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
