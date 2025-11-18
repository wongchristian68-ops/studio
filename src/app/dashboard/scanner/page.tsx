
'use client';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ScannerPage() {
    return (
        <div className="flex justify-center items-start pt-8">
             <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle>Page Retirée</CardTitle>
                    <CardDescription>
                        Cette fonctionnalité a été déplacée vers l'application client. Vos clients peuvent désormais scanner votre QR code directement.
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    )
}
