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
import { myPortableTextComponents } from "../../../components/data/portableContent";
import Script from "next/script";

function Index({ grammarData, getAuther }) {
  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 0,
  });
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
                <li className="font-bold text-3xl">{grammarData.title}</li>
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
