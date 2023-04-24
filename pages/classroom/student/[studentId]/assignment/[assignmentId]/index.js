import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Editor } from "@tinymce/tinymce-react";
import { IoCaretBackOutline } from "react-icons/io5";
import { Box, TextField } from "@mui/material";
import {
  GetMyWork,
  SummitWork,
} from "../../../../../../service/student/assignment";
import { SlideshowLightbox, initLightboxJS } from "lightbox.js-react";
import Image from "next/image";
import "lightbox.js-react/dist/index.css";
import { FiMoreVertical } from "react-icons/fi";

function Index() {
  const router = useRouter();
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

  const [student, setStudent] = useState();
  const [studentWork, setStudnetWork] = useState();
  const [assignment, setAssignment] = useState();
  const [deadline, setDeadline] = useState();
  const [studentSummit, setStudentSummit] = useState({
    body: "",
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const handleSummitWork = async (e) => {
    try {
      e.preventDefault();
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
    } catch (err) {
      console.log(err);
    }
  };
  //set files to array
  const handleFileEvent = (e) => {
    const choosenFiles = Array.prototype.slice.call(e.target.files);
    setSelectedFiles(choosenFiles);
  };

  useEffect(() => {
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
        const dateObj = new Date(convertAssignment.assignment.deadline);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // +1 because months start from 0
        const day = String(dateObj.getDate()).padStart(2, "0");
        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate;
      });
      return convertAssignment.assignment;
    });
    setTimeout(() => {
      fetchStudentWork.refetch();
    }, 500);
  }, []);

  return (
    <div className="bg-[#2C7CD1]  w-full h-full font-Kanit relative pb-96 ">
      <div className="w-full absolute top-0 flex justify-between items-center">
        <div
          role="button"
          aria-label="button go back to classroom"
          onClick={() =>
            router.push({
              pathname: `/classroom/student/${student.id}`,
            })
          }
          className="w-28 h-10 bg-transparent border-2 border-solid border-white rounded-lg mt-2 ml-2
        flex items-center justify-center active:bg-orange-500 hover:scale-110 transition duration-150"
        >
          <div className="text-2xl text-white flex items-center justify-center ">
            <IoCaretBackOutline />
          </div>
          <span className="font-Poppins font-semibold text-white">go back</span>
        </div>
        <div className="mr-2">
          <div
            className="text-slate-500 w-max h-max px-1 text-lg flex items-center justify-center py-[6px] 
          rounded-md bg-slate-200 active:bg-blue-600 active:text-white"
          >
            <FiMoreVertical />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-start pt-16 gap-2">
        <div className="w-full flex gap-2 items-center justify-center">
          {studentWork?.status === "no-work" && (
            <div
              className="w-max px-3 h-10 bg-red-500 py-1 rounded-lg border-2 border-solid border-white
          flex items-center justify-center"
            >
              <span className="flex items-center justify-center font-Kanit text-white flex-col">
                <span>สถานะ</span>
                <div className="text-lg">
                  <span>ไม่ส่งงาน</span>
                </div>
              </span>
            </div>
          )}
          {studentWork?.status === "have-work" &&
            studentWork.isSummited === false && (
              <div
                className="w-max px-3 h-10 bg-red-500 py-1 rounded-lg border-2 border-solid border-white
          flex items-center justify-center"
              >
                <span className="flex items-center justify-center font-Kanit text-white flex-col">
                  <span>สถานะ</span>
                  <div className="text-lg">
                    <span>ส่งงานแล้ว</span>
                  </div>
                </span>
              </div>
            )}
          {studentWork?.status === "have-work" &&
            studentWork.isSummited === true && (
              <div
                className="w-max px-3 h-10 bg-red-500 py-1 rounded-lg border-2 border-solid border-white
          flex items-center justify-center"
              >
                <span className="flex items-center justify-center font-Kanit text-white flex-col">
                  <span>สถานะ</span>
                  <div className="text-lg">
                    <span>ตรวจแล้ว</span>
                  </div>
                </span>
              </div>
            )}
          <div
            className="w-max px-3 h-10 bg-orange-500 py-1 rounded-lg border-2 border-solid border-white
          flex items-center justify-center"
          >
            <span className="flex items-center justify-center font-Kanit text-white flex-col">
              <span>คะแนน</span>
              <div className="text-lg">
                <span>{!studentWork?.score ? 0 : studentWork.score}</span>
                <span>/</span>
                <span>{assignment?.maxScore}</span>
              </div>
            </span>
          </div>
          <div
            className="w-max px-3 h-10 py-1 bg-pink-500 rounded-lg border-2 border-solid border-white
          flex items-center justify-center"
          >
            <span className="flex items-center justify-center  font-Kanit text-white flex-col">
              <span>กำหนดส่ง</span>
              <span className="text-lg">{deadline}</span>
            </span>
          </div>
        </div>
        <div className="h-60 w-10/12 p-5 bg-white rounded-lg drop-shadow-lg overflow-auto relative border-2 border-solid border-black">
          <div className="bg-gray-200 w-full left-0 top-0 py-2 flex justify-between  absolute font-semibold ">
            <span className="ml-2">{assignment?.title}</span>
            <div className="w-5 h-5 bg-[#2C7CD1] rounded-full mr-2"></div>
          </div>

          <div
            className="mt-5"
            dangerouslySetInnerHTML={{
              __html: assignment?.description,
            }}
          />
        </div>
        <div className="w-11/12 h-1 bg-white my-2"></div>
        {studentWork?.status === "no-work" && (
          <form
            onSubmit={handleSummitWork}
            className="w-11/12 h-full mt-1 flex flex-col gap-2"
          >
            <span className="text-2xl text-white font-Poppins font-semibold">
              Summit section
            </span>

            <div className="h-60 relative overflow-hidden rounded-xl">
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
                    "link",
                  ],
                  toolbar:
                    "undo redo | formatselect | " +
                    "bold italic backcolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | link",
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
              <div className="w-full flex justify-end absolute bottom-0 h-10 bg-white">
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

            <button
              className="w-40 h-10  bg-green-500 drop-shadow-md text-white rounded-xl
           flex items-center justify-center"
            >
              ส่งงาน
            </button>
          </form>
        )}

        {studentWork?.status === "have-work" && (
          <div className="w-11/12">
            <div>
              <span className="text-xl font-Kanit text-white">งานของคุณ</span>
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
                         max-h-40 overflow-auto  `}
              >
                {studentWork?.picture?.map((image, index) => {
                  return (
                    <Image
                      key={index}
                      src={image.src}
                      alt={image.alt}
                      width={240}
                      height={160}
                      className="object-contain "
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
                  <div className="w-max max-w-5xl pr-6 h-max p-2 rounded-lg bg-white flex">
                    <span className="font-semibold">นักเรียน :</span>
                    <div
                      className="h-max w-44  overflow-hidden ml-2"
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
    </div>
  );
}

export default Index;
