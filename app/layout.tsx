import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Housekeeping Assignment Tool',
  description: 'Daily housekeeping board builder for hotel operations.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
