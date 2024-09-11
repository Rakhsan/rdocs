"use server";

import { liveblocks } from "@/lib/liveblocks";
import { parseStringify } from "@/lib/utils";
import { clerkClient } from "@clerk/nextjs/server";

const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
    try {
        const { data } = await clerkClient.users.getUserList({
            emailAddress: userIds,
        });

        const users = data.map((user) => ({
           id: user.id,
           name: user.fullName ?? user.username ?? "Anon",
           email: user.emailAddresses[0].emailAddress,
           avatar: user.imageUrl,
        }))

        const sortedUsers = userIds.map((email) => users.find((user) => user.email === email));

        return parseStringify(sortedUsers);
    } catch (error) {
        console.error(`Error while fetching clerk users: ${error}`);
    }
}

const getDocumentUsers = async ({ roomId, currentUser, text }: { roomId: string, currentUser: string, text: string }) => {
    try {
        const room = await liveblocks.getRoom(roomId);

        const users = Object.keys(room.usersAccesses).filter((email) => email !== currentUser);

        if (text.length) {
            const lowerCaseText = text.toLowerCase();
            const filteredUsers = users.filter((user) => user.toLowerCase().includes(lowerCaseText));
            return parseStringify(filteredUsers);
        }

        return parseStringify(users);
    } catch (error) {
        console.error(`Error while fetching document users: ${error}`);
    }
}

export { getClerkUsers, getDocumentUsers };
