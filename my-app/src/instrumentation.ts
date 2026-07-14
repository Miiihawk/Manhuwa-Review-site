export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { userService } = await import("@/app/lib/services/user.service");
    await userService.seedAdmin();

    const { comicService } = await import("@/app/lib/services/comic.service");
    await comicService.seedComics();
  }
}
