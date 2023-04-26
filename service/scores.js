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

export async function UpdateScoreOnStudent(
  { scoreId, studentId },
  inputValues
) {
  try {
    let points = 1;

    if (!inputValues) {
      points = 1;
    } else if (inputValues) {
      points = Number(inputValues);
    }
    const access_token = localStorage.getItem("access_token");
    const updateScore = await axios.put(
      `${process.env.Server_Url}/user/score/individual/update`,
      {
        points: points,
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

export async function UpdateScoreOnWholeClass(
  { scoreId },
  inputValues,
  classroomId
) {
  try {
    let points = 1;
    if (!inputValues) {
      points = 1;
    } else if (inputValues) {
      points = Number(inputValues);
    }
    const access_token = localStorage.getItem("access_token");
    const updateScore = await axios.put(
      `${process.env.Server_Url}/user/score/update/score/students`,
      {
        points: points,
      },
      {
        params: {
          scoreId: scoreId,
          classroomId: classroomId,
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

export async function CreateScoreOnClass({ title, emoji, classroomId }) {
  try {
    const access_token = localStorage.getItem("access_token");
    const score = await axios.post(
      `${process.env.Server_Url}/user/score/create`,
      {
        title: title,
        picture: emoji,
      },
      {
        params: {
          classroomId: classroomId,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return score;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function HideScore({ scoreId }) {
  try {
    const access_token = localStorage.getItem("access_token");
    const score = await axios.put(
      `${process.env.Server_Url}/user/score/hide-score`,
      {},
      {
        params: {
          scoreId: scoreId,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return score;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
