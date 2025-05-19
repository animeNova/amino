import HomePage from '@/components/home'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Amino - Your Community Platform',
  description: 'Join Amino to connect with communities, share your interests, and engage with like-minded people.',
  keywords: 'community, social platform, discussion, forums, amino',
  openGraph: {
    title: 'Amino - Your Community Platform',
    description: 'Join Amino to connect with communities, share your interests, and engage with like-minded people.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Amino'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amino - Your Community Platform',
    description: 'Join Amino to connect with communities, share your interests, and engage with like-minded people.'
  }
}

export default function Home() {
  return (
    <div className="">
      <HomePage/>
    </div>
  );
}
