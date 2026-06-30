import { auth } from "@/lib/auth";
import { deleteAvatar, uploadAvatar } from "@/lib/cloudinary";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("photo");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No photo provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Photo must be JPEG, PNG, or WebP" },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Photo must be 2 MB or smaller" },
      { status: 400 },
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadAvatar({
      userId: session.user.id,
      buffer,
      mimeType: file.type,
    });

    return NextResponse.json({ url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to upload photo";

    console.error("[profile/photo]", error);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await deleteAvatar(session.user.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[profile/photo DELETE]", error);
    return NextResponse.json(
      { error: "Failed to remove photo" },
      { status: 500 },
    );
  }
}
