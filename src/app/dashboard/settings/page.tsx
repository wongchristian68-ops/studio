
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


export default function SettingsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [customerPhone, setCustomerPhone] = useState('');
  const [stampCount, setStampCount] = useState(10);
  const [rewardDescription, setRewardDescription] = useState('Une boisson chaude offerte');

  useEffect(() => {
    const savedLogo = localStorage.getItem("loyaltyCardLogo");
    if (savedLogo) {
      setLogoPreview(savedLogo);
    }
    const savedLoyaltySettings = localStorage.getItem("loyaltySettings");
    if (savedLoyaltySettings) {
        const { stampCount, rewardDescription } = JSON.parse(savedLoyaltySettings);
        setStampCount(stampCount);
        setRewardDescription(rewardDescription);
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

  const handleLogoSave = () => {
    if (logoPreview) {
      localStorage.setItem("loyaltyCardLogo", logoPreview);
      toast({
        title: "Logo sauvegardé !",
        description: "Votre carte de fidélité a été mise à jour.",
      });
    }
  };

  const handleLoyaltySettingsSave = () => {
    const loyaltySettings = {
        stampCount,
        rewardDescription,
    };
    localStorage.setItem("loyaltySettings", JSON.stringify(loyaltySettings));
    toast({
        title: "Paramètres de fidélité sauvegardés !",
        description: "Votre programme de fidélité a été mis à jour.",
    });
  }

  const handleDeleteCustomer = () => {
    if (!customerPhone) {
        toast({
            variant: "destructive",
            title: "Erreur",
            description: "Veuillez entrer un numéro de téléphone.",
        });
        return;
    }
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const userExists = existingUsers.some((user: any) => user.phone === customerPhone && user.role === 'customer');

    if (userExists) {
        const updatedUsers = existingUsers.filter((user: any) => !(user.phone === customerPhone && user.role === 'customer'));
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        toast({
            title: "Client supprimé",
            description: `Le client avec le numéro ${customerPhone} a été supprimé.`,
        });
        setCustomerPhone('');
    } else {
        toast({
            variant: "destructive",
            title: "Client non trouvé",
            description: "Aucun client trouvé avec ce numéro de téléphone.",
        });
    }
  };
  
  const handleDeleteRestaurateur = () => {
    // In a real app, this would be a more complex process.
    // For now, we'll just clear the local storage and redirect.
    localStorage.clear();
    toast({
      title: "Compte supprimé",
      description: "Votre compte a été supprimé avec succès. Vous allez être redirigé.",
    });
    router.push('/');
  };
  
  return (
    <div className="grid gap-6">
       <Card>
        <CardHeader>
            <CardTitle>Programme de fidélité</CardTitle>
            <CardDescription>
                Définissez le nombre de tampons nécessaires pour obtenir une récompense et ce qu'est la récompense.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="stamp-count">Nombre de tampons pour une récompense</Label>
                <Input 
                    id="stamp-count" 
                    type="number" 
                    value={stampCount}
                    onChange={(e) => setStampCount(parseInt(e.target.value))}
                    min="1"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="reward-description">Description de la récompense</Label>
                <Input 
                    id="reward-description" 
                    type="text"
                    placeholder="Ex: Une boisson chaude offerte"
                    value={rewardDescription}
                    onChange={(e) => setRewardDescription(e.target.value)}
                />
            </div>
        </CardContent>
        <CardFooter>
            <Button onClick={handleLoyaltySettingsSave}>Sauvegarder les paramètres de fidélité</Button>
        </CardFooter>
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
          <Button onClick={handleLogoSave} disabled={!logoFile}>Sauvegarder les modifications</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Gestion des clients (RGPD)</CardTitle>
          <CardDescription>
            Supprimez les données d'un client à sa demande. Cette action est irréversible.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-2">
                <Label htmlFor="customer-phone">Numéro de téléphone du client</Label>
                <Input 
                    id="customer-phone" 
                    type="tel" 
                    placeholder="+33 6 12 34 56 78" 
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)} 
                />
            </div>
        </CardContent>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={!customerPhone}>Supprimer le client</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Cette action est irréversible. Toutes les données du client {customerPhone} seront définitivement supprimées.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteCustomer} className="bg-destructive hover:bg-destructive/90">
                        Oui, supprimer ce client
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
            <CardTitle className="text-destructive">Zone de danger</CardTitle>
            <CardDescription>
                Actions irréversibles concernant votre compte.
            </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-between items-center p-4 bg-destructive/5 rounded-lg">
            <div>
                <p className="font-semibold">Supprimer votre compte</p>
                <p className="text-sm text-muted-foreground">Toutes vos données seront définitivement effacées.</p>
            </div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive">Supprimer mon compte</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. Toutes vos données, y compris les données de vos clients, seront définitivement supprimées.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteRestaurateur} className="bg-destructive hover:bg-destructive/90">
                            Oui, supprimer mon compte
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
