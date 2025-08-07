import Navbar from "~/components/Navbar";
import type { Route } from "./+types/project";
import Footer from "~/components/Footer";

type ManifestJson = {
  [key: string]: ManifestProject;
};

type ManifestProject = {
  id: string;
  name: string;
  description: string;
  images: string[];
  youtubeVideo: string;
};

// eslint-disable-next-line react-refresh/only-export-components
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const manifestJson = (await fetch("/imagesManifest.json").then((res) =>
    res.json()
  )) as ManifestJson;

  return manifestJson[params.projectId];
}

// eslint-disable-next-line react-refresh/only-export-components
export function meta() {
  return [
    { title: "Antonio Wang Portfolio" },
    {
      name: "description",
      content: "Coding by passion, capturing the streets by instinct.",
    },
  ];
}

export default function Project({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex flex-col">
      <Navbar />

      <div className="mx-auto mb-8 flex w-2/3 flex-col items-center space-y-4 text-center">
        <div className="font-secondary text-xl lg:text-3xl">
          {loaderData["name"]}
        </div>
        <div className="font-regular text-base font-light lg:text-xl">
          {loaderData["description"]}
        </div>
      </div>

      {/* YouTube video */}
      {loaderData["youtubeVideo"] !== "" && (
        <iframe
          src={loaderData["youtubeVideo"]}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="mx-auto my-8 aspect-video w-full p-4 lg:w-2/3 lg:p-0"
        />
      )}

      {/* Image Grid */}
      <div className="columns-2 gap-4 space-y-4 px-4 md:columns-3 lg:columns-4">
        {loaderData.images.map((image) => (
          <img
            key={image}
            src={`/optimized/${loaderData.id}/${image}`}
            alt={`Image of ${loaderData.name}`}
            loading="lazy"
            className="mb-4 w-full"
          />
        ))}
      </div>

      <Footer />
    </div>
  );
}
