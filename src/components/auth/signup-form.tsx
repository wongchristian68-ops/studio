"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SignUpForm() {
  const [role, setRole] = useState("customer");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'restaurateur') {
      router.push('/dashboard');
    } else {
      router.push('/customer');
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Créer un compte</CardTitle>
          <CardDescription>Entrez vos informations pour commencer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet</Label>
            <Input id="name" type="text" placeholder="John Doe" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Numéro de téléphone</Label>
            <Input id="phone" type="tel" placeholder="+33 6 12 34 56 78" required />
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
  );
}