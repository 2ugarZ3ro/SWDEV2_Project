import Image from "next/image";
import { sportImages } from "@/sports";

// fills its parent, which must be `relative`
export default function SportImage({
  sport,
  sizes,
}: {
  sport: string;
  sizes: string;
}) {
  return (
    <Image
      src={sportImages[sport]}
      alt={sport}
      fill
      sizes={sizes}
      className="object-cover"
    />
  );
}
