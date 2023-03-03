import axios from "axios";
import React from "react";

function Index({ data }) {
  console.log(data);
  return <div>Index</div>;
}

export default Index;

export const getServerSideProps = async (context) => {
  const { params, query } = context;

  const data = await axios.get(
    `${process.env.Server_Url}/user/classroom/get-a-classroom/${params.classroomId}`,
    {
      headers: {
        Authorization: "Bearer " + query.access_token,
      },
    }
  );

  return {
    props: {
      data: data.data,
    },
  };
};
