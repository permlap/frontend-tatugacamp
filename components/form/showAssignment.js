import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
  DeleteAssignment,
  ViewAllAssignOnStudent,
} from "../../service/assignment";
import { FiSettings } from "react-icons/fi";
import { Skeleton } from "@mui/material";
import UpdateAssignment from "./updateAssignment";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { GrFormView, GrFormViewHide } from "react-icons/gr";
import Image from "next/image";
import "lightbox.js-react/dist/index.css";
import { SlideshowLightbox, initLightboxJS } from "lightbox.js-react";
function ShowAssignment({
  setShowAssignment,
  passAssianment,
  classroomId,
  students,
  assignments,
}) {
  const [triggerUpdateAssignment, setTriggerUpdateAssignment] = useState(false);
  const [activeMenu, setActiveMenu] = useState(0);
  const [currentStudentWork, setCurrentStudentWork] = useState();
  const menus = [
    {
      title: "assignment",
    },
    {
      title: "ตรวจงาน",
    },
  ];
  const studentOnAssignments = useQuery(["studentOnAssignments"], () =>
    ViewAllAssignOnStudent({
      assignmentId: passAssianment.id,
      classroomId: classroomId,
    })
  );

  useEffect(() => {
    initLightboxJS("0BBA-0D66-99C4-B63A", "individual");
  }, []);
  // refetch studentOnAssinment when  there is new passAssianment
  useEffect(() => {
    studentOnAssignments.refetch();
  }, [passAssianment]);

  // convert date format
  const date = new Date(passAssianment?.deadline);
  const formattedDate = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  //handle show update assignmnet compponent
  const handleClickUpdateAssignment = () => {
    setTriggerUpdateAssignment(true);
  };

  //handle click to delete assignment
  const handleDeleteAssignment = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const deleteAssignment = await DeleteAssignment({
          assignmentId: passAssianment.id,
        });
        assignments.refetch();
        setShowAssignment(false);
        Swal.fire("Deleted!", deleteAssignment?.data, "success");
      }
    });
  };

  //handle trigger menu
  const handleMenuTrigger = (index) => {
    setActiveMenu(index);
  };

  //handle select student's work
  const handleSelectWork = (student) => {
    setCurrentStudentWork(student);
  };
  console.log(currentStudentWork);
  return (
    <div>
      {triggerUpdateAssignment ? (
        <UpdateAssignment
          students={students}
          assignment={passAssianment}
          setTriggerUpdateAssignment={setTriggerUpdateAssignment}
          studentOnAssignments={studentOnAssignments}
          setShowAssignment={setShowAssignment}
          assignments={assignments}
        />
      ) : (
        <div
          className="flex items-center justify-start w-5/6 gap-1 flex-col h-[34rem]
           font-Kanit bg-white border-2 border-solid rounded-lg drop-shadow-xl p-10 z-40 
  top-0 right-0 left-0 bottom-0 m-auto fixed"
        >
          {/* menu bars */}
          <div className=" w-full relative -top-5 rounded-xl flex items-center justify-center gap-9">
            {menus.map((menu, index) => {
              return (
                <div
                  onClick={() => handleMenuTrigger(index)}
                  key={index}
                  className=" hover:font-bold w-max hover:cursor-pointer text-xl font-Kanit 
                font-normal flex items-center  group justify-center underLineHover transition duration-150"
                >
                  <span
                    className={`text-[#2C7CD1] ${
                      activeMenu === index ? "font-bold" : "font-normal"
                    }`}
                  >
                    {menu.title}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center">
            {/* assignment detail */}
            {activeMenu === 0 && (
              <div className="w-full">
                <div>
                  <div className="flex justify-between">
                    <span className="lg:text-4xl">{passAssianment?.title}</span>
                    <div className="flex items-center justify-center flex-col">
                      <div
                        className="w-20 h-10 rounded-xl flex items-center justify-center
              bg-orange-400 font-Poppins font-bold text-xl text-white"
                      >
                        {passAssianment?.maxScore}
                      </div>
                      <span>คะแนนเต็ม</span>
                    </div>
                  </div>

                  <div className="w-full h-[2px] bg-blue-900 rounded-full"></div>
                  <div className="mt-5 font-Kanit text-xl w-full h-[24rem] overflow-auto">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: passAssianment?.description,
                      }}
                    />
                  </div>
                  <div className="flex gap-2 items-end mt-5 justify-between">
                    <div>
                      <span>กำหนดส่ง</span>
                      <span className="text-xl ml-2 font-semibold text-red-500">
                        {formattedDate}
                      </span>
                    </div>
                    <div className="flex gap-6">
                      <div
                        onClick={handleDeleteAssignment}
                        className="text-xl text-red-600 flex items-center justify-center flex-col hover:scale-110 
                  transition duration-150 ease-in-out cursor-pointer"
                      >
                        <MdDelete />
                        <span className="text-sm">ลบงาน</span>
                      </div>
                      <div
                        onClick={handleClickUpdateAssignment}
                        className="text-xl flex flex-col items-center justify-center hover:scale-110 transition duration-150 cursor-pointer
            "
                      >
                        <FiSettings />
                        <span className="text-sm">แก้ไข</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* student's assignment */}
            {activeMenu === 1 && (
              <div className="flex items-start justify-start w-[80rem] ">
                <div className="w-max flex flex-col h-[30rem] items-center justify-start ">
                  <span className="text-xl font-Kanit font-semibold">
                    สถานะการส่งงานของผู้เรียน
                  </span>
                  <ul className="w-full list-none pl-0">
                    <li className="grid grid-cols-4 mt-4 gap-5 text-xl ">
                      <div className="flex justify-center">เลขที่</div>
                      <div>ชื่อ</div>
                      <div>นามสกุล</div>
                      <div>สถานะ</div>
                    </li>
                    <div className="h-[28rem] w-max overflow-auto">
                      {studentOnAssignments.isLoading && (
                        <div className="flex flex-col items-center justify-start mt-5 gap-5">
                          <Skeleton
                            variant="rounded"
                            animation="wave"
                            width="80%"
                          />
                          <Skeleton
                            variant="rounded"
                            animation="wave"
                            width="80%"
                          />
                          <Skeleton
                            variant="rounded"
                            animation="wave"
                            width="80%"
                          />
                          <Skeleton
                            variant="rounded"
                            animation="wave"
                            width="80%"
                          />
                          <Skeleton
                            variant="rounded"
                            animation="wave"
                            width="80%"
                          />
                          <Skeleton
                            variant="rounded"
                            animation="wave"
                            width="80%"
                          />
                          <Skeleton
                            variant="rounded"
                            animation="wave"
                            width="80%"
                          />
                        </div>
                      )}

                      {studentOnAssignments?.data?.data?.map(
                        (student, index) => {
                          return (
                            <li className="grid grid-cols-4 gap-5 py-2  ">
                              <div className="flex justify-center">
                                {student.number}
                              </div>
                              <div>{student.firstName}</div>
                              <div>{student.lastName}</div>
                              {student.status === "no-work" && (
                                <div className="w-max bg-red-500 py-1 px-2 rounded-lg text-white">
                                  ยังไม่ส่งงาน
                                </div>
                              )}
                              {student.status === "have-work" &&
                                student.studentWork.score === 0 && (
                                  <div
                                    onClick={() => handleSelectWork(student)}
                                    className=" w-max cursor-pointer hover:scale-105 transition duration-150
                                     bg-yellow-500 py-1 px-2 rounded-lg text-white"
                                  >
                                    ส่งงานแล้ว
                                  </div>
                                )}
                              {student.status === "no-assign" && (
                                <div className="w-max bg-gray-500 py-1 px-2 rounded-lg text-white">
                                  ไม่ถูกมอบหมายงาน
                                </div>
                              )}
                              {student.status === "have-work" &&
                                student.studentWork.score > 0 && (
                                  <div className="w-max bg-green-500 py-1 px-2 rounded-lg text-white">
                                    ตรวจแล้ว
                                  </div>
                                )}
                            </li>
                          );
                        }
                      )}
                    </div>
                  </ul>
                </div>
                <div className="flex flex-col w-full items-center justify-start px-10">
                  <div className="flex w-full justify-between  ">
                    <div className="flex items-center justify-center relative">
                      <span className="text-3xl font-Kanit">
                        งานของผู้เรียน
                      </span>
                      <div className="w-96 h-[2px] bg-blue-700 absolute left-0 bottom-2"></div>
                    </div>
                    <div className="flex justify-center items-center gap-2">
                      <div className="text-2xl">
                        {currentStudentWork?.firstName}
                      </div>
                      <div className="w-16 h-16 relative rounded-full overflow-hidden bg-blue-100">
                        <Image
                          src={currentStudentWork?.picture}
                          layout="fill"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    {currentStudentWork && (
                      <SlideshowLightbox
                        theme="day"
                        className="container grid grid-cols-2 gap-2 mx-auto h-96 overflow-auto"
                      >
                        <img
                          className="w-full rounded"
                          src={currentStudentWork?.studentWork?.picture}
                        />
                      </SlideshowLightbox>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <div
        onClick={() => {
          setActiveMenu(0);
          setShowAssignment(false);
          setTriggerUpdateAssignment(false);
        }}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></div>
    </div>
  );
}

export default ShowAssignment;
