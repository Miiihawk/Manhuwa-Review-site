import { prisma } from "../prisma";

export class ComicRepository {

    //read
    findAll() {
        return prisma.comic.findMany({
            orderBy: { createdAt: "desc" },
        });
    }

    findBySlug(slug: string) {
        return prisma.comic.findUnique({
            where: { slug },
        });
    }

    findAllSlugs() {
        return prisma.comic.findMany({
            select: { slug: true },
        });
    }

    count() {
        return prisma.comic.count();
    }
    //Create

    create(data: {
        title: string;
        slug: string;
        synopsis: string;
        coverPhoto: string;
        author: string;
        categoryId: number;
        createdById: number;
    }) {
        return prisma.comic.create({ data });
    }
}

export const comicRepository = new ComicRepository();