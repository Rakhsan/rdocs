import { getDocs } from "@/actions/room.action"
import AddDocumentBtn from "@/components/AddDocumentBtn"
import DeleteModal from "@/components/DeleteModal"
import Header from "@/components/Header"
import Notifications from "@/components/Notifications"
import { Button } from "@/components/ui/button"
import { dateConverter } from "@/lib/utils"
import { SignedIn, UserButton } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

const Page = async () => {

  const clerkUser = await currentUser();
  if (!clerkUser) {
    redirect("/signIn");
  }

  const roomDocs = await getDocs(clerkUser.emailAddresses[0].emailAddress);

  return (
    <>
      <main className="home-container overflow-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
        <Header className="sticky left-0 top-0">
          <div className="flex items-center gap-2 lg:gap-4">
            <Notifications />
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </Header>

        {roomDocs.data.length > 0 ? (
          <div className="document-list-container overflow-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
            <div className="document-list-title">
              <h3 className="text-28-semibold">All Documents</h3>
              <AddDocumentBtn 
                userId={clerkUser.id}
                email={clerkUser.emailAddresses[0].emailAddress}
              />
            </div>
            <ul className="document-ul overflow-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
              {roomDocs.data.map(({ id, metadata, createdAt }: any) => (
                <li key={id} className="document-list-item bg-slate-800/90">
                  <Link href={`/documents/${id}`} className="flex flex-1 items-center gap-4">
                    <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                      <Image 
                        src={"/icons/doc.svg"}
                        alt={"file"}
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="line-clamp-1 text-lg">{metadata.title}</p>
                      <p className="text-sm font-light text-blue-100">Created {dateConverter(createdAt)}</p>
                    </div>
                  </Link>
                  <DeleteModal roomId={id} />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="document-list-empty">
            <Image
              src="/icons/doc.svg"
              alt="Document"
              width={40}
              height={40}
              className='mx-auto'
            />
            <AddDocumentBtn 
              userId={clerkUser.id}
              email={clerkUser.emailAddresses[0].emailAddress}
            />
          </div>
        )}
      </main>
    </>
  )
}

export default Page

