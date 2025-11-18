
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

// Simple pseudo-random string generator
const generateRandomString = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// SVG QR Code component
const QrCodeSvg = ({ value }: { value: string }) => {
    // This is a placeholder for a real QR code library. 
    // In a real app, you'd use a library to generate a proper QR code image from the value.
    const pseudoData = useMemo(() => {
        const segments = [];
        for (let i = 0; i < 100; i++) {
            const hash = value.split('').reduce((acc, char) => acc + char.charCodeAt(0) * (i + 1), 0);
            if ((hash + i) % 3 === 0) {
                const x = (i % 10) * 10;
                const y = Math.floor(i / 10) * 10;
                segments.push(`M${x} ${y}h10v10H${x}z`);
            }
        }
        return segments.join('');
    }, [value]);

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full rounded-md">
      <path fill="currentColor" d={pseudoData} />
    </svg>
  );
};


export function QrCodeGenerator() {
  const [qrData, setQrData] = useState<{ value: string; expires: number } | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const { toast } = useToast();

  const generateNewCode = () => {
    const value = generateRandomString(20);
    const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    const newQrData = { value, expires };
    setQrData(newQrData);
    localStorage.setItem('loyaltyQrCode', JSON.stringify(newQrData));
    toast({
      title: 'Nouveau QR Code généré !',
      description: 'Ce code est valable 24 heures.',
    });
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
            <QrCodeSvg value={qrData.value} />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground rounded-md">
              <p>Aucun code actif</p>
            </div>
          )}
        </div>
        {qrData && !isExpired && (
            <div className="text-center">
                <p className="font-semibold">Temps restant :</p>
                <p className="text-2xl font-mono text-primary">{formatTime(timeLeft)}</p>
            </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={generateNewCode}>
          {isExpired ? 'Générer un nouveau QR Code' : 'Générer un autre QR Code'}
        </Button>
      </CardFooter>
    </Card>
  );
}
