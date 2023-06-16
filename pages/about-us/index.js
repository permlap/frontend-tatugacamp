import Image from "next/image";
import React, { useEffect, useState } from "react";
import { sanityClient, urlFor } from "../../sanity";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import Head from "next/head";
import Layout from "../../components/layout";
import { returnProps } from "../../utils/imageMetadata";
import Hands from "../../components/svg/Hands";

function Index({ members }) {
  const { height, width } = useWindowDimensions();
  const [checked, setChecked] = useState(1);

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
      <div className="flex flex-col items-center justify-center">
        <Head>
          <meta charSet="UTF-8" />
          <meta
            property="og:image"
            content="https://storage.googleapis.com/tatugacamp.com/Members/memberThumnailNew.jpg"
          />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="about us - tatuga camp" />
          <meta
            property="og:description"
            content="Introducing our exceptional team, wholeheartedly devoted to crafting enchanting and inspiring educational journeys."
          />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="600" />
          <meta
            property="og:image:secure_url"
            content="https://storage.googleapis.com/tatugacamp.com/Members/memberThumnailNew.jpg"
          />
          <meta
            name="twitter:image:src"
            content="https://storage.googleapis.com/tatugacamp.com/Members/memberThumnailNew.jpg"
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
        <header className="font-Poppins w-full max-w-7xl h-max flex justify-start items-center relative md:mt-0 mt-10 ">
          <div className="md:m-20 md:mr-0 lg:w-max   m-10 mt-20  w-max flex flex-col relative ">
            <span className="font-semibold">The team</span>
            <span className="lg:text-7xl md:w-3/4 md:text-5xl text-3xl  font-semibold text-[#2C7CD1] leading-tight">
              Introducing our exceptional team
            </span>
            <span className="md:mt-5 mt-2 lg:text-xl">
              wholeheartedly devoted to crafting enchanting and
            </span>
            <span className="lg:text-xl">inspiring educational journeys.</span>
          </div>
          <div className=" md:absolute hidden md:block lg:right-9 xl:right-80 md:right-5">
            <Image
              src="https://storage.googleapis.com/tatugacamp.com/logo%20/tatugacamp%20facebook.jpg"
              width={200}
              height={200}
              quality={100}
              className=""
            />
          </div>
        </header>
        <main className="w-full flex items-center justify-center font-Poppins max-w-[99rem]">
          <div className="w-10/12 grid grid-cols-2  lg:grid-cols-2 xl:grid-cols-3 md:grid-cols-2 place-items-center gap-10 mb-10">
            {members?.map((member) => {
              return (
                <div
                  key={member._id}
                  className="lg:w-96 w-full lg:h-80 md:w-60 md:h-full h-full flex items-start justify-start flex-col group "
                >
                  <div className="w-full bg-white h-72  relative group-hover:opacity-0 opacity-100 group-hover:w-0 group-hover:h-0 transition duration-150 ">
                    <Image
                      src={urlFor(member.mainImage.asset._ref).url()}
                      layout="fill"
                      className="object-cover scale-110 drop-shadow-xl relative z-10"
                      placeholder="blur"
                      blurDataURL={member.imageProps.blurDataURL}
                      alt={`picture of ${member.name}`}
                    />
                    <div className="w-full absolute md:h-28 h-40 bg-[#EDB901] bottom-0 -z-5"></div>
                  </div>
                  <div className=" bg-white relative opacity-0 w-0 h-0 group-hover:opacity-100 group-hover:w-full group-hover:h-72  transition duration-150 ">
                    <Image
                      src={urlFor(member.secondImage.asset._ref).url()}
                      layout="fill"
                      className="object-cover scale-110 drop-shadow-xl relative z-10"
                      placeholder="blur"
                      blurDataURL={member.imageProps.blurDataURL}
                      alt={`picture of ${member.name}`}
                    />
                    <div className="w-full absolute md:h-28 h-40  bg-[#2C7CD1] bottom-0 -z-5"></div>
                  </div>
                  <span className="md:text-2xl text-md  font-semibold mt-2 text-[#2C7CD1] group-hover:text-[#EDB901]">
                    {member.name}
                  </span>
                  <span className="md:text-md text-sm ">{member.position}</span>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </Layout>
  );
}

export default Index;

export const getStaticProps = async (ctx) => {
  const membersQuery = `*[_type == "members"]`;
  const members = await sanityClient.fetch(membersQuery);
  members.sort((a, b) => Date.parse(a._createdAt) - Date.parse(b._createdAt));
  const blurData = await Promise.all(
    members.map(async (item) => {
      const imageProps = await returnProps(
        urlFor(item.mainImage.asset._ref).url()
      );

      // This will return the image a well as the needed plaiceholder
      // info in the same object within the array 🤯
      return { ...item, imageProps };
    })
  );
  return {
    props: {
      members: blurData,
    },
  };
};
