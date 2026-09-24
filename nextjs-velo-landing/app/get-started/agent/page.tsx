import type { Metadata } from 'next';
import RegistrationHandoff from '@/components/get-started/RegistrationHandoff';

export const metadata: Metadata = {
  title: 'Become a Logistics Agent | Velo',
  description: 'Open agent registration in the Velo app.',
  robots: { index: false, follow: false },
};

export default function AgentGetStartedPage() {
  return <RegistrationHandoff path="agent" />;
}