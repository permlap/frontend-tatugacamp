import Image from "next/image";
import React, { useEffect, useState } from "react";

import { MdDelete } from "react-icons/md";
import { FcCheckmark, FcCancel } from "react-icons/fc";
import CreateClass from "../../components/form/createClass";
import { Popover } from "@headlessui/react";
import { useMutation, useQuery } from "react-query";
import { DeleteClassroom, GetAllClassrooms } from "../../service/classroom";
import * as animationData from "../../components/LoadingScreen.json";
import Lottie from "lottie-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FiSettings, FiArrowLeftCircle } from "react-icons/fi";
import Layout from "../../layouts/classroomLayout";
import * as teacherAnimation from "../../components/98349-teacher-in-classroom.json";
import { GetUser } from "../../service/user";
import Unauthorized from "../../components/error/unauthorized";

function Index() {
  const router = useRouter();
  const [access_token, setAccessToken] = useState();
  const [runFetchClassroom, setRunFetchClassroom] = useState(false);
  const [classroomState, setClassroomState] = useState();

  const user = useQuery(["user"], () => GetUser());

  const classrooms = useQuery(
    ["classrooms"],
    () =>
      GetAllClassrooms().then((res) => {
        setClassroomState((prev) => (prev = res?.data));
      }),
    {
      enabled: runFetchClassroom,
    }
  );
  useEffect(() => {
    if (router.query.access_token) {
      localStorage.setItem("access_token", router.query.access_token);
      const access_token = localStorage.getItem("access_token");
      if (user.error && !access_token) {
        console.log("redirect");
        router.push({
          pathname: "/auth/signIn",
        });
      }
    } else if (user.error && !access_token) {
      console.log("redirect");
      router.push({
        pathname: "/auth/signIn",
      });
    }
  }, [user.data?.status]);
  useEffect(() => {
    if (user.data !== "Unauthorized" && user.data !== undefined) {
      setRunFetchClassroom(true);
    }
  }, [user.data]);

  const deleteClassroom = useMutation(async (classroomid) => {
    const deleting = await DeleteClassroom(classroomid);
    classrooms.refetch();
  });

  if (user.isError) {
    return <Unauthorized user={user} />;
  }

  //handle open make sure to delete classroom
  const handleOpenClasssDeleted = (index) => {
    const newItems = classroomState.map((item, i) => {
      if (i === index) {
        return { ...item, selected: true };
      } else {
        return { ...item, selected: false };
      }
    });
    setClassroomState(newItems);
  };

  //handle make sure to cancel deleting classroom
  const handleCloseClasssDeleted = (index) => {
    const newItems = classroomState.map((item, i) => {
      if (i === index) {
        return { ...item, selected: false };
      } else {
        return { ...item, selected: false };
      }
    });
    setClassroomState(newItems);
  };

  // for passing data to sidebar
  const sideMenus = [
    {
      title: "โรงเรียน",
      icon: "🏫",
      url: "/classroom",
    },

    {
      title: "ตั้งค่า",
      icon: <FiSettings />,
      url: "/classroom/setting",
    },
    {
      title: "หน้าหลัก",
      icon: <FiArrowLeftCircle />,
      url: "/",
    },
  ];

  const style = {
    height: 500,
  };

  if (!user.data) {
    return <Unauthorized user={user} />;
  }

  return (
    <div className="bg-white w-full h-full font-Kanit">
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
          content="ห้องเรียนจาก Tatuga camp ที่จะพาคุณครูไปสู่การบริหารห้องเรียนอย่างสะดวกและสนุก กับ tatuga class"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>TaTuga class</title>
      </Head>

      <div
        className={`flex  w-full  bg-[url('/blob-scene-haikei.svg')] bg-no-repeat bg-fixed bg-cover ${
          classroomState?.[0] ? "h-full pb-60 md:pb-[30rem] " : "h-screen"
        } `}
      >
        <Layout user={user} sideMenus={sideMenus} />

        <div
          className={`flex justify-center items-center md:items-start    lg:items-center  w-full h-full`}
        >
          <div className="xl:w-full  h-max m-5  flex flex-col  justify-center items-center pb-14 ">
            <header className="mt-28 md:mt-2  rounded-lg   p-5 md:px-10 xl:px-20 w-max  relative     ">
              <div className=" w-full md:block flex items-center justify-center    bg-transparent">
                <div
                  className="xl:w-[35rem] w-40   md:w-96 p-20 flex flex-col items-center justify-center
                   text-left leading-[3.5rem] md:mt-32 lg:mt-20   md:ml-28 md:pl-10 py-5 rounded-lg 
                  h-10 md:h-max z-10 relative "
                >
                  <div
                    className="xl:text-6xl text-xl w-60 md:w-96 lg:w-[30rem] mt-20 md:mt-0   md:text-left md:text-2xl font-semibold  
                  font-Kanit tracking-wider  "
                  >
                    <span className="md:text-8xl text-5xl hover:text-[#2C7CD1] text-black duration-150 transition">
                      สร้าง
                    </span>
                    <span>ห้องเรียนของคุณได้ที่นี่</span>
                  </div>
                </div>
                <div className="absolute md:-top-20 lg:-top-20 lg:-left-36 ">
                  <Lottie animationData={teacherAnimation} style={style} />
                </div>
              </div>
              <div>
                <Popover className="relative">
                  {({ open }) => (
                    <>
                      <div className="lg:mt-20 md:mt-5 mt-20 w-full flex justify-center items-center  font-Kanit ">
                        <div className="flex gap-x-2 justify-center items-center ">
                          <span className="text-xl md:text-2xl font-bold text-[#2C7CD1] ">
                            กดเพื่อ
                          </span>
                          <Popover.Button
                            className={`
                ${open ? "" : "text-opacity-90"}
            bg-[#EDBA02] border-2 border-transparent border-solid text-md px-5 py-2 rounded-lg 
                font-bold font-Kanit text-white cursor-pointer
              active:border-black hover:scale-110 transition md:text-2xl duration-150 ease-in-out"`}
                          >
                            <span> สร้าง</span>
                          </Popover.Button>
                          <span className="text-xl  md:text-2xl  font-bold text-[#2C7CD1]">
                            ห้องเรียน
                          </span>
                        </div>
                      </div>
                      <Popover.Panel>
                        {({ close }) => (
                          <div className=" fixed top-0 right-0 left-0 bottom-0 m-auto righ z-20">
                            <CreateClass
                              close={close}
                              refetch={classrooms.refetch}
                            />
                          </div>
                        )}
                      </Popover.Panel>
                    </>
                  )}
                </Popover>
              </div>
            </header>

            {/* classrooms are here  */}
            <main
              className={`w-full h-max lg:pb-40 flex-col  
              md:flex-row md:flex-wrap items-start justify-center 
            lg:grid-cols-2 xl:grid-cols-3 xl:gap-x-5 gap-5 mt-14 
            ${classroomState?.[0] ? "flex" : "hidden"} `}
            >
              {classroomState?.map((classroom, index) => {
                return (
                  <div
                    key={index}
                    className=" h-48  w-full  md:w-60 md:h-max lg:w-60 xl:w-80 md:pb-3  border-2 border-solid 
                    rounded-3xl overflow-hidden relative bg-white flex flex-col md:block items-start justify-center "
                  >
                    <div className="text-right mt-2 ">
                      <dev className="text-3xl absolute right-4 top-3">
                        {!classroom.selected && (
                          <div
                            onClick={() => handleOpenClasssDeleted(index)}
                            role="button"
                            className="text-gray-700   hover:text-red-500 
                        cursor-pointer flex"
                          >
                            <MdDelete />
                          </div>
                        )}
                        {classroom.selected && (
                          <div className="flex gap-x-4">
                            <div
                              role="button"
                              onClick={() => {
                                deleteClassroom.mutate(classroom.id);
                              }}
                              className="hover:scale-110  transition duration-150 ease-in-out cursor-pointer "
                            >
                              <FcCheckmark />
                            </div>
                            <div
                              role="button"
                              onClick={() => {
                                handleCloseClasssDeleted(index);
                              }}
                              className="hover:scale-110  transition duration-150 ease-in-out cursor-pointer "
                            >
                              <FcCancel />
                            </div>
                          </div>
                        )}
                      </dev>
                    </div>
                    <div className="flex flex-col mt-0 pl-10 md:pl-5 md:mt-2 lg:mt-5 mb-10 ">
                      <span className="text-lg text-gray-600 font-light">
                        {classroom.level}
                      </span>
                      <span className="font-bold text-3xl  text-[#EDBA02]">
                        {classroom.title}
                      </span>
                      <span>{classroom.description}</span>
                    </div>
                    <div className="flex justify-center items-center  w-full lg:mt-5 ">
                      <button
                        onClick={() => {
                          localStorage.setItem("classroomId", classroom.id);
                          router.push({
                            pathname: `/classroom/${classroom.id}`,
                          });
                        }}
                        className="w-3/4 absolute md:relative bottom-2  h-9 mt-2 rounded-lg bg-[#2C7CD1] text-white font-sans font-bold
              text-md cursor-pointer hover:bg-[#FFC800] active:border-2 active:text-black active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid"
                      >
                        <span>🚪เข้าชั้นเรียน</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
