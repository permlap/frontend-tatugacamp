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
      validation: (Rule) =>
        Rule.required().min(1).max(80).warning("must fill the data"),
    },
    {
      name: "firstTaboo",
      title: "first Taboo",
      type: "string",
      validation: (Rule) =>
        Rule.required().min(1).max(80).warning("must fill the data"),
    },
    {
      name: "secondTaboo",
      title: "second Taboo",
      type: "string",
      validation: (Rule) =>
        Rule.required().min(1).max(80).warning("must fill the data"),
    },
    {
      name: "thirdTaboo",
      title: "third Taboo",
      type: "string",
      validation: (Rule) =>
        Rule.required().min(1).max(80).warning("must fill the data"),
    },
    {
      name: "category",
      title: "category",
      type: "reference",
      to: { type: "categoryTaboo" },
    },
  ],
};
