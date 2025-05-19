import Header from "@/components/header/header";
import { ThemeProvider } from "@/components/theme/theme-provider"
import LoginDialog from "@/components/dialogs/auth/login-dialog";
import { Toaster } from "@/components/ui/sonner"
import { redirect } from "next/navigation";
import { isUserNew } from "../actions/users/get";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user =await isUserNew()
  if(user){
    return redirect('/onboarding')
  }
  return (
    <div>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
        <Header />
        <LoginDialog />
        {children}
        </ThemeProvider>
        </div>
  );
}
