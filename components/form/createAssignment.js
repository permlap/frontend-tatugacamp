import React, { useState } from "react";
import { FcBusinessContact, FcLineChart, FcViewDetails } from "react-icons/fc";
import { Editor } from "@tinymce/tinymce-react";
import { GrScorecard } from "react-icons/gr";
import Image from "next/image";
import { CreateAssignmentApi } from "../../service/assignment";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

export default function CreateAssignment({
  close,
  setTriggerAssignment,
  students,
}) {
  const rounter = useRouter();
  const [assignmentData, setAssignmentData] = useState({
    title: "",
    body: "",
    deadline: "",
    maxScore: "",
  });
  const [isAssignStudent, setIsAssignmentStdent] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssignmentData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const createAssignment = await CreateAssignmentApi({
        classroomId: rounter.query.classroomId,
        title: assignmentData.title,
        description: assignmentData.body,
        maxScore: assignmentData.maxScore,
        deadline: assignmentData.deadline,
      });
      Swal.fire("success", "assignment has been createed", "success");
      setIsAssignmentStdent(true);
    } catch (err) {
      console.log(err);
      Swal.fire(
        "error",
        err?.props?.response?.data?.message.toString(),
        "error"
      );
    }
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex w-5/6  h-5/6 font-Kanit bg-white border-2 border-solid rounded-lg drop-shadow-xl p-10 z-40 
    top-0 right-0 left-0 bottom-0 m-auto fixed"
      >
        {isAssignStudent === false ? (
          <div className="w-full flex gap-8">
            <div className="flex-col flex gap-4 w-3/4">
              <div className="flex flex-col gap-0">
                <label className="relative cursor-pointer">
                  <input
                    onChange={handleChange}
                    name="title"
                    type="text"
                    placeholder="title"
                    className="h-10 w-3/4 pl-5 text-xl text-black appearance-none ring-2 ring-gray-200
                    border-0 rounded-lg border-opacity-50 outline-none focus:ring-black
                    placeholder-gray-300 placeholder-opacity-0 transition duration-200"
                  />
                  <span
                    className="text-2xl   bg-white  text-black
                 text-opacity-80  absolute left-5 top-2 px-1 transition duration-200 input-text"
                  >
                    Title
                  </span>
                </label>
              </div>
              <div className="flex flex-col gap-0">
                <Editor
                  apiKey="bis00u2a6lpujg7c1unyyclqhzqbq3boyusyz01w3jdpgisi"
                  textareaName="description"
                  initialValue="<p>รายละเอียดของงาน....</p>"
                  init={{
                    height: 400,
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
                      "removeformat | help",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                  onEditorChange={(newText) =>
                    setAssignmentData((prev) => {
                      return {
                        ...prev,
                        body: newText,
                      };
                    })
                  }
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 mt-2 rounded-full bg-[#2C7CD1] text-white font-sans font-bold
              text-md cursor-pointer hover: active:border-2  active:border-gray-300
               active:border-solid  focus:border-2 hover:bg-red-500 transition duration-150
              focus:border-solid"
              >
                สร้าง
              </button>
            </div>
            <div
              className="w-[30%] h-full border-2 border-solid border-gray-200 rounded-xl 
          flex flex-col items-center justify-start gap-5"
            >
              <div className="mt-5 flex flex-col">
                <label>กำหนดส่ง</label>
                <input
                  onChange={handleChange}
                  name="deadline"
                  className="w-40 appearance-none outline-none border-none ring-2 rounded-md px-5 
                py-2 text-lg ring-gray-200 focus:ring-black "
                  type="date"
                  placeholder="Please select a date"
                  required
                />
              </div>
              <div className="flex flex-col w-max relative  h-max ">
                <label>คะแนนของงาน</label>
                <input
                  required
                  onChange={handleChange}
                  name="maxScore"
                  className="w-40 appearance-none outline-none border-none ring-2 rounded-md px-5 
                py-2 text-lg ring-gray-200 focus:ring-black placeholder:text-sm"
                  type="number"
                  placeholder="ใส่คะแนนของงาน"
                />
                <div className="text-lg absolute top-8 right-5">
                  <GrScorecard />
                </div>
              </div>
              <div className="relative w-60 h-80">
                <Image
                  src="https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3053.PNG"
                  layout="fill"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex items-center justify-start flex-col gap-10">
            <div className="text-2xl font-Kanit font-semibold">
              เลือกผู้เรียนเพื่อมอบหมายงาน
            </div>
            <div className="w-2/4 h-3/4 border-2 border-solid flex items-center justify-start flex-col">
              {students?.data?.data?.map((student) => {
                return (
                  <div>
                    <div>{student.firstName}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </form>
      <div
        onClick={() => setTriggerAssignment(false)}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></div>
    </div>
  );
}
