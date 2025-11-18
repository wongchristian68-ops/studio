
import { QrCodeGenerator } from '@/components/dashboard/qr-code-generator';

export default function LoyaltyQrPage() {
  return (
    <div className="flex justify-center items-start pt-8">
        <QrCodeGenerator />
    </div>
  );
}
