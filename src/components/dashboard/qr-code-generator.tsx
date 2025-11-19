
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import QRCode from "react-qr-code";
import { Loader2 } from 'lucide-react';

// Simple pseudo-random string generator
const generateRandomString = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const CODE_LIFETIME_SECONDS = 24 * 60 * 60; // 24 hours

export function QrCodeGenerator() {
  const [qrData, setQrData] = useState<{ value: string; expires: number } | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateNewCode = () => {
    setIsGenerating(true);
    const value = generateRandomString(20);
    const expires = Date.now() + CODE_LIFETIME_SECONDS * 1000;
    const newQrData = { value, expires };
    setQrData(newQrData);
    localStorage.setItem('loyaltyQrCode', JSON.stringify(newQrData));
    toast({
      title: 'Nouveau QR Code généré !',
      description: `Ce code est valable 24 heures.`,
    });
    setIsGenerating(false);
  };

  useEffect(() => {
    const storedQrData = localStorage.getItem('loyaltyQrCode');
    if (storedQrData) {
      const data = JSON.parse(storedQrData);
      if (data.expires > Date.now()) {
        setQrData(data);
      }
    }
  }, []);

  useEffect(() => {
    if (!qrData || qrData.expires <= Date.now()) {
      setTimeLeft(0);
      if(qrData) { // If there was a code, but it expired, clear it
        setQrData(null);
      }
      return;
    }

    const calculateTimeLeft = () => {
      const now = Date.now();
      const remaining = Math.max(0, qrData.expires - now);
      setTimeLeft(remaining);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [qrData]);

  const formatTime = (ms: number) => {
    if (ms <= 0) return 'Expiré';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const isExpired = !qrData || timeLeft <= 0;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Générateur de QR Code</CardTitle>
        <CardDescription>
          Générez un QR code unique pour permettre à vos clients de valider leurs tampons. Chaque code est valable 24 heures.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="aspect-square w-full max-w-[250px] p-4 border rounded-lg bg-white text-black">
          {qrData && !isExpired ? (
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={qrData.value}
              viewBox={`0 0 256 256`}
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground rounded-md">
              <p>{isExpired ? 'Code expiré' : 'Aucun code actif'}</p>
            </div>
          )}
        </div>
        {!isExpired && (
            <div className="text-center">
                <p className="font-semibold">Temps restant :</p>
                <p className="text-2xl font-mono text-primary tabular-nums w-36">
                  {formatTime(timeLeft)}
                </p>
            </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={generateNewCode} disabled={isGenerating}>
          {isGenerating ? <Loader2 className="animate-spin" /> : (isExpired ? 'Générer un nouveau QR Code' : 'Générer un autre QR Code')}
        </Button>
      </CardFooter>
    </Card>
  );
}
