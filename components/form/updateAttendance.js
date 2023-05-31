import Image from "next/image";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { UpdateAttendnaceAPI } from "../../service/attendance";

function UpdateAttendance({
  close,
  student,
  attendanceData,
  attendances,
  language,
}) {
  const [activeAttendance, setActiveAttendance] = useState();
  const [reCheck, setReCheck] = useState();
  const date = new Date(attendanceData.date);
  const formattedDate = date.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  useEffect(() => {
    if (attendanceData.present) {
      setActiveAttendance(0);
    }
    if (attendanceData.holiday) {
      setActiveAttendance(1);
    }
    if (attendanceData.absent) {
      setActiveAttendance(2);
    }
    setReCheck(() => {
      return {
        absent: attendanceData.absent,
        present: attendanceData.present,
        holiday: attendanceData.holiday,
      };
    });
  }, []);

  const checkList = [
    {
      titleThai: "เข้าเรียน",
      titleEnglish: "Present",
      bgColor: "bg-green-500",
    },
    {
      titleThai: "ลา",
      titleEnglish: "Take a leave",
      bgColor: "bg-yellow-500",
    },
    {
      titleThai: "ขาด",
      titleEnglish: "Absent",
      bgColor: "bg-red-500",
    },
  ];

  const handleUpdateAttendance = async () => {
    try {
      const update = await UpdateAttendnaceAPI({
        attendanceId: attendanceData.id,
        absent: reCheck.absent,
        present: reCheck.present,
        holiday: reCheck.holiday,
      });
      attendances.refetch();
      Swal.fire("success", "attendance has been updated", "success");
      document.body.style.overflow = "auto";
    } catch (err) {
      console.log(err);
      Swal.fire(
        "error",
        err?.props?.response?.data?.message.toString(),
        "error"
      );
      document.body.style.overflow = "auto";
    }
  };
  return (
    <div className=" fixed top-0 right-0 left-0 bottom-0 m-auto righ z-10 font-Kanit">
      <div
        className="md:w-96 md:h-72 fixed z-40 top-0 bottom-0 right-0
       left-0 m-auto flex flex-col  items-center justify-start gap-2 bg-white p-5 rounded-lg  "
      >
        <div
          className={`w-20 h-20 ${checkList[activeAttendance]?.bgColor} rounded-full relative`}
        >
          <Image src={student.picture} layout="fill" className="object-cover" />
        </div>
        <div className="font-Kanit flex gap-3">
          <span>{student.number}</span>
          <span>
            {student.firstName} {student?.lastName}
          </span>
        </div>
        <div className="w-full h-40  flex flex-col items-center justify-start">
          <div>
            <span>{formattedDate}</span>
            <div className="w-80 h-[1px] bg-blue-500"></div>
          </div>
          <div className="flex items-center w-full h-3/4 gap-5 justify-center">
            {checkList.map((attendance, index) => {
              return (
                <div
                  onClick={() => {
                    setReCheck(() => {
                      if (index === 0) {
                        return {
                          absent: false,
                          present: true,
                          holiday: false,
                        };
                      } else if (index === 1) {
                        return {
                          absent: false,
                          present: false,
                          holiday: true,
                        };
                      } else if (index === 2) {
                        return {
                          absent: true,
                          present: false,
                          holiday: false,
                        };
                      }
                    });
                    setActiveAttendance(index);
                  }}
                  key={index}
                  className={`
                  ${attendance.bgColor}
                  w-24 h-8 text-center flex items-center justify-center text-white rounded-lg cursor-pointer 
                  border-2 border-solid hover:scale-105 transition duration-150 ${
                    activeAttendance === index ? "border-black" : "border-white"
                  }
                  
                  `}
                >
                  {language === "Thai" && attendance.titleThai}
                  {language === "English" && attendance.titleEnglish}
                </div>
              );
            })}
          </div>
          <div className="w-full flex items-center justify-center">
            <div
              onClick={handleUpdateAttendance}
              className="bg-blue-400 w-28 h-10 flex items-center cursor-pointer text-white
          justify-center hover:scale-110 transition duration-150 rounded-xl drop-shadow-lg"
            >
              {language === "Thai" && "แก้ไข"}
              {language === "English" && "Update"}
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={() => {
          document.body.style.overflow = "auto";
          close();
        }}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></div>
    </div>
  );
}

export default UpdateAttendance;
