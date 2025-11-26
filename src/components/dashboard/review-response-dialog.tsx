
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
import { Loader2, Sparkles } from 'lucide-react';

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
    // Reset state when dialog is closed or review changes
    if (!isOpen) {
      setResponse('');
      setIsGenerating(false);
    } else if (review?.aiResponse) {
      setResponse(review.aiResponse);
    } else {
      setResponse('');
    }
  }, [review, isOpen]);

  const handleGenerateResponse = async () => {
    if (!review) return;

    setIsGenerating(true);
    try {
      const input: GenerateReviewResponseInput = {
        customerName: review.customerName,
        rating: review.rating,
        comment: review.comment,
      };
      const generatedText = await generateReviewResponse(input);
      setResponse(generatedText);
      // Store the generated response on the review object for this session
      review.aiResponse = generatedText;

    } catch (error) {
      console.error("Failed to generate AI response:", error);
      toast({
        variant: "destructive",
        title: "Erreur de génération",
        description: "Impossible de générer une réponse pour le moment.",
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
            Rédigez votre réponse ou laissez l'IA en suggérer une.
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
              disabled={isGenerating}
            />
          </div>
        </div>
        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between">
           <Button variant="outline" onClick={handleGenerateResponse} disabled={isGenerating}>
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Générer avec l'IA
          </Button>
          <Button onClick={handleSendResponse} disabled={!response || isGenerating}>
            Envoyer la réponse
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
