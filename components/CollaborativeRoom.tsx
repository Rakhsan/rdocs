"use client";

import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense"
import Header from "./Header";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Editor } from "./editor/Editor";
import { ActiveCollabrators } from "./ActiveCollabrator";
import Loader from "./Loader";
import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import Image from "next/image";
import { updateDocs } from "@/actions/room.action";
import ShareModel from "./ShareModel";

const CollaborativeRoom = ({ roomId, roomMetadata, users, currentUserType }: CollaborativeRoomProps) => {

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState(roomMetadata.title);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const updateTitleHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setLoading(true);

            try {
                if (title !== roomMetadata.title) {
                    const updatedDoc = await updateDocs(roomId, title);

                    if (updatedDoc) {
                        setEditing(false);
                    }
                }
            } catch (error) {
                console.error(error);
            }

            setLoading(false);
        }
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setEditing(false);
                updateDocs(roomId, title);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [roomId, title]);

    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editing])

    return (
        <RoomProvider id={roomId}>
            <ClientSideSuspense fallback={<Loader />}>
                <div className="collaborative-room">
                    <Header>
                        <div className="flex w-fit items-center justify-center gap-2" ref={containerRef}>
                            {editing && !loading ? (
                                <Input
                                    type={"text"}
                                    value={title}
                                    ref={inputRef}
                                    placeholder={"Enter title"}
                                    onChange={(e) => setTitle(e.target.value)}
                                    onKeyDown={updateTitleHandler}
                                    disabled={!editing}
                                    className="document-title-input"
                                />
                            ) : (
                                <p className="document-title">{title}</p>
                            )}

                            {currentUserType === "editor" && !editing && (
                                <Image 
                                    src="/icons/edit.svg"
                                    alt="edit"
                                    width={24}
                                    height={24}
                                    onClick={() => setEditing(true)}
                                    className="pointer"
                                />
                            )}

                            {currentUserType !== "editor" && !editing && (
                                <p className="view-only-tag">View only</p>
                            )}

                            {loading && <p className="text-sm text-gray-400">Saveing...</p>}
                        </div>
                    
                        <div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
                            <ActiveCollabrators />
                            
                            <ShareModel 
                                roomId={roomId}
                                collaborators={users}
                                creatorId={roomMetadata.creatorId}
                                currentUserType={currentUserType}
                            />

                            <SignedOut>
                                <SignInButton />
                            </SignedOut>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>
                    </Header>
                    <Editor roomId={roomId} CurrentUserType={currentUserType} />
                </div>
            </ClientSideSuspense>
      </RoomProvider>
    )
}

export default CollaborativeRoom

