import { z } from "zod";
import { getDocument } from "../../../lib/server";
import { procedure, router } from "../trpc";

export const liveblocksRouter = router({
  getDocument: procedure
    .input(z.object({ documentId: z.string() }))
    .query(({ ctx, input }) => getDocument(ctx.session, input)),
});
