import { Session } from "next-auth";
import {
  DocumentUser,
  FetchApiResult,
  GetDocumentUsersProps,
} from "../../../types";
import { getRoom } from "../liveblocks";
import { buildDocumentUsers } from "../utils";

/**
 * Get all collaborators in a given document.
 *
 * @param session
 * @param documentId - The document's id
 */
export async function getDocumentUsers(
  session: Session,
  { documentId }: GetDocumentUsersProps
): Promise<FetchApiResult<DocumentUser[]>> {
  // Get room
  const room = await getRoom({ roomId: documentId });

  // Get the room from documentId
  const { data, error } = room;

  if (error) {
    return { error };
  }

  if (!data) {
    return {
      error: {
        code: 404,
        message: "Room not found",
        suggestion: "Check that you're on the correct page",
      },
    };
  }

  // If successful, convert room to a list of collaborators and send
  const result: DocumentUser[] = await buildDocumentUsers(
    data,
    session?.user.info.id ?? ""
  );
  return { data: result };
}
