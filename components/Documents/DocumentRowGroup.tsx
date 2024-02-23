import { memo } from "react";
import { Document } from "../../types";
import { trpc } from "../../utils/trpc";
import { DocumentRow } from "./DocumentRow";
import styles from "../../layouts/Documents/Documents.module.css";

type Props = {
  documents: Document[];
  revalidateDocuments: () => void;
};

export const DocumentRowGroup = memo(
  ({ documents, revalidateDocuments }: Props) => {
    const documentIds = documents.map((doc) => doc.id);

    // If documents ids passed, get live users in rooms, refresh every 10s
    const { data } = trpc.getLiveUsers.useQuery(
      { documentIds },
      { refetchInterval: 10000, enabled: documentIds?.length > 0 }
    );

    if (!data || "error" in data) return <></>;

    return (
      <>
        {documents.map((document) => {
          const others = data.data.find(
            (user) => user.documentId === document.id
          )?.users;

          return (
            <DocumentRow
              key={document.id}
              document={document}
              others={others}
              className={styles.row}
              revalidateDocuments={revalidateDocuments}
            />
          );
        })}
      </>
    );
  }
);
