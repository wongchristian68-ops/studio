
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function SettingsPage() {
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    const savedLogo = localStorage.getItem("loyaltyCardLogo");
    if (savedLogo) {
      setLogoPreview(savedLogo);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (logoPreview) {
      localStorage.setItem("loyaltyCardLogo", logoPreview);
      toast({
        title: "Logo sauvegardé !",
        description: "Votre carte de fidélité a été mise à jour.",
      });
    }
  };
  
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres du restaurant</CardTitle>
          <CardDescription>
            Gérez les paramètres de votre compte et de votre restaurant.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-24 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Plus de paramètres bientôt disponibles.</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Personnalisation de la carte de fidélité</CardTitle>
          <CardDescription>
            Téléchargez le logo de votre restaurant pour personnaliser la carte de fidélité numérique de vos clients.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logo-upload">Logo du restaurant</Label>
            <Input id="logo-upload" type="file" accept="image/*" onChange={handleFileChange} />
             <p className="text-sm text-muted-foreground">Téléchargez une image (PNG, JPG). Recommandé: 200x200px.</p>
          </div>
          {logoPreview && (
            <div className="space-y-2">
              <Label>Aperçu de la carte</Label>
              <div className="border rounded-lg p-6 bg-secondary flex flex-col items-center justify-center text-center">
                 <Image src={logoPreview} alt="Aperçu du logo" width={80} height={80} className="rounded-full mb-4" />
                 <h3 className="font-bold text-lg text-secondary-foreground">Votre Carte de Fidélité</h3>
                 <p className="text-sm text-muted-foreground">Revenez nous voir !</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={!logoFile}>Sauvegarder les modifications</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
