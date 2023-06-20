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
          <div className=" w-full max-w-7xl mt-5 gap-5 grid items-center justify-center ">
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

                return (
                  <div
                    onClick={() => {
                      router.push({
                        pathname: `/classroom/teacher/${router.query.classroomId}/assignment/${assignment.id}`,
                      });
                    }}
                    key={index}
                    className={`w-80 md:w-[35rem] h-36 md:px-10 md:py-5 drop-shadow-md  bg-white  hover:scale-105 cursor-pointer overflow-hidden
                 duration-150 transition relative
               rounded-lg flex flex-col gap-10 border-2 border-solid`}
                  >
                    <div className="flex md:justify-between justify-between">
                      <div className="flex">
                        <div
                          className={`flex flex-col gap-2 w-40 md:w-3/4 max-w-md  font-Poppins text-center md:text-left text-black `}
                        >
                          <span className=" font text-xl font-bold w-full h-max max-h-8 overflow-auto scrollbar-hide ">
                            {assignment.title}
                          </span>
                          <div className="relative">
                            <div className="w-96  h-[0.5px]  mb-2 bg-blue-800 rounded-full "></div>

                            <div
                              className="h-24 w-60 overflow-hidden fade-mask"
                              dangerouslySetInnerHTML={{
                                __html: assignment?.description,
                              }}
                            />
                            <div className="w-96 hidden md:block bg-gray-200 h-2 rounded-full overflow-hidden">
                              <div
                                style={{ width: assignment.progress.progress }}
                                className={` bg-blue-800 h-2 `}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="relative w-32  ">
                        <div className="flex items-center justify-center flex-col">
                          <div
                            className="w-10 h-10 md:w-20 md:h-20 p-2 bg-[#EDBA02] rounded-full 
                        font-Poppins font-bold flex items-center justify-center"
                          >
                            <span className="text-lg md:text-2xl text-white break-words truncate ">
                              {assignment.maxScore.toLocaleString()}
                            </span>
                          </div>
                          <div className="font-Poppins font-semibold">
                            {user.language === "Thai" && "คะแนน"}
                            {user.language === "English" && "score"}
                          </div>
                        </div>

                        <div className="font-Poppins gap-1 text-sm flex flex-col justify-start items-center  w-full  ">
                          <span>
                            {user.language === "Thai" && "กำหนดส่ง"}
                            {user.language === "English" && "due by"}
                          </span>
                          <span>{formattedDate}</span>
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
