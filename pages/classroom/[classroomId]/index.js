import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import SidebarClassroom from "../../../components/sidebar/sidebarClassroom";
import { GetOneClassroom, GetUser } from "../../../service/service";
import {
  FiHome,
  FiSettings,
  FiChevronsLeft,
  FiChevronsRight,
  FiArrowLeftCircle,
} from "react-icons/fi";
import Head from "next/head";
import Loading from "../../../components/loading/loading";
import FullScreenLoading from "../../../components/loading/FullScreenLoading";
import { Popover, Transition } from "@headlessui/react";
import Layout from "../../../layouts/classroomLayout";
import CreateStudent from "../../../components/form/createStudent";
import { GetAllStudents } from "../../../service/students";
import Lottie from "lottie-react";
import * as ClassroomAnimation from "../../../components/90714-online-learning.json";
import { BsPeopleFill } from "react-icons/bs";
import { AiTwotoneStar } from "react-icons/ai";
import Image from "next/image";
function Index() {
  const router = useRouter();
  const user = useQuery(["user"], () => GetUser());
  const [studentsRearrange, setStudentRearrange] = useState(
    students?.data?.data
  );
  const students = useQuery(["students"], () =>
    GetAllStudents({ classroomId: router.query.classroomId })
  );

  useEffect(() => {
    students.refetch();
    setStudentRearrange(() => {
      return students?.data?.data.sort((a, b) => {
        return parseInt(a.number) - parseInt(b.number);
      });
    });
  }, [students?.data?.data]);

  const classroom = useQuery(
    ["classroom"],
    () => GetOneClassroom({ params: router.query.classroomId }),

    { enabled: false }
  );

  const classroomCode =
    classroom.data?.data?.classroomCode.slice(0, 3) +
    "-" +
    classroom.data?.data?.classroomCode.slice(3);

  useEffect(() => {
    if (user.data === "Unauthorized") {
      router.push("/auth/signIn");
    }
    if (router.isReady) {
      console.log("router is ready", router.isReady);
      classroom.refetch();
    }
  }, [router.isReady]);

  useEffect(() => {
    if (classroom?.data?.response?.data.statusCode === 401) {
      router.push("/auth/signIn");
    }
  }, []);
  // for passing data to sidebar
  const sideMenus = [
    {
      title: "ห้องเรียน",
      icon: "👨‍🏫",
      url: `#`,
    },
    {
      title: "คะแนน",
      icon: "🌟",
      url: "#",
    },
    {
      title: "เครื่องมือ",
      icon: "🧰",
      url: "#",
    },
    {
      title: "ตั้งค่า",
      icon: "🔧",
      url: "#",
    },
    {
      title: "Go back",
      icon: <FiArrowLeftCircle />,
      url: `/classroom`,
    },
  ];
  if (!router.isReady) {
    return <FullScreenLoading />;
  }
  if (classroom?.data?.response?.data.statusCode === 400) {
    return (
      <div className="flex w-full h-screen justify-center items-center font-sans">
        <h1>404 - Page Not Found😢</h1>
      </div>
    );
  }

  //style animationLottie
  const style = {
    height: 280,
  };

  return (
    <>
      <Head>
        <title>classroom - {classroom.data?.data?.title}</title>
      </Head>
      <div className="flex ">
        <Layout user={user} sideMenus={sideMenus} />
        <div className="w-full flex flex-col items-center gap-10 h-full">
          {/* header section */}
          <header
            className="w-3/4 rounded-3xl bg-transparent mt-32 flex gap-x-4  bg-blue-200 h-40 
          items-center justify-start relative  "
          >
            <div
              className="flex flex-col items-center justify-center gap-y-3 absolute top-[5rem] right-[2rem] z-10 
            p-2 "
            >
              <span className="font-Kanit font-semibold text-2xl bg-white rounded-md px-4 drop-shadow-md  text-gray-800">
                Code รหัสห้องเรียน
              </span>

              <Popover className="relative flex items-center justify-center">
                {({ open }) => (
                  <>
                    <Popover.Button className="bg-transparent border-none active:border-none">
                      <div
                        aria-label="ขยายเพื่อดูรหัสห้องเรียน"
                        className={`
                      w-max p-3 bg-[#EDBA02] rounded-xl cursor-pointer
             hover:scale-110 transition duration-200 ease-in-out`}
                      >
                        <span className="font-sans font-bold text-2xl text-white">
                          {classroomCode}
                        </span>
                      </div>
                    </Popover.Button>
                    <Popover.Panel>
                      {({ close }) => (
                        <div
                          className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto
                      bg-white/10 backdrop-blur-sm"
                          onClick={() => close()}
                        >
                          <div
                            className="w-max p-3 h-max fixed right-0 left-0 top-0 bottom-0 m-auto bg-[#EDBA02] rounded-xl cursor-pointer
            hover:scale-110 transition duration-200 ease-in-out"
                          >
                            <span className="font-sans font-bold text-9xl text-white">
                              {classroomCode}
                            </span>
                          </div>
                        </div>
                      )}
                    </Popover.Panel>
                  </>
                )}
              </Popover>
            </div>

            {/* text in header */}
            <div className="font-Kanit text-2xl font-light ml-10 w-80 h-max ">
              <div>
                <span className="mr-2">Welcome to</span>
                <span className="text-4xl font-semibold uppercase">
                  {classroom.data?.data?.title}
                </span>
              </div>
              <div className="mt-2 ">
                <span className="font-Kanit font-light text-base mr-5 ">
                  {classroom.data?.data?.description}
                </span>
                <span className="font-Kanit font-normal px-2 tracking-wider text-white text-base bg-[#EDBA02] p-1 rounded-xl">
                  {classroom.data?.data?.level}
                </span>
              </div>
            </div>
            <div className="absolute right-0 -top-20">
              <Lottie animationData={ClassroomAnimation} style={style} />
            </div>
          </header>

          {/* main part */}
          <main className="w-3/4 h-full flex flex-col">
            <div className="flex flex-col gap-3">
              <div className="font-sans font-normal tracking-wide flex items-center gap-5 text-gray-400">
                <span>Overview</span>
                <Popover className="relative s">
                  {({ open }) => (
                    <>
                      <Popover.Button
                        onClick={() => students.refetch()}
                        className="bg-transparent border-none"
                      >
                        <div
                          aria-label="สร้างผู้เรียนของคุณ"
                          className={`
                      w-max p-3 bg-[#2C7CD1] rounded-xl cursor-pointer
             hover:scale-110 transition duration-200 ease-in-out`}
                        >
                          <span className="font-sans font-bold text-sm text-white">
                            สร้างผู้เรียน 👨‍🎓
                          </span>
                        </div>
                      </Popover.Button>
                      <Popover.Panel>
                        {({ close }) => <CreateStudent close={close} />}
                      </Popover.Panel>
                    </>
                  )}
                </Popover>
              </div>

              <div className="grid grid-cols-3 w-full ">
                <div className="w-5/6 py-1 h-16 bg-[#F2CC5B] flex items-center justify-start gap-5  rounded-lg text-white">
                  <div className="bg-white/40 backdrop-blur-sm p-3 rounded-lg ml-5">
                    <BsPeopleFill size={20} />
                  </div>
                  <div className="flex items-start justify-center flex-col font-sans">
                    <span className="font-bold text-2xl">
                      {students?.data?.data?.length}
                    </span>
                    <span className="text-sm font-medium">students</span>
                  </div>
                </div>
                <div className="w-5/6  py-1 h-16 bg-[#503E9D] flex items-center justify-start gap-5  rounded-lg text-white">
                  <div className="bg-white/40 backdrop-blur-sm p-3 rounded-lg ml-5">
                    <AiTwotoneStar size={20} />
                  </div>
                  <div className="flex items-start justify-center flex-col font-sans">
                    <span className="font-bold text-2xl">30 points</span>
                    <span className="text-sm font-medium">Overall score</span>
                  </div>
                </div>
                <div className="w-5/6  py-1 h-16 bg-[#EB6297] flex items-center justify-start gap-5  rounded-lg text-white">
                  <div className="bg-white/40 backdrop-blur-sm p-3 rounded-lg ml-5">
                    🥇
                  </div>
                  <div className="flex items-start justify-center flex-col font-sans">
                    <span className="font-bold text-2xl">Permlap 01</span>
                    <span className="text-sm font-medium">
                      the highest score
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* 
            students' avatar are here */}
            <div className="w-full flex flex-wrap gap-x-16 gap-y-9 mt-5">
              {studentsRearrange?.map((list) => {
                return (
                  <div
                    className="w-40 h-36  flex-col items-center justify-start flex"
                    key={list.id}
                  >
                    <div className="w-24 h-24 relative overflow-hidden rounded-full mt-2 bg-white">
                      <Image
                        src={list.picture}
                        layout="fill"
                        className="object-cover"
                      />
                    </div>
                    <div className="font-Kanit text-xl">
                      <span className=" bg-blue-500  rounded-full">
                        {list.number}
                      </span>
                      {list.firstName}
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default Index;
