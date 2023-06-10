import Image from "next/image";
import { useState } from "react";
import { urlFor } from "../sanity";

export const myPortableTextComponents = {
  types: {
    image: ({ value }) => {
      return <SanityImage {...value} />;
    },
  },
  listItem: {
    // Ex. 1: customizing common list types
    bullet: ({ children }) => (
      <li className="list-disc pl-2 text-base">{children}</li>
    ),

    // Ex. 2: rendering custom list items
    checkmarks: ({ children }) => <li>✅ {children}</li>,

    number: ({ children }) => <span>{children}</span>,
  },
  block: {
    // Ex. 1: customizing common block types
    h1: ({ children }) => (
      <h1 className={` md:text-4xl text-lg py-5`}>{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className={`text-lg md:text-2xl py-3`}>{children}</h2>
    ),
    h3: ({ children }) => (
      <>
        <h3 className={`text-lg md:text-xl py-3`}>{children}</h3>
        <br />
      </>
    ),
    normal: ({ children }) => <div className="text-base ">{children}</div>,

    blockquote: ({ children }) => (
      <blockquote className="border-l-purple-500 border-l-2 border-solid border-r-0 border-y-0 my-5 pl-5 font-semibold">
        {children}
      </blockquote>
    ),

    // Ex. 2: rendering custom styles
    customHeading: ({ children }) => (
      <h2 className="text-lg text-primary text-purple-700">{children}</h2>
    ),
  },
  marks: {
    definition: ({ children, value }) => {
      return (
        <span className="group w-full relative cursor-pointer">
          <span className="w-max underline decoration-dotted font-semibold text-[#EDBA02] underline-offset-2 ">
            {children}
          </span>
          <div
            className="group-hover:block z-20 group-active:block w-2/4  hidden bg-[#EDBA02] rounded-md text-left px-5
          font-Kanit font-light md:absolute md:w-80  md:right-[0%] md:left-0 "
          >
            <span className="w-max mr-1 font-normal">ความหมาย:</span>
            <span>{value.href}</span>
          </div>
        </span>
      );
    },
    em: ({ children }) => (
      <em className="text-gray-600 font-light">{children}</em>
    ),
    color: ({ children, value }) => (
      <span style={{ color: value.hex }}>{children}</span>
    ),
    link: ({ children, value }) => {
      const rel = !value.href.startsWith("/")
        ? "noreferrer noopener"
        : undefined;
      return (
        <a
          href={value.href}
          className={`text-${value.hex}`}
          rel={rel}
          target="_blank"
        >
          {children}
        </a>
      );
    },
  },
};

// check whether url of image is png or not. If not return false
function isImage(url) {
  return /\.(|png|)$/.test(url);
}

const SanityImage = ({ asset }) => {
  const randomNumber = Math.floor(Math.random() * 4) + 1;
  const [loading, setLoading] = useState(false);
  function onLoad() {
    setLoading((prev) => (prev = true));
  }
  function onLoadingComplete() {
    setLoading((prev) => (prev = false));
  }

  return (
    <div className="w-full h-ful bg-transparent flex items-center justify-center">
      <div
        style={{
          backgroundImage: isImage(urlFor(asset).url())
            ? `url(/BgBlob${randomNumber.toString()}.svg)`
            : "none",
        }}
        className={`lg:w-96 lg:h- h-56 w-56   transition duration-150  bg-cover bg-no-repeat relative `}
      >
        <Image
          src={urlFor(asset).url()}
          layout="fill"
          className="object-contain"
          placeholder="blur"
          blurDataURL="/logo/TaTuga camp.png"
          alt="some images about TaTuga camp teaching you English grammar"
          onLoad={onLoad}
          onLoadingComplete={onLoadingComplete}
        />
      </div>
    </div>
  );
};
