import Image from "next/image";
import React, { useEffect, useState } from "react";

import { MdDelete } from "react-icons/md";
import { FcCheckmark, FcCancel } from "react-icons/fc";
import CreateClass from "../../components/form/createClass";
import { Popover, Transition } from "@headlessui/react";
import { useMutation, useQuery } from "react-query";
import {
  DeleteClassroom,
  GetAllClassrooms,
  GetUser,
} from "../../service/service";
import * as animationData from "../../components/LoadingScreen.json";
import Lottie from "lottie-react";
import Head from "next/head";

import { useRouter } from "next/router";
import {
  FiHome,
  FiGrid,
  FiSettings,
  FiChevronsLeft,
  FiChevronsRight,
  FiArrowLeftCircle,
} from "react-icons/fi";
import Layout from "../../layouts/classroomLayout";

function Index() {
  const router = useRouter();
  const [access_token, setAccess_token] = useState();
  const [classroomState, setClassroomState] = useState();
  const classrooms = useQuery(["classrooms"], () =>
    GetAllClassrooms().then((res) => {
      setClassroomState((prev) => (prev = res?.data));
    })
  );
  const user = useQuery(["user"], () => GetUser());
  const deleteClassroom = useMutation(async (classroomid) => {
    const deleting = await DeleteClassroom(classroomid);
  });

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    setAccess_token(access_token);
    if (user.data === "Unauthorized") {
      router.push("/auth/signIn");
    }
  }, []);

  if (user.isLoading) {
    return (
      <div className="fixed z-50 flex items-center justify-center w-screen h-full top-[0%] left-[0%] mt-[0px] bg-white">
        <Lottie
          animationData={animationData}
          height={200}
          loop={true}
          width={200}
        />
      </div>
    );
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
      title: "หน้าหลัก",
      icon: "🏫",
      url: "/classroom",
    },

    {
      title: "ตั้งค่า",
      icon: <FiSettings />,
      url: "/classroom/setting",
    },
    {
      title: "Go back",
      icon: <FiArrowLeftCircle />,
      url: "/",
    },
  ];

  return (
    <div className="bg-white w-full h-full font-Kanit">
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="description"
          content="oneline taboo game for students who wants to play them online เกมส์ทาบู ทายคำศัพท์ จาก TaTuga camp"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>TaTuga class</title>
      </Head>
      <div className="flex  w-full bg-[url('/blob-scene-haikei.svg')] bg-no-repeat bg-fixed bg-cover  ">
        <Layout user={user} sideMenus={sideMenus} />
        <div
          className={`flex justify-center  ${
            classroomState?.[0] ? "md:items-start" : "md:items-center"
          }  lg:items-cente bg-transparent w-full`}
        >
          <div className="xl:w-full  h-max m-5  flex flex-col  justify-center items-center pb-14">
            <header className="mt-5 bg-white rounded-lg drop-shadow-md p-5 md:px-10 xl:px-20 ">
              <div className=" w-full flex items-center justify-center  relative  bg-transparent">
                <div className="xl:w-[40rem] md:w-96 text-center ">
                  <span className="xl:text-7xl md:text-2xl font-Kanit tracking-wider leading-snug">
                    สร้างห้องเรียนของคุณได้ที่นี้ 👨‍🏫
                  </span>
                </div>
              </div>
              <div className="">
                <Popover className="relative">
                  {({ open }) => (
                    <>
                      <div className="mt-20 w-full flex justify-center items-center  font-Kanit ">
                        <div className="flex gap-x-2 justify-center items-center ">
                          <span className="text-xl font-bold text-[#2C7CD1] ">
                            กดเพื่อ
                          </span>
                          <Popover.Button
                            className={`
                ${open ? "" : "text-opacity-90"}
            bg-[#EDBA02] border-2 border-transparent border-solid text-md px-5 py-2 rounded-lg 
                font-bold font-Kanit text-white cursor-pointer
              active:border-black hover:scale-110 transition duration-150 ease-in-out"`}
                          >
                            <span> สร้าง</span>
                          </Popover.Button>
                          <span className="text-xl font-bold text-[#2C7CD1]">
                            ห้องเรียน
                          </span>
                        </div>
                      </div>
                      <Popover.Panel>
                        {({ close }) => (
                          <CreateClass
                            close={close}
                            refetch={classrooms.refetch}
                          />
                        )}
                      </Popover.Panel>
                    </>
                  )}
                </Popover>
              </div>
            </header>
            <main
              className={`w-full h-max lg:pb-40 flex-col  
              md:flex-row md:flex-wrap items-start justify-center 
            lg:grid-cols-2 xl:grid-cols-3 xl:gap-x-5 gap-5 mt-14 
            ${classroomState?.[0] ? "flex" : "hidden"} `}
            >
              {classroomState?.map((list, index) => {
                return (
                  <div
                    key={index}
                    className=" h-72 md:w-60 md:h-max lg:w-60 xl:w-80 md:pb-3  border-2 border-solid 
                    rounded-3xl overflow-hidden relative bg-white"
                  >
                    <div className="text-right mt-2 ">
                      <dev className="text-3xl absolute right-4 top-3">
                        {!list.selected && (
                          <div
                            onClick={() => handleOpenClasssDeleted(index)}
                            role="button"
                            className="text-gray-700   hover:text-red-500 
                        cursor-pointer flex"
                          >
                            <MdDelete />
                          </div>
                        )}
                        {list.selected && (
                          <div className="flex gap-x-4">
                            <div
                              role="button"
                              onClick={() => {
                                deleteClassroom.mutate(list.id);
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
                      {/* <div className="w-full bg-gray-400 h-[1.5px] absolute top-16"></div> */}
                      {/* <div className="w-14 h-14 relative rounded-full overflow-hidden ml-5 mt-10">
                        <Image
                          src="https://storage.googleapis.com/tatugacamp.com/UserId%3A63f84bd31ecabb5499898f1c-UUID%3A35e8fd8d-d6c7-414f-84d2-e8b15e77d96c-DATE%3A1677217747662-121461397_1776318822509483_5475911820922048867_n.jpg"
                          layout="fill"
                          className="object-contain"
                        />
                      </div> */}
                    </div>
                    <div className="flex flex-col mt-4 md:mt-2 lg:mt-5 ml-5 ">
                      <span className="text-lg text-gray-600 font-light">
                        {list.level}
                      </span>
                      <span className="font-bold text-3xl  text-[#EDBA02]">
                        {list.title}
                      </span>
                      <span>{list.description}</span>
                    </div>
                    <div className="flex justify-center items-center lg:mt-5 ">
                      <button
                        onClick={() =>
                          router.push({
                            pathname: `/classroom/${list.id}`,
                          })
                        }
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
