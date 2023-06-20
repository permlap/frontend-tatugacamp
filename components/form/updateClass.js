import React, { useState } from "react";

import { UpdateClassroom } from "../../service/classroom";
import { FcBusinessContact, FcLineChart, FcViewDetails } from "react-icons/fc";
import Swal from "sweetalert2";

function UpdateClass({ close, classroom, refetch, language }) {
  const [classroomState, setClassroomState] = useState(classroom);
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const classroom = await UpdateClassroom({
        classroomState,
      });

      Swal.fire("success", classroom.data.message, "success");
      document.body.style.overflow = "auto";
      refetch();
    } catch (err) {
      console.log("err", err);
      document.body.style.overflow = "auto";
      Swal.fire(
        "error",
        err?.props?.response?.data?.message.toString(),
        "error"
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassroomState((prev) => {
      return { ...prev, [name]: value };
    });
  };

  return (
    <div className="relative z-40">
      <div
        className="flex w-max h-max font-Kanit p-5 bg-white border-2 border-solid rounded-lg drop-shadow-xl  z-20 
        top-0 right-0 left-0 bottom-0 m-auto fixed"
      >
        <form
          className=" w-80 flex flex-col justify-center items-center "
          onSubmit={handleSubmit}
        >
          <span className="text-xl font-semibold text-[#2C7CD1]">
            {language === "Thai" && "แก้ไขห้องเรียนของคุณ"}
            {language === "English" && "Classroom setting"}
          </span>
          <div className="flex flex-col relative">
            <label className="font-sans font-normal">
              {language === "Thai" && "รายชื่อวิชา"}
              {language === "English" && "title"}
            </label>
            <input
              onChange={handleChange}
              className="w-60 h-7 rounded-md   pl-10 
                placeholder:italic placeholder:font-light"
              type="text"
              name="title"
              placeholder={
                language === "Thai"
                  ? "เช่น วิชาภาษาไทย"
                  : language === "English" && "Ex. mathematics"
              }
              maxLength="30"
              value={classroomState.title}
            />
            <div
              className="absolute bottom-1 left-2 bg-white text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
            >
              <FcBusinessContact />
            </div>
          </div>

          <div className="flex flex-col relative mt-2">
            <label className="font-sans font-normal">
              {language === "Thai" && "ระดับชั้น"}
              {language === "English" && "level"}
            </label>
            <input
              className="w-60 h-7 rounded-md   pl-10 
                placeholder:italic placeholder:font-light"
              type="text"
              onChange={handleChange}
              name="level"
              placeholder={
                language === "Thai"
                  ? "เช่น ม.6/5"
                  : language === "English" && "grade 6 / 4"
              }
              maxLength="20"
              value={classroomState.level}
            />
            <div
              className="absolute bottom-1 left-2  text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
            >
              <FcLineChart />
            </div>
          </div>
          <div className="flex flex-col relative mt-2">
            <label className="font-sans font-normal">
              {language === "Thai" && "คำอธิบาย (optional) "}
              {language === "English" && "description (optional)"}
            </label>
            <input
              className="w-60 h-7 rounded-md   pl-10 
                placeholder:italic placeholder:font-light"
              onChange={handleChange}
              type="text"
              name="description"
              placeholder={
                language === "Thai"
                  ? "เช่น ท55435"
                  : language === "English" && "Ex. MATH445"
              }
              maxLength="20"
              value={classroomState.description}
            />
            <div
              className="absolute bottom-1 left-2  text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
            >
              <FcViewDetails />
            </div>
          </div>

          <button
            className="w-full  h-9 mt-2 rounded-full bg-[#2C7CD1] text-white font-sans font-bold
              text-md cursor-pointer hover: active:border-2  active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid"
          >
            {language === "Thai" && "แก้ไข"}
            {language === "English" && "enter"}
          </button>
        </form>
      </div>
      <div
        onClick={() => {
          console.log("click");
          close();
          document.body.style.overflow = "auto";
        }}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-20 bg-black/30 "
      ></div>
    </div>
  );
}

export default UpdateClass;
