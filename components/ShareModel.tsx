"use client";

import { useSelf } from "@liveblocks/react/suspense";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "./ui/button";
import Image from "next/image";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import UserTypeSelector from "./UserTypeSelector";
import Collabrator from "./Collabrator";
import { updateDocAccess } from "@/actions/room.action";
  
const ShareModel = ({ roomId, collaborators, creatorId, currentUserType }: ShareDocumentDialogProps) => {
    const user = useSelf();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [userType, setUserType] = useState<UserType>('viewer');

    const shareDocumentHandler = async () => {
        setLoading(true);

        await updateDocAccess({
            roomId: roomId,
            email: email,
            userType: userType as UserType,
            updatedBy: user.info
        });

        setLoading(false);
    }
    
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                    <Button variant={"secondary"} className="gradient-blue flex h-9 gap-1 px-4" disabled={currentUserType !== 'editor'}>
                        <Image 
                            src={"/icons/share.svg"}
                            alt="share"
                            width={20}
                            height={20}
                            className="min-w-4 md:size-5"
                        />
                        <p className="mr-1 hidden sm:block">
                            Share
                        </p>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manage Collaborators</DialogTitle>
                        <DialogDescription>
                            Select a collaborator to share this document
                        </DialogDescription>
                    </DialogHeader>
                    <Label htmlFor="email" className="mt-6 text-blue-100">
                        Email address
                    </Label>
                    <div className="flex items-center gap-3">
                        <div className="flex flex-1 rounded-md bg-dark-400">
                            <Input 
                                id="email"
                                placeholder="Enter Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="share-input"
                            />
                            <UserTypeSelector 
                                userType={userType}
                                setUserType={setUserType}
                            />
                        </div>
                        <Button type="submit" className="gradient-blue flex h-full gap-1 px-5" variant={"secondary"} onClick={shareDocumentHandler} disabled={loading}>
                            {loading ? "Sending..." : "Invite"}
                        </Button>
                    </div>

                    <div className="my-2 space-y-2">
                        <ul className="flex flex-col">
                            {collaborators.map((collaborator) => (
                                <Collabrator 
                                    key={collaborator.id}
                                    roomId={roomId}
                                    creatorId={creatorId}
                                    email={collaborator.email}
                                    collaborator={collaborator}
                                    user={user.info}
                                />
                            ))}
                        </ul>
                    </div>
                </DialogContent>
            </Dialog>

        </>
    )
}

export default ShareModel

