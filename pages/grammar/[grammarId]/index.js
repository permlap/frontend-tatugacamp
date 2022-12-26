import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import SideMenuBar from "../../../components/grammar/sideMenuBar";
import { sanityClient, urlFor } from "../../../sanity";
import { PortableText } from "@portabletext/react";
import { useNextSanityImage } from "next-sanity-image";
function Index({ randomImage, grammarData }) {
  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 0,
  });

  const myPortableTextComponents = {
    types: {
      image: ({ value }) => {
        return <SanityImage {...value} />;
      },
    },

    marks: {
      link: ({ children, value }) => {
        const rel = !value.href.startsWith("/")
          ? "noreferrer noopener"
          : undefined;
        return (
          <a href={value.href} rel={rel}>
            {children}
          </a>
        );
      },
    },
  };

  const SanityImage = ({ asset }) => {
    return (
      <div className="relative w-96 h-96">
        <Image src={urlFor(asset).url()} layout="fill" className="" />
      </div>
    );
  };
  return (
    <div>
      <ul className="w-full h-max list-none pl-0 flex gap-x-0 items-start ">
        <SideMenuBar />

        <li className="w-full h-max ">
          <header>
            <div
              style={{
                backgroundImage: `url(${randomImage.urls.regular})`,
                width: "100%",
                height: "100%",
              }}
              className="w-full relative bg-no-repeat bg-cover"
            >
              <ul
                className={`list-none pl-0 flex flex-col justify-center gap-y-6 items-center font-Inter h-96`}
              >
                <li className="font-bold text-3xl">{grammarData.title}</li>
                <li className="">
                  <button className="border-0  font-Inter font-semibold rounded-md text-xl cursor-pointer bg-[#EDBA02] text-white px-2 py-1 hover:bg-[#2C7CD1] active:ring-2 active:ring-white">
                    {grammarData.title} 🥴
                  </button>
                </li>
              </ul>
            </div>
          </header>
          <main className="w-full h-max font-Inter">
            <div>
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
  const YOUR_ACCESS_KEY = "cRQOgQNZ4GoPRJY3euHL1Rl8Dmwmh2WYCi5Gl7IXZ3s";

  const res = await axios(
    `https://api.unsplash.com/photos/random?client_id=${YOUR_ACCESS_KEY}`
  );
  const randomImage = res.data;

  const slug = await context.params.grammarId;
  const query = `*[slug.current  == "${slug}"]`;
  const grammarDataRaw = await sanityClient.fetch(query);
  const grammarData = grammarDataRaw[0];
  return {
    props: { randomImage, grammarData },
  };
};
