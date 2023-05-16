import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Editor } from "@tinymce/tinymce-react";
import { IoCaretBackOutline } from "react-icons/io5";
import { Box, Skeleton, TextField } from "@mui/material";
import {
  GetMyWork,
  SummitWork,
} from "../../../../../../service/student/assignment";
import { SlideshowLightbox, initLightboxJS } from "lightbox.js-react";
import Image from "next/image";
import "lightbox.js-react/dist/index.css";
import { AiFillQuestionCircle } from "react-icons/ai";
import { CiFaceFrown } from "react-icons/ci";
import Swal from "sweetalert2";

function Index() {
  const router = useRouter();
  const menus = [
    { title: "Summition", translate: "translate-x-7" },
    { title: "Your work", translate: "translate-x-40" },
  ];
  const [teacher, setTeacher] = useState();
  const [loading, setLoading] = useState(false);
  const fetchStudentWork = useQuery(["student-work"], () =>
    GetMyWork({ studentId: student.id, assignmentId: assignment.id }).then(
      (res) => {
        setStudnetWork(() => {
          let pictures = [];

          if (res.data.status === "have-work") {
            if (res.data.picture) {
              const arrayPictures = res.data.picture.split(", ");
              for (const arrayPicture of arrayPictures) {
                pictures.push({ src: arrayPicture, alt: "student's work" });
              }
              return { ...res.data, picture: pictures };
            } else if (!res.data.picture) {
              return res.data;
            }
          } else if (res.data.status === "no-work") {
            return res.data;
          }
        });
        return res;
      }
    )
  );
  const [activeMenu, setActiveMenu] = useState(0);
  const [student, setStudent] = useState();
  const [studentWork, setStudnetWork] = useState();
  const [assignment, setAssignment] = useState();
  const [deadline, setDeadline] = useState();
  const [studentSummit, setStudentSummit] = useState({
    body: "",
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const handleSummitWork = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "ยืนยันการส่งงาน",
      text: "นักเรียนแน่ใจใช่หรือไม่ที่จะส่งงาน",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const formFiles = new FormData();
          selectedFiles.forEach((file) => {
            formFiles.append("files", file);
          });
          formFiles.append("body", studentSummit.body);
          formFiles.getAll("body");
          const summitWork = await SummitWork({
            formFiles,
            studentId: student.id,
            assignmentId: assignment.id,
          });

          fetchStudentWork.refetch();
          location.reload();
          Swal.fire("success", "ส่งงานแล้ว", "success");
        } catch (err) {
          if (
            err?.props?.response?.data?.error.message ===
            "student's already summit their work"
          ) {
            Swal.fire(
              "error",
              "นักเรียนได้ส่งงานแล้ว ถ้าจะส่งใหม่ให้ติดต่อครูผู้สอนเพื่อลบงานเดิม",
              "error"
            );
          } else {
            Swal.fire("error", err?.props?.response?.data?.message, "error");
          }
          console.log(err);
        }
      }
    });
  };
  //set files to array
  const handleFileEvent = (e) => {
    const choosenFiles = Array.prototype.slice.call(e.target.files);
    setSelectedFiles(choosenFiles);
  };

  useEffect(() => {
    setTeacher(() => {
      const teacher = localStorage.getItem("teacher");
      return JSON.parse(teacher);
    });
    initLightboxJS(process.env.NEXT_PUBLIC_LIGHTBOX_KEY, "individual");
    const studentWork = localStorage.getItem("assignment");
    setStudent(() => {
      const student = localStorage.getItem("student");
      const convertStudent = JSON.parse(student);
      return convertStudent;
    });
    setAssignment(() => {
      const assignment = localStorage.getItem("assignment");
      const convertAssignment = JSON.parse(assignment);
      setDeadline(() => {
        const date = new Date(convertAssignment.assignment.deadline);
        const formattedDate = date.toLocaleDateString("th-TH", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        return formattedDate;
      });
      return convertAssignment.assignment;
    });
    setTimeout(() => {
      fetchStudentWork.refetch();
    }, 500);
  }, []);

  //check wheter studet has work
  useEffect(() => {
    if (studentWork?.status === "have-work") {
      setActiveMenu(1);
    }
  }, [studentWork]);

  return (
    <div className="  w-full h-full font-Kanit relative pb-96 bg-white  ">
      <div className="w-full absolute top-0 flex justify-between items-center ">
        <div
          role="button"
          aria-label="button go back to classroom"
          onClick={() => {
            setLoading(true);
            router.push({
              pathname: `/classroom/student/${student.id}`,
            });
          }}
          className="w-max h-max  mt-2 ml-2 cursor-pointer group
        flex items-center justify-center active:scale-110 hover:scale-110 transition duration-150"
        >
          <div className="text-2xl text-[#2C7CD1] flex items-center justify-center group-hover:scale-110 transition duration-150 ">
            <IoCaretBackOutline />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-start pt-16 gap-2">
        <div className="w-full flex gap-2 items-center justify-center">
          <div className="w-full ml-5 md:ml-0 h-max text-left max-w-3xl ">
            <span className="font-Kanit text-2xl ml-5 font-bold text-black tracking-wide">
              {assignment?.title}
            </span>
          </div>
        </div>
        <div className="w-11/12 grid gap-2  max-w-5xl">
          <div className="w-full  grid grid-cols-3 place-items-start items-center ">
            <div>Assign by</div>
            <div className="flex gap-2 justify-center items-center col-span-2">
              <span className="uppercase">
                {teacher?.firstName} {teacher?.lastName}
              </span>
              {teacher?.picture ? (
                <div className="w-10 h-10 rounded-full overflow-hidden relative bg-slate-400">
                  <Image
                    src={teacher?.picture}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full overflow-hidden relative bg-blue-400 flex items-center justify-center">
                  <div className="font-Kanit font-bold text-2xl uppercase text-center text-white ">
                    {teacher?.firstName.charAt(0)}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="w-full grid grid-cols-3 place-items-start items-center">
            <div>Deadline</div>
            {fetchStudentWork.isLoading || loading ? (
              <Skeleton variant="rounded" width="100%" height={20} />
            ) : (
              <div className="col-span-2 font-semibold">{deadline}</div>
            )}
          </div>
          <div className="w-full grid grid-cols-3 place-items-start items-center">
            <div>Score</div>
            {fetchStudentWork.isLoading || loading ? (
              <Skeleton variant="rounded" width="100%" height={20} />
            ) : (
              <div className="text-lg">
                <span>{!studentWork?.score ? 0 : studentWork.score}</span>
                <span>/</span>
                <span>{assignment?.maxScore}</span>
              </div>
            )}
          </div>
          <div className="w-full grid grid-cols-3 place-items-start items-center ">
            <div>Status</div>
            {studentWork?.status === "no-work" && (
              <div
                className="w-max px-2 h-4 bg-red-500 py-1 rounded-lg border-2 border-solid border-white
          flex items-center justify-center"
              >
                <span className="flex items-center justify-center font-Kanit text-white flex-col">
                  <div className="text-sm">
                    <span>ไม่ส่งงาน</span>
                  </div>
                </span>
              </div>
            )}
            {studentWork?.status === "have-work" &&
              studentWork.isSummited === false && (
                <div
                  className="w-max px-2 h-4 bg-yellow-500 py-1 rounded-lg border-2 border-solid border-white
          flex items-center justify-center"
                >
                  <span className="flex items-center justify-center font-Kanit text-white flex-col">
                    <div className="text-sm">
                      <span>รอตรวจ</span>
                    </div>
                  </span>
                </div>
              )}
            {studentWork?.status === "have-work" &&
              studentWork.isSummited === true && (
                <div
                  className="w-max px-2 h-4 bg-green-500 py-1 rounded-lg border-2 border-solid border-white
          flex items-center justify-center"
                >
                  <span className="flex items-center justify-center font-Kanit text-white flex-col">
                    <div className="text-sm">
                      <span>ตรวจแล้ว</span>
                    </div>
                  </span>
                </div>
              )}
          </div>
        </div>
        <div className="h-max w-11/12 bg-gray-200 lg:text-lg rounded-md max-w-4xl overflow-x-auto">
          <div
            className=" p-5  text-black font-Kanit"
            dangerouslySetInnerHTML={{
              __html: assignment?.description,
            }}
          />
        </div>
        <div className="font-Poppins flex w-full max-w-5xl h-10 mt-5 gap-10 font-semibold text-[#2C7CD1] relative ">
          {menus.map((menu, index) => {
            return (
              <div
                key={index}
                onClick={() => setActiveMenu(index)}
                className={`${index === 0 && "ml-10"} cursor-pointer`}
              >
                <span
                  className={`${
                    activeMenu === index ? "font-bold" : "font-normal"
                  }`}
                >
                  {menu.title}
                </span>
              </div>
            );
          })}
          <div
            className={`w-28 z-20 absolute h-1 bottom-0  ${menus[activeMenu]?.translate} left-0 transition duration-150 bg-blue-200`}
          ></div>
          <div className="absolute bottom-0 w-full h-1 bg-gray-200"></div>
        </div>

        {activeMenu === 0 && (
          <form
            onSubmit={handleSummitWork}
            className="w-11/12 max-w-3xl h-full mt-1 flex flex-col gap-2"
          >
            {fetchStudentWork.isLoading || loading ? (
              <Skeleton variant="rounded" width="100%" height={300} />
            ) : (
              <div className="h-60 bg-slate-400 relative overflow-hidden rounded-xl drop-shadow-md">
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_TEXTEDITOR_KEY}
                  textareaName="body"
                  init={{
                    link_context_toolbar: true,
                    height: "100%",
                    width: "100%",
                    menubar: false,
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount",
                    ],
                    toolbar:
                      "undo redo | formatselect | " +
                      "bold italic backcolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | ",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
                  }}
                  onEditorChange={(newText) => {
                    setStudentSummit((prevState) => {
                      return {
                        ...prevState,
                        body: newText,
                      };
                    });
                  }}
                />
                <div className="w-full flex justify-end rounded-b-xl absolute left-1 bottom-0 h-10 bg-white">
                  <label className="w-40 ">
                    <input
                      onChange={handleFileEvent}
                      name="files"
                      aria-label="upload image"
                      type="file"
                      multiple="multiple"
                      accept="image/png, image/gif, image/jpeg"
                      className="text-sm text-grey-500 
            file:mr-5 md:file:w-max file:w-20 w-full file:py-2
            file:rounded-full file:border-0
            file:text-sm file:font-Kanit file:font-normal file:text-white
             bg-white rounded-full
            file:bg-blue-400 file:drop-shadow-lg
            hover:file:cursor-pointer hover:file:bg-amber-50
            hover:file:text-amber-700
          "
                    />
                  </label>
                </div>
              </div>
            )}

            <button
              className="w-40 h-10 mt-5  bg-green-500 drop-shadow-md text-white rounded-xl
           flex items-center justify-center"
            >
              ส่งงาน
            </button>
          </form>
        )}

        {activeMenu === 1 && (
          <div className="w-11/12 h-max max-w-3xl">
            {studentWork.status === "no-work" ? (
              <div className="font-Kanit text-2xl text-red-400 font-light h-20 flex items-center justify-center gap-2">
                <span>คุณยังไม่ส่งงาน</span>
                <div className="flex items-center justify-center ">
                  <CiFaceFrown />
                </div>
              </div>
            ) : (
              <div>
                <div>
                  <span className="text-xl font-Kanit text-white">
                    งานของคุณ
                  </span>
                </div>
                {studentWork.picture && (
                  <SlideshowLightbox
                    downloadImages={true}
                    lightboxIdentifier="lightbox1"
                    showThumbnails={true}
                    framework="next"
                    images={studentWork.picture}
                    theme="day"
                    className={`container grid  w-full mx-auto h-full items-center place-items-center
                         max-h-40 gap-2 grid-cols-2 md:grid-cols-3  `}
                  >
                    {studentWork?.picture?.map((image, index) => {
                      return (
                        <Image
                          key={index}
                          src={image.src}
                          alt={image.alt}
                          width={240}
                          height={160}
                          className="object-cover "
                          data-lightboxjs="lightbox1"
                          quality={80}
                        />
                      );
                    })}
                  </SlideshowLightbox>
                )}
                <div className="w-full flex items-center justify-center mt-2">
                  {studentWork?.body && (
                    <div className="w-11/12 flex justify-start">
                      <div className="w-max max-w-5xl pr-6 h-max p-2 rounded-lg bg-blue-50 flex">
                        <span className="font-semibold">นักเรียน:</span>
                        <div
                          className="h-max w-full  overflow-hidden ml-2"
                          dangerouslySetInnerHTML={{
                            __html: studentWork?.body,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="w-full flex items-center justify-center mt-2">
                  {studentWork?.comment && (
                    <div className="w-11/12 flex justify-end">
                      <div className="h-max p-2 rounded-lg bg-green-200 flex flex-row-reverse w-max max-w-5xl">
                        <div>
                          <span className="font-semibold">: ครู</span>
                        </div>
                        <div>{studentWork.comment}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Index;
