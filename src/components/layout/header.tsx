import Link from 'next/link';
import { UtensilsCrossed, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <UtensilsCrossed className="h-6 w-6 text-primary" />
          <span>RestoConnect</span>
        </Link>
        <nav className="hidden items-center gap-4 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/login">Se connecter</Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground">
            <Link href="/signup">Commencer</Link>
          </Button>
        </nav>
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Ouvrir le menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <div className="grid gap-4 py-6">
                         <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-4">
                            <UtensilsCrossed className="h-6 w-6 text-primary" />
                            <span>RestoConnect</span>
                        </Link>
                        <Button variant="ghost" asChild>
                            <Link href="/login">Se connecter</Link>
                        </Button>
                        <Button asChild className="bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground">
                            <Link href="/signup">Commencer</Link>
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
