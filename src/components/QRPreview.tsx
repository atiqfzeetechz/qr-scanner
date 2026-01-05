interface Props {
  qrRef: React.RefObject<HTMLDivElement>;
}

export const QRPreview = ({ qrRef }: Props) => {
  return (
    <div
      ref={qrRef}
      className="p-4 bg-white border rounded-lg min-h-[280px] min-w-[280px] flex items-center justify-center"
    />
  );
};
