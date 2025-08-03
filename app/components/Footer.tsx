import { Link } from "react-router";

export default function Footer() {
  return (
    <div className="bg-real-white flex flex-col space-y-4 p-8 text-black lg:space-y-8">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col space-y-4">
          <div className="font-secondary text-xl lg:text-3xl">CONTACTS</div>
          <div className="font-regular flex flex-col space-y-2 text-base font-extralight lg:text-xl">
            <Link
              to={"https://www.instagram.com/antonio.wang_/"}
              className="hover-underline hover-underline-dark w-fit"
              target="_blank"
              rel="noreferrer noopener"
            >
              Instagram
            </Link>
            <Link
              to={"https://linktr.ee/notreallyeight"}
              className="hover-underline hover-underline-dark w-fit"
              target="_blank"
              rel="noreferrer noopener"
            >
              Linktree
            </Link>
          </div>
        </div>

        <img
          alt="Antonio Wang Logo"
          src="/sig-black.png"
          className="h-12 lg:h-24"
        ></img>
      </div>

      {/* Line */}
      <div className="h-0.5 border-b-2 border-b-black"></div>

      <div className="font-script text-center text-xl lg:text-3xl">
        Made with ❤️ by Antonio Wang.
      </div>
    </div>
  );
}
