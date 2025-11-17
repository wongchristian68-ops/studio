import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
            <UtensilsCrossed className="h-8 w-8 text-primary" />
            <span>RestoConnect</span>
          </Link>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
