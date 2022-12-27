// sanity.config.js
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { schemaTypes } from "./schemas";
import { visionTool } from "@sanity/vision";
import { colorInput } from "@sanity/color-input";
export default defineConfig({
  name: "default",
  title: "tatuga",

  projectId: "n14jpqkv",
  dataset: "production",
  plugins: [deskTool(), visionTool(),colorInput()],
  schema: {
    types: schemaTypes,
  },
});
