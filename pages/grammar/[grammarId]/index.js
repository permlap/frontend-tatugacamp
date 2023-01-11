import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import SideMenuBar from "../../../components/grammar/sideMenuBar";
import { sanityClient, urlFor } from "../../../sanity";
import { PortableText, toPlainText } from "@portabletext/react";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import Layout from "../../../components/grammar/layout";
import Script from "next/script";

/** @param {import('next').InferGetStaticPropsType<typeof getStaticProps> } props */
function Index({ grammarData, getAuther }) {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const [date, setDate] = useState("loading...");
  const [showMenuBar, setShowMenuBar] = useState(false);
  //trigger menubar
  //show menu bar
  const triggerMenu = () => {
    setShowMenuBar((prev) => prev === false);
  };

  //handle close meubar when is cliked
  const handleCloseMenu = (close) => {
    setShowMenuBar((prev) => prev === close);
  };

  // display confetti
  const handleConfetti = () => {
    setShowConfetti((show) => !show);
  };

  // handle error Unhandled Runtime Error
  // Error: Text content does not match server-rendered HTML.
  useEffect(() => {
    setDate(grammarData._createdAt);
  }, [grammarData._createdAt]);

  //data protable
  const myPortableTextComponents = {
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
      normal: ({ children }) => <span className="text-base ">{children}</span>,

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
          <span className="group w-full relative cursor-pointer">
            <span className="w-max underline  underline-offset-4 ">
              {children}
            </span>
            <div
              className=" group-hover:block group-active:block  w-full hidden bg-[#EDBA02] rounded-md text-left pl-2 
            font-Kanit font-light md:absolute md:w-max md:right-[0%] md:left-0 "
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
          <a href={value.href} className={`text-${value.hex}`} rel={rel}>
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
          className={`lg:w-96 lg:h-96 h-56 w-56  bg-cover bg-no-repeat relative `}
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

  return (
    <div>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="description" content={toPlainText(grammarData.body)} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{grammarData.title}</title>
      </Head>
      <Script
        type="module"
        src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
      ></Script>
      <Script
        noModule
        src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"
      ></Script>

      <Layout triggerMenu={triggerMenu} />

      <ul className="w-full h-max list-none pl-0 flex gap-x-0 items-start">
        <SideMenuBar trigger={showMenuBar} handleCloseMenu={handleCloseMenu} />
        {showConfetti && <Confetti width={width} height={height} />}
        <li className="w-full h-max ">
          <header className=" md:mt-0">
            <div className="w-full pt-10  spectrum-background">
              <ul
                className={`list-none pl-0 flex flex-col justify-center gap-y-6 items-center font-Inter h-40`}
              >
                <li className="font-bold text-3xl text-center flex justify-center items-center after:content-['BETA'] after:font-Inter after:text-xs after:text-slate-700 after:bg-slate-300 after:rounded-md after:p-1 after:ml-3">
                  {grammarData.title}
                </li>
                <li className="">
                  <button
                    onClick={handleConfetti}
                    emoji1="😃"
                    emoji2="🥴"
                    className={`border-0 after:content-[attr(emoji2)] active:after:content-[attr(emoji2)] ]  font-Inter font-semibold rounded-md text-base cursor-pointer bg-[#EDBA02] text-white px-2 py-1 hover:bg-[#2C7CD1] active:ring-2 active:ring-white`}
                  >
                    Let's start learning!
                  </button>
                </li>
              </ul>
            </div>

            {/* Auther info */}
            <div className="w-full h-max mt-9 font-Inter">
              <ul className="list-none md:pl-10 lg:pl-40 flex justify-start items-center gap-x-6">
                <li className="h-16 w-16 text-center bg-white drop-shadow-lg rounded-full relative overflow-hidden">
                  <Image
                    src={urlFor(getAuther.image.asset._ref).url()}
                    layout="fill"
                    className="object-cover"
                    quality={60}
                    alt={`Image of ${getAuther.name} `}
                  />
                </li>
                <li>
                  <ul className="list-none pl-0">
                    <li>
                      <span className="font-medium">post by </span>
                      <span className="font-lightS uppercase">
                        {getAuther.name}
                      </span>
                    </li>
                    <li className="text-sm">
                      <span>Published at </span>
                      <span>{new Date(date).toLocaleString() || null}</span>
                    </li>
                  </ul>
                </li>
                <li></li>
              </ul>
            </div>
          </header>
          <main className="w-full bg-white flex items-center justify-center mt-5">
            <div className="md:w-5/6 lg:w-2/4 bg-white h-max pb-20 font-Inter text-base p-6 ">
              <PortableText
                value={grammarData.body}
                components={myPortableTextComponents}
              />
            </div>
          </main>
        </li>
      </ul>
    </div>
  );
}

export default Index;

export const getStaticPaths = async () => {
  const query = `*[_type  == "grammar"]{
    slug,
  }`;
  const allID = await sanityClient.fetch(query);
  const paths = allID.map((list) => ({
    params: { grammarId: list.slug.current.toString() },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const slug = await context.params.grammarId;
  const query = `*[slug.current  == "${slug}"]`;

  const grammarDataRaw = await sanityClient.fetch(query);

  const queryAuther = `*[_id   == "${grammarDataRaw[0].author._ref}"]`;
  const getAuther = await sanityClient.fetch(queryAuther);

  return {
    props: {
      grammarData: grammarDataRaw[0],
      getAuther: getAuther[0],
    },
    revalidate: 10,
  };
};
