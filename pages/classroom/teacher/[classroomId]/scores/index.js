import React, { useEffect, useState } from "react";
import Layout from "../../../../../layouts/classroomLayout";
import Unauthorized from "../../../../../components/error/unauthorized";
import { useRouter } from "next/router";
import { GetUser, GetUserCookie } from "../../../../../service/user";
import { useQuery } from "react-query";
import { FiArrowLeftCircle } from "react-icons/fi";
import { GetAllStudentScores } from "../../../../../service/students";
import Head from "next/head";
import { BiMessageAltError } from "react-icons/bi";
import { Skeleton } from "@mui/material";
import { SiMicrosoftexcel } from "react-icons/si";
import { DownloadExcelScore } from "../../../../../service/dowloadFile";
import Swal from "sweetalert2";
import { parseCookies } from "nookies";
import {
  sideMenusEnglish,
  sideMenusThai,
} from "../../../../../data/menubarsScores";

function Index({ user, error }) {
  const router = useRouter();
  const [sideMenus, setSideMenus] = useState(() => {
    if (user.language === "Thai") {
      return sideMenusThai();
    } else if (user.language === "English") {
      return sideMenusEnglish();
    }
  });
  const studentsScores = useQuery(
    ["studentsScores"],
    () => GetAllStudentScores({ classroomId: router.query.classroomId }),
    {
      enabled: false,
    }
  );
  //check whether there is authorrized acccess or not
  useEffect(() => {
    studentsScores.refetch();
  }, [router.isReady]);

  const handleDownloadFile = async () => {
    try {
      await DownloadExcelScore({ classroomId: router.query.classroomId });
      Swal.fire(
        "ดาวโหลดสำเร็จ",
        "ดาวโหลดไฟล์รายงานผลคะแนนเรียบร้อย",
        "success"
      );
    } catch (err) {
      Swal.fire(
        "error",
        err?.props?.response?.data?.message.toString(),
        "error"
      );
      console.log(err);
    }
  };
  if (error?.statusCode === 401) {
    return <Unauthorized />;
  }
  return (
    <div className="w-full font-Kanit bg-blue-50 pb-40">
      <Head>
        <title>overall score</title>
      </Head>
      <Layout language={user.language} sideMenus={sideMenus} />
      <div className=" w-full flex flex-col items-center justify-start mt-10">
        <button
          className="w-max px-5 flex gap-1 mb-2 hover:scale-105 transition duration-150 active:bg-blue-800 bg-blue-500 font-Poppins font-semibold text-white rounded-lg py-2"
          onClick={handleDownloadFile}
        >
          dowload
          <div>
            <SiMicrosoftexcel />
          </div>
        </button>
        {studentsScores.isLoading || studentsScores.isFetching ? (
          <div className="flex flex-col gap-5 mt-5">
            <Skeleton variant="rectangular" width={700} height={40} />
            <Skeleton variant="rectangular" width={600} height={40} />
            <Skeleton variant="rectangular" width={800} height={40} />
          </div>
        ) : (
          <div
            className={`relative lg:max-w-6xl md:w-[40rem] lg:w-max  h-max max-h-[30rem]
         ${
           studentsScores?.data?.data?.assignments.length === 0
             ? "border-0 bg-transparent"
             : " bg-white overflow-auto border-2 border-solid rounded-lg mb-20"
         }
      `}
          >
            {studentsScores?.data?.data?.assignments.length === 0 ? (
              <div className="w-full  flex items-center justify-center h-full text-3xl mt-5">
                <span>
                  {user.language === "Thai" &&
                    "ไม่มีข้อมูลเนื่องจากไม่ได้มอบหมายงานให้ผู้เรียน"}
                  {user.language === "English" &&
                    "No data due to no assignments"}
                </span>
                <div className="text-red-400">
                  <BiMessageAltError />
                </div>
              </div>
            ) : (
              <table className="border-collapse w-max ">
                <thead className="sticky top-0 bg-white drop-shadow-lg">
                  <tr className="border-b border-0 border-solid border-slate-700">
                    <th scope="col" className="px-6 py-3 w-20">
                      {user.language === "Thai" && "เลขที่"}
                      {user.language === "English" && "number"}
                    </th>
                    <th scope="col" className="px-6 py-3 w-60">
                      {user.language === "Thai" && "รายชื่อ"}
                      {user.language === "English" && "student's name"}
                    </th>

                    {studentsScores?.data?.data?.assignments.map(
                      (assignment) => {
                        const date = new Date(assignment.createAt);
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
                          <th
                            key={assignment.id}
                            scope="col"
                            className="px-6 py-3  "
                          >
                            <div className="flex   max-w-xs  flex-col items-center justify-center">
                              <span className="text-sm">
                                {assignment.title}
                              </span>
                              <span className="text-sm font-normal">
                                {user.language === "Thai" && "คะแนนเต็ม"}
                                {user.language === "English" && "scores"} {` `}
                                {assignment.maxScore}
                              </span>
                              <span className="font-normal italic">
                                ({formattedDate})
                              </span>
                            </div>
                          </th>
                        );
                      }
                    )}
                    <th scope="col" className="px-6 py-3 w-28">
                      {user.language === "Thai" && "คะแนนความประพฤติ"}
                      {user.language === "English" && "motivative scores"}
                    </th>
                    <th scope="col" className="px-6 py-3 w-20">
                      {user.language === "Thai" && "รวม"}
                      {user.language === "English" && "sum"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {studentsScores?.data?.data?.studentsScores.map((student) => {
                    return (
                      <tr
                        key={student.id}
                        className="border-b border-0 border-solid border-slate-700"
                      >
                        <th scope="row" className="px-6 py-4 text-center">
                          {student.number}
                        </th>
                        <td className="px-6 py-4">
                          {student.firstName} {student?.lastName}
                        </td>
                        {student.studentWorks.map((studentWork, index) => {
                          return (
                            <td key={index} className="px-6 py-4 text-center">
                              {!studentWork.studentWork
                                ? "0"
                                : studentWork.studentWork.score}
                            </td>
                          );
                        })}
                        <td className="px-6 py-4 text-center">
                          {student.score.totalPoints}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {student.totalPoints + student.score.totalPoints}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
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
