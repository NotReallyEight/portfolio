import Navbar from "~/components/Navbar";
import { FiChevronsDown } from "react-icons/fi";
import ProjectCard from "~/components/ProjectCard";
import Footer from "~/components/Footer";
import { OPTIMISED_CDN_IMAGE_BASE_URL } from "config";

let projects: {
  name: string;
  imageUrl: string;
  redirectLink: string;
  isDark?: boolean;
}[] = [
  {
    name: "Street Photography \\\\ 2025",
    imageUrl: `${OPTIMISED_CDN_IMAGE_BASE_URL}/Pictures/AdobeLightroom/2025/11/20251130_225209.jpg`,
    redirectLink: "/projects/street-photography-2025",
  },
  {
    name: "Viaggio Liguria Costa Azzurra \\\\ 2025",
    imageUrl: `${OPTIMISED_CDN_IMAGE_BASE_URL}/Pictures/AdobeLightroom/2025/03/J55C4902.jpg`,
    redirectLink: "/projects/gita-liguria-costa-azzurra-2025",
  },
  {
    name: "Salerno Street Photography \\\\ 2025",
    imageUrl: `${OPTIMISED_CDN_IMAGE_BASE_URL}/Pictures/AdobeLightroom/2025/03/J55C4296.jpg`,
    redirectLink: "/projects/salerno-street-photography-2025",
  },
  {
    name: "Soggetti Erotici - Ah Ah Ah (Music Video) \\\\ 2025",
    imageUrl: "/optimized/sogg-erotici-ah-ah-ah-2025/thumbnail.webp",
    redirectLink: "/projects/sogg-erotici-ah-ah-ah-2025",
  },
  {
    name: "Agropoli Street Photography \\\\ 2025",
    imageUrl: `${OPTIMISED_CDN_IMAGE_BASE_URL}/Pictures/AdobeLightroom/2025/04/_DSC0001.jpg`,
    redirectLink: "/projects/agropoli-street-2025",
  },
  {
    name: "Napoli Street Photography \\\\ 2025",
    imageUrl: `${OPTIMISED_CDN_IMAGE_BASE_URL}/Pictures/AdobeLightroom/2025/04/7Q5A5091.jpg`,
    redirectLink: "/projects/napoli-street-2025",
  },
  {
    name: "Street Photography \\\\ 2024",
    imageUrl: `${OPTIMISED_CDN_IMAGE_BASE_URL}/Pictures/AdobeLightroom/2024/02/20240213_171300.jpg`,
    redirectLink: "/projects/street-photography-2024",
  },
  {
    name: "Erebus - Discord API Wrapper \\\\ 2021",
    imageUrl: "/optimized/coding-project-thumbnails/erebus.webp",
    redirectLink: "https://erebus.js.org/",
  },
  {
    name: "ATN Modmail - Discord Modmail Bot \\\\ 2021",
    imageUrl: "/optimized/coding-project-thumbnails/atn-modmail.webp",
    redirectLink: "https://github.com/ATN-Development/atn-modmail",
  },
];

// If number of projects is odd start with white, if it's even start with black
projects = projects.map(
  (
    p,
    i
  ): {
    name: string;
    imageUrl: string;
    redirectLink: string;
    isDark: boolean;
  } => ({
    ...p,
    isDark:
      projects.length % 2 === 0
        ? // even
          i % 2 === 0
        : // odd
          !(i % 2 === 0),
  })
);

export default function Home() {
  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 bg-[url(https://cdn.antoniowang.dev/cdn-cgi/image/width=1400,quality=80,format=auto/Pictures/AdobeLightroom/2025/03/J55C4804.jpg)] bg-cover bg-center opacity-25"></div>
      <div className="relative flex h-screen flex-col">
        <Navbar />

        {/* Hero Section */}
        <section className="global-padding my-auto flex flex-col items-center justify-center space-y-8">
          <div className="font-header text-center text-5xl lg:text-8xl">
            Antonio Wang
          </div>
          <div className="font-regular text-center text-base font-light lg:text-2xl">
            Coding by passion, capturing the streets by instinct.
          </div>

          <div className="mt-12 flex animate-bounce flex-row items-center justify-center space-x-4">
            <FiChevronsDown
              className="h-6 w-6 lg:h-12 lg:w-12"
              color="var(--color-white)"
              strokeWidth={1}
            ></FiChevronsDown>
            <div className="font-regular text-base font-extralight lg:text-2xl">
              <i>Discover more</i>
            </div>
          </div>
        </section>
      </div>

      {/* Projects section */}
      <section id="projects" className="bg-white text-black">
        {projects.map((p, i) => (
          <ProjectCard
            name={p.name}
            imageUrl={p.imageUrl}
            redirectLink={p.redirectLink}
            isDark={p.isDark ?? false}
            key={i.toString()}
            isLast={i === projects.length - 1}
          ></ProjectCard>
        ))}
      </section>

      {/* About Me Section */}
      <section id="about-me">
        <div className="bg-real-black flex h-screen flex-col items-center justify-center">
          <div className="flex h-screen w-3/4 flex-col items-center space-y-4 gap-x-8 py-8 lg:grid lg:h-2/3 lg:w-2/3 lg:grid-cols-[1fr_2fr]">
            <div className="h-full w-full overflow-hidden">
              <img
                alt="Antonio Wang"
                src={`${OPTIMISED_CDN_IMAGE_BASE_URL}/Pictures/Other/2024/09/18 Antonio-44.jpg`}
                className="h-full w-full object-cover"
                loading="lazy"
              ></img>
            </div>
            <div className="text-real-white flex flex-col space-y-4 lg:space-y-8">
              <div className="font-secondary text-center text-xl lg:text-left lg:text-3xl">
                About Me
              </div>
              <div className="font-regular text-center text-base font-light lg:text-left lg:text-xl">
                Hi, I&apos;m Antonio Wang — I write code by day and chase light
                with a camera by… also day. I&apos;m 19 and obsessed with
                building things that work and look good. When I&apos;m not
                coding, I&apos;m probably out framing strangers like characters
                in a story — freezing time at 1/160th of a second, one shot at a
                time.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer></Footer>
    </div>
  );
}
