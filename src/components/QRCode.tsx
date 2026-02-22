import { QRCodeSVG } from "qrcode.react";

interface QRCodeProps {
  value: string;
  size?: number;
}

export default function QRCode({ value, size = 200 }: QRCodeProps) {
  if (!value) return null;
  return (
    <div className="inline-block p-2 bg-white rounded">
      <QRCodeSVG value={value} size={size} level="M" />
    </div>
  );
}
