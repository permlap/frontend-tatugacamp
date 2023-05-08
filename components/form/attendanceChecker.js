import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MdEmojiPeople } from "react-icons/md";
import Swal from "sweetalert2";
import { CreateAttendance, GetAllAttendance } from "../../service/attendance";
import Loading from "../loading/loading";
import { useQuery } from "react-query";

function AttendanceChecker({ close, students }) {
  const router = useRouter();
  const [isCheckStudent, setIsCheckStudent] = useState();
  const currentDate = new Date().toISOString().slice(0, 10); // get current date in "yyyy-mm-dd" format
  const [attendanceDate, setAttendanceDate] = useState(currentDate);
  const [loading, setLoading] = useState(false);
  const attendances = useQuery(
    ["attendance"],
    () => GetAllAttendance({ classroomId: router.query.classroomId }),
    {
      enabled: false,
    }
  );
  useEffect(() => {
    setIsCheckStudent(() =>
      students?.data?.data?.map((student) => {
        return {
          ...student,
          [student.id]: { absent: false, present: false, holiday: false },
        };
      })
    );
  }, []);
  const handleIsCheckStudent = ({ studentId, event }) => {
    const { name } = event.target;
    setIsCheckStudent((prevState) => {
      return prevState.map((prevStudent) => {
        if (prevStudent.id === studentId) {
          if (
            (prevStudent[studentId].holiday &&
              prevStudent[studentId].present) ||
            prevStudent[studentId].absent
          ) {
            return {
              ...prevStudent,
              [studentId]: {
                ...!prevStudent[studentId],
                [name]: !prevStudent[prevStudent.id][name],
              },
            };
          }
          if (
            (prevStudent[studentId].present && prevStudent[studentId].absent) ||
            prevStudent[studentId].holiday
          ) {
            return {
              ...prevStudent,
              [studentId]: {
                ...!prevStudent[studentId],
                [name]: !prevStudent[prevStudent.id][name],
              },
            };
          }
          if (
            (prevStudent[studentId].holiday && prevStudent[studentId].absent) ||
            prevStudent[studentId].present
          ) {
            return {
              ...prevStudent,
              [studentId]: {
                ...!prevStudent[studentId],
                [name]: !prevStudent[prevStudent.id][name],
              },
            };
          }
          return {
            ...prevStudent,
            [studentId]: {
              ...prevStudent[studentId],
              [name]: !prevStudent[prevStudent.id][name],
            },
          };
        } else {
          return { ...prevStudent };
        }
      });
    });
  };

  const handleCheckAllstudent = (event) => {
    const name = event.currentTarget.name;
    setIsCheckStudent((prevState) => {
      return prevState.map((prevStudent) => {
        if (
          (prevStudent[prevStudent.id].holiday &&
            prevStudent[prevStudent.id].present) ||
          prevStudent[prevStudent.id].absent
        ) {
          return {
            ...prevStudent,
            [prevStudent.id]: {
              ...!prevStudent[prevStudent.id],
              [name]: !prevStudent[prevStudent.id][name],
            },
          };
        }
        if (
          (prevStudent[prevStudent.id].present &&
            prevStudent[prevStudent.id].absent) ||
          prevStudent[prevStudent.id].holiday
        ) {
          return {
            ...prevStudent,
            [prevStudent.id]: {
              ...!prevStudent[prevStudent.id],
              [name]: !prevStudent[prevStudent.id][name],
            },
          };
        }
        if (
          (prevStudent[prevStudent.id].holiday &&
            prevStudent[prevStudent.id].absent) ||
          prevStudent[prevStudent.id].present
        ) {
          return {
            ...prevStudent,
            [prevStudent.id]: {
              ...!prevStudent[prevStudent.id],
              [name]: !prevStudent[prevStudent.id][name],
            },
          };
        }
        return {
          ...prevStudent,
          [prevStudent.id]: {
            ...prevStudent[prevStudent.id],
            [name]: !prevStudent[prevStudent.id][name],
          },
        };
      });
    });
  };

  const handleSummitForm = async () => {
    try {
      setLoading(true);
      const createAttendace = await CreateAttendance({
        isChecks: isCheckStudent,
        attendanceDate: attendanceDate,
        classroomId: router.query.classroomId,
      });
      setLoading(false);
      Swal.fire("success", "check attendacne completed", "success");
      document.body.style.overflow = "auto";
      attendances.refetch();
    } catch (err) {
      setLoading(false);
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
    <div className=" fixed top-0 right-0 left-0 bottom-0 m-auto righ z-40">
      <div
        className="md:w-3/4 md:h-max fixed z-40 top-0 bottom-0 right-0
       left-0 m-auto flex  items-center justify-center gap-5 bg-white p-5 rounded-lg  "
      >
        <div className="md:w-9/12 md:h-full bg-white flex flex-col items-center justify-start gap-5 ">
          {/* headers parts */}
          <div className="w-full flex items-center justify-between ">
            <div className="flex">
              <span className="font-Kanit text-xl font-semibold text-black">
                เช็คชื่อผู้เรียน
              </span>
              <div className="text-3xl text-blue-600">
                <MdEmojiPeople />
              </div>
            </div>
            <div className="flex gap-10 items-end justify-center">
              <div className="mt-2 flex flex-col text-black font-Kanit">
                <label>เลือกวันที่</label>
                <input
                  onChange={(e) =>
                    setAttendanceDate(() => {
                      const value = e.target.value;
                      return value;
                    })
                  }
                  defaultValue={currentDate}
                  name="deadline"
                  className="w-40 appearance-none outline-none border-none ring-2 rounded-md px-5 
                py-2 text-lg ring-gray-200 focus:ring-black "
                  type="date"
                  placeholder="Please select a date"
                />
              </div>
              {loading ? (
                <div
                  className="w-max  text-white flex items-center hover:scale-110 transition duration-150 
                cursor-pointer
               justify-center h-max px-8 py-2 rounded-lg font-Poppins"
                >
                  <Loading />
                </div>
              ) : (
                <button
                  onClick={handleSummitForm}
                  className="w-max bg-blue-500 text-white flex items-center hover:scale-110 transition duration-150 
                cursor-pointer
               justify-center h-max px-8 py-2 rounded-lg font-Poppins"
                >
                  summit
                </button>
              )}
            </div>
          </div>

          <div className="w-full flex justify-center items-center flex-col ">
            <ul className="list-none pl-0 grid grid-cols-7 w-full place-items-center text-black font-Kanit ">
              <li className="">เลขที่</li>
              <li className="col-span-2">ชื่อจริง</li>
              <li className="">นามสกุล</li>
              <div className="grid-cols-3 col-span-3  grid w-full gap-5 place-items-center ">
                <button
                  onClick={handleCheckAllstudent}
                  name="present"
                  role="button"
                  aria-label="check all"
                  className="w-full bg-green-500 rounded-2xl text-white text-center 
                  hover:scale-110 transition duration-150 cursor-pointer group"
                >
                  <span className="block group-hover:hidden">เข้าเรียน</span>
                  <span className="hidden group-hover:block text-base">
                    เลือกทั้งหมด
                  </span>
                </button>
                <button
                  onClick={handleCheckAllstudent}
                  name="holiday"
                  role="button"
                  aria-label="check all"
                  className="w-full bg-yellow-500 rounded-2xl text-white text-center 
                  hover:scale-110 transition duration-150 cursor-pointer group"
                >
                  <span className="block group-hover:hidden">ลา</span>
                  <span className="hidden group-hover:block text-base">
                    เลือกทั้งหมด
                  </span>
                </button>
                <button
                  onClick={handleCheckAllstudent}
                  name="absent"
                  role="button"
                  aria-label="check all"
                  className="w-full bg-red-500 rounded-2xl text-white text-center
                  hover:scale-110 transition duration-150 cursor-pointer group"
                >
                  <span className="block group-hover:hidden">ขาด</span>
                  <span className="hidden group-hover:block text-base">
                    เลือกทั้งหมด
                  </span>
                </button>
              </div>
            </ul>
            <div className="w-full h-full items-center justify-start max-h-96 mt-2 overflow-auto scrollbar-hide fade-mask-short flex flex-col gap-2">
              {isCheckStudent?.map((student) => {
                return (
                  <ul
                    key={student.id}
                    className="list-none pl-0 grid grid-cols-7 w-full place-items-center text-black font-Kanit "
                  >
                    <li className="">{student.number}</li>
                    <li className="col-span-2">{student.firstName}</li>
                    <li className="">{student?.lastName}</li>
                    <div className="grid-cols-3 col-span-3  grid w-full   place-items-center  ">
                      <div
                        className=" bg-green-500 rounded text-white text-center
                       p-1  w-6 h-6 flex items-center justify-center"
                      >
                        <input
                          name="present"
                          onChange={(event) =>
                            handleIsCheckStudent({
                              studentId: student.id,
                              event,
                            })
                          }
                          checked={student?.[student.id].present}
                          className="h-5 w-5 rounded-full shadow"
                          type="checkbox"
                        />
                      </div>
                      <div
                        className=" bg-yellow-500 rounded-md text-white text-center 
                      p-1  w-6 h-6 flex items-center justify-center"
                      >
                        <input
                          onChange={(event) =>
                            handleIsCheckStudent({
                              studentId: student.id,
                              event,
                            })
                          }
                          checked={student?.[student.id].holiday}
                          name="holiday"
                          className="h-5 w-5 rounded-full shadow"
                          type="checkbox"
                        />
                      </div>
                      <div
                        className=" bg-red-500 rounded-md text-white text-center 
                      p-1  w-6 h-6 flex items-center justify-center"
                      >
                        <input
                          onChange={(event) =>
                            handleIsCheckStudent({
                              studentId: student.id,
                              event,
                            })
                          }
                          checked={student?.[student.id].absent}
                          name="absent"
                          className="h-5 w-5 rounded-full shadow"
                          type="checkbox"
                        />
                      </div>
                    </div>
                  </ul>
                );
              })}
              <br />
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

export default AttendanceChecker;
