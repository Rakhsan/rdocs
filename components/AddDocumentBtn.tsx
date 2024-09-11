"use client";

import { Button } from "./ui/button"
import Image from "next/image"
import { createDocument } from "@/actions/room.action"
import { useRouter } from "next/navigation";

const AddDocumentBtn = ({ userId, email }: AddDocumentBtnProps) => {

    const router = useRouter();

    const AddDocumentHandler = async () => {
        try {
            const room = await createDocument({ userId, email });

            if (room) {
                router.push(`/documents/${room.id}`);
            }
        } catch (error) {
            console.error(`Something went wrong "while Createing a room"`);
        }
    }

    return (
        <Button variant={"ghost"} className="flex gap-1 shadow-md" type={"submit"} onClick={() => {AddDocumentHandler()}}>
            <Image
                src="/icons/add.svg"
                alt="add"
                width={24}
                height={24}
            />
            Start a blank document
        </Button>
    )
}

export default AddDocumentBtn

