import axios from "axios";
import Error from "next/error";
export async function GetAttendances({ studentId, classroomId }) {
  try {
    const attendances = await axios.get(
      `${process.env.Server_Url}/student/attendance/get-attendance`,
      {
        params: {
          studentId: studentId,
          classroomId: classroomId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return attendances;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
