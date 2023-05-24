import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";
import { v4 as uuidv4 } from "uuid";

export async function CreateAttendance({
  classroomId,
  attendanceDate,
  isChecks,
}) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const formatDate = new Date(attendanceDate).toISOString();

    const uniqueId = uuidv4();
    const students = isChecks.map((student) => {
      return {
        id: student.id,
        attendance: student[student.id],
      };
    });
    console.log(students);
    const attendacne = await axios.post(
      `${process.env.Server_Url}/user/attendance/create`,
      {
        date: formatDate,
        groupId: uniqueId,
        students: students,
      },
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

    return attendacne;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function GetAllAttendance({ classroomId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
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
    const cookies = parseCookies();
    const access_token = cookies.access_token;
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
    const cookies = parseCookies();
    const access_token = cookies.access_token;
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
