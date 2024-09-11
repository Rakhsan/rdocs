"use server";

import { liveblocks } from "@/lib/liveblocks";
import { getAccessType, parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { title } from "process";
import { v4 as uuid } from "uuid";

const createDocument = async ({ userId, email }: CreateDocumentParams) => {
    const roomId = `${uuid()}-${uuid()}`;

    try {
        const metadata = {
            creatorId: userId,
            email: email,
            title: "Untitled",
        };

        const usersAccesses: RoomAccesses = {
            [email]: ['room:write']
        }
    
        const room = await liveblocks.createRoom(roomId, {
            metadata: metadata,
            usersAccesses: usersAccesses,
            defaultAccesses: []
        });

        revalidatePath(`/`)

        return parseStringify(room);
    } catch (error) {
        console.error(`Something went wrong "while Createing a room"\n${error}`);
    }
}

const getDoc = async ({ roomId, userId }: { roomId: string, userId: string }) => {
    try {
        const room = await liveblocks.getRoom(roomId);

        const hasAccess = Object.keys(room.usersAccesses).includes(userId);

        if (!hasAccess) {
            return { Access: false };
        }

        return parseStringify(room);
    } catch (error) {
        console.error(`Something went wrong "while Geting a room"\n${error}`);
    }
}

const updateDocs = async (roomId: string, title: string) => {
    try {
        const updatedRoom = await liveblocks.updateRoom(roomId, {
            metadata: {
                title: title
            }
        })

        revalidatePath(`/documents/${roomId}`)

        return parseStringify(updatedRoom);
    } catch (error) {
        console.log(`Something went wrong "while Updateing a room title"\n${error}`);
    }
}

const getDocs = async (email: string) => {
    try {
        const rooms = await liveblocks.getRooms({ userId: email });

        return parseStringify(rooms);
    } catch (error) {
        console.error(`Something went wrong "while Geting a rooms"\n${error}`);
    }
}

const updateDocAccess = async ({ roomId, email, userType, updatedBy }: ShareDocumentParams) => {
    try {
        const usersAccesses: RoomAccesses = {
            [email]: getAccessType(userType) as AccessType,
        }

        const room = await liveblocks.updateRoom(roomId, {
            usersAccesses: usersAccesses,
        })

        if (room) {
            const notificationId = uuid();

            await liveblocks.triggerInboxNotification({
                userId: email,
                kind: '$documentAccess',
                subjectId: notificationId,
                activityData: {
                    userType,
                    title: `You have been granted ${userType} by ${updatedBy.name}`,
                    updatedBy: updatedBy.name,
                    avatar: updatedBy.avatar,
                    email: updatedBy.email,
                },
                roomId: roomId
            })
        }

        revalidatePath(`/documents/${roomId}`)

        return parseStringify(room);
    } catch (error) {
        console.error(`Something went wrong "while Updateing a room access"\n${error}`);
    }
}

const removeCollaborator = async ({ roomId, email }: { roomId: string, email: string }) => {
    try {
        const room = await liveblocks.getRoom(roomId);

        if (room.metadata.email === email) {
            throw new Error("You can't remove yourself");
        }

        const updatedRoom = await liveblocks.updateRoom(roomId, {
            usersAccesses: {
                [email]: null
            }
        })

        revalidatePath(`/documents/${roomId}`)

        return parseStringify(updatedRoom);
    } catch (error) {
        console.error(`Something went wrong "while Removeing a collaborator"\n${error}`);
    }
}

const deleteDocument = async (roomId: string): Promise<void> => {
    try {
        await liveblocks.deleteRoom(roomId);
        revalidatePath('/');
        redirect('/');
    } catch (error) {
      console.log(`Something went wrong "while Deleteing a room"\n${error}`);
    }
}


export { createDocument, getDoc, getDocs, updateDocs, updateDocAccess, removeCollaborator, deleteDocument };

