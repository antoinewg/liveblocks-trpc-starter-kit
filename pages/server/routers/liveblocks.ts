import { z } from "zod";
import {
  createDocument,
  getDocument,
  getDocumentGroups,
  getDocumentUsers,
  getDocuments,
  getGroups,
  getLiveUsers,
  getNextDocuments,
} from "../../../lib/server";
import { procedure, router } from "../trpc";

export const liveblocksRouter = router({
  getDocument: procedure
    .input(z.object({ documentId: z.string() }))
    .query(({ ctx, input }) => getDocument(ctx.session, input)),

  getGroups: procedure
    .input(z.object({ groupIds: z.array(z.string()) }).optional())
    .query(({ ctx, input }) =>
      getGroups(input?.groupIds ?? ctx.session.user.info.groupIds ?? [])
    ),

  getDocumentGroups: procedure
    .input(z.object({ documentId: z.string() }))
    .query(({ input }) => getDocumentGroups(input)),

  getDocumentUsers: procedure
    .input(z.object({ documentId: z.string() }))
    .query(({ ctx, input }) => getDocumentUsers(ctx.session, input)),

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
        const { data, error } = await getNextDocuments(ctx.session, {
          nextPage: input.cursor,
        });
        if (error) {
          console.error(error.message);
          throw error;
        }
        return data;
      }
      const { data, error } = await getDocuments(ctx.session, input);
      if (error) {
        console.error(error.message);
        throw error;
      }
      return data;
    }),

  getLiveUsers: procedure
    .input(z.object({ documentIds: z.array(z.string()) }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await getLiveUsers(ctx.session, input);
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
      const { data, error } = await createDocument(ctx.session, input);
      if (error) {
        console.error(error.message);
        throw error;
      }
      return data;
    }),
});
