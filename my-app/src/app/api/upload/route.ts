import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";
import { auth } from "@/app/lib/auth";

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB
const ALLOWED = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

export async function POST(request: Request) {
  try {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
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

    const bytes = Buffer.from(await file.arrayBuffer());
    const filename = `${randomUUID()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), bytes);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error("POST /api/upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
