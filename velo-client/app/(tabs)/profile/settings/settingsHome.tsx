import React from 'react';
import ProfileShell from '@/components/profile/ProfileShell';

/**
 * Settings uses the same ProfileShell as the Profile tab so layouts stay consistent
 * across USER / AGENT / SUPERADMIN / GUEST / SUB_AGENT.
 */
const SettingsHome = () => {
  return <ProfileShell />;
};

export default SettingsHome;
