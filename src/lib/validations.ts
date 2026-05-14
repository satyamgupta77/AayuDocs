import { z } from "zod";

export const toolConfigurationSchema = z.object({
  file: z.any()
    .refine((file) => file !== null, "File is required")
    .refine((file) => file?.size <= 50 * 1024 * 1024, "Max file size is 50MB"),
  quality: z.number().min(1).max(100).optional(),
  format: z.string().optional(),
});

export type ToolConfiguration = z.infer<typeof toolConfigurationSchema>;
