import axios from "axios";
import Error from "next/error";

export async function GetStudent({ studentId }) {
  try {
    const student = await axios.get(
      `${process.env.Server_Url}/student/get-a-student`,
      {
        params: {
          studentId: studentId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return student;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
