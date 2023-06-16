export default {
  name: "whatsNews",
  title: "what's news",
  type: "document",
  fields: [
    {
      name: "title",
      title: "news - title",
      type: "string",
    },
    {
      name: "NewsEnglish",
      title: "news - English",
      type: "blockContent",
    },
    {
      name: "NewsThai",
      title: "news - Thai",
      type: "blockContent",
    },
  ],
};
