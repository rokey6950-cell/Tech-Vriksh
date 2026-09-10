import { blogPosts } from '../data';
import Link from 'next/link';

export default function BlogPage() {
  return (
    <main className="flex-1 mx-auto w-full max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8 min-h-[60vh]">
      <h1 className="tv-heading text-4xl sm:text-5xl tracking-[-0.05em] mb-12">Blog</h1>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.slug} className="group rounded-3xl border border-[color:var(--tv-border)] p-6 hover:border-[color:var(--tv-primary)]/50 transition-colors">
            <h2 className="text-xl font-bold mb-2 text-white">{post.title}</h2>
            <p className="text-sm text-[color:var(--tv-text-secondary)] mb-4">{post.date} · {post.author}</p>
            <p className="text-sm text-[color:var(--tv-text-secondary)]">{post.summary}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
