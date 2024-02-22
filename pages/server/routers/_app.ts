import { mergeRouters } from "../trpc";
import { liveblocksRouter } from "./liveblocks";

export const appRouter = mergeRouters(liveblocksRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
