"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, CameraOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";

export function LoyaltyScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

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
    setIsScanning(false);
    toast({
        title: "Tampon validé !",
        description: "Le client a bien reçu son tampon de fidélité."
    });
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Valider un tampon</CardTitle>
        <CardDescription>Scannez le QR code de fidélité de votre client pour lui ajouter un tampon.</CardDescription>
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
  );
}
