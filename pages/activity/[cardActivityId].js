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

function Index(props) {
  const [likes, setLikes] = useState(props.likes);
  const [likesHasbeenClicked, setLikeHasBeenClicked] = useState(false);
  const [mouseHover, setMouseHover] = useState(() => false);
  const [currentURL, setCurrentURL] = useState();

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

  return (
    <Layout>
      <div className="w-full h-screen md:h-max  bg-[url('/blob2.svg')] bg-no-repeat bg-cover pt-11">
        <Head>
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
          <title>{props.data[0].title}</title>
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
              <li className="bg-transparent w-[20rem] h-[20rem] md:w-96 md:h-96 lg:w-[48.313rem] lg:h-[22.875rem] relative square xyz-in">
                <Image
                  src={urlFor(props.data[0].mainImage.asset._ref).url()}
                  layout="fill"
                  alt={props.data[0].title}
                  className=" object-contain"
                  priority
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
                <li className="sm:text-black text-white  text-sm w-3/4 bg-[#2C7CD1] sm:bg-transparent font-Kanit rounded-3xl font-normal ">
                  {props.data[0]?.LongDescription}
                </li>
                <li>
                  <Status status={props.data[0]} />
                </li>
              </ul>
            </li>
          </ul>
        </header>
        <main className="w-full h-max flex mt-5 flex-col justify-center items-center bg-[#2C7CD1] md:bg-transparent">
          {props.data[0].price && (
            <div className="w-max  h-full bg-transparent relative mt-[1rem] md:mt-2 font-Kanit text-center font-semibold mb-2 rounded-xl px-14 py-2">
              <ul className="pl-0 list-none">
                <li className="w-[15rem] h-[4rem] hover:cursor-pointer hover:rounded-sm transition-all bg-[#EDBA02] flex justify-center items-center rounded-2xl text-white">
                  <a
                    href="https://web.facebook.com/TaTugaCamp/posts/pfbid02DYHKGDw71vR9h2D2St7vnuNemfPndpEALufDbRBz9bkkjByPL72UEQ6oV7GGTARml"
                    target="_blank"
                    rel="noreferrer"
                    className="no-underline text-white w-full h-max"
                  >
                    <div>
                      <span className="flex justify-center items-center">
                        <Image
                          src="/arrayAround/Brave.png"
                          alt="buy product at facebook tatuga camp"
                          width={125}
                          height={90}
                          priority
                        />
                        <span className="text-xl">ซื้อเลย!</span>
                      </span>

                      {/* <div>
                      <span className="text-sm">
                        ที่ facebok: TaTuga camp กดเลย
                      </span>
                    </div> */}
                    </div>
                  </a>
                </li>

                <li className="text-white">
                  <span>ราคาเพียง</span>
                  <span className="text-2xl"> {props.data[0].price}.-</span>
                </li>
              </ul>
            </div>
          )}

          <MainContent
            picture={props.data[0].mainImage.asset._ref}
            body={props?.data[0]?.body}
          />
        </main>
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
  const query = `*[slug.current == "${cardActivityId}"]{
    title,
    _id,
    LongDescription,
    mainImage,
    categories[0] ->,
    body,
    slug,
    likes,
    age,
    time,
    material,
    people,
    price
  }`;

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