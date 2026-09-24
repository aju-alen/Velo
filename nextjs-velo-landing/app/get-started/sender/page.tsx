import type { Metadata } from 'next';
import RegistrationHandoff from '@/components/get-started/RegistrationHandoff';

export const metadata: Metadata = {
  title: 'Get Started as a Sender | Velo',
  description: 'Open sender registration in the Velo app.',
  robots: { index: false, follow: false },
};

export default function SenderGetStartedPage() {
  return <RegistrationHandoff path="sender" />;
}
