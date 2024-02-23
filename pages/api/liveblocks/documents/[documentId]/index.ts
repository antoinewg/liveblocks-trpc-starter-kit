import { NextApiRequest, NextApiResponse } from "next";
import { getDocument, getServerSession } from "../../../../../lib/server";

/**
 * GET Document - Used in /lib/client/getDocument.ts
 *
 * Get a document.
 * Only allow if user has access to room (including logged-out users and public rooms).
 *
 * @param req
 * @param req.query.documentId - The document's id
 * @param res
 */
async function GET(req: NextApiRequest, res: NextApiResponse) {
  const documentId = req.query.documentId as string;

  const session = await getServerSession(req, res);
  const { data, error } = await getDocument(session, { documentId });

  if (error) {
    return res.status(error.code ?? 500).json({ error });
  }

  return res.status(200).json(data);
}

export default async function document(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return await GET(req, res);

    default:
      return res.status(405).json({
        error: {
          code: 405,
          message: "Method Not Allowed",
          suggestion: "Only GET, POST, and DELETE are available from this API",
        },
      });
  }
}
