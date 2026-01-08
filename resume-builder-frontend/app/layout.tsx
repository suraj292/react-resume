import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

// Metadata is now handled dynamically by each page using the useSEO hook

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Default meta tags - will be updated dynamically by useSEO hook */}
        <title>AI Resume Builder</title>
        <meta name="description" content="Build ATS-optimized resumes with AI assistance" />
        <meta name="keywords" content="resume builder, AI resume, ATS resume" />

        {/* Open Graph */}
        <meta property="og:title" content="AI Resume Builder" />
        <meta property="og:description" content="Build ATS-optimized resumes with AI assistance" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Resume Builder" />
        <meta name="twitter:description" content="Build ATS-optimized resumes with AI assistance" />
        <meta name="twitter:site" content="@resumebuilder" />

        {/* Fonts */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
