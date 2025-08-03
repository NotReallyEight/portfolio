import { Link } from "react-router";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ProjectCard(props: {
  name: string;
  imageUrl: string;
  redirectLink: string;
  isDark: boolean;
  isLast?: boolean;
}) {
  const containerRef = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      trigger: containerRef.current,
      // markers: true,
      // If the container is shorter than the window then pin at the top, otherwise at the bottom for smoother scroll (the first one should)
      start: () =>
        (containerRef.current?.offsetHeight ?? 0) < window.innerHeight
          ? "top top"
          : "bottom bottom",
      pin: true,
      pinSpacing: props.isLast,
    });
  });

  return (
    <section
      className={`${props.isDark ? "bg-black text-white" : "bg-white text-black"} project-card flex h-screen flex-col items-center justify-center`}
      ref={containerRef}
    >
      <div
        className={`${props.isDark ? "lg:bg-lighter-black" : "lg:bg-darker-white"} flex h-2/3 w-3/4 flex-col space-y-8 lg:grid lg:w-2/3 lg:grid-cols-[1fr_2fr] lg:space-x-8 lg:p-16`}
      >
        <div className="h-full w-full overflow-hidden">
          <img
            alt="Project cover image"
            src={props.imageUrl}
            className="h-full w-full object-cover"
          ></img>
        </div>

        <div className="flex flex-col items-center justify-center space-y-4 lg:space-y-8">
          <div className="font-secondary text-center text-xl lg:text-3xl">
            {props.name}
          </div>
          <Link
            to={props.redirectLink}
            className={`hover-underline ${props.isDark ? "" : "hover-underline-dark"} hover-underline-inverted font-regular text-base font-extralight lg:text-xl`}
          >
            <i>Learn more</i>
          </Link>
        </div>
      </div>
    </section>
  );
}
