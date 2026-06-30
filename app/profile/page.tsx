import ProfileForm from "@/app/components/profile-form";
import SiteHeader from "@/app/components/site-header";
import { auth } from "@/lib/auth";
import type { ProfileUser } from "@/lib/profile";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Profile | AVG Run Club",
  description: "Edit your AVG Run Club profile.",
};

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/events");
  }

  const user = session.user as ProfileUser;

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader backHref="/events" backLabel="← Events" />

      <main className="mx-auto max-w-xl px-6 py-12 md:py-16">
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-black tracking-tight text-[#e8192c] sm:text-5xl">
            PROFILE
          </h1>
          <p className="mt-3 text-white/60">
            Update your details, photo, and phone number.
          </p>
        </div>

        <ProfileForm user={user} />
      </main>
    </div>
  );
}
