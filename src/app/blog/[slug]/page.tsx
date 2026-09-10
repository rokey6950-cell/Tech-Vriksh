import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/app/data';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <main className="flex-1 mx-auto w-full max-w-4xl px-4 pb-20 pt-8 sm:px-6 lg:px-8 min-h-[60vh]">
      {/* ═══ BACK LINK ═══ */}
      <Link
        href="/blog"
        className="group/back tv-mono mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[color:var(--tv-text-muted)] hover:text-[color:var(--tv-primary)] transition-colors"
      >
        <span className="transition-transform duration-300 group-hover/back:-translate-x-1">←</span>
        <span>All Posts</span>
      </Link>

      {/* ═══ ARTICLE CONTAINER ═══ */}
      <article className="rounded-3xl border border-[color:var(--tv-border)] bg-[rgba(7,17,15,0.7)] p-6 sm:p-10 md:p-14 shadow-2xl backdrop-blur-xl">
        {/* Title */}
        <h1 className="tv-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[color:var(--tv-text-primary)] leading-[1.2] mb-4">
          {post.title}
        </h1>

        {/* Meta details */}
        <div className="flex flex-wrap items-center gap-3 pb-8 mb-8 border-b border-white/[0.08] text-sm text-[color:var(--tv-text-muted)]">
          <time dateTime={post.date}>{post.date}</time>
          <span>•</span>
          <span>By <strong className="text-[color:var(--tv-text-primary)] font-medium">{post.author}</strong></span>
        </div>

        {/* Formatted Markdown Content */}
        <div className="blog-content">
          <MarkdownRenderer content={post.content} />
        </div>

        {/* Article Footer */}
        <footer className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/blog"
            className="group/back tv-mono text-xs uppercase tracking-[0.2em] text-[color:var(--tv-text-muted)] hover:text-[color:var(--tv-primary)] transition-colors"
          >
            ← Back to all posts
          </Link>
          <p className="tv-mono text-xs sm:text-sm tracking-wide text-[color:var(--tv-text-secondary)]">
            Prepared by <span className="font-semibold text-[color:var(--tv-text-primary)]">{post.author}</span>
          </p>
        </footer>
      </article>
    </main>
  );
}
