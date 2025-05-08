'use client';
import { type ReactNode } from 'react';

export default function AppProvider({ children }: Readonly<{ children: ReactNode }>) {

  return (
      <div>
            {children}
      </div>

  );
}
