import { z } from "zod";
import * as Server from "../../../lib/server";
import { DocumentAccess } from "../../../types";
import { procedure, router } from "../trpc";

export const liveblocksRouter = router({
  getDocument: procedure
    .input(z.object({ documentId: z.string() }))
    .query(({ ctx, input }) => Server.getDocument(ctx.session, input)),

  getGroups: procedure
    .input(z.object({ groupIds: z.array(z.string()) }).optional())
    .query(({ ctx, input }) =>
      Server.getGroups(input?.groupIds ?? ctx.session.user.info.groupIds ?? [])
    ),

  getDocumentGroups: procedure
    .input(z.object({ documentId: z.string() }))
    .query(({ input }) => Server.getDocumentGroups(input)),

  getDocumentUsers: procedure
    .input(z.object({ documentId: z.string() }))
    .query(({ ctx, input }) => Server.getDocumentUsers(ctx.session, input)),

  getPaginatedDocuments: procedure
    .input(
      z.object({
        groupIds: z.array(z.string()).optional(),
        userId: z.string().optional(),
        documentType: z.enum(["text", "whiteboard", "spreadsheet"]).optional(),
        drafts: z.boolean().optional(),
        limit: z.number().optional(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (input.cursor) {
        const { data, error } = await Server.getNextDocuments(ctx.session, {
          nextPage: input.cursor,
        });
        if (error) {
          console.error(error.message);
          throw error;
        }
        return data;
      }
      const { data, error } = await Server.getDocuments(ctx.session, input);
      if (error) {
        console.error(error.message);
        throw error;
      }
      return data;
    }),

  getLiveUsers: procedure
    .input(z.object({ documentIds: z.array(z.string()) }))
    .query(({ ctx, input }) => Server.getLiveUsers(ctx.session, input)),

  createDocument: procedure
    .input(
      z.object({
        name: z.string(),
        type: z.enum(["text", "whiteboard", "spreadsheet"]),
        userId: z.string(),
        groupIds: z.array(z.string()).optional(),
        draft: z.boolean().optional(),
      })
    )
    .mutation(({ ctx, input }) => Server.createDocument(ctx.session, input)),

  deleteDocument: procedure
    .input(z.object({ documentId: z.string() }))
    .mutation(({ ctx, input }) => Server.deleteDocument(ctx.session, input)),

  removeGroupAccess: procedure
    .input(z.object({ documentId: z.string(), groupId: z.string() }))
    .mutation(({ ctx, input }) => Server.removeGroupAccess(ctx.session, input)),

  removeUserAccess: procedure
    .input(z.object({ documentId: z.string(), userId: z.string() }))
    .mutation(({ ctx, input }) => Server.removeUserAccess(ctx.session, input)),

  updateGroupAccess: procedure
    .input(
      z.object({
        documentId: z.string(),
        groupId: z.string(),
        access: z.enum([
          DocumentAccess.EDIT,
          DocumentAccess.FULL,
          DocumentAccess.NONE,
          DocumentAccess.READONLY,
        ]),
      })
    )
    .mutation(({ ctx, input }) => Server.updateGroupAccess(ctx.session, input)),

  updateUserAccess: procedure
    .input(
      z.object({
        documentId: z.string(),
        userId: z.string(),
        access: z.enum([
          DocumentAccess.EDIT,
          DocumentAccess.FULL,
          DocumentAccess.NONE,
          DocumentAccess.READONLY,
        ]),
      })
    )
    .mutation(({ ctx, input }) =>
      Server.updateUserAccess(ctx.session, ctx.req.headers.origin, input)
    ),

  updateDefaultAccess: procedure
    .input(
      z.object({
        documentId: z.string(),
        access: z.enum([
          DocumentAccess.EDIT,
          DocumentAccess.FULL,
          DocumentAccess.NONE,
          DocumentAccess.READONLY,
        ]),
      })
    )
    .mutation(({ ctx, input }) =>
      Server.updateDefaultAccess(ctx.session, input)
    ),

  updateDocument: procedure
    .input(z.object({ documentId: z.string(), name: z.string() }))
    .mutation(({ ctx, input }) =>
      Server.updateDocument(ctx.session, {
        documentId: input.documentId,
        documentData: { metadata: { name: input.name } },
      })
    ),
});
