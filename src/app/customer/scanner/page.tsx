
'use client';

import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, CameraOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { logStampActivity } from "@/lib/activity-log";


export default function ScannerPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    let stream: MediaStream | null = null;
    const getCameraPermission = async () => {
      if (isScanning) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error("Error accessing camera:", error);
          setHasCameraPermission(false);
          setIsScanning(false);
          toast({
            variant: "destructive",
            title: "Accès à la caméra refusé",
            description: "Veuillez autoriser l'accès à la caméra dans les paramètres de votre navigateur.",
          });
        }
      }
    };
    getCameraPermission();

    return () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        if(videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }
  }, [isScanning, toast]);

  const handleScanClick = () => {
    setIsScanning(true);
  };
  
  const handleValidation = () => {
    // In a real app, we'd validate the QR code content. Here we simulate success.
    const user = sessionStorage.getItem('loggedInUser');
    if (user) {
        const parsedUser = JSON.parse(user);
        const currentStamps = parseInt(localStorage.getItem(`stamps_${parsedUser.phone}`) || '0', 10);
        const loyaltySettings = JSON.parse(localStorage.getItem('loyaltySettings') || '{ "stampCount": 10 }');
        
        let newStampCount = currentStamps + 1;
        if (newStampCount > loyaltySettings.stampCount) {
            newStampCount = loyaltySettings.stampCount;
        }
        
        localStorage.setItem(`stamps_${parsedUser.phone}`, newStampCount.toString());
        logStampActivity();
    }
    
    setIsScanning(false);
    toast({
        title: "Tampon validé !",
        description: "Vous avez bien reçu votre tampon de fidélité."
    });

    setTimeout(() => {
      router.push('/customer');
    }, 1000);
  }

  return (
    <div className="flex justify-center items-start pt-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Valider un tampon</CardTitle>
          <CardDescription>Scannez le QR code affiché par votre restaurateur pour recevoir un tampon.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-square w-full bg-muted rounded-md flex items-center justify-center overflow-hidden">
            {isScanning ? (
              <div className="relative w-full h-full">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                {hasCameraPermission === false && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4">
                    <CameraOff className="h-12 w-12 mb-4" />
                     <Alert variant="destructive">
                        <AlertTitle>Accès Caméra Requis</AlertTitle>
                        <AlertDescription>
                          Veuillez autoriser l'accès à la caméra pour utiliser cette fonctionnalité.
                        </AlertDescription>
                      </Alert>
                  </div>
                )}
                 <div className="absolute inset-2 border-2 border-dashed border-primary rounded-lg opacity-75"></div>
              </div>
            ) : (
              <QrCode className="h-24 w-24 text-muted-foreground" />
            )}
          </div>
        </CardContent>
        <CardFooter>
          {!isScanning ? (
              <Button className="w-full" onClick={handleScanClick}>Scanner le QR Code</Button>
          ) : (
              <div className="w-full flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" className="w-full" onClick={() => setIsScanning(false)}>Annuler</Button>
                  <Button className="w-full" onClick={handleValidation} disabled={hasCameraPermission === false}>Valider le tampon</Button>
              </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
