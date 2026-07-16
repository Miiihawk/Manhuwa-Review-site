import { comicRepository } from "../repositories/comic.repository";
import { comicCategoryRepository } from "../repositories/comic-cat.repo";
import { userRepository } from "../repositories/user.repository";
import { featuredCovers } from "@/app/data/comic";
import type { ComicInput } from "../validators/comic.schema";
import { genreRepository } from "../repositories/genre.repository";
import type { ComicStatus } from "@prisma-generated";
import { favoriteRepository } from "../repositories/favorite.repository";
import { readingListRepository } from "../repositories/reading-list.repository";
import { notificationService } from "./notification.service";

const VALID_SORTS = ["rating", "reviews", "recent", "title"] as const;
type DirectorySort = (typeof VALID_SORTS)[number];

const VALID_STATUSES: ComicStatus[] = [
  "ONGOING",
  "COMPLETED",
  "COMING_SOON",
  "HIATUS",
];

function normalizeUrl(url: string) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function deriveSourceName(url: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    const label = host.split(".")[0];
    return label ? label.charAt(0).toUpperCase() + label.slice(1) : "Official";
  } catch {
    return "Official";
  }
}

function buildSources(urls?: string[]) {
  if (!urls) return [];
  return urls
    .map((u) => u.trim())
    .filter((u) => u.length > 0)
    .slice(0, 4)
    .map((u) => {
      const url = normalizeUrl(u);
      return { name: deriveSourceName(url), url };
    });
}

export class ComicService {
  listComics() {
    return comicRepository.findAll();
  }

  getComicBySlug(slug: string) {
    return comicRepository.findBySlug(slug);
  }

  listComicSlugs() {
    return comicRepository.findAllSlugs();
  }

  listRecentlyAdded() {
    return comicRepository.findRecentlyAdded();
  }

  listHighestRated() {
    return comicRepository.findHighestRated();
  }

  deleteComic(id: number) {
    return comicRepository.delete(id);
  }

  getComicById(id: number) {
    return comicRepository.findById(id);
  }

  listCategories() {
    return comicCategoryRepository.findAll();
  }

  async searchComics(q: string, take = 6) {
    const term = q.trim();
    if (!term) return [];
    return comicRepository.search(term, take);
  }

  countComicsByCreator(userId: number) {
    return comicRepository.countByCreator(userId);
  }

  listDirectory(opts: {
    sort?: string;
    status?: string;
    categorySlug?: string;
    genreSlug?: string;
    q?: string;
  }) {
    const sort: DirectorySort = VALID_SORTS.includes(opts.sort as DirectorySort)
      ? (opts.sort as DirectorySort)
      : "rating";
    const status = VALID_STATUSES.includes(opts.status as ComicStatus)
      ? (opts.status as ComicStatus)
      : undefined;

    return comicRepository.findForDirectory(
      {
        status,
        categorySlug: opts.categorySlug || undefined,
        genreSlug: opts.genreSlug || undefined,
        q: opts.q?.trim() || undefined,
      },
      sort,
    );
  }

  async seedComics() {
    const existing = await comicRepository.count();
    if (existing > 0) {
      console.log("Comics already seeded.");
      return;
    }

    const admin = await userRepository.findFirstAdmin();
    if (!admin) {
      console.error("No admin user found. Please seed an admin user first.");
      return;
    }

    // Comics require a category — make sure one exists.
    let category = await comicCategoryRepository.findBySlug("manhwa");
    if (!category) {
      category = await comicCategoryRepository.create({
        name: "Manhwa",
        slug: "manhwa",
      });
    }

    for (const item of featuredCovers) {
      await comicRepository.create({
        title: item.title,
        slug: item.id!, // mock "id" is already a slug
        synopsis: item.description ?? "No synopsis yet.",
        coverPhoto: item.image,
        author: "Unknown", // schema requires author; placeholder demo data
        categoryId: category.id,
        createdById: admin.id,
      });
    }
    console.log(`[seed] Created ${featuredCovers.length} comics.`);
  }

  async createComic(createdById: number, input: ComicInput) {
    // Slug must be unique — it's the page URL.
    const existing = await comicRepository.findBySlug(input.slug);
    if (existing) {
      throw new Error("SLUG_TAKEN");
    }

    // Resolve the category name → id (create it if it doesn't exist yet).
    const categorySlug = input.category.toLowerCase().replace(/\s+/g, "-");
    let category = await comicCategoryRepository.findBySlug(categorySlug);
    if (!category) {
      category = await comicCategoryRepository.create({
        name: input.category,
        slug: categorySlug,
      });
    }

    const genreIds: number[] = [];
    if (input.genres) {
      for (const name of input.genres) {
        const genreSlug = name.toLowerCase().replace(/\s+/g, "-");
        let genre = await genreRepository.findBySlug(genreSlug);
        if (!genre) {
          genre = await genreRepository.create({ name, slug: genreSlug });
        }
        genreIds.push(genre.id);
      }
    }

    return comicRepository.create({
      title: input.title,
      alternativeName: input.alternativeName || null,
      slug: input.slug,
      synopsis: input.synopsis,
      coverPhoto: input.coverPhoto,
      author: input.author,
      genreIds,
      categoryId: category.id,
      createdById,
      publicationStatus: input.publicationStatus,
      sources: buildSources(input.officialLegalPlatforms),
    });
  }

  async updateComic(id: number, input: ComicInput) {
    const existing = await comicRepository.findById(id);
    if (!existing) {
      throw new Error("COMIC_NOT_FOUND");
    }

    // Slug must stay unique — but it's fine if it's still this comic's own slug.
    const bySlug = await comicRepository.findBySlug(input.slug);
    if (bySlug && bySlug.id !== id) {
      throw new Error("SLUG_TAKEN");
    }

    const categorySlug = input.category.toLowerCase().replace(/\s+/g, "-");
    let category = await comicCategoryRepository.findBySlug(categorySlug);
    if (!category) {
      category = await comicCategoryRepository.create({
        name: input.category,
        slug: categorySlug,
      });
    }

    const genreIds: number[] = [];
    if (input.genres) {
      for (const name of input.genres) {
        const genreSlug = name.toLowerCase().replace(/\s+/g, "-");
        let genre = await genreRepository.findBySlug(genreSlug);
        if (!genre) {
          genre = await genreRepository.create({ name, slug: genreSlug });
        }
        genreIds.push(genre.id);
      }
    }

    const updated = await comicRepository.update(id, {
      title: input.title,
      alternativeName: input.alternativeName || null,
      slug: input.slug,
      synopsis: input.synopsis,
      coverPhoto: input.coverPhoto,
      author: input.author,
      categoryId: category.id,
      publicationStatus: input.publicationStatus,
      genreIds,
      sources: buildSources(input.officialLegalPlatforms),
    });

    // Notify favorite / reading-list users when the status actually changes.
    if (
      input.publicationStatus &&
      input.publicationStatus !== existing.publicationStatus
    ) {
      try {
        const [favUsers, listUsers] = await Promise.all([
          favoriteRepository.findUserIdsByComic(id),
          readingListRepository.findUserIdsByComic(id),
        ]);
        const recipientIds = [
          ...new Set([...favUsers, ...listUsers].map((r) => r.userId)),
        ];
        await notificationService.notifyComicStatusChange({
          comicId: id,
          comicTitle: existing.title,
          newStatus: input.publicationStatus,
          recipientIds,
        });
      } catch (error) {
        console.error("Status-change notification failed:", error);
      }
    }

    return updated;
  }

  countComics() {
    return comicRepository.count();
  }
}

export const comicService = new ComicService();
