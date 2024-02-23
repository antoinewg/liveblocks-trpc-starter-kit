import clsx from "clsx";
import { ComponentProps, useCallback, useRef, useState } from "react";
import { CheckIcon, CopyIcon, EditIcon, LinkIcon } from "../../icons";
import { Button } from "../../primitives/Button";
import { Checkbox } from "../../primitives/Checkbox";
import { Input } from "../../primitives/Input";
import { Spinner } from "../../primitives/Spinner";
import { Document, DocumentAccess } from "../../types";
import { trpc } from "../../utils/trpc";
import styles from "./ShareDialogDefault.module.css";

interface Props extends ComponentProps<"div"> {
  defaultAccess: DocumentAccess;
  documentId: Document["id"];
  fullAccess: boolean;
  onSetDefaultAccess: () => void;
}

let copyToClipboardTimeout: number;

export function ShareDialogDefault({
  documentId,
  fullAccess,
  defaultAccess,
  onSetDefaultAccess,
  className,
  ...props
}: Props) {
  const shareInputRef = useRef<HTMLInputElement>(null);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const publicRead = defaultAccess !== DocumentAccess.NONE;
  const [isPublicReadLoading, setPublicReadLoading] = useState(false);
  const publicEdit = defaultAccess === DocumentAccess.EDIT;
  const [isPublicEditLoading, setPublicEditLoading] = useState(false);

  const updateDefaultAccess = trpc.updateDefaultAccess.useMutation({
    onSuccess: () => onSetDefaultAccess(),
  });

  // Toggle between public accesses: READONLY/NONE
  async function handlePublicRead(newPublicRead: boolean) {
    setPublicReadLoading(true);
    await updateDefaultAccess.mutateAsync({
      documentId: documentId,
      access: newPublicRead ? DocumentAccess.READONLY : DocumentAccess.NONE,
    });
    setPublicReadLoading(false);
  }

  // Toggle between public accesses: EDIT/READONLY
  async function handlePublicEdit(newPublicEdit: boolean) {
    setPublicEditLoading(true);
    await updateDefaultAccess.mutateAsync({
      documentId: documentId,
      access: newPublicEdit ? DocumentAccess.EDIT : DocumentAccess.READONLY,
    });
    setPublicEditLoading(false);
  }

  const handleCopyToClipboard = useCallback(async () => {
    if (!shareInputRef.current) return;

    try {
      await navigator.clipboard.writeText(shareInputRef.current.value);
      shareInputRef.current.select();

      setCopiedToClipboard(true);
      window.clearTimeout(copyToClipboardTimeout);
      copyToClipboardTimeout = window.setTimeout(() => {
        setCopiedToClipboard(false);
      }, 3000);
    } catch {
      return;
    }
  }, []);

  return (
    <div className={clsx(className, styles.default)} {...props}>
      <div className={styles.section}>
        <label
          className={styles.sectionLabel}
          data-disabled={fullAccess ? undefined : true}
          htmlFor="public-read-checkbox"
        >
          <LinkIcon className={styles.sectionLabelIcon} />
          <span>Enable public share link</span>
        </label>
        <div className={styles.sectionAction}>
          {isPublicReadLoading ? (
            <Spinner size={18} />
          ) : (
            <Checkbox
              checked={publicRead}
              disabled={!fullAccess}
              id="public-read-checkbox"
              initialValue={defaultAccess !== DocumentAccess.NONE}
              name="public-read-checkbox"
              onValueChange={handlePublicRead}
            />
          )}
        </div>
      </div>
      {defaultAccess !== DocumentAccess.NONE ? (
        <>
          <div className={styles.section}>
            <label
              className={styles.sectionLabel}
              data-disabled={fullAccess ? undefined : true}
              htmlFor="public-edit-checkbox"
            >
              <EditIcon className={styles.sectionLabelIcon} />
              <span> Allow anyone to edit</span>
            </label>
            <div className={styles.sectionAction}>
              {isPublicEditLoading ? (
                <Spinner size={18} />
              ) : (
                <Checkbox
                  checked={publicEdit}
                  disabled={!fullAccess || isPublicEditLoading}
                  id="public-edit-checkbox"
                  initialValue={defaultAccess === DocumentAccess.EDIT}
                  name="public-edit-checkbox"
                  onValueChange={handlePublicEdit}
                />
              )}
            </div>
          </div>
          <div className={clsx(styles.section, styles.shareLinkSection)}>
            <Input
              className={styles.shareLinkInput}
              readOnly
              ref={shareInputRef}
              value={window.location.href}
            />
            <Button
              icon={copiedToClipboard ? <CheckIcon /> : <CopyIcon />}
              onClick={handleCopyToClipboard}
            >
              Copy
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
}
