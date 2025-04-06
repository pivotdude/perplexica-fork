'use client';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';

const ThemeProviderComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="dark">
      <SessionProvider>
        {children}
      </SessionProvider>
    </ThemeProvider>
  );
};

export default ThemeProviderComponent;
