import axios from "axios";

export async function CreateAssignmentApi({
  classroomId,
  title,
  description,
  deadline,
  maxScore,
}) {
  try {
    const maxScoreNum = Number(maxScore);
    const dateFormat = new Date(deadline);
    console.log(dateFormat);
    const access_token = localStorage.getItem("access_token");
    const assignment = await axios.post(
      `${process.env.Server_Url}/user/assignment/create`,
      {
        title: title,
        deadline: dateFormat,
        description: description,
        maxScore: maxScoreNum,
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
    return assignment;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function GetAllAssignments({ classroomId }) {
  try {
    const access_token = localStorage.getItem("access_token");
    const assignments = await axios.get(
      `${process.env.Server_Url}/user/assignment/get-all-assignment`,

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
    return assignments;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
