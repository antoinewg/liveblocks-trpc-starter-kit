import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, updateGroupAccess } from "../../../../../lib/server";
import { UpdateGroupRequest } from "../../../../../types";

/**
 * POST Groups - User in /lib/client/updateGroupAccess.ts
 *
 * Add a new group to a document, or edit an old group's permissions
 * Only allow if authorized with NextAuth and if user is added as a userId on usersAccesses
 * Do not allow if public access, or access granted through groupIds
 *
 * @param req
 * @param req.query.documentId - The document's id
 * @param req.body - JSON string, as defined below
 * @param req.body.groupId - The edit group's id
 * @param req.body.access - The invited user's new document access
 * @param res
 */
async function POST(req: NextApiRequest, res: NextApiResponse) {
  const documentId = req.query.documentId as string;
  const { groupId, access }: UpdateGroupRequest = JSON.parse(req.body);

  const session = await getServerSession(req, res);
  const { data, error } = await updateGroupAccess(session, {
    documentId,
    groupId,
    access,
  });

  if (error) {
    return res.status(error.code ?? 500).json({ error });
  }

  return res.status(200).json(data);
}

export default async function groups(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      return await POST(req, res);
    default:
      return res.status(405).json({
        error: {
          code: 405,
          message: "Method Not Allowed",
          suggestion: "Only GET, POST, AND PATCH are available from this API",
        },
      });
  }
}
