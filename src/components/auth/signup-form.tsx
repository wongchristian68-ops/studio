
"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function SignUpForm() {
  const [role, setRole] = useState("customer");
  const [showUserExistsAlert, setShowUserExistsAlert] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;

    // Simulate checking if user exists in localStorage
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const userExists = existingUsers.some((user: any) => user.phone === phone);

    if (userExists) {
      setShowUserExistsAlert(true);
    } else {
      // Simulate saving user
      const newUser = { name, phone, role };
      existingUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(existingUsers));
      
      // Also save to session storage for immediate use
      sessionStorage.setItem('loggedInUser', JSON.stringify(newUser));
      
      toast({
        title: "Compte créé !",
        description: "Vous allez être redirigé.",
      });

      if (role === 'restaurateur') {
        router.push('/dashboard');
      } else {
        router.push('/customer');
      }
    }
  };

  return (
    <>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Créer un compte</CardTitle>
            <CardDescription>Entrez vos informations pour commencer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input id="name" name="name" type="text" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <Input id="phone" name="phone" type="tel" placeholder="+33 6 12 34 56 78" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Je suis un...</Label>
              <Select name="role" value={role} onValueChange={setRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Sélectionnez votre rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Client</SelectItem>
                  <SelectItem value="restaurateur">Restaurateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Créer un compte
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="mt-4 text-center text-sm">
              Vous avez déjà un compte ?{" "}
              <Link href="/login" className="underline">
                Se connecter
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
      <AlertDialog open={showUserExistsAlert} onOpenChange={setShowUserExistsAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cet utilisateur existe déjà</AlertDialogTitle>
            <AlertDialogDescription>
              Un compte utilisant ce numéro de téléphone existe déjà. Veuillez vous connecter.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Link href="/login">Se connecter</Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
