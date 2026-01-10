'use client';

import { ReactNode } from 'react';
import Header from './header';
import Footer from './footer';

interface MarketingLayoutProps {
    children: ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow pt-20">
                {children}
            </main>
            <Footer />
        </div>
    );
}
