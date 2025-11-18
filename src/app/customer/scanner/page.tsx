
'use client';

import { useState, useRef, useEffect, useCallback } from "react";
import jsQR from "jsqr";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, CameraOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { logStampActivity } from "@/lib/activity-log";
import { textToSpeech } from "@/ai/flows/text-to-speech";

export default function ScannerPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const animationFrameId = useRef<number>();

  const scanQrCode = useCallback(() => {
    if (isLoading || !isScanning) return;
    
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          handleValidation(code.data);
          return; // Stop scanning once a code is found
        }
      }
    }
    animationFrameId.current = requestAnimationFrame(scanQrCode);
  }, [isLoading, isScanning]);


  useEffect(() => {
    let stream: MediaStream | null = null;
    const enableCamera = async () => {
      setIsLoading(true);
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
             animationFrameId.current = requestAnimationFrame(scanQrCode);
          };
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
      } finally {
        setIsLoading(false);
      }
    };

    if (isScanning) {
      enableCamera();
    } else {
       if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isScanning, toast, scanQrCode]);

  const handleScanClick = () => {
    setIsScanning(true);
  };
  
  const handleValidation = async (scannedData: string) => {
    setIsLoading(true);
    setIsScanning(false);

    const storedQrDataStr = localStorage.getItem('loyaltyQrCode');
    
    if (!storedQrDataStr) {
      toast({
        variant: "destructive",
        title: "Code QR invalide",
        description: "Aucun QR code valide n'est configuré par le restaurateur."
      });
      setIsLoading(false);
      return;
    }
    
    const storedQrData = JSON.parse(storedQrDataStr);
    
    if (scannedData === storedQrData.value && storedQrData.expires > Date.now()) {
      const user = sessionStorage.getItem('loggedInUser');
      if (user) {
          const parsedUser = JSON.parse(user);
          let newStampCount = (parseInt(localStorage.getItem(`stamps_${parsedUser.phone}`) || '0', 10)) + 1;
          localStorage.setItem(`stamps_${parsedUser.phone}`, newStampCount.toString());
          logStampActivity();
      }
      
      const confirmationText = "Tampon validé !";
      toast({
          title: confirmationText,
          description: "Vous avez bien reçu votre tampon de fidélité."
      });

      try {
        const audioResponse = await textToSpeech(confirmationText);
        const audio = new Audio(audioResponse.media);
        audio.play();
      } catch (e) {
        console.error("Erreur lors de la génération de la synthèse vocale", e);
      }

      setTimeout(() => {
        router.push('/customer');
      }, 1500);

    } else {
        toast({
            variant: "destructive",
            title: "Code QR invalide ou expiré",
            description: "Veuillez scanner un code valide fourni par le restaurateur."
        });
        // Allow scanning again
         setTimeout(() => {
             setIsLoading(false);
             // Re-enable scanning if user wants to try again
             // animationFrameId.current = requestAnimationFrame(scanQrCode);
         }, 2000);
    }
  }

  const handleCancel = () => {
    setIsScanning(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
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
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                {(hasCameraPermission === false || isLoading) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white p-4">
                    {isLoading && <Loader2 className="h-12 w-12 mb-4 animate-spin" />}
                    {hasCameraPermission === false && !isLoading && (
                        <>
                            <CameraOff className="h-12 w-12 mb-4" />
                            <Alert variant="destructive">
                                <AlertTitle>Accès Caméra Requis</AlertTitle>
                                <AlertDescription>
                                  Veuillez autoriser l'accès à la caméra pour utiliser cette fonctionnalité.
                                </AlertDescription>
                            </Alert>
                        </>
                    )}
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
              <Button className="w-full" onClick={handleScanClick} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Scanner le QR Code
              </Button>
          ) : (
              <div className="w-full flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" className="w-full" onClick={handleCancel}>Annuler</Button>
                  <Button className="w-full" disabled>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Validation en cours..."}
                  </Button>
              </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
