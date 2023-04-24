import React, { useEffect, useState } from "react";
import Layout from "../../../../components/layout";
import Image from "next/image";
import { MdWork } from "react-icons/md";
import { GiProgression } from "react-icons/gi";
import { IoCaretBackOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { GetAllAssignment } from "../../../../service/student/assignment";

function Index() {
  const [classroomCode, setClassroomCode] = useState();
  const router = useRouter();
  const [student, setStudnet] = useState();
  const assignments = useQuery(
    ["assignments-student"],
    () =>
      GetAllAssignment({
        studentId: student?.id,
        classroomId: student.classroomId,
      }),
    {
      enabled: false,
    }
  );

  useEffect(() => {
    setStudnet(() => {
      const student = localStorage.getItem("student");
      const studentObject = JSON.parse(student);
      return studentObject;
    });
    setClassroomCode(() => {
      const rawClassroomCode = localStorage.getItem("classroomCode");
      const classroomCode = JSON.parse(rawClassroomCode);
      return classroomCode;
    });
  }, []);

  useEffect(() => {
    assignments.refetch();
  }, [student]);
  return (
    <div className="bg-[#2C7CD1] w-full h-full pb-96">
      <main className="w-full h-full flex items-center justify-start flex-col pt-20 gap-3 relative">
        <div
          role="button"
          aria-label="button go back to classroom"
          onClick={() =>
            router.push({
              pathname: `/classroom/student`,
              query: {
                classroomCode: classroomCode,
              },
            })
          }
          className="w-28 h-10 bg-transparent border-2 border-solid border-white rounded-lg absolute top-2 left-2
        flex items-center justify-center active:bg-orange-500 hover:scale-110 transition duration-150"
        >
          <div className="text-2xl text-white flex items-center justify-center ">
            <IoCaretBackOutline />
          </div>
          <span className="font-Poppins font-semibold text-white">go back</span>
        </div>
        {student?.picture && (
          <div className="w-28 h-28 relative rounded-2xl overflow-hidden ring-4 ring-white bg-[#EDBA02]">
            <Image
              priority={true}
              src={student?.picture}
              layout="fill"
              className="object-contain scale-125 translate-y-4"
            />
          </div>
        )}
        <div className="text-white font-Kanit font-normal flex gap-2">
          <span>{student?.firstName}</span>
          <span>{student?.lastName}</span>
        </div>
        <div className="flex gap-2">
          <div className="w-32 h-10 rounded-md bg-yellow-500 items-center flex justify-evenly">
            <div className="w-8 h-8 bg-white/50 backdrop-blur-md rounded-md flex items-center justify-center text-white">
              <MdWork />
            </div>
            <span className="text-md text-white font-Poppins font-normal">
              works
            </span>
          </div>
          <div className="w-32 h-10 rounded-md bg-pink-400 items-center flex justify-evenly">
            <div className="w-8 h-8 bg-white/50 backdrop-blur-md rounded-md flex items-center justify-center text-white">
              <GiProgression />
            </div>
            <span className="text-md text-white font-Poppins font-normal">
              progress
            </span>
          </div>
        </div>
        {!student && (
          <div className="text-xl text-white font-Kanit">
            ไม่พบผู้เรียนโปรดกลับสู่หน้าหลัก
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 place-items-center w-full	">
          {assignments?.data?.data?.map((assignment) => {
            return (
              <div
                key={assignment.assignment.id}
                onClick={() => {
                  const serializedAssignment = JSON.stringify(assignment);
                  localStorage.setItem("assignment", serializedAssignment);
                  router.push({
                    pathname: `/classroom/student/${student.id}/assignment/${assignment.assignment.id}`,
                  });
                }}
                aria-label="open assignment"
                role="button"
                className={`w-[85%] py-2 px-2 h-32 active:scale-105   drop-shadow-md  bg-white  hover:scale-105 cursor-pointer 
                 duration-150 transition relative 
               rounded-lg flex items-start justify-between  gap-2 border-2 border-solid`}
              >
                <div className={`flex gap-2 w-full font-Poppins text-black `}>
                  <div>
                    <div className=" overflow-hidden w-52 h-8 ">
                      <span className=" font text-xl font-bold w-max ml-2">
                        {assignment?.assignment?.title}
                      </span>
                    </div>

                    <div className="relative">
                      <div className="w-40  h-[0.5px] mt-1 ml-2  mb-2 bg-blue-800 rounded-full "></div>

                      <div
                        className="h-20 w-44 overflow-hidden  fade-mask ml-2"
                        dangerouslySetInnerHTML={{
                          __html: assignment?.assignment?.description,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full  h-full flex items-center justify-center">
                  <div className=" font-Kanit flex-col font-semibold flex justify-center items-center">
                    {assignment?.student.status === "no-work" && (
                      <div className="w-20 h-20 bg-red-600 rounded-2xl text-white font-Kanit font-semibold flex justify-center items-center">
                        <span>ไม่ส่งงาน</span>
                      </div>
                    )}
                    {assignment?.student.status === "have-work" &&
                      assignment?.student?.isSummited === false && (
                        <div className="w-20 h-20 bg-yellow-400 rounded-2xl text-white font-Kanit font-semibold flex justify-center items-center">
                          <span>ส่งแล้ว</span>
                        </div>
                      )}
                    {assignment?.student.status === "have-work" &&
                      assignment?.student?.isSummited === true && (
                        <div className="w-20 h-20 bg-green-600 rounded-2xl text-white font-Kanit font-semibold flex justify-center items-center">
                          <span>ตรวจแล้ว</span>
                        </div>
                      )}
                    สถานะ
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default Index;
