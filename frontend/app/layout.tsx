/* eslint-disable @next/next/no-sync-scripts */

import { ClerkProvider } from "@clerk/nextjs";

const FONT_CLASS = 'font-sans antialiased'

export default function RootLayout({
  children,
} : Readonly<{
  children: React.ReactNode;
}>){
  return(
    <ClerkProvider>
      <html lang='en'>
       <head>
        <title>StoreAnything</title>
        <meta name="description" content="Your personal file storage solution." />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body className={FONT_CLASS}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
