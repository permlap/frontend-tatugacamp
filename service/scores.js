import axios from "axios";

export async function GetAllScoresClassroom({ classroomId }) {
  try {
    const access_token = localStorage.getItem("access_token");
    const allScore = await axios.get(
      `${process.env.Server_Url}/user/score/get-class-all-score`,
      {
        params: {
          classroomId: classroomId,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return allScore;
  } catch (err) {
    throw new Error(err);
  }
}

export async function UpdateScoreOnStudent({ scoreId, studentId }) {
  try {
    const access_token = localStorage.getItem("access_token");
    const updateScore = await axios.put(
      `${process.env.Server_Url}/user/score/individual/update`,
      {
        points: 1,
      },
      {
        params: {
          scoreId: scoreId,
          studentId: studentId,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return updateScore;
  } catch (err) {
    throw new Error(err);
  }
}
