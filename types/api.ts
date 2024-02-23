import { Document } from "./document";
import { Room, RoomActiveUser } from "./room";

export type GetDocumentsResponse = {
  documents: Document[];
  nextPage: string | null;
};

export type GetStorageResponse = Record<string, unknown>;

export type GetRoomsResponse = {
  nextPage: string | null;
  data: Room[];
};

export type LiveUsersResponse = {
  documentId: Document["id"];
  users: RoomActiveUser[];
};

export type ErrorData = {
  message: string;
  code?: number;
  suggestion?: string;
};

export type FetchApiResult<T = unknown> =
  | {
      data: T;
      error?: never;
    }
  | {
      error: ErrorData;
      data?: never;
    };
