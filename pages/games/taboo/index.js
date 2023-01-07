import axios from "axios";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import FooterActivities from "../../../components/footer/FooterActivities";
import Layout from "../../../components/layout";
import { sanityClient, urlFor } from "../../../sanity";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import Head from "next/head";

function Index() {
  const [taboo, setTaboo] = useState(null);
  const [random, setRandom] = useState();
  const length = taboo?.length || 0;
  const [nextCard, setNextCard] = useState(() => {
    return Math.floor(Math.random() * 29);
  });
  const [indexRandom, setIndexRandom] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const [scores, setScores] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const { width, height } = useWindowSize();

  //fectching taboo data
  const { isLoading, isFetching, error } = useQuery(["taboo"], () =>
    axios("/api/taboo").then((res) => {
      setTaboo(res.data);
      return res;
    })
  );

  // handle skip
  const handleSkip = () => {
    //check if index of random is less than the length
    if (indexRandom < length - 1) {
      // set index of random to increase 1 each click
      setIndexRandom((prev) => prev + 1);
      setNextCard((current) => {
        return (current = random[indexRandom]);
      });
    } else if (indexRandom >= length - 1) {
      console.log("loop finish");
      setIndexRandom(0);
      setNextCard((current) => {
        return (current = random[indexRandom]);
      });
    }
  };

  //show confirmation
  const NextTaboo = () => {
    if (scores === "win") {
      setScores(0);
    } else {
      setShowConfirm(true);
    }
  };

  //generate uniqe array of random number
  function GenerateRandom(length) {
    const nums = new Set();
    while (nums.size !== length) {
      nums.add(Math.floor(Math.random() * length));
    }

    return [...nums];
  }

  //call set random to generate unqie random number
  useEffect(() => {
    setRandom(GenerateRandom(length));
  }, [length]);

  // handle yes confirm
  const YesConfirm = () => {
    setConfirm(true);
    if (indexRandom < length - 1) {
      setIndexRandom((prev) => prev + 1);
      setNextCard((current) => {
        return (current = random[indexRandom]);
      });
    } else if (indexRandom >= length - 1) {
      console.log("loop finish");
      setIndexRandom(0);
      setNextCard((current) => {
        return (current = random[indexRandom]);
      });
    }
    setShowConfirm(false);

    // set score
    setScores((current) => (current === length - 1 ? "win" : current + 1));
  };

  // handle no confirm
  const NoConfirm = () => {
    setConfirm(false);
    setShowConfirm(false);
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="description"
          content="oneline taboo game for students who wants to play them online เกมส์ทาบู ทายคำศัพท์ จาก TaTuga camp"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Taboo game</title>
      </Head>
      <Layout>
        <div className="font-sans pt-10 bg-slate-100 h-screen">
          {scores === "win" && <Confetti width={width} height={height} />}
          <header className="w-full h-max  flex justify-center flex-col items-center pt-10">
            {isLoading ? (
              <h1>กำลังโหลด...</h1>
            ) : (
              <h1 className="MoreSugar md:text-3xl text-3xl text-[#2C7CD1]">
                Taboo
              </h1>
            )}
            {error && <h1>มีข้อผิดพลาดเกิดขึ้น</h1>}
          </header>
          <main className="flex  h-max pt-3 items-center justify-center relative    ">
            <ul
              className="list-none p-10 w-3/5 h-max flex flex-col items-center justify-center
             bg-white drop-shadow-lg rounded-md  md:w-96 md:flex lg:w-96 relative "
            >
              <div className="absolute z-20 flex flex-col items-center justify-center gap-y-1 -top-5 right-0">
                <div className="flex flex-col justify-center items-center w-8 md:w-10 bg-slate-700 px-2 py-1 rounded-lg text-white font-medium">
                  <span className="md:text-lg">{scores}</span>
                  <span className="w-full h-[2px] bg-white"></span>
                  <span className="md:text-lg">{length}</span>
                </div>
              </div>

              {showConfirm === true && (
                <div className="w-full h-max py-10 absolute bg-red-300 z-30 flex flex-col items-center justify-center">
                  <div>คุณแน่ใจจะไปต่อใช่ไหม? 🤨</div>
                  <div className="flex gap-12 mt-5">
                    <button
                      onClick={YesConfirm}
                      className="border-0 font-Kanit font-bold bg-white rounded-sm drop-shadow-sm hover:bg-red-700 hover:text-white cursor-pointer ring-2 ring-black"
                    >
                      Yes
                    </button>
                    <button
                      onClick={NoConfirm}
                      className="border-0 font-Kanit font-bold bg-white rounded-sm drop-shadow-sm hover:bg-red-700 hover:text-white cursor-pointer ring-2 ring-black"
                    >
                      No
                    </button>
                  </div>
                </div>
              )}

              <li className="text-2xl font-bold mb-3 md:w-96 text-center">
                {taboo?.[nextCard].vocabulary}
              </li>
              <li className="relative w-32 h-28 rounded-lg overflow-hidden bg-white drop-shadow-lg md:w-40 md:h-40 lg:w-56 lg:h-56">
                {taboo && (
                  <Image
                    src={urlFor(
                      taboo?.[nextCard]?.mainImage?.asset?._ref
                    ).url()}
                    layout="fill"
                    className="object-cover"
                    priority
                    quality={15}
                    alt={`taboo of ${taboo?.[nextCard]?.vocabulary}`}
                  />
                )}
              </li>

              <li className="mt-5">{taboo?.[nextCard].firstTaboo}</li>
              <li>{taboo?.[nextCard].secondTaboo}</li>
              <li>{taboo?.[nextCard].thirdTaboo}</li>
              <li className="mt-5 w-full flex gap-x-5">
                <button
                  emoji1="😨"
                  emoji2="😢"
                  className={`w-full ${
                    scores === "win" && "hidden"
                  } h-10 after:content-[attr(emoji1)] after:ml-2 py-2 after:hover:content-[attr(emoji2)] 
                    active:ring-4 active:ring-black hover:text-white text-center font-sans border-0 flex 
                    items-center justify-center  bg-gray-300 rounded-md font-semibold cursor-pointer hover:bg-black`}
                  onClick={handleSkip}
                >
                  ข้าม
                </button>

                <button
                  emoji1="😎"
                  emoji2="👉"
                  className="w-full after:content-[attr(emoji1)] text-white after:ml-2 py-2 after:hover:content-[attr(emoji2)] active:ring-4 active:ring-black hover:text-white text-center font-sans border-0 flex items-center justify-center  bg-red-800 rounded-md font-semibold cursor-pointer hover:bg-orange-500"
                  onClick={NextTaboo}
                >
                  {scores === "win" ? "Start again" : "Move on"}
                </button>
              </li>
            </ul>
          </main>
          <footer></footer>
        </div>
      </Layout>
      <FooterActivities />
    </>
  );
}

export default Index;

export const getServerSideProps = async (context) => {
  const query = `*[slug.current == "taboo"]{
    mainImage
  }`;
  const mainImage = await sanityClient.fetch(query);

  return {
    props: {
      mainImage: mainImage[0],
    },
  };
};
