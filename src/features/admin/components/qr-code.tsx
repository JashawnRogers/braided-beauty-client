import QRCode from "react-qr-code";

export default function FinalPaymentQrModal({
  checkoutUrl,
}: {
  checkoutUrl: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h2 className="text-lg font-semibold">Scan to pay remaining balance</h2>

      <div className="rounded-xl border bg-background p-4">
        <QRCode value={checkoutUrl} size={220} />
      </div>

      <p className="text-sm text-muted-foreground text-center">
        Scan with your phone camera to pay via Apple Pay, Google Pay, or card.
      </p>

      <a
        href={checkoutUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm underline"
      >
        Open payment link
      </a>
    </div>
  );
}
