"use client";

import { getClerkUsers, getDocumentUsers } from "@/actions/user.action";
import Loader from "@/components/Loader";
import { useUser } from "@clerk/nextjs";
import {
    LiveblocksProvider,
    RoomProvider,
    ClientSideSuspense,
} from "@liveblocks/react/suspense";

const Provider = ({ children }: { children: React.ReactNode }) => {

    const { user: clerkUser } = useUser();

    return (
        <LiveblocksProvider
            authEndpoint={"/api/liveblocks-auth"}
            resolveUsers={async ({ userIds }: { userIds: string[] }) => {
                const users = await getClerkUsers({ userIds });
                return users;
            }}
            resolveMentionSuggestions={async ({ text, roomId }: { text: string, roomId: string }) => {
                const roomUsers = await getDocumentUsers({ roomId, currentUser: clerkUser?.emailAddresses[0].emailAddress as string, text });
                return roomUsers;
            }}
        >
            <ClientSideSuspense fallback={<Loader />}>
                {children}
            </ClientSideSuspense>
        </LiveblocksProvider>
    )
}

export default Provider

