import clsx from "clsx";
import { ComponentProps, FormEvent } from "react";
import { PlusIcon } from "../../icons";
import { Button } from "../../primitives/Button";
import { Input } from "../../primitives/Input";
import { Spinner } from "../../primitives/Spinner";
import { Document, DocumentAccess } from "../../types";
import { trpc } from "../../utils/trpc";
import styles from "./ShareDialogInvite.module.css";

interface Props extends ComponentProps<"div"> {
  documentId: Document["id"];
  fullAccess: boolean;
  onSetUsers: () => void;
}

export function ShareDialogInviteUser({
  documentId,
  fullAccess,
  onSetUsers,
  className,
  ...props
}: Props) {
  const updateUserAccess = trpc.updateUserAccess.useMutation({
    onSuccess: () => onSetUsers(),
  });

  return (
    <div className={clsx(className, styles.section)} {...props}>
      {fullAccess ? (
        <>
          <form
            className={styles.inviteForm}
            onSubmit={(e: FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const id = new FormData(e.currentTarget).get("userId") as string;
              updateUserAccess.mutate({
                userId: id,
                documentId: documentId,
                access: DocumentAccess.READONLY,
              });
            }}
          >
            <Input
              className={styles.inviteInput}
              disabled={updateUserAccess.isPending}
              name="userId"
              placeholder="Email address"
              required
              type="email"
            />
            <Button
              className={styles.inviteButton}
              disabled={updateUserAccess.isPending}
              icon={updateUserAccess.isPending ? <Spinner /> : <PlusIcon />}
            >
              Invite
            </Button>
          </form>
          {updateUserAccess.error && (
            <div className={clsx(styles.error, styles.inviteFormMessage)}>
              {updateUserAccess.error.message}
            </div>
          )}
        </>
      ) : (
        <div className={styles.error}>
          You need full access to invite others.
        </div>
      )}
    </div>
  );
}
