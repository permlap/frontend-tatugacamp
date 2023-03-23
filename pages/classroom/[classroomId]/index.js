import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import SidebarClassroom from "../../../components/sidebar/sidebarClassroom";
import { GetOneClassroom } from "../../../service/classroom";
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
import { GetAllScoresClassroom } from "../../../service/scores";
import UpdateScore from "../../../components/form/updateScore";
import UpdateClass from "../../../components/form/updateClass";
import { GetUser } from "../../../service/user";
import { Skeleton } from "@mui/material";
function Index() {
  const router = useRouter();
  const [skeletion, setSkeletion] = useState(["1", "2", "3", "4"]);
  const user = useQuery(["user"], () => GetUser());
  const students = useQuery(
    ["students"],
    () => GetAllStudents({ classroomId: router.query.classroomId }),
    { enabled: false }
  );
  const classroom = useQuery(
    ["classroom"],
    () => GetOneClassroom({ params: router.query.classroomId }),
    { enabled: false }
  );
  const scores = useQuery(
    ["scores"],
    () => GetAllScoresClassroom({ classroomId: router.query.classroomId }),
    { enabled: false }
  );
  const [studentsRearrange, setStudentRearrange] = useState(
    students?.data?.data
  );

  //check whether there is authorrized acccess or not
  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
      router.push("/auth/signIn");
    }
    if (user.data === "Unauthorized") {
      router.push("/auth/signIn");
    }
    if (user.isFetching === false) {
      if (!user.data) {
        router.push("/auth/signIn");
      }
    }
    if (router.isReady) {
      classroom.refetch();
      students.refetch();
      scores.refetch();
    }
  }, [router.isReady, user.data === "Unauthorized"]);

  // find totalPoints in the classroom
  const totalPoints = students?.data?.data?.reduce(
    (acc, obj) => acc + obj.score.totalPoints,
    0
  );

  //create new copy of students data
  const coppyStudentsData = students?.data?.data?.slice();

  //rearrange copy studens data to the first array is the highest score
  const highestScorePlayer = coppyStudentsData?.sort(
    (a, b) => b.score.totalPoints - a.score.totalPoints
  )[0];

  useEffect(() => {
    setStudentRearrange(() => {
      return students?.data?.data.sort((a, b) => {
        return parseInt(a.number) - parseInt(b.number);
      });
    });
  }, [students?.data?.data]);

  const handlePassingstudents = (students) => {
    setStudentRearrange(students);
  };

  const classroomCode =
    classroom.data?.data?.classroomCode.slice(0, 3) +
    "-" +
    classroom.data?.data?.classroomCode.slice(3);

  useEffect(() => {
    if (classroom?.data?.response?.data.statusCode === 401) {
      router.push("/auth/signIn");
    }
  }, []);
  // for passing data to sidebar
  const sideMenus = [
    {
      title: "โรงเรียน",
      icon: "🏫",
      url: `/classroom`,
    },
    {
      title: "ห้องเรียน",
      icon: "👨‍🏫",
      url: `#`,
    },
    {
      title: "timer",
      icon: "⏲️",
      url: `/teacher-tools/timer`,
    },

    {
      title: "หน้าหลัก",
      icon: <FiArrowLeftCircle />,
      url: `/`,
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

  //covert date
  const date = new Date(classroom.data?.data?.createAt);

  const formattedDate = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <Head>
        <title>classroom - {classroom.data?.data?.title}</title>
      </Head>
      <div className="flex  ">
        <Layout user={user} sideMenus={sideMenus} />

        <div className="w-full flex flex-col items-center justify-center  gap-10 h-full pb-40">
          {/* header section */}
          <header
            className="w-[90%] max-w-6xl rounded-3xl mt-32 flex  flex-col-reverse md:flex-row md:gap-x-4 z-10
             bg-blue-200 md:h-52 lg:h-40 
          items-center justify-start relative  "
          >
            <Popover>
              {({ open }) => (
                <>
                  <Popover.Button
                    className="absolute top-4 left-3 text-2xl text-gray-500 cursor-pointer
border-none flex items-center justify-center hover:animate-spin bg-transparent animate-none 	"
                  >
                    <div className="flex items-center justify-center">
                      <FiSettings />
                    </div>
                  </Popover.Button>
                  <Popover.Panel>
                    {({ close }) => (
                      <UpdateClass
                        close={close}
                        classroom={classroom?.data?.data}
                        refetch={classroom.refetch}
                      />
                    )}
                  </Popover.Panel>
                </>
              )}
            </Popover>

            <div
              className="flex flex-col items-center justify-center gap-y-3 static  md:absolute top-[5rem] right-[2rem] z-10 
            p-2 "
            >
              <span className="font-Kanit font-semibold text-2xl bg-transparent md:bg-white rounded-md px-4 drop-shadow-md  text-gray-800">
                Code รหัสห้องเรียน
              </span>

              <Popover className="relative flex items-center justify-center">
                {({ open }) => (
                  <>
                    <Popover.Button className="bg-transparent border-none active:border-none ">
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
                          className="w-full h-full fixed  overflow-hidden right-0 left-0 top-0 bottom-0 m-auto
                      bg-white/30 backdrop-blur-md"
                          onClick={() => close()}
                        >
                          <div
                            className="w-5/6 md:w-max p-3 h-max fixed right-0 text-center left-0 top-0 bottom-0 m-auto bg-[#EDBA02] rounded-xl cursor-pointer
            hover:scale-110 transition duration-200 ease-in-out"
                          >
                            <span className="font-sans font-bold  text-3xl md:text-9xl xl:text-[15rem] text-white md:px-40">
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
            <div className="font-Kanit text-2xl font-light md:ml-10 m-2 md:w-80 lg:w-full  md:h-max md:block flex flex-col items-center justify-center">
              <div className="flex md:block items-center justify-center w-full flex-col">
                <span className="mr-2 md:block hidden">Welcome to</span>
                <div className="mr-2 md:hidden block">Welcome to</div>
                <span className="text-4xl font-semibold text-center md:text-left uppercase">
                  {classroom.data?.data?.title}
                </span>
              </div>
              <div className="mt-2  md:flex">
                <span className="font-Kanit font-light text-base mr-5 ">
                  {classroom.data?.data?.description}
                </span>
                <span className="font-Kanit font-normal px-2 tracking-wider text-white text-base bg-[#EDBA02] p-1 rounded-xl">
                  {classroom.data?.data?.level}
                </span>
                <span className="text-sm ml-5 uppercase hidden  md:block">
                  create at {formattedDate}
                </span>
                <div className="text-sm ml-5 uppercase md:hidden block mt-2">
                  create at {formattedDate}
                </div>
              </div>
            </div>
            <div className="absolute right-0 -top-20 hidden md:block  ">
              <Lottie animationData={ClassroomAnimation} style={style} />
            </div>
          </header>

          {/* main part */}
          <main className="w-full max-w-6xl h-full flex flex-col  ">
            <div className="flex flex-col gap-3 md:pl-5 lg:pl-0  items-center justify-center md:items-start">
              <div className="font-sans font-normal tracking-wide flex items-center gap-5 pl-5 md:pl-0 text-gray-400">
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
                        {({ close }) => (
                          <div className=" fixed top-0 right-0 left-0 bottom-0 m-auto righ z-10">
                            <CreateStudent
                              close={close}
                              handlePassingstudents={handlePassingstudents}
                            />
                          </div>
                        )}
                      </Popover.Panel>
                    </>
                  )}
                </Popover>
              </div>

              <div className="grid md:grid-cols-3 grid-cols-2 w-[95%] md:w-full gap-2 md:gap-0 ">
                <div
                  className="md:w-5/6 w-full  py-1 h-16 bg-[#F2CC5B] flex items-center 
                justify-start gap-2  rounded-lg text-white"
                >
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
                <div className="md:w-5/6 w-full   py-1 h-16 bg-[#503E9D] flex items-center justify-start gap-5  rounded-lg text-white">
                  <div className="bg-white/40 backdrop-blur-sm p-3 rounded-lg ml-5">
                    <AiTwotoneStar size={20} />
                  </div>
                  <div className="flex items-start justify-center flex-col font-sans">
                    <span className="font-bold text-2xl"></span>
                    <span className="text-sm font-medium text-gray-200">
                      Tasks progress incoming
                    </span>
                  </div>
                </div>
                <div
                  className="md:w-5/6 w-full col-span-2 md:col-span-1
                  py-1 h-16 bg-[#EB6297] flex items-center md:justify-start justify-center gap-5  rounded-lg text-white"
                >
                  <div className="bg-white/40 backdrop-blur-sm p-3 rounded-lg ml-5">
                    🥇
                  </div>
                  <div className="flex items-start justify-center flex-col font-sans">
                    <span className="font-bold text-2xl">
                      {highestScorePlayer?.firstName}
                    </span>
                    <span className="text-sm font-medium">
                      the highest score
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 
            students' avatar are here */}
            <div
              className="w-full max-w-7xl grid grid-cols-2 items-center justify-center md:justify-start  
            md:flex md:flex-wrap md:gap-x-12 md:gap-y-9 mt-10 "
            >
              {students.isLoading
                ? skeletion.map((number) => {
                    return (
                      <Skeleton key={number} variant="rounded">
                        <button className="bg-transparent border-none active:border-none appearance-none focus:outline-none">
                          <div
                            className="w-40 h-36 cursor-pointer  flex-col items-center justify-start flex hover:drop-shadow-md 
                       duration-200 rounded-2xl bg-white relative hover:bg-orange-100 transition drop-shadow-md"
                          >
                            <div
                              className={`absolute w-10 h-10 rounded-full    ring-2 ring-white
                      flex justify-center items-center font-sans font-bold text-xl z-10 text-white right-5 top-5`}
                            ></div>
                            <div className="w-24 h-24 relative overflow-hidden rounded-full mt-2 bg-white"></div>
                            <div className="font-Kanit text-xl flex items-center justify-start gap-2">
                              <div className=" bg-blue-500 font-semibold text-white w-5 h-5 flex items-center justify-center  rounded-md"></div>
                            </div>
                          </div>
                        </button>
                      </Skeleton>
                    );
                  })
                : studentsRearrange?.map((student) => {
                    return (
                      <Popover key={student.id}>
                        {({ open }) => (
                          <div className="relative md:block flex items-start justify-center">
                            <Popover.Button className="bg-transparent  border-none active:border-none appearance-none focus:outline-none">
                              <div
                                className="w-40 h-36 cursor-pointer  flex-col items-center justify-start flex hover:drop-shadow-md 
                       duration-200 rounded-2xl bg-white relative hover:bg-orange-100 transition drop-shadow-md"
                                key={student.id}
                              >
                                <div
                                  className={`absolute w-10 h-10 rounded-full   ${
                                    student.score.totalPoints < 0
                                      ? "bg-red-600"
                                      : "bg-[#EDBA02] "
                                  } ring-2 ring-white
                      flex justify-center items-center font-sans font-bold text-xl z-10 text-white right-5 top-5`}
                                >
                                  {student.score.totalPoints}
                                </div>
                                <div className="w-24 h-24 relative overflow-hidden rounded-full mt-2 bg-white">
                                  <Image
                                    src={student.picture}
                                    layout="fill"
                                    alt="student's avatar"
                                    className="object-cover scale-150 translate-y-8"
                                  />
                                </div>
                                <div className="font-Kanit text-xl flex items-center justify-start gap-2">
                                  <div className=" bg-blue-500 font-semibold text-white w-5 h-5 flex items-center justify-center  rounded-md">
                                    {student.number}
                                  </div>
                                  {student.firstName}
                                </div>
                              </div>
                            </Popover.Button>
                            <Popover.Panel>
                              {({ close }) => (
                                <UpdateScore
                                  close={close}
                                  student={student}
                                  scores={scores.data}
                                  students={students}
                                  refetchScores={scores.refetch}
                                />
                              )}
                            </Popover.Panel>
                          </div>
                        )}
                      </Popover>
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
