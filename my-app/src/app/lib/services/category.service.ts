import { comicCategoryRepository } from "../repositories/comic-cat.repo";
import { slugify } from "../slug";

export class CategoryService {
  listCategories() {
    return comicCategoryRepository.findAll();
  }

  async createCategory(name: string) {
    const slug = slugify(name);
    const existing = await comicCategoryRepository.findBySlug(slug);
    if (existing) throw new Error("CATEGORY_EXISTS");
    return comicCategoryRepository.create({ name: name.trim(), slug });
  }

  async updateCategory(id: number, name: string) {
    const existing = await comicCategoryRepository.findById(id);
    if (!existing) throw new Error("CATEGORY_NOT_FOUND");

    const slug = slugify(name);
    const bySlug = await comicCategoryRepository.findBySlug(slug);
    if (bySlug && bySlug.id !== id) throw new Error("CATEGORY_EXISTS");

    return comicCategoryRepository.update(id, { name: name.trim(), slug });
  }

  async deleteCategory(id: number) {
    const existing = await comicCategoryRepository.findById(id);
    if (!existing) throw new Error("CATEGORY_NOT_FOUND");
    if (existing._count.comics > 0) throw new Error("CATEGORY_IN_USE");
    return comicCategoryRepository.delete(id);
  }
}

export const categoryService = new CategoryService();
