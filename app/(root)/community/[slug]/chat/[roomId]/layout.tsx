
import { AblyClientProvider } from '@/lib/ably';



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
          <AblyClientProvider>
            {children}
          </AblyClientProvider>
  );
}
