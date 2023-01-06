export default {
  name: "taboo",
  title: "taboo",
  type: "document",
  fields: [
    {
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "vocabulary",
      title: "vocabulary",
      type: "string",
    },
    {
      name: "firstTaboo",
      title: "first Taboo",
      type: "string",
    },
    {
      name: "secondTaboo",
      title: "second Taboo",
      type: "string",
    },
    {
      name: "thirdTaboo",
      title: "third Taboo",
      type: "string",
    },
  ],
};
