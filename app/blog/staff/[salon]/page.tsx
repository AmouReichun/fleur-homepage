import { notFound } from "next/navigation";
import StaffUploadForm from "./StaffUploadForm";

const SALON_INFO = {
  fleurami: { label: "fleur ami", sub: "ヘアサロン・香南市" },
  riv:      { label: "Riv.",      sub: "ヘアサロン・高知市" },
  raffine:  { label: "Raffine",   sub: "アイラッシュ・高知市" },
} as const;

type SalonKey = keyof typeof SALON_INFO;

export default function StaffSalonPage({ params }: { params: { salon: string } }) {
  const { salon } = params;
  if (!(salon in SALON_INFO)) notFound();

  const info = SALON_INFO[salon as SalonKey];
  return (
    <StaffUploadForm
      salonKey={salon}
      salonLabel={info.label}
      salonSub={info.sub}
    />
  );
}
