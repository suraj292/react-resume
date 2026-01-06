import MarketingLayout from '@/components/layout/marketing-layout';
import Link from 'next/link';

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
    // Mock blog data - in real app this would come from CMS/API
    const article = {
        title: '10 Hidden Keywords That Will Triple Your Interview Chances in 2024',
        category: 'ATS Strategy',
        author: {
            name: 'Sarah Jenkins',
            bio: 'Sarah is a former HR Director at a Fortune 500 company turned Career Coach. She helps professionals navigate the modern hiring landscape.',
            avatar: 'https://ui-avatars.com/api/?name=Sarah+J&background=6366f1&color=fff'
        },
        publishDate: 'Oct 24, 2023',
        readTime: '8 min read',
        featuredImage: 'https://picsum.photos/seed/resume/1200/600'
    };

    const relatedPosts = [
        {
            title: 'Resume Design Trends 2024',
            date: 'Oct 12',
            readTime: '5 min read',
            image: 'https://picsum.photos/seed/rel1/400/300',
            slug: 'resume-design-trends'
        },
        {
            title: 'How to Write a Cover Letter',
            date: 'Sep 28',
            readTime: '7 min read',
            image: 'https://picsum.photos/seed/rel2/400/300',
            slug: 'cover-letter-guide'
        },
        {
            title: 'Remote Work Resume Tips',
            date: 'Sep 15',
            readTime: '4 min read',
            image: 'https://picsum.photos/seed/rel3/400/300',
            slug: 'remote-work-tips'
        }
    ];

    const tableOfContents = [
        { id: 'section-1', title: 'Why Keywords Matter' },
        { id: 'section-2', title: 'Top 5 Action Verbs' },
        { id: 'section-3', title: 'Missing Hard Skills' },
        { id: 'section-4', title: 'Natural Integration' },
        { id: 'section-5', title: 'Conclusion' }
    ];

    return (
        <MarketingLayout>
            {/* Blog Header Hero */}
            <section className="bg-white pt-10 pb-12 border-b border-slate-100">
                <div className="container mx-auto px-6 max-w-5xl animate-fade-in">
                    <div className="text-center mb-8">
                        <Link
                            href="/blog"
                            className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wide mb-4 hover:bg-indigo-100 transition-colors"
                        >
                            {article.category}
                        </Link>
                        <h1 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight">
                            {article.title}
                        </h1>

                        <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                                <img
                                    src={article.author.avatar}
                                    className="w-8 h-8 rounded-full"
                                    alt={article.author.name}
                                />
                                <span className="font-semibold text-slate-700">{article.author.name}</span>
                            </div>
                            <span>{article.publishDate}</span>
                            <span>{article.readTime}</span>
                        </div>
                    </div>

                    <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-xl">
                        <img
                            src={article.featuredImage}
                            className="w-full h-full object-cover"
                            alt={article.title}
                        />
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-12 gap-12 max-w-6xl mx-auto">

                    {/* Content Area (Main) */}
                    <article className="lg:col-span-8 prose prose-lg prose-slate max-w-none animate-fade-in" style={{ animationDelay: '0.1s' }}>

                        <p className="lead text-xl text-slate-500 font-light mb-8">
                            Most job seekers don't realize that their resume isn't read by a human first. It's read by a bot. And that bot is looking for very specific signals.
                        </p>

                        {/* Inline Ad (Top) */}
                        <div className="my-8 bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden not-prose">
                            <span className="absolute top-2 right-2 text-[10px] text-slate-400 border border-slate-200 px-1 rounded">
                                Sponsored
                            </span>
                            <div className="w-full h-32 bg-slate-200 rounded mb-3 flex items-center justify-center text-slate-400">
                                <i className="fa-solid fa-rectangle-ad text-4xl" />
                            </div>
                            <p className="text-sm font-bold text-slate-700">Get 1-on-1 Career Coaching</p>
                            <a href="#" className="text-indigo-600 text-xs font-bold hover:underline">Learn More</a>
                        </div>

                        <h2 id="section-1">Why Keywords Matter</h2>
                        <p>
                            Applicant Tracking Systems (ATS) are designed to filter out unqualified candidates. They do this by scanning for keywords found in the job description. If your resume lacks these specific terms, you might be rejected instantly, regardless of your actual qualifications.
                        </p>
                        <p>
                            However, not all keywords are created equal. Some are "hard skills" (like Python, SQL, or Figma), while others are "soft skills" or action verbs that demonstrate impact.
                        </p>

                        <h2 id="section-2">The Top 5 Action Verbs</h2>
                        <p>Stop using "Responsible for" or "Managed". These words are passive. Instead, use words that imply result and ownership:</p>
                        <ul>
                            <li><strong>Spearheaded:</strong> Shows leadership and initiative.</li>
                            <li><strong>Orchestrated:</strong> Implies handling complexity.</li>
                            <li><strong>Accelerated:</strong> Demonstrates efficiency and speed.</li>
                            <li><strong>Optimized:</strong> Shows you improved a process.</li>
                            <li><strong>Revitalized:</strong> Great for turning around failing projects.</li>
                        </ul>

                        <blockquote>
                            "The best resumes don't just list duties; they tell a story of impact using data and strong verbs."
                        </blockquote>

                        <h2 id="section-3">Hard Skills You Might Be Missing</h2>
                        <p>
                            Depending on your industry, there are "hidden" technical keywords that recruiters search for but often forget to list explicitly in the requirements.
                        </p>
                        <p>
                            For example, in project management, terms like <strong>"Stakeholder Management"</strong>, <strong>"Risk Mitigation"</strong>, and <strong>"Agile Methodologies"</strong> are gold dust.
                        </p>

                        {/* Inline Ad (Middle) */}
                        <div className="my-10 p-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl not-prose">
                            <div className="bg-white rounded-lg p-6 flex items-center justify-between gap-4">
                                <div>
                                    <h4 className="font-bold text-slate-900 text-lg">Is your resume missing these?</h4>
                                    <p className="text-sm text-slate-500">Run a free ATS scan now to find out.</p>
                                </div>
                                <Link
                                    href="/builder"
                                    className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
                                >
                                    Check Score
                                </Link>
                            </div>
                        </div>

                        <h2 id="section-4">How to Integrate Them Naturally</h2>
                        <p>
                            Don't just keyword stuff. A section at the bottom listing 50 words looks suspicious to both bots and humans. Instead, weave them into your bullet points.
                        </p>
                        <p>
                            <em>Bad:</em> "Used Python."<br />
                            <em>Good:</em> "Optimized data processing scripts using <strong>Python</strong>, reducing runtime by 40%."
                        </p>

                        <h2 id="section-5">Conclusion</h2>
                        <p>
                            Optimizing for ATS doesn't mean writing like a robot. It means ensuring the language you use to describe your human achievements aligns with the language the machine is programmed to value.
                        </p>

                        {/* Author Box */}
                        <div className="mt-12 not-prose bg-indigo-50 rounded-2xl p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 border border-indigo-100">
                            <img
                                src={`https://ui-avatars.com/api/?name=${article.author.name}&background=6366f1&color=fff&size=128`}
                                className="w-20 h-20 rounded-full border-4 border-white shadow-sm"
                                alt={article.author.name}
                            />
                            <div className="text-center sm:text-left">
                                <h3 className="text-lg font-bold text-slate-900 mb-2">About {article.author.name}</h3>
                                <p className="text-slate-600 text-sm mb-4">{article.author.bio}</p>
                                <div className="flex justify-center sm:justify-start gap-3">
                                    <a href="#" className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                                        <i className="fa-brands fa-linkedin-in" />
                                    </a>
                                    <a href="#" className="w-8 h-8 rounded-full bg-white text-sky-500 flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                                        <i className="fa-brands fa-twitter" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Share Buttons */}
                        <div className="mt-8 pt-8 border-t border-slate-200 flex items-center justify-between not-prose">
                            <span className="font-bold text-slate-700">Share this article:</span>
                            <div className="flex gap-3">
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-transform hover:-translate-y-1">
                                    <i className="fa-brands fa-linkedin mr-2" /> LinkedIn
                                </button>
                                <button className="px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-bold hover:bg-sky-600 transition-transform hover:-translate-y-1">
                                    <i className="fa-brands fa-twitter mr-2" /> Twitter
                                </button>
                                <button className="px-4 py-2 bg-blue-800 text-white rounded-lg text-sm font-bold hover:bg-blue-900 transition-transform hover:-translate-y-1">
                                    <i className="fa-brands fa-facebook mr-2" /> Facebook
                                </button>
                            </div>
                        </div>

                        {/* Comments */}
                        <div className="mt-12 not-prose">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Comments (2)</h3>

                            <div className="space-y-6">
                                {/* Comment 1 */}
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0" />
                                    <div className="bg-slate-50 p-4 rounded-xl flex-grow">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-sm text-slate-900">Mark D.</span>
                                            <span className="text-xs text-slate-400">2 hours ago</span>
                                        </div>
                                        <p className="text-sm text-slate-600">Great tip about the action verbs! I always struggle with that.</p>
                                    </div>
                                </div>

                                {/* Comment Form */}
                                <div className="mt-8">
                                    <textarea
                                        className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-sm"
                                        rows={3}
                                        placeholder="Leave a comment..."
                                    />
                                    <button className="mt-3 px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors">
                                        Post Comment
                                    </button>
                                </div>
                            </div>
                        </div>

                    </article>

                    {/* Sidebar (Right) */}
                    <aside className="lg:col-span-4 space-y-8">

                        {/* Table of Contents (Sticky) */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
                            <h4 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider">
                                Table of Contents
                            </h4>
                            <ul className="space-y-3 text-sm border-l-2 border-slate-100 ml-1">
                                {tableOfContents.map((item) => (
                                    <li key={item.id}>
                                        <a
                                            href={`#${item.id}`}
                                            className="block pl-4 text-slate-600 hover:text-indigo-600 hover:border-l-2 hover:border-indigo-600 -ml-[2px] transition-all"
                                        >
                                            {item.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div className="bg-indigo-600 p-6 rounded-2xl text-white text-center">
                            <i className="fa-regular fa-paper-plane text-3xl mb-3 opacity-80" />
                            <h4 className="font-bold text-lg mb-2">Weekly Career Tips</h4>
                            <p className="text-indigo-100 text-xs mb-4">Join 50,000+ subscribers getting resume advice.</p>
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full px-4 py-2 rounded-lg text-slate-900 text-sm mb-2 focus:outline-none"
                            />
                            <button className="w-full py-2 bg-slate-900 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">
                                Subscribe
                            </button>
                        </div>

                        {/* AdSense Sidebar */}
                        <div className="bg-slate-100 rounded-2xl h-[400px] flex items-center justify-center text-slate-400 border border-slate-200 relative">
                            <span className="absolute top-2 right-2 text-[10px] bg-white/50 px-2 py-0.5 rounded text-slate-500">
                                Sponsored
                            </span>
                            <div className="text-center">
                                <i className="fa-solid fa-ad text-3xl mb-2" />
                                <p className="text-sm">Vertical Ad Unit</p>
                            </div>
                        </div>

                    </aside>
                </div>
            </section>

            {/* Related Posts */}
            <section className="bg-slate-50 py-16 border-t border-slate-200">
                <div className="container mx-auto px-6 max-w-6xl">
                    <h3 className="text-2xl font-bold text-slate-900 mb-8">Read Next</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        {relatedPosts.map((post, index) => (
                            <Link
                                key={index}
                                href={`/blog/${post.slug}`}
                                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                            >
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={post.image}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        alt={post.title}
                                    />
                                </div>
                                <div className="p-5">
                                    <h4 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                        {post.title}
                                    </h4>
                                    <p className="text-xs text-slate-500">{post.date} • {post.readTime}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
