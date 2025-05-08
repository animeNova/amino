import Header from "@/components/header/header";
import { ThemeProvider } from "@/components/theme/theme-provider"
import LoginDialog from "@/components/dialogs/auth/login-dialog";
import { Toaster } from "@/components/ui/sonner"
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await auth.api.getSession({
    headers : await headers()
  })
  if(user && user.user.name === user.user.email){
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
