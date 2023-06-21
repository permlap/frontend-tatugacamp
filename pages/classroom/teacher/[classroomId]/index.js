import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { GetOneClassroom } from "../../../../service/classroom";
import Head from "next/head";
import FullScreenLoading from "../../../../components/loading/FullScreenLoading";
import { Popover } from "@headlessui/react";
import Layout from "../../../../layouts/classroomLayout";
import { GetAllStudents } from "../../../../service/students";
import Image from "next/image";
import { GetAllScoresClassroom } from "../../../../service/scores";
import UpdateScore from "../../../../components/form/updateScore";
import { GetUserCookie } from "../../../../service/user";
import { Skeleton } from "@mui/material";
import Unauthorized from "../../../../components/error/unauthorized";
import { parseCookies } from "nookies";
import {
  SideMenusThai,
  sideMenusEnglish,
} from "../../../../data/menubarsClassroom";
import Trophy from "../../../../components/svg/Trophy";

function Index({ user, error }) {
  const router = useRouter();
  const [loadedImages, setLoadedImages] = useState([]);
  const [skeletion, setSkeletion] = useState(["1", "2", "3", "4"]);
  const [sideMenus, setSideMenus] = useState(() => {
    if (user?.language === "Thai") {
      return SideMenusThai();
    } else if (user?.language === "English") {
      return sideMenusEnglish();
    }
  });

  const classroom = useQuery(
    ["classroom"],
    () => GetOneClassroom({ params: router.query.classroomId }),
    { enabled: false }
  );
  const students = useQuery(
    ["students"],
    () => GetAllStudents({ classroomId: router.query.classroomId }),
    { enabled: false }
  );
  const scores = useQuery(
    ["scores"],
    () => GetAllScoresClassroom({ classroomId: router.query.classroomId }),
    { enabled: false }
  );

  // Update sideMenus whenever the user's language changes
  useEffect(() => {
    if (router.isReady) {
      classroom.refetch();
      students.refetch();
      scores.refetch();
      if (user?.language === "Thai") {
        setSideMenus(SideMenusThai(router));
      } else if (user?.language === "English") {
        setSideMenus(sideMenusEnglish(router));
      }
    }
  }, [router.isReady]);

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

  const handleLoadingComplete = (id) => {
    setLoadedImages((prevImages) => [...prevImages, id]);
  };
  if (error?.statusCode === 401) {
    return <Unauthorized />;
  }
  return (
    <div className="w-full pb-96 bg-slate-100 ">
      <Layout language={user.language} sideMenus={sideMenus} />
      <Head>
        <title>{`classroom - ${classroom.data?.data?.title}`}</title>
      </Head>

      <div className="flex  items-center justify-center ">
        <div className="w-full flex flex-col items-center justify-center  bg gap-10 h-full pb-40">
          {/* header section */}

          {/* main part */}
          <main className="w-full max-w-6xl h-full flex flex-col items-center justify-start  ">
            {/*
              students' avatar are here */}
            <div
              className=" md:w-11/12 lg:w-full max-w-7xl grid grid-cols-2 gap-4 items-center justify-center md:justify-start
              md:grid md:grid-cols-4 lg:grid-cols-5 md:gap-5 mt-10 place-items-center	"
            >
              <Popover>
                {({ open }) => (
                  <>
                    <Popover.Button>
                      <Trophy />
                    </Popover.Button>
                    <Popover.Panel>
                      {({ close }) => (
                        <UpdateScore
                          close={close}
                          language={user.language}
                          classroomScore={true}
                          scores={scores.data}
                          students={students}
                          refetchScores={scores.refetch}
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
                : students?.data?.data.map((student) => {
                    const shortName = student.firstName.replace(
                      /^(นาย|นางสาว|นาง|เด็กชาย|เด็กหญิง|ด\.ช\.|ด\.ญ\.)(.*)$/,
                      "$2"
                    );
                    var firstName = shortName.split(" ")[0];
                    return (
                      <Popover key={student.id}>
                        {(open) => (
                          <div>
                            <Popover.Button
                              onClick={() => {
                                document.body.style.overflow = "hidden";
                              }}
                            >
                              <div className="w-40 overflow-hidden rounded-3xl  flex relative justify-center drop-shadow-md">
                                <div
                                  className={`w-14 h-10 rounded-r-full absolute left-0  top-4  ${
                                    student.score.totalPoints < 0
                                      ? "bg-red-600"
                                      : "bg-[#EDBA02] "
                                  } ring-2 ring-white
  flex justify-center items-center font-sans font-bold text-xl z-10 text-white`}
                                >
                                  {student.score.totalPoints}
                                </div>
                                <div
                                  className="w-40 h-52 cursor-pointer  flex-col items-center justify-start flex
  duration-200  bg-white  overflow-hidden  hover:bg-orange-100 transition "
                                >
                                  {!loadedImages.includes(student.id) && (
                                    <div>
                                      <Skeleton
                                        variant="circular"
                                        width={96}
                                        height={96}
                                      />
                                    </div>
                                  )}

                                  <div className="w-24 h-24 ring-2 ring-gray-200 relative overflow-hidden rounded-full mt-2 ">
                                    {students.isFetching && !router.isReady ? (
                                      <Skeleton
                                        variant="circular"
                                        width={96}
                                        height={96}
                                      />
                                    ) : (
                                      <Image
                                        src={student.picture}
                                        layout="fill"
                                        quality={60}
                                        placeholder="blur"
                                        blurDataURL="/logo/TaTuga camp.png"
                                        alt="student's avatar"
                                        className=" hover:scale-150 object-cover
               transition duration-150 "
                                        onLoad={() =>
                                          handleLoadingComplete(student.id)
                                        }
                                      />
                                    )}
                                  </div>

                                  <div className="font-Kanit text-xl flex items-center flex-col mt-2 justify-start gap-1">
                                    <div
                                      className="w-full truncate font-medium lg:text-xl flex-col
        flex justify-center items-center"
                                    >
                                      <span className="text-xl text-blue-700   ">
                                        {firstName}
                                      </span>
                                      <span className="text-sm text-gray-600 font-normal ">
                                        {student?.lastName}
                                      </span>
                                    </div>
                                    <div
                                      className="text-gray-700 font-normal  w-full h-5 flex
         items-center justify-center text-base  rounded-md"
                                    >
                                      {user.language === "Thai" && "เลขที่"}
                                      {user.language === "English" &&
                                        "number"}{" "}
                                      {student.number}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Popover.Button>
                            <Popover.Panel>
                              {({ close }) => (
                                <UpdateScore
                                  language={user.language}
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
export async function getServerSideProps(context) {
  const { req, res, query } = context;
  const cookies = parseCookies(context);
  const accessToken = cookies.access_token;

  if (!accessToken && !query.access_token) {
    return {
      props: {
        error: {
          statusCode: 401,
          message: "unauthorized",
        },
      },
    };
  } else if (query.access_token) {
    try {
      const userData = await GetUserCookie({
        access_token: query.access_token,
      });
      const user = userData.data;

      return {
        props: {
          user,
        },
      };
    } catch (err) {
      return {
        props: {
          error: {
            statusCode: 401,
            message: "unauthorized",
          },
        },
      };
    }
  } else if (accessToken) {
    try {
      const userData = await GetUserCookie({
        access_token: accessToken,
      });
      const user = userData.data;
      return {
        props: {
          user,
        },
      };
    } catch (err) {
      return {
        props: {
          error: {
            statusCode: 401,
            message: "unauthorized",
          },
        },
      };
    }
  }
}
