import Header from "@/components/header/header";
import { ThemeProvider } from "@/components/theme/theme-provider"
import LoginDialog from "@/components/dialogs/auth/login-dialog";
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
