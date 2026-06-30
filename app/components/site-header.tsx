import Image from "next/image";
import Link from "next/link";

import ProfileMenu from "@/app/components/profile-menu";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type SiteHeaderProps = {
  backHref?: string;
  backLabel?: string;
};

export default async function SiteHeader({
  backHref = "/",
  backLabel = "← Home",
}: SiteHeaderProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header className="border-b border-white/10 px-6 py-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link
          href={backHref}
          className="text-sm font-semibold uppercase tracking-wider text-white/70 transition hover:text-white"
        >
          {backLabel}
        </Link>

        {session?.user ? (
          <ProfileMenu />
        ) : (
          <Link href="/" aria-label="AVG Run Club home">
            <Image
              src="/avg_logo.jpg"
              alt=""
              width={40}
              height={40}
              className="size-10 rounded-full object-cover"
            />
          </Link>
        )}
      </div>
    </header>
  );
}
