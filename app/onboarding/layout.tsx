import { redirect } from "next/navigation";
import { isUserNew } from "../actions/users/get";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user =await isUserNew()
  if(!user){
    return redirect('/')
  }
  return (
    <div>
        {children}
     </div>
  );
}
