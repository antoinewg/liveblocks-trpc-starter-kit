import { ComponentProps } from "react";
import { Button } from "../../primitives/Button";
import { Dialog } from "../../primitives/Dialog";
import { trpc } from "../../utils/trpc";
import styles from "./DocumentDeleteDialog.module.css";

interface Props
  extends Omit<ComponentProps<typeof Dialog>, "content" | "title"> {
  documentId: string;
  onDeleteDocument: () => void;
}

export function DocumentDeleteDialog({
  documentId,
  onOpenChange = () => {},
  onDeleteDocument = () => {},
  children,
  ...props
}: Props) {
  const { mutate: deleteDocument } = trpc.deleteDocument.useMutation({
    onSuccess: () => {
      onOpenChange(false);
      onDeleteDocument();
    },
  });

  return (
    <Dialog
      content={
        <div className={styles.dialog}>
          <p className={styles.description}>
            This will permanently delete the document.
          </p>
          <div className={styles.buttons}>
            <Button onClick={() => onOpenChange(false)} variant="secondary">
              Cancel
            </Button>
            <Button
              onClick={() => deleteDocument({ documentId })}
              variant="destructive"
            >
              Delete
            </Button>
          </div>
        </div>
      }
      onOpenChange={onOpenChange}
      title="Delete document"
      {...props}
    >
      {children}
    </Dialog>
  );
}
