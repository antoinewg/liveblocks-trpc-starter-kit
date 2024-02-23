import { z } from "zod";
import {
  getDocument,
  getDocumentGroups,
  getDocumentUsers,
  getGroups,
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
});
