import { comicRepository } from "../repositories/comic.repository";
import { comicCategoryRepository } from "../repositories/comic-cat.repo";
import { userRepository } from "../repositories/user.repository";
import { featuredCovers } from "@/app/data/comic";

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
}

export const comicService = new ComicService();
