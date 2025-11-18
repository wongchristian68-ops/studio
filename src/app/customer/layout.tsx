import Link from 'next/link';
import { UtensilsCrossed, User, Gift, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function CustomerHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <UtensilsCrossed className="h-6 w-6 text-primary" />
            <span className="inline-block font-bold">RestoConnect</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link href="/customer" className="text-sm font-medium text-foreground hover:text-primary">
              Mes Points
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Récompenses
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Parrainer un ami
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <svg
                  className="h-8 w-8 text-muted-foreground"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Jane Doe</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><User className="mr-2 h-4 w-4" />Profil</DropdownMenuItem>
              <DropdownMenuItem><Gift className="mr-2 h-4 w-4" />Mes récompenses</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href="/"><LogOut className="mr-2 h-4 w-4" />Déconnexion</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/40">
      <CustomerHeader />
      <main className="container mx-auto py-8 px-4 md:px-6">
        {children}
      </main>
    </div>
  );
}
