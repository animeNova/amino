'use client';
import * as Ably from 'ably';
import { useChannel, usePresence, configureAbly } from '@ably-labs/react-hooks';
import React from 'react';

// Configure Ably immediately when this module is imported
configureAbly({
  authUrl: process.env.NODE_ENV == 'production' 
    ? `https://amino-clone.com/api/ably-token` 
    : `http://localhost:3000/api/ably-token`,
  authMethod: 'POST',
});


// Custom provider component for wrapping your application
export function AblyClientProvider({ children }: { children: React.ReactNode }) {
  // No need to call configureAbly again here
  return <>{children}</>;
}

// Export the hooks for use in components
export { useChannel, usePresence };

