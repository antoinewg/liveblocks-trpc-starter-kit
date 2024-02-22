import { Liveblocks } from "@liveblocks/node";
import { z } from "zod";
import { SECRET_API_KEY } from "../../../liveblocks.server.config";
import { procedure, router } from "../trpc";

const liveblocks = new Liveblocks({ secret: SECRET_API_KEY as string });

export const liveblocksRouter = router({
  getRoom: procedure
    .input(z.object({ roomId: z.string() }))
    .query(({ input }) => liveblocks.getRoom(input.roomId)),
});
