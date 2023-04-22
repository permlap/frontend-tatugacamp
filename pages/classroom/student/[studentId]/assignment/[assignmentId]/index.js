import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Editor } from "@tinymce/tinymce-react";
import { IoCaretBackOutline } from "react-icons/io5";
import { Box, TextField } from "@mui/material";
import { SummitWork } from "../../../../../../service/student/assignment";

function Index() {
  const router = useRouter();
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
      console.log(summitWork);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFileEvent = (e) => {
    const choosenFiles = Array.prototype.slice.call(e.target.files);
    setSelectedFiles(choosenFiles);
  };

  useEffect(() => {
    setStudnetWork(() => {
      const studentWork = localStorage.getItem("assignment");
      const convertStudentWork = JSON.parse(studentWork);
      return convertStudentWork.student;
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
    setStudent(() => {
      const student = localStorage.getItem("student");
      const convertStudent = JSON.parse(student);
      return convertStudent;
    });
  }, []);

  return (
    <div className="bg-[#2C7CD1] w-full h-full font-Kanit relative pb-20">
      <div
        role="button"
        aria-label="button go back to classroom"
        onClick={() =>
          router.push({
            pathname: `/classroom/student/${student.id}`,
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

      <div className="w-full flex flex-col items-center justify-start pt-16 gap-2">
        <div className="w-full flex gap-2 items-center justify-center">
          <div
            className="w-28 h-10 bg-orange-500 py-1 rounded-lg border-2 border-solid border-white
          flex items-center justify-center"
          >
            <span className="flex items-center justify-center font-Kanit text-white flex-col">
              <span>คะแนน</span>
              <div className="text-lg">
                <span>{!studentWork?.score && 0}</span>
                <span>/</span>
                <span>{assignment?.maxScore}</span>
              </div>
            </span>
          </div>
          <div
            className="w-28 h-10 py-1 bg-pink-500 rounded-lg border-2 border-solid border-white
          flex items-center justify-center"
          >
            <span className="flex items-center justify-center  font-Kanit text-white flex-col">
              <span>กำหนดส่ง</span>
              <span className="text-lg">{deadline}</span>
            </span>
          </div>
        </div>
        <div className="h-80 w-10/12 p-5 bg-white rounded-lg drop-shadow-lg overflow-auto relative border-2 border-solid border-black">
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

        <form
          onSubmit={handleSummitWork}
          className="w-11/12 h-full mt-1 flex flex-col gap-2"
        >
          <span className="text-2xl text-white font-Poppins font-semibold">
            Summit section
          </span>

          <div className="h-60 ">
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
          </div>
          <label className="w-3/4 ">
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
            file:text-sm file:font-medium bg-white rounded-full
            file:bg-blue-50 file:text-blue-700
            hover:file:cursor-pointer hover:file:bg-amber-50
            hover:file:text-amber-700
          "
            />
          </label>
          <button
            className="w-40 h-10  bg-green-500 drop-shadow-md text-white rounded-xl
           flex items-center justify-center"
          >
            ส่งงาน
          </button>
        </form>
      </div>
    </div>
  );
}

export default Index;
