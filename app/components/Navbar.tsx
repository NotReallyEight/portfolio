import { Link } from "react-router";

export default function Navbar() {
  return (
    <div className="glassmorphism global-padding flex flex-row items-center justify-between">
      <Link to={"/"}>
        <img
          alt="Antonio Wang Logo"
          src="/sig-white.png"
          className="h-8 lg:h-16"
        ></img>
      </Link>
      <div className="font-secondary flex flex-row items-center justify-center space-x-8 text-xl lg:text-3xl">
        <Link className="hover-underline" to={"/#projects"}>
          PROJECTS
        </Link>
        <Link className="hover-underline" to={"/#about-me"}>
          ABOUT ME
        </Link>
      </div>
    </div>
  );
}
