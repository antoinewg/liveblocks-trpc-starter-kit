import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { Session } from "next-auth";
import { AuthenticatedLayout } from "../../../layouts/Authenticated";
import { DashboardLayout } from "../../../layouts/Dashboard";
import { DocumentsLayout } from "../../../layouts/Documents";
import * as Server from "../../../lib/server";
import { trpc } from "../../../utils/trpc";

export default function GroupPage({
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { data: groups = [] } = trpc.getGroups.useQuery();

  return (
    <AuthenticatedLayout session={session}>
      <DashboardLayout groups={groups}>
        <DocumentsLayout
          filter="group"
          group={groups.find((group) => group.id === router.query.groupId)}
        />
      </DashboardLayout>
    </AuthenticatedLayout>
  );
}

interface ServerSideProps {
  session: Session;
}

// Authenticate on server and retrieve a list of the current user's groups
export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({
  req,
  res,
}) => {
  const session = await Server.getServerSession(req, res);

  // If not logged in, redirect to marketing page
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  return {
    props: { session },
  };
};
