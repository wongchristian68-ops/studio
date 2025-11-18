import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { OAuthButtons } from "./oauth-buttons";

export function LoginForm() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Content de vous revoir</CardTitle>
        <CardDescription>Connectez-vous pour accéder à votre tableau de bord</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="password">Mot de passe</Label>
            <Link href="#" className="ml-auto inline-block text-sm underline">
              Mot de passe oublié ?
            </Link>
          </div>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full" asChild>
          <Link href="/dashboard">Se connecter</Link>
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Ou continuer avec
            </span>
          </div>
        </div>
        <OAuthButtons />
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
