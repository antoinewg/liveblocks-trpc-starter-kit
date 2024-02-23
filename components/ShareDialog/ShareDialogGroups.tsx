import clsx from "clsx";
import { ComponentProps } from "react";
import { Select } from "../../primitives/Select";
import { Document, DocumentAccess, DocumentGroup } from "../../types";
import { trpc } from "../../utils/trpc";
import styles from "./ShareDialogRows.module.css";

interface Props extends ComponentProps<"div"> {
  documentId: Document["id"];
  fullAccess: boolean;
  groups: DocumentGroup[];
  onSetGroups: () => void;
}

export function ShareDialogGroups({
  documentId,
  fullAccess,
  groups,
  onSetGroups,
  className,
  ...props
}: Props) {
  const { mutate: removeGroupAccess } = trpc.removeGroupAccess.useMutation({
    onSuccess: () => onSetGroups(),
  });
  const { mutate: updateGroupAccess } = trpc.updateGroupAccess.useMutation({
    onSuccess: () => onSetGroups(),
  });

  return (
    <div className={clsx(className, styles.rows)} {...props}>
      {groups
        ? groups.map(({ name, id, access }) => (
            <div className={styles.row} key={id}>
              <div className={styles.rowInfo}>
                <span className={styles.rowName}>{name}</span>
                {fullAccess ? (
                  <button
                    className={styles.rowRemoveButton}
                    onClick={() =>
                      removeGroupAccess({ groupId: id, documentId })
                    }
                  >
                    Remove
                  </button>
                ) : null}
              </div>
              <div className={styles.rowAccessSelect}>
                <Select
                  aboveOverlay
                  disabled={!fullAccess}
                  initialValue={access}
                  items={[
                    {
                      title: "Can edit",
                      value: DocumentAccess.EDIT,
                      description:
                        "Group can read, edit, and share the document",
                    },
                    {
                      title: "Can read",
                      value: DocumentAccess.READONLY,
                      description: "Group can only read the document",
                    },
                  ]}
                  onChange={(value) =>
                    updateGroupAccess({
                      groupId: id,
                      documentId,
                      access: value as DocumentAccess,
                    })
                  }
                  value={access}
                />
              </div>
            </div>
          ))
        : null}
    </div>
  );
}
