import { z } from "zod";

export const invoiceUploadSchema = z
  .object({
    fileType: z.enum(["pdf", "xml", "image", "link"]),
    storagePath: z.string().min(1).optional(),
    invoiceLink: z.url().optional(),
    originalFilename: z.string().min(1).max(255).optional(),
    contentType: z.string().min(1).max(255).optional(),
    fileSizeBytes: z.number().int().min(1).max(26_214_400).optional(),
    note: z.string().max(2000).optional(),
  })
  .superRefine((value, context) => {
    if (value.fileType === "link" && !value.invoiceLink) {
      context.addIssue({
        code: "custom",
        message: "A link upload requires invoiceLink.",
      });
    }

    if (value.fileType !== "link" && !value.storagePath) {
      context.addIssue({
        code: "custom",
        message: "A file upload requires storagePath.",
      });
    }
  });
