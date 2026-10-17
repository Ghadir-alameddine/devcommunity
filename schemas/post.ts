import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must contain at least 5 characters.")
    .max(150, "Title cannot exceed 150 characters."),

  community: z
    .string()
    .trim()
    .min(1, "Please select a community."),

  tags: z
    .string()
    .trim()
    .optional(),

  content: z
    .string()
    .trim()
    .min(20, "Article content must contain at least 20 characters.")
    .max(20000, "Article content is too long."),
});

export type PostInput = z.infer<typeof postSchema>;