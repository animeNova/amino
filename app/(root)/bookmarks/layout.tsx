import { getUserIdSafe } from "@/app/actions/helpers/get-userId";
import { Metadata } from "next";
import { unauthorized } from "next/navigation";

export const metadata: Metadata = {
  title: "Bookmarks | Amino",
  description: "View your bookmarked posts",
};

export default async function BookmarksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId =await getUserIdSafe();
  if(!userId){
    return unauthorized();
  }
  return (
    <div className="container mx-auto">
      {children}
    </div>
  );
}