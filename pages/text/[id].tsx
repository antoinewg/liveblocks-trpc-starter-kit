import { LiveMap } from "@liveblocks/client";
import { useRouter } from "next/router";
import {
  DocumentHeader,
  DocumentHeaderSkeleton,
} from "../../components/Document";
import { TextEditor } from "../../components/TextEditor/TextEditor";
import { DocumentLayout } from "../../layouts/Document";
import { ErrorLayout } from "../../layouts/Error";
import { InitialDocumentProvider } from "../../lib/client";
import { RoomProvider } from "../../liveblocks.config";
import { trpc } from "../../utils/trpc";

export default function TextDocumentView() {
  const router = useRouter();
  const documentId = router.query.id as string;
  const { data, refetch } = trpc.getDocument.useQuery({ documentId });
  const { mutate: updateDocument } = trpc.updateDocument.useMutation({
    onSuccess: () => refetch(),
  });

  if (!data) {
    return <DocumentLayout header={<DocumentHeaderSkeleton />} />;
  }

  if (data && "error" in data) {
    return <ErrorLayout error={data.error} />;
  }

  if (!data.data) {
    return <DocumentLayout header={<DocumentHeaderSkeleton />} />;
  }

  return (
    <RoomProvider
      id={documentId}
      initialPresence={{ cursor: null }}
      initialStorage={{ notes: new LiveMap() }}
    >
      <InitialDocumentProvider initialDocument={data.data}>
        <DocumentLayout
          header={
            <DocumentHeader
              onDocumentRename={(name) => updateDocument({ documentId, name })}
            />
          }
        >
          <TextEditor />
        </DocumentLayout>
      </InitialDocumentProvider>
    </RoomProvider>
  );
}
