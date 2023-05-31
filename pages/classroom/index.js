import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import Image from "next/image";
import Lottie from "lottie-react";
import * as teacherAnimation from "../../components/98349-teacher-in-classroom.json";
import { useRouter } from "next/router";
import Head from "next/head";
import { returnProps } from "../../utils/imageMetadata";
import { useQuery } from "react-query";
import { GetNumberStudent, GetNumberUsers } from "../../service/overview/users";
import { useInView } from "react-intersection-observer";
import NumberAnimated from "../../components/overview/numberAnimated";
import ReactPlayer from "react-player";
import { Skeleton } from "@mui/material";

function Index({ cardData }) {
  const router = useRouter();
  const usersNumber = useQuery(["usersNumber"], () => GetNumberUsers());
  const studentNumber = useQuery(["studentNumber"], () => GetNumberStudent());
  const [loading, setLoading] = useState(true);
  const footerData = `ห้องเรียนจาก Tatuga class หรือ ทาทูก้าคลาส ที่จะพาคุณครูไปสู่การบริหารห้องเรียนอย่างสะดวกและสนุก กับ tatuga class TaTuga Class Classroom Management for Everyone จัดการชั้นเรียนและบริหารห้องเรียนอย่างมีประสิทธิภาพ สะดวก และ รวดเร็ว - tatuga class`;
  const [domLoaded, setDomLoaded] = useState(false);
  const [classroomCode, setClassroomCode] = useState();
  const style = {
    height: "100%",
  };
  useEffect(() => {
    setDomLoaded(true);
  }, []);
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });
  function handleVideoReady() {
    setLoading(false);
  }

  return (
    <div className="bg-[url('/blob-scene-haikei.svg')] bg-no-repeat bg-bottom md:h-full  bg-cover pb-20">
      <Head>
        <meta property="og:title" content={`TaTuga class`} />
        <meta
          property="og:description"
          content="ห้องเรีัยน tatuga จาก tatuga camp"
        />
        <meta property="og:image" content="/thumnail/thumnail.jpg" />
        <meta property="og:image:secure_url" content="/thumnail/thumnail.jpg" />
        <meta name="twitter:image:src" content="/thumnail/thumnail.jpg" />
        <meta
          name="keywords"
          content={`TaTuga camp, tatugacamp, tatuga camp, English, English camp, camp for 
            learning English, card game, activities in classroom, กิจกรรมค่ายภาษาอังกฤษ,
             การ์ดเกมเพื่อการเรียนรู้, การ์ดเกม, `}
        />
        <meta charSet="UTF-8" />
        <meta
          name="description"
          content="ห้องเรียนจาก Tatuga class หรือ ทาทูก้าคาส ที่จะพาคุณครูไปสู่การบริหารห้องเรียนอย่างสะดวกและสนุก กับ tatuga class 
          TaTuga Class Classroom Management for Everyone
          จัดการชั้นเรียนและบริหารห้องเรียนอย่างมีประสิทธิภาพ สะดวก และ รวดเร็ว - tatuga class"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Tatuga class</title>
      </Head>
      <Layout>
        <header className="w-full max-w-9xl   h-max  flex justify-center items-center gap-12 font-sans">
          <div className="lg:w-max lg:max-w-4xl bg-transparent lg:ml-5 xl:pl-10 p-10 gap-2 flex flex-col items-start justify-center ">
            <div className="md:mt-5 mt-10">
              <span className="font-medium text-gray-400 md:text-lg lg:text-xl ">
                welcome to
              </span>
            </div>
            <div className="flex flex-col w-full gap-0 md:gap-1 lg:gap-1 xl:gap-5 ">
              <span className="font-Poppins font-bold  text-[#2C7CD1] text-3xl md:text-4xl lg:text-6xl xl:text-7xl w-max">
                Tatuga Class
              </span>
              <span className="text-[#2C7CD1] md:text-2xl lg:text-2xl font-bold font-Poppins relative z-10 ">
                Classroom Management for Everyone
              </span>
            </div>
            <div className="mt-1 font-Kanit text-lg w-3/4 leading-tight relative z-10">
              <span className="text-blue-900">
                จัดการชั้นเรียนและบริหารห้องเรียนอย่างมีประสิทธิภาพ สะดวก และ
                รวดเร็ว - tatuga class
              </span>
            </div>
            <div className="md:w-3/4 md:flex hidden   gap-2 items-center justify-center  ">
              <div className="w-96 font-Kanit font-bold text-blue-900">
                <div className="w-max">
                  <span className="text-2xl ">สำหรับนักเรียน</span>
                </div>
              </div>
              <input
                value={classroomCode}
                onChange={(e) => setClassroomCode(e.target.value)}
                className="bg-blue-200  appearance-none border-none border-gray-200 rounded w-full py-2 px-4  
              leading-tight focus:outline-none focus:bg-blue-400 focus:border-2 focus:right-4 placeholder:text-md 
              placeholder:text-black text-lg font-Poppins placeholder:text-md placeholder:font-Kanit placeholder:font-medium focus:placeholder:text-white text-black focus:text-white font-semibold "
                type="number"
                name="classroomCode"
                placeholder="รหัสห้องเรียน"
                maxLength="6"
              />
              <button
                onClick={() =>
                  router.push({
                    pathname: "/classroom/student",
                    query: {
                      classroomCode: classroomCode,
                    },
                  })
                }
                className="w-full  h-9   rounded-full bg-[#EDBA02] text-white font-sans font-bold
              text-md cursor-pointer hover: active:border-2  active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid"
              >
                เข้าร่วม
              </button>
            </div>
            <div className="flex  w-full items-center justify-center md:justify-start  gap-5  mt-2">
              <div className="text-2xl font-Kanit font-bold text-blue-900">
                สำหรับครู
              </div>
              <button
                onClick={() =>
                  router.push({
                    pathname: "/classroom/teacher",
                  })
                }
                className="w-40  h-9  rounded-full bg-[#2C7CD1] hover:scale-110 transition duration-150 text-white font-sans font-bold
              text-md cursor-pointer hover: active:border-2  active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid"
              >
                จัดการชั้นเรียน
              </button>
            </div>
          </div>

          <div className="md:w-full lg:w-full xl:w-4/12 md:h-96 w-40 h-40 hidden md:flex items-center justify-center relative ">
            <div className="absolute -left-60 md:-left-52 lg:-left-16  md:w-96 lg:w-full ">
              <Lottie animationData={teacherAnimation} style={style} />
            </div>
          </div>
        </header>
        <div className="relative">
          {loading && (
            <div className=" flex absolute top-0 right-0 left-0 bottom-0 m-auto justify-center items-center flex-col">
              <div className="md:w-[35rem] md:h-[20rem] w-72 h-40">
                <Skeleton variant="rectangular" width="100%" height="100%" />
              </div>
              <div className="font-Kanit lg:text-lg text-base">
                📹กำลำโหลด..
              </div>
            </div>
          )}
          {domLoaded && (
            <div className=" flex justify-center items-center flex-col">
              <div className=" md:w-[35rem] md:h-[20rem] w-72 h-40 rounded-md overflow-hidden ">
                <ReactPlayer
                  onReady={handleVideoReady}
                  loop={true}
                  playsinline
                  controls
                  width="100%"
                  height="100%"
                  url="https://player.vimeo.com/video/829310227?h=47849a81e3"
                />
              </div>
            </div>
          )}
        </div>

        <main className=" w-full h-max flex flex-col justify-start items-center  pt-12 gap-12">
          <div className="flex flex-col items-center justify-center font-Poppins">
            <span className="uppercase text-xl font-normal text-[#2C7CD1]">
              tatuga class
            </span>
            <span className=" text-2xl font-bold text-blue-900 mt-2">
              Manage Your Classrooms
            </span>
            <span className=" text-2xl font-bold text-blue-900">
              With Our Tools
            </span>
          </div>
          <div className="lg:w-full md:w-[95%] gap-8 md:flex-row flex-col  flex md:gap-5  lg:gap-10 items-center justify-center py-4 ">
            {cardData?.map((list, index) => {
              return (
                <div
                  key={index}
                  className="w-52 h-60 lg:h-64 md:h-60  rounded-lg drop-shadow-lg bg-white hover:bg-[#EDBA02] transition duration-200 ease-in-out
           hover:scale-110 hover:text-white text-blue-900 group  flex flex-col items-start justify-start font-Poppins p-6 gap-2"
                >
                  <div className="font-Poppins text-xl font-bold ">
                    {list.title}
                  </div>
                  <div className="w-36  h-2/4 relative mt-2 rounded-md overflow-hidden ">
                    <Image
                      alt="tatuga avatar"
                      priority
                      src={list.picture}
                      layout="fill"
                      placeholder="blur"
                      blurDataURL={list.imageProps.blurDataURL}
                      className="object-contain  object-center  transition duration-150  "
                    />
                  </div>
                  <div className="h-10 text-xs lg:relative  -bottom-4 leading-tight text-black group-hover:text-white font-semibold ">
                    {list.description}
                  </div>
                </div>
              );
            })}
          </div>
          <div
            ref={ref}
            className={`w-full   mt-10 h-full flex gap-10 font-Poppins 
             items-center justify-center item-group square   `}
            xyz="fade-100% up-1"
          >
            <div
              className={`flex flex-col justify-center w-20 md:w-80  items-center gap-5 text-right ${
                inView ? "xyz-in" : "xyz-out"
              } `}
            >
              <div className="">
                {usersNumber.isLoading ? (
                  <div>
                    <Skeleton variant="rectangular" width={80} height={100} />
                  </div>
                ) : (
                  <span className="font-Poppins text-right font-semibold text-5xl md:text-8xl text-white">
                    {inView && (
                      <NumberAnimated n={usersNumber?.data?.data?.userNumber} />
                    )}
                  </span>
                )}
              </div>

              <span className="font-Poppins text-right font-semibold text-xl text-white">
                Teachers
              </span>
            </div>
            <div className="h-80 w-[2px] bg-white"></div>
            <div
              className={`flex flex-col jjustify-center w-20 md:w-80  items-center gap-5 text-right ${
                inView ? "xyz-in" : "xyz-out"
              } `}
            >
              <div className="">
                {studentNumber.isLoading ? (
                  <div>
                    <Skeleton variant="rectangular" width={80} height={100} />
                  </div>
                ) : (
                  <span className="font-Poppins text-right font-semibold text-5xl md:text-8xl text-white">
                    {inView && (
                      <NumberAnimated
                        n={studentNumber?.data?.data?.studentNumber}
                      />
                    )}
                  </span>
                )}
              </div>

              <span className="font-Poppins text-right font-semibold text-xl text-white">
                Students
              </span>
            </div>
          </div>
        </main>
        <footer className="w-full flex items-center mt-10 justify-center relative">
          <div className="md:w-9/12 lg:w-6/12 w-11/12 text-lg font-Kanit text-white text-center">
            {footerData}
          </div>
        </footer>
      </Layout>
    </div>
  );
}

export default Index;

export async function getStaticProps(ctx) {
  const cardData = [
    {
      title: "No login required for student",
      picture:
        "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3064.PNG",
      description: " Students can submit their homework without logging in.",
    },
    {
      title: "Gamification in classroom",
      picture:
        "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3060.PNG",
      description:
        "Our platform incorporates gamification to make teaching a fantastic experience.",
    },
    {
      title: "Export your data to Excel",
      picture:
        "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3062.PNG",
      description:
        "With our platform, you can easily export your data to Excel",
    },
  ];

  const blurData = await Promise.all(
    cardData.map(async (item) => {
      const imageProps = await returnProps(item.picture);

      // This will return the image a well as the needed plaiceholder
      // info in the same object within the array 🤯
      return { ...item, imageProps };
    })
  );
  return {
    props: {
      cardData: blurData,
    },
  };
}
