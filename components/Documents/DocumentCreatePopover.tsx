import { useRouter } from "next/router";
import { ComponentProps } from "react";
import { DOCUMENT_URL } from "../../constants";
import { PlusIcon } from "../../icons";
import { Button } from "../../primitives/Button";
import { Popover } from "../../primitives/Popover";
import {
  Document,
  DocumentGroup,
  DocumentType,
  DocumentUser,
} from "../../types";
import { trpc } from "../../utils/trpc";
import styles from "./DocumentCreatePopover.module.css";

interface Props extends Omit<ComponentProps<typeof Popover>, "content"> {
  documentName?: Document["name"];
  draft: Document["draft"];
  groupIds?: DocumentGroup["id"][];
  userId: DocumentUser["id"];
}

export function DocumentCreatePopover({
  documentName = "Untitled",
  groupIds,
  userId,
  draft,
  children,
  ...props
}: Props) {
  const router = useRouter();
  const { mutateAsync: createDocument } = trpc.createDocument.useMutation();

  // Create a new document, then navigate to the document's URL location
  async function createNewDocument(name: string, type: DocumentType) {
    const newDocument = await createDocument({
      name: documentName,
      type: type,
      userId: userId,
      draft: draft,
      groupIds: draft ? undefined : groupIds,
    });

    if (!newDocument || "error" in newDocument) return;
    router.push(DOCUMENT_URL(newDocument.data.type, newDocument.data.id));
  }

  return (
    <Popover
      content={
        <div className={styles.popover}>
          <Button
            icon={<PlusIcon />}
            onClick={() => {
              createNewDocument(documentName, "text");
            }}
            variant="subtle"
          >
            Text
          </Button>
          <Button
            icon={<PlusIcon />}
            onClick={() => {
              createNewDocument(documentName, "whiteboard");
            }}
            variant="subtle"
          >
            Whiteboard
          </Button>
          <Button
            disabled
            icon={<PlusIcon />}
            onClick={() => {
              createNewDocument(documentName, "spreadsheet");
            }}
            variant="subtle"
          >
            Spreadsheet
          </Button>
        </div>
      }
      modal
      side="bottom"
      {...props}
    >
      {children}
    </Popover>
  );
}
