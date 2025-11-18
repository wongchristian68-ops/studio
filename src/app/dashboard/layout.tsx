
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Home,
  Users,
  Star,
  Settings,
  QrCode,
  UtensilsCrossed,
  UserPlus,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const notifications = [
  { type: 'user', content: 'Nouveau client inscrit: Marc D.', time: 'il y a 5 minutes' },
  { type: 'referral', content: 'Pauline A. a parrainé un nouvel utilisateur.', time: 'il y a 2 heures' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pageTitles: { [key: string]: string } = {
    '/dashboard': 'Aperçu',
    '/dashboard/loyalty-qr': 'Générer QR Code',
    '/dashboard/referrals': 'Parrainages',
    '/dashboard/reviews': 'Avis',
    '/dashboard/settings': 'Paramètres',
  }
  const title = pageTitles[pathname] || 'Aperçu';


  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-muted/40">
        <Sidebar>
          <SidebarHeader>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg p-2">
              <UtensilsCrossed className="h-6 w-6 text-primary" />
              <span className="group-data-[collapsible=icon]:hidden">RestoConnect</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Aperçu" isActive={pathname === '/dashboard'}>
                   <Link href="/dashboard">
                    <Home />
                    <span>Aperçu</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Générer QR Code" isActive={pathname === '/dashboard/loyalty-qr'}>
                   <Link href="/dashboard/loyalty-qr">
                    <QrCode />
                    <span>Générer QR Code</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Parrainages" isActive={pathname === '/dashboard/referrals'}>
                  <Link href="/dashboard/referrals">
                    <Users />
                    <span>Parrainages</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Avis" isActive={pathname === '/dashboard/reviews'}>
                  <Link href="/dashboard/reviews">
                    <Star />
                    <span>Avis</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
             <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Paramètres" isActive={pathname === '/dashboard/settings'}>
                  <Link href="/dashboard/settings">
                    <Settings />
                    <span>Paramètres</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
            <SidebarTrigger className="md:hidden"/>
            <div className="flex-1">
              <h1 className="text-lg font-semibold font-headline">{title}</h1>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="ml-auto h-8 w-8 relative">
                  <Bell className="h-4 w-4" />
                  <span className="sr-only">Activer/Désactiver les notifications</span>
                  {notifications.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 justify-center p-0">{notifications.length}</Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length > 0 ? (
                  notifications.map((notif, index) => (
                    <DropdownMenuItem key={index} className="flex items-start gap-3">
                      <Avatar className="h-8 w-8 border">
                         <AvatarFallback>
                           {notif.type === 'user' ? <UserPlus className="h-4 w-4" /> : <Gift className="h-4 w-4" />}
                         </AvatarFallback>
                       </Avatar>
                       <div className="grid gap-0.5">
                         <p className="text-sm font-medium">{notif.content}</p>
                         <p className="text-xs text-muted-foreground">{notif.time}</p>
                       </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    <p>Aucune nouvelle notification.</p>
                  </div>
                )}
                 <DropdownMenuSeparator />
                 <DropdownMenuItem className="justify-center text-sm text-muted-foreground hover:text-foreground">
                    Voir toutes les notifications
                 </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                  <span className="sr-only">Ouvrir le menu utilisateur</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">Paramètres</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="mailto:support@restoconnect.com">Support</a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/">Déconnexion</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
