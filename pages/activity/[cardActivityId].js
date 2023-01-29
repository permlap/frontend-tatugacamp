import React, { useEffect, useState } from "react";
import Image from "next/image";
import { sanityClient, urlFor } from "../../sanity";
import Head from "next/head";
import Script from "next/script";
import Status from "../../components/activity/Status";
import MainContent from "../../components/activity/MainContent";
import { FacebookShareButton, TwitterShareButton } from "next-share";
import FooterActivities from "../../components/footer/FooterActivities";
import Layout from "../../components/layout";
import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ReactPlayer from "react-player";
import Loading from "../../components/loading/loading";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
/** @param {import('next').InferGetStaticPropsType<typeof getStaticProps> } props */
function Index(props) {
  const [likes, setLikes] = useState(props.likes);
  const [likesHasbeenClicked, setLikeHasBeenClicked] = useState(false);
  const [mouseHover, setMouseHover] = useState(() => false);
  const [currentURL, setCurrentURL] = useState();
  const [loading, setLoading] = useState(true);
  const [domLoaded, setDomLoaded] = useState(false);

  // render the component only after the DOM is loaded.
  useEffect(() => {
    setDomLoaded(true);
  }, []);

  // set current url to pass into social media link share
  useEffect(() => {
    setCurrentURL(window.location.href);
  }, []);

  // check whether like button has been clicked or not
  useEffect(() => {
    const readLocalstore = localStorage.getItem(props.data[0].slug.current);
    if (!readLocalstore) {
      setLikeHasBeenClicked(false);
    } else if (readLocalstore === props.data[0]._id) {
      setLikeHasBeenClicked(true);
    }
  }, [props.data]);

  // send POST requse to api in order to handle like button
  const addLike = async () => {
    localStorage.setItem(props.data[0].slug.current, props.data[0]._id);
    const readLocalstore = localStorage.getItem(props.data[0].slug.current);

    if (!readLocalstore) {
      setLikeHasBeenClicked(false);
    } else if (readLocalstore === props.data[0]._id) {
      setLikeHasBeenClicked(true);
    }
    const res = await fetch("/api/handle-likes", {
      method: "POST",
      body: JSON.stringify({ _id: props.data[0]._id }),
    }).catch((error) => console.log(error));
    const data = await res.json();
    setLikes(data.likes);
  };

  //set loading video when it is not ready
  function handleVideoReady() {
    setLoading(false);
  }

  return (
    <Layout>
      <div className="w-full md:h-full  bg-[url('/blob2.svg')] md:bg-[url('/blob3.svg')] bg-[#2C7CD1] bg-no-repeat bg-cover pt-11">
        <Head>
          <meta property="og:url" content={currentURL} />
          <meta property="og:type" content="website" />
          <meta
            property="og:title"
            content={`${props.data[0].title} - ${props.data[0].description}`}
          />
          <meta
            property="og:description"
            content={props.data[0].LongDescription}
          />
          <meta
            property="og:image"
            content={urlFor(props.data[0].mainImage.asset._ref).url()}
          />
          <meta
            property="og:image:secure_url"
            content={urlFor(props.data[0].mainImage.asset._ref).url()}
          />
          <meta
            name="twitter:image:src"
            content={urlFor(props.data[0].mainImage.asset._ref).url()}
          />

          <meta name="google" content="nositelinkssearchbox" key="sitelinks" />
          <meta name="google" content="notranslate" key="notranslate" />
          <meta name="description" content={props?.data[0]?.LongDescription} />
          <meta
            name="keywords"
            content={`TaTuga camp, tatugacamp, tatuga camp, English, English camp, camp for learning English, card game, activities in classroom, กิจกรรมค่ายภาษาอังกฤษ, การ์ดเกมเพื่อการเรียนรู้, การ์ดเกม, ${props.data[0].title}}`}
          />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <title>
            {props.data[0].title} - {props.data[0].description}
          </title>
        </Head>
        <Script
          type="module"
          src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
        ></Script>
        <Script
          noModule
          src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"
        ></Script>
        <header>
          <ul className="list-none flex flex-col  lg:mt-2  md:flex-row justify-center items-center w-full h-full bg-transparent mt-0 md:mt-34 pl-0">
            <ul xyz="fade up back-1 " className="pl-0 list-none">
              <li className="bg-transparent w-[20rem] h-[20rem] md:w-60 md:h-60 lg:w-96 lg:h-96  relative square xyz-in">
                <Image
                  src={urlFor(props.data[0].mainImage.asset._ref).url()}
                  layout="fill"
                  alt={props.data[0].title}
                  className="object-contain"
                  placeholder="blur"
                  blurDataURL="/logo/TaTuga camp.png"
                />
              </li>
            </ul>
            <li xyz="fade-100% big-100% wide-100% tall-100%">
              <ul className="list-none pl-0 flex flex-col square xyz-in justify-center text-center pr-0 items-center bg-transparent w-full mt-10  rounded-3xl h-max md:w-[503px] md:h-[376px]">
                <li className="MoreSugar text-3xl md:text-[2.8rem] text-[#EDBA02]">
                  {props.data[0].title}
                </li>
                <li className="MoreSugar text-white md:text-black text-xl lg:mt-2 md:mb-2 md:text-[1.5rem]">
                  {props.data[0].categories.title}
                </li>
                <li className=" px-4 py-2 rounded-md bg-[#2C7CD1]  md:drop-shadow-lg md:mb-2 text-white flex items-center gap-x-2 text-[20px] ">
                  <div className="flex flex-col justify-center gap-y-0 items-center">
                    <div className="flex justify-center items-center gap-x-4">
                      <div>
                        <FacebookShareButton
                          url={currentURL}
                          quote={props.data[0].LongDescription}
                          hashtag={`#${props.data[0].slug}`}
                          media={urlFor(
                            props.data[0].mainImage.asset._ref
                          ).url()}
                        >
                          <div className="text-2xl  hover:text-[#F55E00] transition duration-200 ease-in-out">
                            <ion-icon name="logo-facebook"></ion-icon>
                          </div>
                        </FacebookShareButton>
                      </div>
                      <span className="font-Kanit text-sm">Share</span>
                      <div>
                        <TwitterShareButton
                          url={currentURL}
                          quote={props.data[0].LongDescription}
                          hashtag={`#${props.data[0].slug}`}
                        >
                          <div className="text-2xl hover:text-[#F55E00] transition duration-200 ease-in-out">
                            <ion-icon name="logo-twitter"></ion-icon>
                          </div>
                        </TwitterShareButton>
                      </div>
                    </div>
                  </div>
                  {likesHasbeenClicked ? (
                    <button
                      className=" border-0 w-max h-max  font-black font-Inter 
                md:text-xl gap-x-2 md:gap-x-2 px-3 rounded-xl  
              bg-white mt-0 text-[#F55E00] flex justify-center items-center
                 "
                    >
                      <span className="mt-1 text-2xl">
                        <ion-icon name="heart-circle"></ion-icon>
                      </span>
                      <div>
                        <span className="text-sm">Thanks!</span>
                      </div>
                    </button>
                  ) : (
                    <button
                      onClick={addLike}
                      className=" border-0 w-max h-max  font-black font-Inter 
                md:text-xl gap-x-2 md:gap-x-2 px-3 rounded-xl  
              bg-white mt-0 text-[#F55E00] flex justify-center items-center
                hover:bg-[#F55E00] hover:text-white transition duration-200 ease-in-out
                 "
                    >
                      <span className="mt-1 text-2xl">
                        <ion-icon name="heart-circle"></ion-icon>
                      </span>
                      <div>{likes}</div>
                    </button>
                  )}
                </li>
                <li className="sm:text-white text-white md:text-black   text-sm w-3/4 bg-[#2C7CD1] sm:bg-transparent font-Kanit rounded-3xl font-normal ">
                  {props.data[0]?.LongDescription}
                </li>
                <li>
                  <Status status={props.data[0]} />
                </li>
              </ul>
            </li>
          </ul>

          {/* button for playing game online  */}
          {props.data[0].game && (
            <div className="w-full flex items-center justify-center mt-3">
              <Link href={props.data[0].game}>
                <div
                  className="w-max h-max p-3 bg-[#EDBA02] font-Kanit font-semibold text-white rounded-md ring-2 ring-white
                 hover:scale-110 active:scale-110 transition duration-200 cursor-pointer "
                >
                  <span>กดเพื่อเล่น 🎮</span>
                </div>
              </Link>
            </div>
          )}

          {props.data[0].price && (
            <div className="w-full flex items-center py-3  md:py-1 justify-center">
              <a
                href={props.data[0].payoutLink}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline "
              >
                <IconButton
                  className="text-[#2C7CD1] md:text-[#2C7CD1] bg-white rounded-lg p-3"
                  size="small"
                  aria-label="add to shopping cart"
                >
                  <AddShoppingCartIcon />
                  <span className="font-Kanit">
                    <span>สั่งซื้อสินค้า</span>
                    {props.data[0].price}
                    <span>.- บาท</span>
                  </span>
                </IconButton>
              </a>
            </div>
          )}
        </header>
        <main className="w-full h-max flex mt-5 flex-col justify-center items-center bg-[#2C7CD1] md:bg-transparent">
          {props?.data[0]?.video && (
            <div className="w-full flex relative items-center justify-center mb-5">
              {loading && (
                <div className="absolute flex justify-center items-center flex-col">
                  <div className="md:w-[35rem] md:h-[20rem] w-72 h-40">
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height="100%"
                    />
                  </div>
                  <div className="font-Kanit lg:text-lg text-base">
                    📹กำลำโหลด..
                  </div>
                </div>
              )}
              {domLoaded && (
                <div className=" md:w-[35rem] md:h-[20rem] w-72 h-40 rounded-md overflow-hidden ">
                  <ReactPlayer
                    onReady={handleVideoReady}
                    playsinline
                    controls
                    width="100%"
                    height="100%"
                    url={props?.data[0]?.video}
                  />
                </div>
              )}
            </div>
          )}
          <MainContent
            picture={props.data[0].mainImage.asset._ref}
            body={props?.data[0]?.body}
            reflectionTipsStrategies={props?.data[0]?.ReflectionTipsStrategies}
            materialDetail={props?.data[0]?.materialDetail}
          />
        </main>
        <footer>
          <FooterActivities />
        </footer>
      </div>
    </Layout>
  );
}

export default Index;

export const getStaticPaths = async () => {
  const quary = `*[_type == "post"]{
    _id,
    slug
  }`;
  const post = await sanityClient.fetch(quary);

  const paths = post.map((post) => ({
    params: { cardActivityId: post.slug.current.toString() },
  }));

  return { paths, fallback: false };
};

export const getStaticProps = async (context) => {
  const cardActivityId = await context.params.cardActivityId;
  const query = `*[slug.current == "${cardActivityId}"]`;

  const RawDataActivity = await sanityClient.fetch(query);
  const likes = RawDataActivity[0].likes;

  return {
    props: {
      data: RawDataActivity,
      likes: likes || 0,
    },
    revalidate: 1,
  };
};
