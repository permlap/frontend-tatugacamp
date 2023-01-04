import Image from "next/image";
import { urlFor } from "../../sanity";

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
      <h3 className={`text-lg md:text-xl py-3`}>{children}</h3>
    ),
    normal: ({ children }) => <span className="text-base">{children}</span>,

    blockquote: ({ children }) => (
      <blockquote className="border-l-purple-500 border-l-8 border-solid border-r-0 border-y-0 my-5 pl-5 font-semibold">
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
        <span
          definition={`ความหมาย : ${value.href}`}
          className="after:content-[attr(definition)] md:after:w-max after:w-28  after:h-max after:p-3 after:drop-shadow-lg  after:bg-[#EDBA02] 
            after:font-Kanit after:font-normal after:text-base after:text-white after:rounded-lg
            after:top-[100%]  relative after:left-[0%] after:absolute hover:after:flex  after:hidden cursor-pointer w-full"
        >
          📚{children}
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
        <a href={value.href} className={`text-${value.hex}`} rel={rel}>
          {children}
        </a>
      );
    },
  },
};
function isImage(url) {
  return /\.(|png|)$/.test(url);
}

const SanityImage = ({ asset }) => {
  if (isImage(urlFor(asset).url()) === false) {
  }

  const randomNumber = Math.floor(Math.random() * 4) + 1;
  return (
    <div className="w-full h-ful bg-transparent flex items-center justify-center">
      <div
        style={{
          backgroundImage: isImage(urlFor(asset).url())
            ? `url(/BgBlob${randomNumber.toString()}.svg)`
            : "none",
        }}
        className={`lg:w-96 lg:h-96 h-56 w-56  bg-cover bg-no-repeat relative `}
      >
        <Image
          src={urlFor(asset).url()}
          layout="fill"
          className="object-contain"
          blurDataURL="LURfXxtP.8RRtRoLofWq?^aMMxo|"
          alt="some images about TaTuga camp teaching you English grammar"
        />
      </div>
    </div>
  );
};
