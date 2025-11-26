
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
    // When the dialog opens, if there's a review, set the response from the mock data.
    if (isOpen && review) {
      setResponse(review.aiResponse || '');
    } else if (!isOpen) {
      // Reset when closed
      setResponse('');
    }
  }, [review, isOpen]);

  const handleSendResponse = () => {
    toast({
      title: 'Réponse envoyée !',
      description: 'Dans un vrai scénario, votre réponse serait publiée sur Google.',
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
            Rédigez ou modifiez la réponse ci-dessous.
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
          <Button onClick={handleSendResponse} disabled={!response}>
            Envoyer la réponse
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
