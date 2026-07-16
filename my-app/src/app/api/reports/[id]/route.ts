import { resolveReportSchema } from "../../../lib/validators/report.schema";
import { reportService } from "../../../lib/services/report.service";
import { auth } from "@/app/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const reportId = Number(id);
  if (!Number.isInteger(reportId) || reportId < 1) {
    return Response.json({ error: "Invalid report id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = resolveReportSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const adminId = Number(session.user.id);
    if (parsed.data.action === "remove") {
      await reportService.removeReportedContent(adminId, reportId);
    } else {
      await reportService.dismissReport(adminId, reportId);
    }
    return Response.json({ ok: true }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "REPORT_NOT_FOUND") {
      return Response.json({ error: "Report not found" }, { status: 404 });
    }
    console.error("PATCH /api/reports/[id] failed:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
