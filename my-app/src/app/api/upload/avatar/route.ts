import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { auth } from "@/app/lib/auth";

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const ext = ALLOWED.get(file.type);
    if (!ext) {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 },
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File too large (max 4MB)" },
        { status: 400 },
      );
    }

    const blob = await put(`avatars/${randomUUID()}.${ext}`, file, {
      access: "public",
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("POST /api/upload/avatar failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
