import MarketingLayout from '@/components/layout/marketing-layout';
import Link from 'next/link';

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
    return (
        <MarketingLayout>
            <article className="py-16 bg-white">
                <div className="container mx-auto px-6 max-w-3xl">
                    {/* Breadcrumb */}
                    <div className="mb-8">
                        <Link href="/blog" className="text-indigo-600 hover:underline">
                            ← Back to Blog
                        </Link>
                    </div>

                    {/* Header */}
                    <header className="mb-8">
                        <div className="flex items-center gap-3 mb-4 text-sm">
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full font-bold">
                                Resume Tips
                            </span>
                            <span className="text-slate-400">Dec 15, 2023</span>
                        </div>
                        <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">
                            How to Write an ATS-Friendly Resume in 2023
                        </h1>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                JD
                            </div>
                            <div>
                                <div className="font-bold text-slate-900">John Doe</div>
                                <div className="text-sm text-slate-500">Career Coach</div>
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <div className="prose prose-slate max-w-none">
                        <p className="text-lg text-slate-600 leading-relaxed mb-6">
                            In today's competitive job market, understanding how Applicant Tracking Systems (ATS) work is crucial for job seekers.
                            Your resume might be perfect in content and design, but if it doesn't pass the ATS screening, it may never reach human eyes.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">What is an ATS?</h2>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            An Applicant Tracking System is software used by employers to collect, scan, sort, and rank job applications.
                            These systems help companies manage the overwhelming number of applications they receive.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Key Tips for ATS Optimization</h2>
                        <ul className="space-y-3 mb-6 text-slate-600">
                            <li className="flex items-start gap-3">
                                <i className="fa-solid fa-check-circle text-green-500 mt-1"></i>
                                <span>Use standard resume sections like "Work Experience" and "Education"</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <i className="fa-solid fa-check-circle text-green-500 mt-1"></i>
                                <span>Include relevant keywords from the job description</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <i className="fa-solid fa-check-circle text-green-500 mt-1"></i>
                                <span>Avoid complex formatting, tables, and graphics</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <i className="fa-solid fa-check-circle text-green-500 mt-1"></i>
                                <span>Save your resume as a .doc or .pdf file</span>
                            </li>
                        </ul>

                        <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 my-8">
                            <p className="text-slate-700 italic">
                                "Using our AI-powered resume builder ensures your resume is automatically optimized for ATS while maintaining
                                a professional appearance for human readers."
                            </p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-12 p-8 bg-slate-50 rounded-2xl text-center">
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to optimize your resume?</h3>
                        <Link
                            href="/builder"
                            className="inline-block px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-colors"
                        >
                            Build Resume Free
                        </Link>
                    </div>
                </div>
            </article>
        </MarketingLayout>
    );
}
