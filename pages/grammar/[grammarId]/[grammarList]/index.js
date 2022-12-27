import React from "react";

function index() {
  return <div>index</div>;
}

export default index;

export const getStaticPaths = async () => {
  return {
    paths: [
      { params: { grammarId: "basic-grammar", grammarList: "verb-to-be" } },
    ],
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const slug = await context.params;
  console.log(slug);
  return {
    props: {
      data: null,
    },
  };
};
