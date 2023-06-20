import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { GetUser, GetUserCookie } from "../../../../../service/user";
import { useRouter } from "next/router";
import Unauthorized from "../../../../../components/error/unauthorized";
import FullScreenLoading from "../../../../../components/loading/FullScreenLoading";
import { GetOneClassroom } from "../../../../../service/classroom";
import Image from "next/image";
import CreateAssignment from "../../../../../components/form/createAssignment";
import { GetAllAssignments } from "../../../../../service/assignment";
import { GetAllStudents } from "../../../../../service/students";
import Layout from "../../../../../layouts/classroomLayout";
import { Skeleton } from "@mui/material";
import Head from "next/head";
import { parseCookies } from "nookies";
import {
  sideMenusEnglish,
  sideMenusThai,
} from "../../../../../data/menubarsAssignments";
function Assignment({ error, user }) {
  const router = useRouter();
  const [sideMenus, setSideMenus] = useState(() => {
    if (user?.language === "Thai") {
      return sideMenusThai();
    } else if (user?.language === "English") {
      return sideMenusEnglish();
    }
  });
  const [triggerAssignment, setTriggerAssignment] = useState(false);
  const classroom = useQuery(
    ["classroom"],
    () => GetOneClassroom({ params: router.query.classroomId }),
    {
      enabled: false,
    }
  );
  const assignments = useQuery(
    ["assignments"],
    () => GetAllAssignments({ classroomId: router.query.classroomId }),
    {
      enabled: false,
    }
  );
  const students = useQuery(
    ["students"],
    () => GetAllStudents({ classroomId: router.query.classroomId }),
    {
      enabled: false,
    }
  );
  //check whether there is authorrized acccess or not
  useEffect(() => {
    classroom.refetch();
    assignments.refetch();
    students.refetch();
  }, [router.isReady]);

  if (!router.isReady) {
    return <FullScreenLoading />;
  }
  if (error?.statusCode === 401) {
    return <Unauthorized />;
  }
  return (
    <div className="w-full pb-96 bg-blue-50 ">
      <Head>
        <title>assignments</title>
      </Head>
      <Layout sideMenus={sideMenus} language={user.language} />
      <div className="">
        <main className="w-full  py-5  mt-10 flex flex-col items-center justify-center relative">
          <div
            className="bg-white w-80 md:w-[28rem] h-20 rounded-full drop-shadow-md flex items-center 
          justify-start gap-2 "
          >
            <div className="w-12  h-12  bg-orange-400 relative ml-5 rounded-full bg- overflow-hidden">
              {user?.picture && (
                <Image
                  src={user?.picture}
                  layout="fill"
                  className="object-contain"
                />
              )}
            </div>
            <button
              onClick={() => {
                setTriggerAssignment(true);
                document.body.style.overflow = "hidden";
              }}
              className="w-8/12 md:w-80 border-none py-2 rounded-full bg-blue-100 text-center font-Poppins text-sm hover:bg-[#2C7CD1] hover:text-white
text-black transition duration-150 cursor-pointer"
            >
              <div className="font-Kanit font-medium">
                {user.language === "Thai" && "สร้างชิ้นงาน"}
                {user.language === "English" && "create your assignment"}
              </div>
            </button>
          </div>

          <div
            className={` top-0 right-0 left-0 bottom-0 m-auto righ z-40 ${
              triggerAssignment === false ? "hidden" : "fixed"
            }`}
          >
            <CreateAssignment
              language={user.language}
              assignments={assignments}
              setTriggerAssignment={setTriggerAssignment}
              students={students}
            />
          </div>

          {/* assignments are here */}
          <div className=" w-full mt-5 gap-5 grid place-items-center bg-slate-100 ">
            {assignments.isLoading || assignments.isFetching ? (
              <div className="flex flex-col gap-5 w-80 md:w-[40rem]">
                <Skeleton variant="rounded" width="100%" height={144} />
                <Skeleton variant="rounded" width="100%" height={144} />
                <Skeleton variant="rounded" width="100%" height={144} />
                <Skeleton variant="rounded" width="100%" height={144} />
                <Skeleton variant="rounded" width="100%" height={144} />
              </div>
            ) : (
              assignments?.data?.map((assignment, index) => {
                //covert date
                const date = new Date(assignment.deadline);

                const formattedDate = date.toLocaleDateString(
                  `${
                    user.language === "Thai"
                      ? "th-TH"
                      : user.language === "English" && "en-US"
                  }`,
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                );
                const assignDate = new Date(assignment.createAt);

                const formatAssigDate = assignDate.toLocaleDateString(
                  `${
                    user.language === "Thai"
                      ? "th-TH"
                      : user.language === "English" && "en-US"
                  }`,
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                );

                return (
                  <div
                    onClick={() => {
                      router.push({
                        pathname: `/classroom/teacher/${router.query.classroomId}/assignment/${assignment.id}`,
                      });
                    }}
                    key={index}
                    className={`w-11/12 md:w-[35rem] group  h-36  md:px-10 md:py-5 drop-shadow-lg 
                     bg-white  hover:scale-105 cursor-pointer overflow-hidden
                 duration-150 transition relative
               rounded-lg flex flex-col justify-center `}
                  >
                    <div className="flex md:justify-between justify-center gap-3 md:gap-0">
                      <div className="flex">
                        <div
                          className={`flex flex-col  justify-center h-full
                            gap-2 w-60 md:w-3/4 max-w-md  font-Poppins text-center
                             md:text-left text-black `}
                        >
                          <span className=" font text-xl font-bold w-full h-max max-h-8  truncate">
                            {assignment.title}
                          </span>
                          <div className="relative">
                            <div className="w-96 hidden md:block bg-gray-200 h-2 rounded-full overflow-hidden">
                              <div
                                style={{ width: assignment.progress.progress }}
                                className={` bg-blue-800 h-2 `}
                              ></div>
                            </div>
                            <div className="font-Kanit mt-2">
                              {user.language === "Thai" && "ผู้เรียนส่งงานแล้ว"}
                              {user.language === "English" &&
                                "Students has summited thier work for"}{" "}
                              {assignment.progress.progress}
                            </div>
                            <div className="font-Kanit mt-2">
                              {user.language === "Thai" && "มอบหมายเมื่อ"}
                              {user.language === "English" && "Assign on"}{" "}
                              <span className="w-max h-max p-1 px-2 bg-orange-300 text-black rounded-lg">
                                {formatAssigDate}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="relative w-24 md:w-32 ring-2 py-1 md:py-2 ring-blue-400 group-hover:bg-blue-400 rounded-xl flex flex-col justify-center ">
                        <div className="flex items-center justify-center flex-col">
                          <div>
                            <span className="text-lg md:text-2xl font-Poppins font-semibold group-hover:text-white text-blue-500 truncate ">
                              {assignment.maxScore.toLocaleString()}
                            </span>
                          </div>
                          <div className="font-Poppins font-semibold group-hover:text-white text-black">
                            {user.language === "Thai" && "คะแนน"}
                            {user.language === "English" && "score"}
                          </div>
                        </div>

                        <div className="font-Poppins gap-1 text-sm flex flex-col justify-start items-center  w-full  ">
                          <span className="group-hover:text-white text-black">
                            {user.language === "Thai" && "กำหนดส่ง"}
                            {user.language === "English" && "due by"}
                          </span>
                          <span className="group-hover:text-white text-black">
                            {formattedDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Assignment;
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
