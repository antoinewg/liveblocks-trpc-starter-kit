import { z } from "zod";
import { getDocument, getGroups } from "../../../lib/server";
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
});
