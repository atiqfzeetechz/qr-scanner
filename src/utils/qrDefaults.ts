// @ts-nocheck
import {
  Options,
  DrawType,
  Mode,
  ErrorCorrectionLevel,
  DotType,
  CornerSquareType,
  CornerDotType
} from "qr-code-styling";

export const defaultQROptions: Options = {
  width: 300,
  height: 300,
  type: "svg" as DrawType,
  data: "",
  margin: 10,
  qrOptions: {
    mode: "Byte" as Mode,
    errorCorrectionLevel: "Q" as ErrorCorrectionLevel
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 20,
    crossOrigin: "anonymous"
  },
  dotsOptions: {
    color: "#222",
    type: "rounded" as DotType
  },
  backgroundOptions: {
    color: "#ffffff"
  },
  cornersSquareOptions: {
    type: "extra-rounded" as CornerSquareType,
    color: "#222"
  },
  cornersDotOptions: {
    type: "dot" as CornerDotType,
    color: "#222"
  }
};
