"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export function LoginForm() {
  const [role, setRole] = useState("customer");
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const phone = formData.get("phone") as string;
    
    // Simulate checking if user exists in localStorage
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = existingUsers.find((user: any) => user.phone === phone && user.role === role);

    if (foundUser) {
      toast({
        title: "Connexion réussie !",
        description: "Vous allez être redirigé.",
      });
      if (role === 'restaurateur') {
        router.push('/dashboard');
      } else {
        router.push('/customer');
      }
    } else {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Aucun compte trouvé avec ce numéro de téléphone et ce rôle. Veuillez vous inscrire.",
      });
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Content de vous revoir</CardTitle>
          <CardDescription>Connectez-vous pour accéder à votre espace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Numéro de téléphone</Label>
            <Input id="phone" name="phone" type="tel" placeholder="+33 6 12 34 56 78" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Je me connecte en tant que...</Label>
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
            Se connecter
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="mt-4 text-center text-sm">
            Vous n'avez pas de compte ?{" "}
            <Link href="/signup" className="underline">
              S'inscrire
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
