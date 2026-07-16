import { comicService } from "../../lib/services/comic.service";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  try {
    const results = await comicService.searchComics(q, 6);
    return Response.json(results, { status: 200 });
  } catch (error) {
    console.error("GET /api/search failed:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
