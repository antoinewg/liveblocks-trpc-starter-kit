import { z } from "zod";
import * as Server from "../../../lib/server";
import * as Schema from "../../../types";
import { procedure, router } from "../trpc";

export const liveblocksRouter = router({
  getDocument: procedure
    .input(Schema.GetDocumentSchema)
    .query(({ ctx, input }) => Server.getDocument(ctx.session, input)),

  getGroups: procedure
    .input(Schema.GetGroupsSchema)
    .query(({ ctx, input }) =>
      Server.getGroups(input?.groupIds ?? ctx.session.user.info.groupIds ?? [])
    ),

  getDocumentGroups: procedure
    .input(Schema.GetDocumentGroupsSchema)
    .query(({ input }) => Server.getDocumentGroups(input)),

  getDocumentUsers: procedure
    .input(Schema.GetDocumentUsersSchema)
    .query(({ ctx, input }) => Server.getDocumentUsers(ctx.session, input)),

  getPaginatedDocuments: procedure
    .input(
      z
        .object({ cursor: z.string().nullish() }) // <-- "cursor" needs to exist, but can be any type
        .extend(Schema.GetDocumentsSchema.shape)
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
    .input(Schema.GetLiveUsersSchema)
    .query(({ ctx, input }) => Server.getLiveUsers(ctx.session, input)),

  createDocument: procedure
    .input(Schema.CreateDocumentSchema)
    .mutation(({ ctx, input }) => Server.createDocument(ctx.session, input)),

  deleteDocument: procedure
    .input(Schema.DeleteDocumentSchema)
    .mutation(({ ctx, input }) => Server.deleteDocument(ctx.session, input)),

  removeGroupAccess: procedure
    .input(Schema.RemoveGroupAccessSchema)
    .mutation(({ ctx, input }) => Server.removeGroupAccess(ctx.session, input)),

  removeUserAccess: procedure
    .input(Schema.RemoveUserAccessSchema)
    .mutation(({ ctx, input }) => Server.removeUserAccess(ctx.session, input)),

  updateGroupAccess: procedure
    .input(Schema.UpdateGroupAccessSchema)
    .mutation(({ ctx, input }) => Server.updateGroupAccess(ctx.session, input)),

  updateUserAccess: procedure
    .input(Schema.UpdateUserAccessSchema)
    .mutation(({ ctx, input }) =>
      Server.updateUserAccess(ctx.session, ctx.req.headers.origin, input)
    ),

  updateDefaultAccess: procedure
    .input(Schema.UpdateDefaultAccessSchema)
    .mutation(({ ctx, input }) =>
      Server.updateDefaultAccess(ctx.session, input)
    ),

  updateDocument: procedure
    .input(Schema.UpdateDocumentSchema)
    .mutation(({ ctx, input }) => Server.updateDocument(ctx.session, input)),
});
