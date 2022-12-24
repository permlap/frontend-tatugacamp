import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect } from "react";
import SideMenuBar from "../../components/grammar/sideMenuBar";
import { sanityClient, urlFor } from "../../sanity";
import { useInView } from "react-intersection-observer";
import FooterActivities from "../../components/footer/FooterActivities";

function Index({ randomImage }) {
  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 0,
  });

  return (
    <div>
      <Head></Head>
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
            className={`list-none pl-0 flex flex-col justify-center gap-y-6 items-center font-Inter h-96  `}
          >
            <li className="font-bold text-3xl">Basic grammar</li>
            <li>
              <button className="border-0 font-Inter font-semibold rounded-md text-xl cursor-pointer bg-[#EDBA02] text-white px-2 py-1 hover:bg-[#2C7CD1] active:ring-2 active:ring-white">
                Let's start 🥴
              </button>
            </li>
          </ul>
        </div>
      </header>

      <main>
        <SideMenuBar />
      </main>
      <footer className="mt-96">
        <FooterActivities />
      </footer>
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

export const getStaticProps = async (ctx) => {
  const YOUR_ACCESS_KEY = "cRQOgQNZ4GoPRJY3euHL1Rl8Dmwmh2WYCi5Gl7IXZ3s";
  const res = await axios(
    `https://api.unsplash.com/photos/random?client_id=${YOUR_ACCESS_KEY}`
  );
  const randomImage = res.data;

  return {
    props: { randomImage },
  };
};
