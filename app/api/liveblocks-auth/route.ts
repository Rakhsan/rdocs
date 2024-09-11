import { liveblocks } from "@/lib/liveblocks";
import { getUserColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

const POST = async (req: NextRequest) => {
    const clerkUser = await currentUser();
    if (!clerkUser) {
        redirect("/signIn");
    }

    const user = {
        id: clerkUser.id,
        info: {
            id: clerkUser.id,
            name: clerkUser.fullName ?? clerkUser.username ?? "Anon",
            email: clerkUser.emailAddresses[0].emailAddress,
            avatar: clerkUser.imageUrl,
            color: getUserColor(clerkUser.id),
        }
    }

    const { status, body } = await liveblocks.identifyUser(
        {
            userId: user.info.email,
            groupIds: [],
        },
        {
            userInfo: user.info,
        }
    );

    return new Response(body, { status });
}

export { POST }

