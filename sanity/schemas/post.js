export default {
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) =>
        Rule.required().min(1).warning("must fill the data"),
    },
    {
      name: "description",
      title: "Description",
      type: "string",
      validation: (Rule) =>
        Rule.required().min(1).warning("must fill the data"),
    },
    {
      name: "LongDescription",
      title: "Long Description",
      type: "string",
      validation: (Rule) =>
        Rule.required().min(1).warning("must fill the data"),
    },
    {
      name: "price",
      title: "Price",
      type: "number",
    },
    {
      name: "payoutLink",
      title: "payoutLink",
      type: "url",
    },
    {
      name: "likes",
      title: "Likes",
      type: "number",
    },
    {
      name: "time",
      title: "Time",
      type: "string",
      validation: (Rule) =>
        Rule.required().min(1).warning("must fill the data"),
    },
    {
      name: "people",
      title: "People",
      type: "string",
      validation: (Rule) =>
        Rule.required().min(1).warning("must fill the data"),
    },
    {
      name: "material",
      title: "Material",
      type: "string",
      validation: (Rule) =>
        Rule.required().min(1).warning("must fill the data"),
    },
    {
      name: "age",
      title: "Age",
      type: "string",
      validation: (Rule) =>
        Rule.required().min(1).warning("must fill the data"),
    },

    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    },
    {
      name: "game",
      title: "game",
      type: "string",
    },
    {
      name: "video",
      title: "video",
      type: "url",
    },
    {
      name: "author",
      title: "Author",
      type: "reference",
      to: { type: "author" },
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
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    },

    {
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
    },
    {
      name: "body",
      title: "Instructions",
      type: "blockContent",
    },
    {
      name: "ReflectionTipsStrategies",
      title: "Reflection-Tips & Strategies",
      type: "blockContent",
    },
    {
      name: "materialDetail",
      title: "material's detail",
      type: "blockContent",
    },
  ],
  initialValue: {
    likes: 1,
  },

  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "mainImage",
    },
    prepare(selection) {
      const { author } = selection;
      return Object.assign({}, selection, {
        subtitle: author && `by ${author}`,
      });
    },
  },
};
