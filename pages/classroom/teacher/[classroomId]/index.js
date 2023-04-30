import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { GetOneClassroom } from "../../../../service/classroom";
import { FiArrowLeftCircle } from "react-icons/fi";
import Head from "next/head";
import FullScreenLoading from "../../../../components/loading/FullScreenLoading";
import { Popover } from "@headlessui/react";
import Layout from "../../../../layouts/classroomLayout";
import { GetAllStudents } from "../../../../service/students";
import Image from "next/image";
import { GetAllScoresClassroom } from "../../../../service/scores";
import UpdateScore from "../../../../components/form/updateScore";
import { GetUser } from "../../../../service/user";
import { Skeleton } from "@mui/material";
import Unauthorized from "../../../../components/error/unauthorized";

function Index() {
  const router = useRouter();
  const [loadedImages, setLoadedImages] = useState([]);
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

  useEffect(() => {
    setStudentRearrange(() => {
      return students?.data?.data.sort((a, b) => {
        return parseInt(a.number) - parseInt(b.number);
      });
    });
  }, [students?.data?.data]);

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
      url: `/classroom/teacher`,
    },
    {
      title: "ห้องเรียน",
      icon: "👨‍🏫",
      url: `#`,
    },
    {
      title: "มอบหมายงาน",
      icon: "🎒",
      url: `/classroom/teacher/${router.query.classroomId}/assignment`,
    },
    {
      title: "ข้อมูลการเข้าเรียน",
      icon: "🙌",
      url: `/classroom/teacher/${router.query.classroomId}/attendance`,
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

  if (!user.data || user.isError) {
    return <Unauthorized user={user} />;
  }

  //style animationLottie
  const style = {
    height: 280,
  };

  const handleLoadingComplete = (id) => {
    setLoadedImages((prevImages) => [...prevImages, id]);
  };

  return (
    <div className="bg-blue-50">
      <Layout sideMenus={sideMenus} />
      <Head>
        <title>classroom - {classroom.data?.data?.title}</title>
      </Head>
      <div className="flex  items-center justify-center ">
        <div className="w-full flex flex-col items-center justify-center  bg gap-10 h-full pb-40">
          {/* header section */}

          {/* main part */}
          <main className="w-full max-w-6xl h-full flex flex-col  ">
            {/* 
            students' avatar are here */}
            <div
              className="lg:w-full md:w-full max-w-7xl grid grid-cols-2 gap-y-4 items-center justify-center md:justify-start  
            md:grid md:grid-cols-4 lg:grid-cols-5 md:gap-x-12 md:gap-y-9 mt-10 place-items-center	"
            >
              <Popover>
                {({ open }) => (
                  <>
                    <Popover.Button>
                      <div className="w-40 h-36 flex flex-col items-center justify-center rounded-xl group relative cursor-pointer ">
                        <div
                          className="w-28 h-28 flex items-center justify-center blur-none group-hover:blur-sm  bg-[#EDBA02] border-4 border-solid border-white rounded-full drop-shadow-xl
                  group-hover:scale-110 transition duration-150 group-hover:border-2 overflow-hidden 
                "
                        >
                          <div className="relative w-24 h-24 scale-150 -">
                            <Image
                              src="https://storage.googleapis.com/tatugacamp.com/Avatar%20students/scoreAll-1.png"
                              layout="fill"
                              className="object-contain -translate-y-1"
                            />
                          </div>
                        </div>
                        <span
                          className="font-Kanit font-semibold text-lg group-hover:scale-100 scale-0 bg-white px-3 rounded-lg
                 transition duration-150 absolute"
                        >
                          ให้คะแนนห้อง
                        </span>
                      </div>
                    </Popover.Button>
                    <Popover.Panel>
                      {({ close }) => (
                        <UpdateScore
                          close={close}
                          classroomScore={true}
                          scores={scores.data}
                          students={students}
                        />
                      )}
                    </Popover.Panel>
                  </>
                )}
              </Popover>

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
                    const shortName = student.firstName.replace(
                      /^นาย|^นางสาว|^นาง|^เด็กชาย|^เด็กหญิง|^ด.ช.|^ด.ญ./,
                      ""
                    );
                    return (
                      <Popover key={student.id}>
                        {({ open }) => (
                          <div className="relative  md:block flex items-start justify-center">
                            <Popover.Button
                              onClick={() => {
                                document.body.style.overflow = "hidden";
                              }}
                              className="bg-transparent  border-none active:border-none appearance-none focus:outline-none"
                            >
                              <div
                                className="w-40 h-36 cursor-pointer  flex-col items-center justify-start flex hover:drop-shadow-md 
                       duration-200 rounded-2xl bg-white border-2 border-solid relative hover:bg-orange-100 transition drop-shadow-md"
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

                                {!loadedImages.includes(student.id) && (
                                  <div>
                                    <Skeleton
                                      variant="circular"
                                      width={96}
                                      height={96}
                                    />
                                  </div>
                                )}

                                <div className="w-24 h-24 relative overflow-hidden rounded-full mt-2 ">
                                  <Image
                                    src={student.picture}
                                    layout="fill"
                                    alt="student's avatar"
                                    className="object-cover scale-125 hover:scale-150 transition duration-150 translate-y-5"
                                    onLoad={() =>
                                      handleLoadingComplete(student.id)
                                    }
                                  />
                                </div>

                                <div className="font-Kanit text-xl flex items-center w-max  justify-start gap-2">
                                  <div className=" font-semibold text-gray-700 w-5 h-5 flex items-center justify-center  rounded-md">
                                    {student.number}
                                  </div>
                                  <span className="text-md">{shortName}</span>
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
    </div>
  );
}

export default Index;
