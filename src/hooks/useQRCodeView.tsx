import { useRef } from "react";
import QRCodeStyling, { Options, Extension } from "qr-code-styling";

export const useQRCodeView = (options: Options) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrInstance = useRef<QRCodeStyling | null>(null);

  if (!qrInstance.current) {
    qrInstance.current = new QRCodeStyling(options);
  }

  const display = (data: string) => {
    if (!containerRef.current || !qrInstance.current) return;

    containerRef.current.innerHTML = "";

    qrInstance.current.update({
      ...options,
      data,
    });

    qrInstance.current.append(containerRef.current);
  };

  const download = (ext: Extension = "png") => {
    qrInstance.current?.download({ extension: ext });
  };

  return {
    ref: containerRef,
    display,
    download,
  };
};