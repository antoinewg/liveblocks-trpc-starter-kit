import clsx from "clsx";
import { useSession } from "next-auth/react";
import { ComponentProps, FormEvent } from "react";
import { PlusIcon } from "../../icons";
import { Button } from "../../primitives/Button";
import { Select } from "../../primitives/Select";
import { Spinner } from "../../primitives/Spinner";
import { Document, DocumentAccess, Group } from "../../types";
import { capitalize } from "../../utils";
import { trpc } from "../../utils/trpc";
import styles from "./ShareDialogInvite.module.css";

interface Props extends ComponentProps<"div"> {
  documentId: Document["id"];
  fullAccess: boolean;
  currentGroups: Group[];
  onSetGroups: () => void;
}

export function ShareDialogInviteGroup({
  documentId,
  fullAccess,
  onSetGroups,
  className,
  currentGroups,
  ...props
}: Props) {
  const { data: session } = useSession();
  const updateGroupAccess = trpc.updateGroupAccess.useMutation({
    onSuccess: () => onSetGroups(),
  });

  const invitableGroupIds = (session?.user.info.groupIds ?? []).filter(
    (groupId) => currentGroups.every((group) => group.id !== groupId)
  );

  return (
    <div className={clsx(className, styles.section)} {...props}>
      {fullAccess ? (
        <>
          {!session || invitableGroupIds.length ? (
            <form
              className={styles.inviteForm}
              onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                const id = new FormData(e.currentTarget).get(
                  "groupId"
                ) as string;
                updateGroupAccess.mutate({
                  groupId: id,
                  documentId: documentId,
                  access: DocumentAccess.READONLY,
                });
              }}
            >
              <Select
                key={currentGroups[0]?.id || undefined}
                aboveOverlay
                name="groupId"
                className={styles.inviteSelect}
                items={invitableGroupIds.map((groupId) => ({
                  value: groupId,
                  title: capitalize(groupId),
                }))}
                placeholder="Choose a group…"
                required
                disabled={updateGroupAccess.isPending}
              />
              <Button
                className={styles.inviteButton}
                icon={updateGroupAccess.isPending ? <Spinner /> : <PlusIcon />}
                disabled={updateGroupAccess.isPending}
              >
                Invite
              </Button>
            </form>
          ) : (
            <div className={clsx(styles.error, styles.inviteFormMessage)}>
              All of your groups have already been added.
            </div>
          )}
          {updateGroupAccess.error && (
            <div className={clsx(styles.error, styles.inviteFormMessage)}>
              {updateGroupAccess.error.message}
            </div>
          )}
        </>
      ) : (
        <div className={styles.error}>
          You need full access to invite groups.
        </div>
      )}
    </div>
  );
}
