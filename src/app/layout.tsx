import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google'; // Using Inter font for clarity
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/context/ThemeContext';
import { TasksProvider } from '@/context/TasksContext';
import { Toaster } from '@/components/ui/toaster'; // Ensure Toaster is imported

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans', // Changed variable name to reflect font change
});

export const metadata: Metadata = {
  title: 'TaskMaster',
  description: 'Manage your tasks efficiently',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased', // Use font-sans utility class
          fontSans.variable // Apply the font variable
        )}
      >
        <ThemeProvider>
          <TasksProvider>
            {children}
            <Toaster /> {/* Add Toaster here */}
          </TasksProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
