import React from "react";

import { CreateClassroom } from "../../service/classroom";
import { FcBusinessContact, FcLineChart, FcViewDetails } from "react-icons/fc";
import Swal from "sweetalert2";

function CreateClass({ close, refetch }) {
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData(e.target);
      const inputObject = Object.fromEntries(formData);
      const classroom = await CreateClassroom(inputObject);
      refetch();
      close();
    } catch (err) {
      console.log("err", err);
      Swal.fire(
        "error",
        err?.props?.response?.data?.message.toString(),
        "error"
      );
    }
  };

  return (
    <div>
      <div
        className="flex w-max h-max font-Kanit bg-white border-2 border-solid rounded-lg drop-shadow-xl p-5 z-20 
        top-0 right-0 left-0 bottom-0 m-auto fixed"
      >
        <form
          className=" w-80 flex flex-col justify-center items-center "
          onSubmit={handleSubmit}
        >
          <span className="text-xl font-semibold text-[#2C7CD1]">
            สร้างห้องเรียน
          </span>
          <div className="flex flex-col relative">
            <label className="font-sans font-normal">รายชื่อวิชา</label>
            <input
              className="w-60 h-7 rounded-md   pl-10 
                placeholder:italic placeholder:font-light"
              type="text"
              name="title"
              placeholder="เช่น วิชาภาษาไทย"
              maxLength="30"
            />
            <div
              className="absolute bottom-1 left-2 bg-white text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
            >
              <FcBusinessContact />
            </div>
          </div>

          <div className="flex flex-col relative mt-2">
            <label className="font-sans font-normal">ระดับชั้น</label>
            <input
              className="w-60 h-7 rounded-md   pl-10 
                placeholder:italic placeholder:font-light"
              type="text"
              name="level"
              placeholder="เช่น ม.6/5"
              maxLength="20"
            />
            <div
              className="absolute bottom-1 left-2  text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
            >
              <FcLineChart />
            </div>
          </div>
          <div className="flex flex-col relative mt-2">
            <label className="font-sans font-normal">คำอธิบาย (optional)</label>
            <input
              className="w-60 h-7 rounded-md   pl-10 
                placeholder:italic placeholder:font-light"
              type="text"
              name="description"
              placeholder="เช่น รหัสวิชา ท51153"
              maxLength="20"
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
            สร้าง
          </button>
        </form>
      </div>
      <div
        onClick={() => close()}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></div>
    </div>
  );
}

export default CreateClass;
