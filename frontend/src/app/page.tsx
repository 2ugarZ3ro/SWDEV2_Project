import Image from "next/image";
import Link from "next/link";
import { sports } from "@/sports";
import SportImage from "@/components/SportImage";

export default function Home() {
  return (
    <div className="flex flex-col gap-10">
      <div className="relative rounded-2xl overflow-hidden h-80">
        <Image
          src="/images/hero.webp"
          alt=""
          fill
          priority
          sizes="(min-width: 1152px) 1120px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-teal-950/60" />
        <div className="relative h-full px-10 flex flex-col items-start justify-center gap-6 text-white">
          <h1 className="text-5xl font-bold">Book a facility</h1>
          <Link
            href="/facilities"
            className="px-6 py-3 rounded-md bg-orange-500 font-medium"
          >
            Browse Facilities →
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Sports</h2>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
          {sports.map((s) => (
            <Link
              key={s}
              href={`/facilities?sport=${s}`}
              className="relative h-36 rounded-xl overflow-hidden shadow"
            >
              <SportImage sport={s} sizes="(min-width: 768px) 220px, 50vw" />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-xl">
                {s}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
