
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

  const stopScanning = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = undefined;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  }, []);

  const handleValidation = useCallback(async (scannedData: string) => {
    setIsLoading(true);
    stopScanning(); // Stop camera and animation frame
    
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
    const userStr = sessionStorage.getItem('loggedInUser');
    
    if (!userStr) {
        toast({ variant: "destructive", title: "Erreur", description: "Utilisateur non connecté." });
        setIsLoading(false);
        return;
    }
    const parsedUser = JSON.parse(userStr);

    if (scannedData === storedQrData.value && storedQrData.expires > Date.now()) {
      // Check if user has already scanned this specific QR code
      const scannedCodesLog: Record<string, string[]> = JSON.parse(localStorage.getItem('scannedQrCodes') || '{}');
      const usersWhoScannedThisCode = scannedCodesLog[scannedData] || [];

      if (usersWhoScannedThisCode.includes(parsedUser.phone)) {
        toast({
            variant: "destructive",
            title: "Code QR déjà utilisé",
            description: "Vous avez déjà validé un tampon avec ce QR code."
        });
        setIsLoading(false);
        return;
      }

      // Add user to the log for this QR code
      usersWhoScannedThisCode.push(parsedUser.phone);
      scannedCodesLog[scannedData] = usersWhoScannedThisCode;
      localStorage.setItem('scannedQrCodes', JSON.stringify(scannedCodesLog));

      // Add stamp to user
      let newStampCount = (parseInt(localStorage.getItem(`stamps_${parsedUser.phone}`) || '0', 10)) + 1;
      localStorage.setItem(`stamps_${parsedUser.phone}`, newStampCount.toString());
      logStampActivity(parsedUser.phone);
      
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
      
      window.dispatchEvent(new Event('storage'));

      setTimeout(() => {
        router.push('/customer');
      }, 1500);

    } else {
        toast({
            variant: "destructive",
            title: "Code QR invalide ou expiré",
            description: "Veuillez scanner un code valide fourni par le restaurateur."
        });
        setIsLoading(false);
    }
  }, [router, toast, stopScanning]);

  const scanQrCode = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code && code.data) {
          handleValidation(code.data);
          return; // Stop scanning once a code is found and handled
        }
    }
    
    animationFrameId.current = requestAnimationFrame(scanQrCode);
  }, [isScanning, handleValidation]);

   useEffect(() => {
    let stream: MediaStream;

    const startCamera = async () => {
      if (isScanning && hasCameraPermission !== false) {
        setIsLoading(true);
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            // Wait for video to start playing to get correct dimensions
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play().catch(e => console.error("Video play failed:", e));
              setHasCameraPermission(true);
              setIsLoading(false);
              animationFrameId.current = requestAnimationFrame(scanQrCode);
            };
          }
        } catch (error) {
          console.error("Error accessing camera:", error);
          setHasCameraPermission(false);
          setIsLoading(false);
          toast({
            variant: "destructive",
            title: "Accès à la caméra refusé",
            description: "Veuillez autoriser l'accès à la caméra dans les paramètres de votre navigateur.",
          });
        }
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isScanning, scanQrCode, toast, hasCameraPermission]);
  

  const handleScanClick = () => {
    setIsScanning(true);
  };
  
  const handleCancel = () => {
    stopScanning();
    setIsLoading(false);
  }

  return (
    <div className="flex justify-center items-start pt-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Valider un tampon</CardTitle>
          <CardDescription>Scannez le QR code affiché par votre restaurateur pour recevoir un tampon.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-square w-full bg-muted rounded-md flex items-center justify-center overflow-hidden relative">
            {!isScanning && !isLoading && (
              <QrCode className="h-24 w-24 text-muted-foreground" />
            )}
             {(isScanning || isLoading) && (
                 <video ref={videoRef} className="w-full h-full object-cover" playsInline hidden={hasCameraPermission === false || isLoading}/>
             )}
             <canvas ref={canvasRef} style={{ display: 'none' }} />
            
            {(isLoading || hasCameraPermission === false) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white p-4 text-center">
                {isLoading && <Loader2 className="h-12 w-12 mb-4 animate-spin" />}
                {hasCameraPermission === false && (
                    <>
                        <CameraOff className="h-12 w-12 mb-4" />
                        <Alert variant="destructive" className="bg-transparent border-red-500/50 text-white">
                            <AlertTitle>Accès Caméra Requis</AlertTitle>
                            <AlertDescription>
                              Veuillez autoriser l'accès à la caméra pour scanner.
                            </AlertDescription>
                        </Alert>
                    </>
                )}
              </div>
            )}
             {isScanning && hasCameraPermission && !isLoading && (
                <div className="absolute inset-2 border-2 border-dashed border-primary rounded-lg opacity-75"></div>
             )}
          </div>
        </CardContent>
        <CardFooter>
          {!isScanning ? (
              <Button className="w-full" onClick={handleScanClick} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Scanner le QR Code"}
              </Button>
          ) : (
              <div className="w-full flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" className="w-full" onClick={handleCancel} disabled={isLoading}>Annuler</Button>
              </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
