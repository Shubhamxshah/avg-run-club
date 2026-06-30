import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export const metadata = {
  title: "Register | AVG Run Club",
};

export default async function RegisterPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/events");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
      <h1 className="font-display text-4xl font-black tracking-tight text-[#e8192c] sm:text-5xl">
        Register
      </h1>
      <p className="mt-4 max-w-md text-white/60">
        Head back to the home page and tap &ldquo;Register for next run!&rdquo; to
        sign in or create an account.
      </p>
      <Link
        href="/"
        className="mt-8 text-sm font-semibold uppercase tracking-wider text-white/80 transition hover:text-white"
      >
        ← Back home
      </Link>
    </div>
  );
}
