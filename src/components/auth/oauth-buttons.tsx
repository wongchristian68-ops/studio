import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

const GoogleIcon = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.27 1.44-1.7 3.75-4.69 3.75a5.53 5.53 0 0 1-5.5-5.5 5.53 5.53 0 0 1 5.5-5.5c1.75 0 3.03.72 3.75 1.41l2.6-2.6C18.09 3.32 15.49 2 12.48 2a10 10 0 0 0-10 10 10 10 0 0 0 10 10 9.88 9.88 0 0 0 9.92-9.92A9.45 9.45 0 0 0 12.48 10.92Z"/></svg>;

export function OAuthButtons() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button variant="outline">
        <GoogleIcon />
        <span className="ml-2">Google</span>
      </Button>
      <Button variant="outline">
        <Phone />
        <span className="ml-2">Phone</span>
      </Button>
    </div>
  );
}
