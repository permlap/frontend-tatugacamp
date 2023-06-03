import React, { useState } from "react";
import { FcBusinessContact, FcLineChart, FcViewDetails } from "react-icons/fc";
import Swal from "sweetalert2";
import { DownloadExcelAttendance } from "../../service/dowloadFile";
import { useRouter } from "next/router";

function DowloadExcelAttendacne({ close, language }) {
  const router = useRouter();
  const [excelData, setExcelData] = useState({
    holiday:
      language === "Thai" ? "ลา" : language === "English" && "take a leave",
    absent: language === "Thai" ? "ขาด" : language === "English" && "absent",
    present:
      language === "Thai" ? "มาเรียน" : language === "English" && "present",
  });
  const handleChangeExcelData = (e) => {
    const { name, value } = e.target;
    setExcelData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleDownloadFile = async () => {
    try {
      await DownloadExcelAttendance({
        classroomId: router.query.classroomId,
        absent: excelData.absent,
        holiday: excelData.holiday,
        present: excelData.present,
      });
      Swal.fire(
        "ดาวโหลดสำเร็จ",
        "ดาวโหลดไฟล์รายงานผลเข้าเรียนเรียบร้อย",
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
  return (
    <div>
      <div
        className="flex w-max h-max font-Kanit bg-white border-2 border-solid rounded-lg drop-shadow-xl p-5 z-20 
        top-0 right-0 left-0 bottom-0 m-auto fixed"
      >
        <form
          onSubmit={handleDownloadFile}
          className=" w-80 flex flex-col justify-center items-center "
        >
          <span className="text-xl font-semibold text-[#2C7CD1]">
            {language === "Thai" && "โหลดไฟล์ Excel"}
            {language === "English" && "Dowload file excel"}
          </span>
          <div className="flex flex-col relative">
            <label className="font-sans font-normal">
              {language === "Thai" && "สถานะะมาเรียน"}
              {language === "English" && "present"}
            </label>
            <input
              onChange={handleChangeExcelData}
              className="w-60 h-7 rounded-md   pl-10 
                placeholder:italic placeholder:font-light"
              type="text"
              name="present"
              value={excelData.present}
              placeholder={
                language === "Thai"
                  ? "กรอกอักษร เมื่อนักเรียนมีสถานะมาเรียน"
                  : language === "English" &&
                    "Put any text when student's present"
              }
              maxLength="10"
              required
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
              {language === "Thai" && "สถานะขาดเรียน"}
              {language === "English" && "absent"}
            </label>
            <input
              onChange={handleChangeExcelData}
              className="w-60 h-7 rounded-md   pl-10 
                placeholder:italic placeholder:font-light"
              type="text"
              name="absent"
              value={excelData.absent}
              placeholder={
                language === "Thai"
                  ? "กรอกอักษร เมื่อนักเรียนมีสถานะขาดเรียน"
                  : language === "English" &&
                    "Put any text when student's absent"
              }
              maxLength="10"
              required
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
              {language === "Thai" && "สถาะนะลา"}
              {language === "English" && "take a leave  "}
            </label>
            <input
              onChange={handleChangeExcelData}
              className="w-60 h-7 rounded-md   pl-10 
                placeholder:italic placeholder:font-light"
              type="text"
              name="holiday"
              value={excelData.holiday}
              placeholder={
                language === "Thai"
                  ? "กรอกอักษร เมื่อนักเรียนมีสถานะลา"
                  : language === "English" &&
                    "Put any text when student's on holiday"
              }
              maxLength="10"
              required
            />
            <div
              className="absolute bottom-1 left-2  text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
            >
              <FcViewDetails />
            </div>
          </div>

          <button
            aria-label="create classroom button"
            className="w-full  h-9 mt-2 rounded-full bg-[#2C7CD1] text-white font-sans font-bold
              text-md cursor-pointer hover: active:border-2  active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid"
          >
            {language === "Thai" && "ดาวน์โหลด"}
            {language === "English" && "dowload"}
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

export default DowloadExcelAttendacne;
