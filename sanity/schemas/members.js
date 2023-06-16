export default {
  name: "members",
  title: "members",
  type: "document",
  fields: [
    {
      name: "name",
      title: "name",
      type: "string",
      validation: (Rule) =>
        Rule.required().min(1).warning("must fill the data"),
    },
    {
      name: "position",
      title: "position",
      type: "string",
      validation: (Rule) =>
        Rule.required().min(1).warning("must fill the data"),
    },
    {
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "secondImage",
      title: "second image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
  ],
};
