import axios from "axios";
import Error from "next/error";

export async function JoinClassroom({ classroomCode }) {
  try {
    const classrooms = await axios.get(
      `${process.env.Server_Url}/student/classroom/get-a-classroom`,
      {
        params: {
          classroomCode: classroomCode,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return classrooms;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
