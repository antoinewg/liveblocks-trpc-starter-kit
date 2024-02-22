import { Session } from "next-auth";
import {
  Document,
  FetchApiResult,
  GetDocumentProps,
  RoomAccess,
} from "../../../types";
import { getRoom } from "../liveblocks";
import { buildDocument, userAllowedInRoom } from "../utils";

/**
 * Get a document.
 * Only allow if user has access to room (including logged-out users and public rooms).
 *
 * @param session
 * @param documentId - The document id
 */
export async function getDocument(
  session: Session,
  { documentId }: GetDocumentProps
): Promise<FetchApiResult<Document>> {
  // Get session and room
  const room = await getRoom({ roomId: documentId });

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

  // Check current user has access to the room (if not logged in, use empty values)
  if (
    !userAllowedInRoom({
      accessesAllowed: [RoomAccess.RoomWrite, RoomAccess.RoomRead],
      userId: session?.user.info.id ?? "",
      groupIds: session?.user.info.groupIds ?? [],
      room: data,
    })
  ) {
    return {
      error: {
        code: 403,
        message: "Not allowed access",
        suggestion: "Check that you've been given permission to the room",
      },
    };
  }

  // Convert room into our custom document format and return
  const document: Document = buildDocument(data);
  return { data: document };
}
