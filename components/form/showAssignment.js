import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
  DeleteAssignment,
  DeleteStudentWork,
  ReviewStudentWork,
  ReviewStudentWorkNoWork,
  ViewAllAssignOnStudent,
} from "../../service/assignment";
import { FiSettings } from "react-icons/fi";
import { Box, Skeleton, TextField } from "@mui/material";
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
  const [teacherReview, setTeacherReview] = useState({
    comment: "",
    score: "",
  });
  const [currentStudentWork, setCurrentStudentWork] = useState();
  const [images, setImages] = useState([]);
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
    initLightboxJS(process.env.NEXT_PUBLIC_LIGHTBOX_KEY, "individual");
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
  const handleDelteStudentWork = async () => {
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
        const deleteStudentWork = await DeleteStudentWork({
          assignmentId: passAssianment.id,
          studentId: currentStudentWork.id,
        });
        studentOnAssignments.refetch();
        Swal.fire("Deleted!", deleteStudentWork?.data, "success");
      }
    });
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
    if (student.studentWork) {
      setImages(() => {
        let pictures = [];
        if (!student?.studentWork?.picture) {
          pictures.push({ src: "", alt: "student's work" });
        } else if (student.studentWork.picture) {
          const arrayPictures = student.studentWork.picture.split(", ");
          for (const arrayPicture of arrayPictures) {
            pictures.push({ src: arrayPicture, alt: "student's work" });
          }
          return pictures;
        }
      });
    } else if (!student.studentWork) {
      setImages(null);
    }

    setCurrentStudentWork(student);
    setTeacherReview((prev) => {
      return {
        ...prev,
        comment: !student?.studentWork?.comment
          ? ""
          : student?.studentWork?.comment,
        score: !student?.studentWork?.score ? "" : student?.studentWork?.score,
      };
    });
  };

  const handleReviewWork = async (e) => {
    try {
      e.preventDefault();

      if (currentStudentWork.status === "have-work") {
        const reviewWork = await ReviewStudentWork({
          studentId: currentStudentWork.id,
          assignmentId: passAssianment.id,
          comment: teacherReview.comment,
          score: teacherReview.score,
        });

        studentOnAssignments.refetch();
        Swal.fire("success", "ตรวจงานเรียบร้อย", "success");
      } else if (currentStudentWork.status === "no-work") {
        const reviewWork = await ReviewStudentWorkNoWork({
          studentId: currentStudentWork.id,
          assignmentId: passAssianment.id,
          comment: teacherReview.comment,
          score: teacherReview.score,
        });
        studentOnAssignments.refetch();
        setCurrentStudentWork(reviewWork.data);

        Swal.fire("success", "ตรวจงานเรียบร้อย", "success");
      }
    } catch (err) {
      console.log(err);
      Swal.fire(
        "error",
        err?.props?.response?.data?.error?.message?.toString(),
        "error"
      );
    }
  };

  const handleOnChangeReviewWork = (e) => {
    const { name, value } = e.target;
    setTeacherReview((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

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
          className="flex items-center justify-start w-max max-w-7xl gap-1 flex-col h-max
           font-Kanit bg-white border-2 border-solid rounded-lg drop-shadow-xl  z-40 
  top-0 right-0 left-0 bottom-0 m-auto fixed"
        >
          {/* menu bars */}
          <div className=" w-full relative mt-5 rounded-xl flex items-center justify-center gap-9">
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
          <div className="flex items-center justify-center w-[80rem] ">
            {/* assignment detail */}
            {activeMenu === 0 && (
              <div className="w-[80rem] px-10 ">
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
                  <div className="flex pb-5 gap-2 items-end mt-5 justify-between">
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
              <div className="flex items-start justify-start w-[80rem]  ">
                <div className="w-[60rem] flex flex-col h-[30rem] items-center justify-start ">
                  <span className="text-xl font-Kanit font-semibold">
                    สถานะการส่งงานของผู้เรียน
                  </span>
                  <ul className="w-full list-none pl-0">
                    <li className="grid grid-cols-4 mt-4 gap-2 text-xl ">
                      <div className="flex justify-center">เลขที่</div>
                      <div className="flex items-center justify-center">
                        ชื่อ
                      </div>
                      <div className="flex items-center justify-center">
                        คะแนน
                      </div>
                      <div className="flex items-center justify-start">
                        สถานะ
                      </div>
                    </li>
                    <div className="h-[23rem] w-full overflow-auto">
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
                            <li
                              key={index}
                              className="grid grid-cols-4 gap-2 py-2  "
                            >
                              <div className="flex justify-center">
                                {student.number}
                              </div>
                              <div className="flex items-center justify-center">
                                {student.firstName}
                              </div>
                              {student?.studentWork?.score ? (
                                <div className="flex items-center justify-center font-Kanit font-bold text-gray-700">
                                  {student.studentWork.score}
                                </div>
                              ) : (
                                <div className="flex items-center justify-center font-Kanit font-bold text-gray-700">
                                  0
                                </div>
                              )}
                              {student.status === "no-work" && (
                                <div
                                  onClick={() => handleSelectWork(student)}
                                  className="w-max bg-red-500 py-1 px-2 rounded-lg text-white cursor-pointer 
                                  hover:scale-105 transition duration-150"
                                >
                                  ไม่ส่งงาน
                                </div>
                              )}
                              {student.status === "have-work" &&
                                student.studentWork.score === 0 &&
                                student.studentWork.isSummited === false && (
                                  <div
                                    onClick={() => handleSelectWork(student)}
                                    className=" w-max cursor-pointer hover:scale-105 transition duration-150
                                     bg-yellow-500 py-1 px-2 rounded-lg text-white"
                                  >
                                    รอการตรวจ
                                  </div>
                                )}
                              {student.status === "no-assign" && (
                                <div className="w-max bg-gray-500 py-1 px-2 rounded-lg text-white">
                                  ไม่ได้มอบหมาย
                                </div>
                              )}
                              {student.status === "have-work" &&
                                student.studentWork.isSummited === true && (
                                  <div
                                    onClick={() => handleSelectWork(student)}
                                    className="w-max bg-green-500 py-1 px-2 cursor-pointer hover:scale-105 transition duration-150 rounded-lg text-white"
                                  >
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

                {/* review student work section */}
                <div className="flex flex-col w-full items-center justify-between h-max">
                  <div className="flex w-full justify-between ">
                    <div className="flex items-center justify-center relative">
                      <div className="text-3xl font-Kanit flex">
                        <span>งานของผู้เรียน</span>
                        {currentStudentWork?.status === "have-work" && (
                          <div
                            onClick={handleDelteStudentWork}
                            className="flex items-center justify-center text-red-500 cursor-pointer
                        hover:text-red-800 transition duration-150"
                          >
                            <MdDelete />
                          </div>
                        )}
                      </div>
                      <div className="w-96 h-[2px] bg-blue-700 absolute left-0 bottom-2"></div>
                    </div>
                    <div className="flex justify-center items-center gap-4">
                      <div className="text-2xl">
                        {currentStudentWork?.number}
                      </div>
                      <div className="text-2xl">
                        {currentStudentWork?.firstName}
                      </div>
                      <div className="w-16 h-16 relative rounded-full overflow-hidden bg-blue-100 mr-4">
                        <Image
                          src={currentStudentWork?.picture}
                          layout="fill"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="">
                    {currentStudentWork && images && images[0].src !== "" ? (
                      <SlideshowLightbox
                        downloadImages={true}
                        lightboxIdentifier="lightbox1"
                        showThumbnails={true}
                        framework="next"
                        images={images}
                        theme="day"
                        className={`container grid ${
                          images.length === 1 ? "grid-cols-1" : "grid-cols-2"
                        } w-[40rem] mx-auto h-full items-center place-items-center
                         max-h-60 overflow-auto  `}
                      >
                        {images.map((image, index) => {
                          return (
                            <Image
                              key={index}
                              src={image?.src}
                              alt={image?.alt}
                              width={240}
                              height={160}
                              className="object-contain "
                              data-lightboxjs="lightbox1"
                              quality={80}
                            />
                          );
                        })}
                      </SlideshowLightbox>
                    ) : (
                      <div
                        className="w-full h-72 flex items-center justify-center font-Kanit
                      font-bold text-5xl text-gray-300"
                      >
                        {currentStudentWork?.status === "no-work" &&
                          "ผู้เรียนยังไม่ส่งงาน"}
                        {currentStudentWork?.status === "have-work" &&
                          "ผู้เรียนยังไม่ส่งงาน"}
                        {!currentStudentWork && "โปรดเลือกงาน"}
                      </div>
                    )}
                  </div>
                  {currentStudentWork?.studentWork?.body && (
                    <div className="w-full  h-max mt-5 flex items-start  relative ">
                      <div className="w-6 left-[5.2rem] top-1 overflow-hidden  inline-block absolute ">
                        <div className=" h-10  bg-blue-100 -rotate-45 transform origin-top-right"></div>
                      </div>
                      <div className="flex justify-center items-center ml-5">
                        <div className="w-16 h-16 relative rounded-full overflow-hidden bg-blue-100 ">
                          <Image
                            src={currentStudentWork?.picture}
                            layout="fill"
                          />
                        </div>
                      </div>

                      <div className="w-[28rem] ml-5 bg-blue-100 rounded-lg h-20 relative overflow-auto p-2">
                        <div className="text-md ml-4 font-bold">
                          {currentStudentWork?.firstName}
                        </div>

                        <div
                          className="pl-4"
                          dangerouslySetInnerHTML={{
                            __html: currentStudentWork?.studentWork?.body,
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <form
                    onSubmit={handleReviewWork}
                    className="w-full flex justify-center gap-5 mt-10 mb-5"
                  >
                    <Box width="50%">
                      <TextField
                        name="comment"
                        onChange={handleOnChangeReviewWork}
                        fullWidth
                        value={teacherReview.comment}
                        label="comment"
                      />
                    </Box>
                    <Box width="20%" className="relative ">
                      <TextField
                        fullWidth
                        label="คะแนน"
                        type="number"
                        name="score"
                        value={teacherReview.score}
                        onChange={handleOnChangeReviewWork}
                      />
                      <span className="font-Poppins absolute top-4 right-5">
                        /{passAssianment.maxScore}
                      </span>
                    </Box>
                    <button
                      className="w-20  h-9 mt-2 rounded-full bg-[#2C7CD1] hover:bg-red-500 tranti duration-150
                       text-white font-sans font-bold
              text-md cursor-pointer hover: active:border-2  active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid"
                    >
                      ส่ง
                    </button>
                  </form>
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
