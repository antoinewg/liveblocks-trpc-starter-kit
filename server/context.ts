import * as trpcNext from "@trpc/server/adapters/next";
import { Session } from "next-auth";
import { getServerSession } from "../lib/server";

export async function createContext(ctx: trpcNext.CreateNextContextOptions) {
  const { req, res } = ctx;
  const session: Session = await getServerSession(req, res);

  return {
    req,
    res,
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
