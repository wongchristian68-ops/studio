
'use client';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const PWALifeCycle = () => {
    const { toast } = useToast();

    useEffect(() => {
        if (
            typeof window !== 'undefined' &&
            'serviceWorker' in navigator &&
            (window as any).workbox !== undefined
        ) {
            const wb = (window as any).workbox;

            wb.addEventListener('installed', (event: any) => {
                if(event.isUpdate) {
                    toast({
                        title: 'Mise à jour disponible !',
                        description: 'Une nouvelle version de l\'application a été installée. Relancez pour voir les nouveautés.',
                    })
                } else {
                     toast({
                        title: 'Application installée',
                        description: 'RestoConnect est maintenant disponible hors ligne.',
                    })
                }
            });

            wb.addEventListener('waiting', () => {
                 toast({
                    title: 'Mise à jour en attente',
                    description: 'Une nouvelle version est prête. Fermez tous les onglets de l\'application pour l\'activer.',
                    duration: 10000
                })
            });

            wb.register();
        }
    }, [toast]);
    return null;
};
