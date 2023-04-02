import React from "react";
import Layout from "../../components/layout";
import Image from "next/image";
import Lottie from "lottie-react";
import * as teacherAnimation from "../../components/98349-teacher-in-classroom.json";
import { useRouter } from "next/router";

function Index() {
  const router = useRouter();
  const style = {
    height: 800,
  };
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
        "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3063.PNG",
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
  return (
    <div className="bg-[url('/blob-scene-haikei.svg')] bg-no-repeat bg-fixed  bg-cover pb-20">
      <Layout>
        <header className="w-full max-w-9xl   h-max  flex justify-between items-center gap-12 font-sans">
          <div className="lg:w-max lg:max-w-4xl bg-transparent lg:ml-5 xl:pl-10 p-10 gap-2 flex flex-col items-start justify-center ">
            <div className="lg:w-[25rem]  flex gap-2 items-center justify-center  ">
              <div className="text-xl w-full font-Kanit font-bold text-blue-900">
                สำหรับนักเรียน
              </div>
              <input
                className="bg-blue-200  appearance-none border-none border-gray-200 rounded w-full py-2 px-4  
              leading-tight focus:outline-none focus:bg-blue-400 focus:border-2 focus:right-4 placeholder:text-md placeholder:font-Kanit
              placeholder:text-black placeholder:font-medium focus:placeholder:text-white text-black focus:text-white font-sans font-semibold "
                type="number"
                name="description"
                placeholder="รหัสห้องเรียน"
                maxLength="6"
              />
              <button
                className="w-40  h-9  rounded-full bg-[#EDBA02] text-white font-sans font-bold
              text-md cursor-pointer hover: active:border-2  active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid"
              >
                เข้าร่วม
              </button>
            </div>
            <div className="mt-5">
              <span className="font-medium text-gray-400 text-xl">
                welcome to
              </span>
            </div>
            <div className="flex flex-col w-full gap-5">
              <span className="font-Poppins font-bold  text-[#2C7CD1] text-8xl">
                TaTuga Class
              </span>
              <span className="text-[#2C7CD1] text-5xl font-bold font-Poppins relative z-10 ">
                Classroom Management for Everyone
              </span>
            </div>
            <div className="mt-1 font-Kanit text-lg w-3/4 leading-tight">
              <span className="text-blue-900">
                จัดการชั้นเรียนและบริหารห้องเรียนอย่างมีประสิทธิภาพ สะดวก และ
                รวดเร็ว - tatuga class
              </span>
            </div>
            <div className="flex items-center justify-center gap-5 mt-10 ">
              <div className="text-xl font-Kanit font-bold text-blue-900">
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
          <div className="w-2/4 h-96 flex items-center justify-center relative ">
            <div className="absolute -left-56 ">
              <Lottie animationData={teacherAnimation} style={style} />
            </div>
          </div>
        </header>

        <main className=" w-full h-max flex flex-col justify-start items-center pt-12 gap-12">
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
          <div className="w-full  flex gap-10 items-center justify-center py-4 ">
            {cardData.map((list, index) => {
              return (
                <div
                  key={index}
                  className="w-52 h-64  rounded-lg drop-shadow-lg bg-white hover:bg-[#EDBA02] transition duration-200 ease-in-out
           hover:scale-110 hover:text-white text-blue-900 group  flex flex-col items-start justify-start font-Poppins p-6 gap-2"
                >
                  <div className="font-Poppins text-xl font-bold ">
                    {list.title}
                  </div>
                  <div className="w-3/4  h-2/4 relative mt-2 ">
                    <Image
                      src={list.picture}
                      layout="fill"
                      className="object-contain object-left  transition duration-150 "
                    />
                  </div>
                  <div className="h-10 text-xs relative -bottom-4 leading-tight text-black group-hover:text-white font-semibold ">
                    {list.description}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
        <footer></footer>
      </Layout>
    </div>
  );
}

export default Index;
