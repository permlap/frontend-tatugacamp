import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import FooterActivities from "../../components/footer/FooterActivities";
import { sanityClient, urlFor } from "../../sanity";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import Head from "next/head";
import Layout from "../../components/layout";

function Index(props) {
  const { height, width } = useWindowDimensions();
  const [checked, setChecked] = useState(1);
  const ref = useRef(null);
  const secRef = useRef(null);

  const handleScroll = () => {
    ref?.current.scrollIntoView({ behavior: "smooth" });
  };
  const secHandleScroll = () => {
    secRef?.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (width < 767) {
      setChecked(1);
    } else if (width > 768 && width < 1000) {
      setChecked(2);
    } else if (width > 1000) {
      setChecked(3);
    }
  }, [width]);

  return (
    <Layout>
      <div>
        <Head>
          <meta
            property="og:image"
            src={urlFor(props.data[1].mainImage.asset._ref).url()}
          />
          <meta
            property="og:image:secure_url"
            src={urlFor(props.data[1].mainImage.asset._ref).url()}
          />
          <meta
            name="twitter:image:src"
            src={urlFor(props.data[1].mainImage.asset._ref).url()}
          />
          <meta name="google" content="nositelinkssearchbox" key="sitelinks" />
          <meta name="google" content="notranslate" key="notranslate" />
          <meta name="description" content="เรื่องราวของพวกเรา TaTuga camp" />
          <meta
            name="keywords"
            content={`TaTuga camp, tatugacamp, tatuga camp, English, English camp, camp for learning English, card game, activities in classroom, กิจกรรมค่ายภาษาอังกฤษ, การ์ดเกมเพื่อการเรียนรู้, การ์ดเกม`}
          />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <title>about us</title>
        </Head>
        <header>
          <ul
            className="w-full pt-20 md:pt-0 h-max pb-[40rem] md:mb-80 lg:mb-80 md:h-[40rem] 
        md:pb-80 md:gap-x-2 lg:gap-x-11 flex flex-col justify-center  items-center md:flex-row-reverse 
        list-none bg-no-repeat bg-cover bg-[url('/svg/headerAboutPhone.svg')]   md:bg-[url('/svg/headerAbout.svg')] pl-0"
          >
            <li className="relative w-80 h-72 md:w-80 md:h-72 lg:w-96 lg:h-80 rounded-3xl overflow-hidden ">
              <Image
                src={urlFor(props.data[1].mainImage.asset._ref).url()}
                layout="fill"
                className="object-cover "
                alt="สิ่งที่มุ่งหวัง"
              />
            </li>
            <li>
              <ul className="list-none pl-0 w-full text-white">
                <li>
                  <ul className="list-none pl-0 font-Kanit flex flex-col w-full gap-y-2">
                    <li className="uppercase mt-5 md:mt-0 text-3xl font-extrabold">
                      about us
                    </li>
                    <li className="text-xl font-bold">
                      เรื่องราวของพวกเรา TaTuga camp
                    </li>
                    <li className="text-bs font-extralight w-[20rem] md:w-[25rem] lg:w-[30rem] ">
                      พวกเรามุ่งหวังเป็นอย่างยิ่งว่าการเรียนรู้ที่ดีคือการเรียนรู้ที่ผู้เรียนได้สนุก
                      และมีความสุขไปกับมัน - TaTuga camp
                    </li>
                  </ul>
                </li>
                <li ref={secRef} className="flex gap-x-4 mt-5">
                  <button
                    onClick={handleScroll}
                    className="w-max h-max bg-[#97CC04] active:bg-red-400 focus:border-white border-1 border-transparent text-lg font-light font-Kanit py-2 ease-out px-9 text-white hover:scale-110 rounded-md transition duration-200  "
                  >
                    จุดเริ่มต้น
                  </button>
                  <button
                    onClick={secHandleScroll}
                    className="w-max h-max bg-transparent border-1 border-white text-lg font-light font-Kanit py-2 px-9  ease-out  outline-0 text-white hover:scale-110 rounded-md transition duration-200  "
                  >
                    สิ่งที่มุ่งหวัง
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </header>

        <main>
          <ul className="list-none pl-0 w-full h-max gap-x-7 top-[45rem]   bg-transparent flex justify-center items-center absolute md:top-[40rem] lg:top-[40rem] ">
            <Swiper spaceBetween={0} slidesPerView={checked}>
              {props.cards?.map((card) => {
                return (
                  <SwiperSlide key={card._id}>
                    <li className="w-[23rem] md:w-[20rem] lg:w-[23rem]  h-max bg-white rounded-sm overflow-hidden drop-shadow-lg lg:hover:scale-110 transition duration-200">
                      <div className="relative w-full h-[14.5rem] ">
                        <Image
                          src={urlFor(card.mainImage.asset._ref).url()}
                          layout="fill"
                          className="object-cover "
                          alt="TaTuga camp image"
                        />
                      </div>
                      <div className="flex flex-col items-center justify-start mt-5 md:gap-y-2 lg:gap-y-7 w-full h-[11rem] drop-shadow-lg text-center font-Kanit">
                        <span className="font-bold text-xl">{card.title}</span>
                        <span className="font-extralight text-base w-3/4">
                          {card.description}
                        </span>
                      </div>
                    </li>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </ul>
          <ul
            ref={ref}
            className="pl-0 list-none flex gap-x-11 gap-y-6 md:flex-row flex-col w-full h-max justify-center items-center font-Kanit mb-40"
          >
            <li className="lg:w-[30rem] md:w-96 text-center md:text-left">
              <div className="flex justify-center">
                <div className="text-[2.5rem]  md:text-[3rem] h-max w-max rotate-45 text-[#2C7CD1] mr-4  md:mr-3">
                  <ion-icon name="arrow-undo-circle"></ion-icon>
                </div>
                <h1 className="text-black ">จุดเริ่มต้น</h1>
              </div>
              <span className="text-justify">
                พวกเราคือกลุ่มคนเล็ก ๆ ที่มีใจรักในการพัฒนาผู้เรียน
                โดยใช้กิจกรรมที่สนุก มีความหลากหลาย ไม่เน้นวิชาการ
                จากจุดเริ่มต้นแรกที่ได้นำความรู้และความสนุกไปแจกจ่ายแก่ผู้เรียนตามชนบท
                โรงเรียนที่ห่างไกลตัวเมือง ทำให้เด็ก ๆ
                ได้เปลี่ยนมุมมองเกี่ยวกับภาษาอังกฤษ ที่เด็ก ๆ คิดว่า “ยาก”
                กลายเป็น “สนุกและอยากที่จะร่วมเรียนรู้ภาษาอังกฤษ”
                ผ่านกิจกรรมต่าง ๆ จนตอนนี้พวกเรา TaTuga camp
                ได้มีผู้ที่มีใจรักและมีอุดมการณ์เดียวกัน
                มาร่วมมือกันเดินหน้าพัฒนาองค์กร
                และตั้งใจอย่างยิ่งว่าจะนำพาความสนุก ความสุขและความรู้
                ไปมอบให้แก่ผู้เรียนที่น่ารักทุกคน … ทั่วประเทศ
              </span>
            </li>
            <li className="relative w-80 h-72 md:w-80 md:h-72 lg:w-96 lg:h-80 rounded-[3rem] overflow-hidden ">
              <Image
                src={urlFor(props.data[2].mainImage.asset._ref).url()}
                layout="fill"
                className="object-cover "
                alt="TaTuga camp image"
              />
            </li>
          </ul>
        </main>
      </div>
    </Layout>
  );
}

export default Index;

export const getStaticProps = async (ctx) => {
  const quaryImages = `*[_type == "heroImages"]`;
  const qurayCards = `*[_type == "aboutUsCards"]`;
  const mainImages = await sanityClient.fetch(quaryImages);
  const cards = await sanityClient.fetch(qurayCards);
  return {
    props: {
      data: mainImages,
      cards: cards,
    },
    revalidate: 1,
  };
};
