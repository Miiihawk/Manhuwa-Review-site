import { createReportSchema } from "../../lib/validators/report.schema";
import { reportService } from "../../lib/services/report.service";
import { auth } from "@/app/lib/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createReportSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const report = await reportService.createReport(
      Number(session.user.id),
      parsed.data,
    );
    return Response.json({ id: report.id }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "TARGET_NOT_FOUND") {
      return Response.json(
        { error: "That content no longer exists" },
        { status: 404 },
      );
    }
    console.error("POST /api/reports failed:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const reports = await reportService.listReports();
    return Response.json(reports, { status: 200 });
  } catch (error) {
    console.error("GET /api/reports failed:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
