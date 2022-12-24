import React, { useEffect, useRef, useState } from "react";
import ListActivity from "../components/activities/ListActivity";
import { useRouter } from "next/router";
import Head from "next/head";
import Footer from "../components/footer/Footer";
import Hands from "../components/svg/Hands";
import Image from "next/image";
import Script from "next/script";
import { sanityClient, urlFor } from "../sanity";
import { useQuery } from "react-query";
import axios from "axios";
import OtherPosts from "../components/activities/grammar/OtherPosts";

export default function Home(props) {
  const [dataSearchOptios, setDataSearchOptions] = useState();
  const [DataDescriptionMeta, SetDataDescriptionMeta] = useState();
  const [current, setCurrent] = useState(0);
  const length = props.mainImages.length;
  const [postsData, setPostsData] = useState(props.data);

  const activeMenu = useRef(0);
  const Menus = [
    { name: "กิจกรรมต่างๆ", icon: "home-outline", dis: "translate-x-0" },
    { name: "โครต Grammar", icon: "person-outline", dis: "translate-x-16" },
  ];

  // fetch data to next list
  const { isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      axios.post("/api/handle-posts", { index: activeMenu }).then((res) => {
        const result = res;
        setPostsData(result.data.posts);
        return result;
      }),

    refetchOnWindowFocus: false,
    enabled: false,
  });

  // telling react-query to fetch data
  const handleFectchMenu = async (index) => {
    activeMenu.current = index;
    refetch();
  };

  // automatic move image silder to the next one
  useEffect(() => {
    if (!Array.isArray(props.mainImages) || props.mainImages.length <= 0) {
      return null;
    }
    const intervalId = setInterval(() => {
      setCurrent(current === length - 1 ? 0 : current + 1);
    }, 10000);
    return () => clearInterval(intervalId);
  }, [current]);

  // set image silder to the next one
  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  // set image silder to the previous one
  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  // attrach meta discription from footer
  const descriptionMeta = (data) => {
    SetDataDescriptionMeta(data);
  };

  return (
    <div>
      <Head>
        <title>TaTuga camp</title>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/TaTuga camp.png"
        />
        <meta name="google" content="nositelinkssearchbox" key="sitelinks" />
        <meta name="google" content="notranslate" key="notranslate" />
        <meta name="description" content={DataDescriptionMeta} />
        <meta
          name="keywords"
          content="TaTuga camp, tatugacamp, tatuga camp, English, English camp, camp for learning English, card game, activities in classroom, กิจกรรมค่ายภาษาอังกฤษ, การ์ดเกมเพื่อการเรียนรู้, การ์ดเกม"
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Script src="https://cdn.jsdelivr.net/npm/kute.j@2.1.2/dist/kute.main.js"></Script>
      <Script
        type="module"
        src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
      ></Script>
      <Script
        noModule
        src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"
      ></Script>

      {/* Image silder */}
      <header>
        <div>
          <div className="w-full h-[30rem] md:h-[40rem] relative flex justify-center items-center">
            <div className="absolute z-10 flex justify-between items-end h-full md:h-max md:items-center w-full">
              <button
                onClick={prevSlide}
                className="border-0 bg-transparent px-0 flex items-center justify-start w-max h-max text-white drop-shadow-xl hover:text-[#97CC04] transition duration-150 active:text-[#2C7CD1] md:active:text-[6rem] text-[3rem] md:text-[5rem]"
              >
                <ion-icon name="arrow-back-circle"></ion-icon>
              </button>
              <button
                onClick={nextSlide}
                className="border-0 bg-transparent px-0 flex items-center justify-start w-max h-max   text-white drop-shadow-xl hover:text-[#97CC04] transition duration-150 active:text-[#2C7CD1] md:active:text-[6rem] text-[3rem] md:text-[5rem]"
              >
                <ion-icon name="arrow-forward-circle"></ion-icon>
              </button>
            </div>
            {props.mainImages.map((silder, index) => {
              return (
                <div
                  className={
                    index === current
                      ? "opacity-100 relative duration-300 transition translate-y-0  w-full h-full "
                      : "opacity-0 -translate-y-full"
                  }
                  key={index}
                >
                  {index === current && (
                    <Image
                      className="object-center"
                      src={urlFor(silder.mainImage.asset._ref).url()}
                      layout="fill"
                      objectFit="cover"
                      alt={silder.title}
                      priority
                      placeholder="blur"
                      quality={50}
                      blurDataURL="data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div
            className="md:w-3/4 lg:w-max md:px-10 lg:px-20  w-[15rem] mr-auto ml-auto right-0 left-0 rounded-3xl
             md:rounded-[323.42px]  h-[25rem] md:h-max absolute md:absolute md:z-10 md:top-[38rem] z-10 top-80 bg-white  
             md:mt-14 flex-col md:flex-row  flex justify-start items-center"
            id="header"
          >
            <div className="w-full text-center mt-5 md:mt-0 justify-center  flex flex-col gap-y-0 md:gap-y-0">
              <div className="square xyz-in">
                <span className="text-[2rem] md:text-[3rem] MoreSugar text-[#2C7CD1]">
                  TaTuga camp
                </span>
              </div>

              <span className="LessSugar text-[0.9rem] md:text-lg">
                Enjoy fun Brush up Playground
              </span>

              <span className="LessSugar text-[0.9rem]  md:text-lg text-[#2C7CD1]">
                learn through play with us
              </span>
            </div>
            <Hands />
          </div>
        </div>
      </header>

      <main className="mt-40 mb-0 md:mb-0 pb-5 md:mt-80 lg:mt-0 lg:pt-80 lg:pb-[6rem] lg:mb-0 flex flex-col justify-center items-center   bg-[url('/blob-scene-haikei.svg')] bg-no-repeat bg-cover ">
        <div className="w-max h-max font-Kanit  z-30 font-medium text-[1.5rem] md:text-[1.7rem]  px-5 py-3 text-white rounded-xl bg-[#2C7CD1]">
          <span>แหล่งรวบรวมความรู้</span>
        </div>
        <ul className="list-none pl-0 w-full  h-24 flex justify-center items-center  gap-x-12 font-Kanit font-light text-lg">
          {Menus.map((list, index) => {
            return (
              <li
                onClick={() => handleFectchMenu(index)}
                key={index}
                className={` ${
                  activeMenu.current === index
                    ? "border-[#EDBA02] text-[#EDBA02] font-semibold"
                    : "border-transparent"
                } underLineHover cursor-pointer `}
              >
                <span className="active:text-[#EDBA02]">{list.name}</span>
              </li>
            );
          })}
        </ul>

        {activeMenu.current === 0 ? (
          <ListActivity
            activityPosts={postsData}
            dataSearchOptios={dataSearchOptios}
            likes={props.likes}
          />
        ) : (
          <OtherPosts
            activityPosts={postsData}
            dataSearchOptios={dataSearchOptios}
            likes={props.likes}
          />
        )}
        {error && console.log(error)}
      </main>

      <footer>
        <Footer descriptionMeta={descriptionMeta} />
      </footer>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  const quary = `*[_type == "post"]{
    _id,
    slug,
    title,
   mainImage,
    description,
    likes,
    author ->{
    name,
  }
  }`;
  const quaryImages = `*[_type == "heroImages"]`;
  const post = await sanityClient.fetch(quary);
  const mainImages = await sanityClient.fetch(quaryImages);

  return {
    props: {
      data: post,
      mainImages: mainImages,
    },
  };
};
