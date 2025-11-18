import Link from 'next/link';
import { UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <UtensilsCrossed className="h-6 w-6 text-primary" />
          <span>RestoConnect</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Se connecter</Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground">
            <Link href="/signup">Commencer</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
