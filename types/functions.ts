import { z } from "zod";
import { DocumentAccess } from "./document";

/**
 * These types are the properties used in:
 * `/lib/server/documents/`
 */

export const CreateDocumentSchema = z.object({
  name: z.string(),
  type: z.enum(["text", "whiteboard", "spreadsheet"]),
  userId: z.string(),
  groupIds: z.array(z.string()).optional(),
  draft: z.boolean().optional(),
});

export type CreateDocumentProps = z.infer<typeof CreateDocumentSchema>;

export const GetDocumentSchema = z.object({ documentId: z.string() });
export type GetDocumentProps = z.infer<typeof GetDocumentSchema>;

export const UpdateDocumentSchema = z.object({
  documentId: z.string(),
  name: z.string(),
});
export type UpdateDocumentProps = z.infer<typeof UpdateDocumentSchema>;

export const UpdateDefaultAccessSchema = z.object({
  documentId: z.string(),
  access: z.enum([
    DocumentAccess.EDIT,
    DocumentAccess.FULL,
    DocumentAccess.NONE,
    DocumentAccess.READONLY,
  ]),
});
export type UpdateDefaultAccessProps = z.infer<
  typeof UpdateDefaultAccessSchema
>;

export const GetGroupsSchema = z
  .object({ groupIds: z.array(z.string()) })
  .optional();
export type GetGroupsProps = z.infer<typeof GetGroupsSchema>;

export const GetDocumentGroupsSchema = z.object({ documentId: z.string() });
export type GetDocumentGroupsProps = z.infer<typeof GetDocumentGroupsSchema>;

export const UpdateGroupAccessSchema = z.object({
  documentId: z.string(),
  groupId: z.string(),
  access: z.enum([
    DocumentAccess.EDIT,
    DocumentAccess.FULL,
    DocumentAccess.NONE,
    DocumentAccess.READONLY,
  ]),
});
export type UpdateGroupAccessProps = z.infer<typeof UpdateGroupAccessSchema>;

export const RemoveGroupAccessSchema = z.object({
  documentId: z.string(),
  groupId: z.string(),
});
export type RemoveGroupAccessProps = z.infer<typeof RemoveGroupAccessSchema>;

export const GetDocumentUsersSchema = z.object({ documentId: z.string() });
export type GetDocumentUsersProps = z.infer<typeof GetDocumentUsersSchema>;

export const UpdateUserAccessSchema = z.object({
  documentId: z.string(),
  userId: z.string(),
  access: z.enum([
    DocumentAccess.EDIT,
    DocumentAccess.FULL,
    DocumentAccess.NONE,
    DocumentAccess.READONLY,
  ]),
});
export type UpdateUserAccessProps = z.infer<typeof UpdateUserAccessSchema>;

export const RemoveUserAccessSchema = z.object({
  documentId: z.string(),
  userId: z.string(),
});
export type RemoveUserAccessProps = z.infer<typeof RemoveUserAccessSchema>;

export const GetDocumentsSchema = z.object({
  groupIds: z.array(z.string()).optional(),
  userId: z.string().optional(),
  documentType: z.enum(["text", "whiteboard", "spreadsheet"]).optional(),
  drafts: z.boolean().optional(),
  limit: z.number().optional(),
});
export type GetDocumentsProps = z.infer<typeof GetDocumentsSchema>;

export const GetLiveUsersSchema = z.object({
  documentIds: z.array(z.string()),
});
export type GetLiveUsersProps = z.infer<typeof GetLiveUsersSchema>;

export const GetNextDocumentsSchema = z.object({ nextPage: z.string() });
export type GetNextDocumentsProps = z.infer<typeof GetNextDocumentsSchema>;

export const DeleteDocumentSchema = z.object({ documentId: z.string() });
export type DeleteDocumentProps = z.infer<typeof DeleteDocumentSchema>;

export const GetUsersSchema = z.object({
  userIds: z.array(z.string()).optional(),
  search: z.string().optional(),
});
export type GetUsersProps = z.infer<typeof GetUsersSchema>;
