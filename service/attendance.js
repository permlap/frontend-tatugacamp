import axios from "axios";
import Error from "next/error";
import { v4 as uuidv4 } from "uuid";

export async function CreateAttendance({
  classroomId,
  attendanceDate,
  isChecks,
}) {
  try {
    const access_token = localStorage.getItem("access_token");
    const formatDate = new Date(attendanceDate).toISOString();
    let attendacnes = [];
    const uniqueId = uuidv4();
    for (const student of isChecks) {
      try {
        const attendacne = await axios.post(
          `${process.env.Server_Url}/user/attendance/create`,
          {
            date: formatDate,
            present: student[student.id].present,
            absent: student[student.id].absent,
            holiday: student[student.id].holiday,
            groupId: uniqueId,
          },
          {
            params: {
              classroomId: classroomId,
              studentId: student.id,
            },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        attendacnes.push({ success: { ...student } });
      } catch (err) {
        attendacnes.push({ fail: { ...student } });
        throw new Error(err);
      }
    }
    return attendacnes;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function GetAllAttendance({ classroomId }) {
  try {
    const access_token = localStorage.getItem("access_token");
    const GetAllAttendacne = await axios.get(
      `${process.env.Server_Url}/user/attendance/get-all`,
      {
        params: {
          classroomId: classroomId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return GetAllAttendacne;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function DeleteAttendance({ groupId }) {
  try {
    const access_token = localStorage.getItem("access_token");
    const deleteAttendance = await axios.delete(
      `${process.env.Server_Url}/user/attendance/delete`,
      {
        params: {
          groupId: groupId,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return deleteAttendance;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function UpdateAttendnaceAPI({
  attendanceId,
  absent,
  present,
  holiday,
}) {
  try {
    const access_token = localStorage.getItem("access_token");
    const update = await axios.put(
      `${process.env.Server_Url}/user/attendance/update`,
      { absent, present, holiday },
      {
        params: {
          attendanceId: attendanceId,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return update;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
