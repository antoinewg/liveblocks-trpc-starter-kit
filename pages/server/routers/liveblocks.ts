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
        console.log("fetching next page", input.cursor);
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
    .query(async ({ ctx, input }) => {
      const { data, error } = await Server.getLiveUsers(ctx.session, input);
      if (error) {
        console.error(error.message);
        throw error;
      }
      return data;
    }),

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
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await Server.createDocument(ctx.session, input);
      if (error) {
        console.error(error.message);
        throw error;
      }
      return data;
    }),

  deleteDocument: procedure
    .input(z.object({ documentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await Server.deleteDocument(ctx.session, input);
      if (error) {
        console.error(error.message);
        throw error;
      }
      return data;
    }),

  removeGroupAccess: procedure
    .input(z.object({ documentId: z.string(), groupId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await Server.removeGroupAccess(
        ctx.session,
        input
      );
      if (error) {
        console.error(error.message);
        throw error;
      }
      return data;
    }),

  removeUserAccess: procedure
    .input(z.object({ documentId: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await Server.removeUserAccess(ctx.session, input);
      if (error) {
        console.error(error.message);
        throw error;
      }
      return data;
    }),

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
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await Server.updateGroupAccess(
        ctx.session,
        input
      );
      if (error) {
        console.error(error.message);
        throw error;
      }
      return data;
    }),

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
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await Server.updateUserAccess(
        ctx.session,
        ctx.req.headers.origin,
        input
      );
      if (error) {
        console.error(error.message);
        throw error;
      }
      return data;
    }),

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
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await Server.updateDefaultAccess(
        ctx.session,
        input
      );
      if (error) {
        console.error(error.message);
        throw error;
      }
      return data;
    }),
});
