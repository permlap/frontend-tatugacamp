export default {
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "description",
      title: "Description",
      type: "string",
    },
    {
      name: "LongDescription",
      title: "Long Description",
      type: "string",
    },
    {
      name: "price",
      title: "Price",
      type: "number",
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
    },
    {
      name: "people",
      title: "People",
      type: "string",
    },
    {
      name: "material",
      title: "Material",
      type: "string",
    },
    {
      name: "age",
      title: "Age",
      type: "string",
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
      name: "Instructions",
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
    {
      name: "body",
      title: "body",
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
