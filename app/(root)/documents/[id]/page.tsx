import { getDoc } from "@/actions/room.action"
import { getClerkUsers } from "@/actions/user.action"
import CollaborativeRoom from "@/components/CollaborativeRoom"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const Page = async ({ params: { id } }: SearchParamProps ) => {

    const clerkUser = await currentUser()
    if (!clerkUser) {
        redirect("/signIn");
    }

    const room = await getDoc({
        roomId: id,
        userId: clerkUser.emailAddresses[0].emailAddress
    });

    if (!room) {
        redirect("/");
    }

    const userIds = Object.keys(room.usersAccesses);
    const users = await getClerkUsers({ userIds });

    const usersData = users.map((user: User) => ({
        ...user,
        userType: room.usersAccesses[user.email]?.includes('room:write')
          ? 'editor'
          : 'viewer'
      }))
    
    const currentUserType = room.usersAccesses[clerkUser.emailAddresses[0].emailAddress]?.includes('room:write') ? 'editor' : 'viewer';

    return (
        <main className="flex w-full flex-col items-center">
            <CollaborativeRoom 
                roomId={id}
                roomMetadata={room.metadata}
                users={usersData}
                currentUserType={currentUserType}
            />
        </main>
    )
}

export default Page

