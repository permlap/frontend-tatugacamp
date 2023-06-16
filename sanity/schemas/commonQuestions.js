export default {
  name: "commonQuestions",
  title: "common questions",
  type: "document",
  fields: [
    {
      name: "questionThai",
      title: "question - Thai",
      type: "string",
    },
    {
      name: "questionEnglish",
      title: "question - English",
      type: "string",
    },
    {
      name: "answerThai",
      title: "answer - Thai",
      type: "blockContent",
    },
    {
      name: "answerEnglish",
      title: "answer - English",
      type: "blockContent",
    },
  ],
};
