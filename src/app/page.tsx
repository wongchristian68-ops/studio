import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Users, QrCode } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');
  const loyaltyImage = PlaceHolderImages.find((img) => img.id === 'loyalty-card');
  const referralImage = PlaceHolderImages.find((img) => img.id === 'referral-program');
  const reviewsImage = PlaceHolderImages.find((img) => img.id === 'google-reviews');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="relative w-full pt-24 pb-12 md:pt-32 md:pb-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary font-headline">
                    Connectez-vous avec vos clients, développez votre restaurant
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    RestoConnect est la plateforme tout-en-un pour fidéliser vos clients, générer des recommandations et gérer votre réputation en ligne.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground">
                    <Link href="/signup">Commencez gratuitement</Link>
                  </Button>
                </div>
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                {heroImage && (
                  <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    width={600}
                    height={400}
                    className="aspect-video w-full object-cover"
                    data-ai-hint={heroImage.imageHint}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">Fonctionnalités clés</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Tout ce dont vous avez besoin pour réussir
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Des cartes de fidélité numériques au marketing de parrainage puissant, nous avons ce qu'il vous faut.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <QrCode className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Programme de fidélité numérique</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">Remplacez les cartes de pointage en papier par un système de fidélité par QR code transparent que les clients adorent.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Parrainages automatisés</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">Transformez vos meilleurs clients en ambassadeurs avec des codes de parrainage uniques et des récompenses automatisées.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <Star className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Gestion des avis</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">Encouragez les avis Google positifs et soyez averti des commentaires pour protéger votre réputation.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-secondary/50 py-6">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} RestoConnect. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}
