
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
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
import type { Referral } from "@/lib/types";
import { getActivityLog, setActivityLog } from "@/lib/activity-log";
import { getLoggedInUser } from "@/lib/data-access";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function CustomerProfilePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');

  useEffect(() => {
    const users = getLoggedInUser();
    if (users && users.length > 0) {
      setUserName(users[0].name);
      setUserPhone(users[0].phone);
    }
  }, []);

  const handleDeleteAccount = () => {
    if (!userPhone) {
        toast({
            variant: "destructive",
            title: "Erreur",
            description: "Utilisateur non trouvé.",
        });
        return;
    }
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    
    // Delete user accounts across all restaurants
    const updatedUsers = allUsers.filter((user: any) => user.phone !== userPhone);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    // In a multi-restaurant system, this would need to be more granular.
    // For this implementation, we delete all data associated with the phone number.
    Object.keys(localStorage).forEach(key => {
        if (key.includes(`_${userPhone}`)) {
            localStorage.removeItem(key);
        }
    });

    // Delete from global activity log
    const activityLog = getActivityLog();
    const updatedActivityLog = activityLog.filter(event => event.userPhone !== userPhone);
    setActivityLog(updatedActivityLog);
    
    // Clear session and redirect
    sessionStorage.removeItem('loggedInUser');
    
    toast({
        title: "Compte supprimé",
        description: `Toutes vos données ont été supprimées.`,
    });

    router.push('/');
  };
  
  return (
    <div className="grid gap-6 max-w-2xl mx-auto">
       <Card>
        <CardHeader>
          <CardTitle>Mon Profil</CardTitle>
          <CardDescription>
            Gérez les informations de votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="restaurant-name">Nom d'utilisateur</Label>
                <Input 
                    id="restaurant-name" 
                    type="text" 
                    value={userName}
                    readOnly
                    className="bg-muted"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="restaurant-address">Numéro de téléphone</Label>
                <Input 
                    id="restaurant-address" 
                    type="text"
                    value={userPhone}
                    readOnly
                     className="bg-muted"
                />
            </div>
        </CardContent>
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
                            Cette action est irréversible. Toutes vos données sur l'ensemble des programmes de fidélité seront définitivement supprimées.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
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
