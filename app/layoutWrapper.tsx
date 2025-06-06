'use client';
import React, { ReactNode } from 'react';

import HelpButton from '@/components/help-button';
import { ThemeProvider } from '@/components/theme-provider';
import TopNavbar from '@/components/top-navbar';

interface LayoutWrapperProps{
    children: ReactNode;
}

const LayoutWrapper:React.FC<LayoutWrapperProps> = ({children}) => {
  return (
     <ThemeProvider attribute="class" defaultTheme="light"  enableSystem>
          <div className="flex min-h-screen flex-col">
            <TopNavbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <HelpButton />
          </div>
        </ThemeProvider>
  )
}

export default LayoutWrapper