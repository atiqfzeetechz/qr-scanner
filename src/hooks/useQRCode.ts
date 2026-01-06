import { useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import Extension from "qr-code-styling";
import type {Options} from "qr-code-styling";
import { useAxios } from "./useAxios";

export const useQRCode = (options: Options) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrInstance = useRef<QRCodeStyling | null>(null);
  const { post } = useAxios()

  if (!qrInstance.current) {
    qrInstance.current = new QRCodeStyling(options);
  }

  const generate = (data: string) => {
    // console.log(options)
    // console.log(data)
    // return
    if (!containerRef.current || !qrInstance.current) return;

    // clear old QR
    containerRef.current.innerHTML = "";

    qrInstance.current.update({
      ...options,
      data,

    });

    // 🔥 THIS IS REQUIRED
    qrInstance.current.append(containerRef.current);
    post('/admin/qr/create', {
      data: data,
      options: options

    })
  };

  const download = (ext: Extension | any = "png") => {
    qrInstance.current?.download({ extension: ext });
  };

  return {
    ref: containerRef,
    generate,
    download,
  };
};
