import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function LoginForm() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Content de vous revoir</CardTitle>
        <CardDescription>Connectez-vous pour accéder à votre espace</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Numéro de téléphone</Label>
          <Input id="phone" type="tel" placeholder="+33 6 12 34 56 78" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Je me connecte en tant que...</Label>
           <Select name="role" defaultValue="customer">
            <SelectTrigger id="role">
              <SelectValue placeholder="Sélectionnez votre rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customer">Client</SelectItem>
              <SelectItem value="restaurateur">Restaurateur</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full" asChild>
          <Link href="/dashboard">Se connecter</Link>
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
    </Card>
  );
}
