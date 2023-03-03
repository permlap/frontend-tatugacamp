import Image from "next/image";
import React, { useEffect, useState } from "react";

import { MdDelete } from "react-icons/md";
import { FcCheckmark, FcCancel } from "react-icons/fc";
import CreateClass from "../../components/form/createClass";
import SearchAutoComplete from "../../components/search/searchAutoComplete";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useMutation, useQuery } from "react-query";
import {
  DeleteClassroom,
  GetAllClassrooms,
  GetUser,
} from "../../service/service";
import * as animationData from "../../components/LoadingScreen.json";
import Lottie from "lottie-react";
import Head from "next/head";
import Layout from "../../components/layout";
import Link from "next/link";
import SidebarClassroom from "../../components/sidebar/sidebarClassroom";
import { useRouter } from "next/router";
function Index() {
  const router = useRouter();
  const [access_token, setAccess_token] = useState();
  const [classroomState, setClassroomState] = useState();
  const classrooms = useQuery(["classroom"], () =>
    GetAllClassrooms().then((res) => {
      setClassroomState((prev) => (prev = res?.data));
    })
  );
  const user = useQuery(["user"], () => GetUser());
  const deleteClassroom = useMutation(async (classroomid) => {
    const deleting = await DeleteClassroom(classroomid);
    classrooms.refetch();
  });

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    setAccess_token(access_token);
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
  if (user.data === "Unauthorized") {
    router.push("/auth/signIn");
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
  console.log(classroomState);
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
      <div className="flex w-full h-full ">
        <SidebarClassroom user={user} />
        <div className="flex justify-end items-center w-full h-full ">
          <div className="bg-white w-3/4 h-max m-5 rounded-md flex flex-col justify-start items-center pb-14 ">
            <header className="mt-5">
              <div className="flex justify-center items-center gap-x-2  z-20 relative"></div>
            </header>

            <div className=" w-full flex  relative mt-20  bg-white">
              <div className="w-[30rem] ml-20">
                <span className="text-7xl font-Kanit tracking-wider leading-snug">
                  สร้างห้องเรียนของคุณได้ที่นี้
                </span>
              </div>
              <div className=" w-96 h-96 absolute right-40 -top-20">
                <Image
                  src="/arrayAround/Brave.png"
                  layout="fill"
                  className="object-contain"
                  alt="some picture at headers"
                />
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

            <main
              className="w-[90%] h-max lg:pb-40 grid-cols-1 grid md:grid-cols-2 
            lg:grid-cols-2 xl:grid-cols-3 gap-5 mt-14"
            >
              {classroomState?.map((list, index) => {
                return (
                  <div
                    key={index}
                    className=" h-72 md:w-64 md:h-max lg:w-80 md:pb-3  border-2 border-solid 
                    rounded-3xl overflow-hidden relative"
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
                      <div className="w-full bg-gray-400 h-[1.5px] absolute top-16"></div>
                      <div className="w-14 h-14 relative rounded-full overflow-hidden ml-5 mt-10">
                        <Image
                          src="https://storage.googleapis.com/tatugacamp.com/UserId%3A63f84bd31ecabb5499898f1c-UUID%3A35e8fd8d-d6c7-414f-84d2-e8b15e77d96c-DATE%3A1677217747662-121461397_1776318822509483_5475911820922048867_n.jpg"
                          layout="fill"
                          className="object-contain"
                        />
                      </div>
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
                            query: { access_token: access_token },
                          })
                        }
                        className="w-3/4 absolute md:relative bottom-2  h-9 mt-2 rounded-lg bg-[#2C7CD1] text-white font-sans font-bold
              text-md cursor-pointer hover:bg-[#FFC800] active:border-2 active:text-black active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid"
                      >
                        <span>เข้าชั้นเรียน</span>
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
