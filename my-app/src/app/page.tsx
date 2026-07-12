import Link from "next/link";
import Image from "next/image";
import BrandLogo from "./components/layout/BrandLogo";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,24,143,0.16),transparent_28%),radial-gradient(circle_at_30%_65%,rgba(45,12,98,0.22),transparent_28%),radial-gradient(circle_at_70%_20%,rgba(255,204,0,0.08),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(17,1,46,0.86),transparent_36%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.96)_0%,rgba(17,1,46,0.92)_42%,rgba(0,0,0,0.99)_100%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between bg-transparent px-0 py-3">
          <BrandLogo href="/" className="max-w-[16rem]" />
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-sm font-black tracking-wide text-white/90 backdrop-blur-md transition-colors duration-200 hover:border-[#ff018f]/70 hover:bg-white/10"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="inline-flex h-11 items-center justify-center rounded-full border border-[#f6a1ff]/70 bg-[linear-gradient(180deg,#ff018f_0%,#f6a1ff_100%)] px-5 text-sm font-black tracking-wide text-black shadow-[0_14px_32px_rgba(255,24,143,0.28)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(255,24,143,0.34)]"
            >
              Sign up
            </Link>
          </div>
        </header>

        <section className="flex flex-1 items-center py-12 lg:py-20">
          <div className="grid w-full gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center">
            <div className="max-w-2xl">
              <h1 className="max-w-lg text-balance text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
                <span className="block">Discover series.</span>
                <span className="block">Save favorites.</span>
                <span className="block">Stay caught up.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-white/68 sm:text-xl">
                Seqily helps you follow your favorites,tracks your reading list,
                and connect with others.
              </p>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="absolute -left-10 top-10 h-56 w-56 rounded-full bg-[#ff018f]/20 blur-3xl" />
              <div className="absolute -right-6 top-28 h-56 w-56 rounded-full bg-[#f6a1ff]/18 blur-3xl" />
              <div className="absolute bottom-2 left-20 h-64 w-64 rounded-full bg-[#2d0c62]/30 blur-3xl" />

              <div className="relative w-full max-w-3xl bg-transparent p-0 shadow-none backdrop-blur-0 sm:p-0">
                <div className="p-0 sm:p-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#f6a1ff]/90">
                        Cover feed
                      </p>
                      <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
                        Join the community and explore new series.
                      </h2>
                    </div>
                  </div>

                  <div className="mt-6 h-80 overflow-hidden bg-transparent">
                    <div className="animate-[panelScroll_14s_linear_infinite] space-y-4 will-change-transform transform-gpu motion-reduce:animate-none">
                      {[
                        {
                          title: "Debut or Die",
                          image: "/images/covers/Debut%20or%20Die.jpg",
                          detail:
                            "A relentless rise through the entertainment industry.",
                        },
                        {
                          title: "Life of a Quack Healer",
                          image:
                            "/images/covers/life%20of%20a%20quck%20healer.jpg",
                          detail:
                            "Fast-paced action with a healer at the center of it all.",
                        },
                        {
                          title: "The Player Hides His Past",
                          image:
                            "/images/covers/The%20player%20hides%20his%20past.jpg",
                          detail:
                            "A sharp protagonist balancing power and secrets.",
                        },
                        {
                          title: "The Ultimate Shut In",
                          image:
                            "/images/covers/The%20Ultimate%20Shut%20in.jpg",
                          detail:
                            "A quiet life turns into something far more dangerous.",
                        },
                      ].map(({ title, image, detail }) => (
                        <div
                          key={title}
                          className="flex items-center gap-4 rounded-2xl bg-white/5 p-3 backdrop-blur-sm"
                        >
                          <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-xl bg-black/40">
                            <Image
                              src={image}
                              alt={title}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white">
                              {title}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-white/62">
                              {detail}
                            </p>
                          </div>
                        </div>
                      ))}
                      {[
                        {
                          title: "Debut or Die",
                          image: "/images/covers/Debut%20or%20Die.jpg",
                          detail:
                            "A relentless rise through the entertainment industry.",
                        },
                        {
                          title: "Life of a Quack Healer",
                          image:
                            "/images/covers/life%20of%20a%20quck%20healer.jpg",
                          detail:
                            "Fast-paced action with a healer at the center of it all.",
                        },
                        {
                          title: "The Player Hides His Past",
                          image:
                            "/images/covers/The%20player%20hides%20his%20past.jpg",
                          detail:
                            "A sharp protagonist balancing power and secrets.",
                        },
                        {
                          title: "The Ultimate Shut In",
                          image:
                            "/images/covers/The%20Ultimate%20Shut%20in.jpg",
                          detail:
                            "A quiet life turns into something far more dangerous.",
                        },
                      ].map(({ title, image, detail }) => (
                        <div
                          key={`${title}-clone`}
                          className="flex items-center gap-4 rounded-2xl bg-white/5 p-3 backdrop-blur-sm"
                        >
                          <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-xl bg-black/40">
                            <Image
                              src={image}
                              alt={title}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white">
                              {title}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-white/62">
                              {detail}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
