import { fetchPostBySlug } from "@repo/api/blog";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

// ✅ Direct function call — no fetch("/api/...") which would fail on the server.
// Next.js calls this at render time and puts the result into <meta> tags.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  // Fallback metadata if post not found
  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: post.title, // Layout template turns this into "Title | VAF Blog"
    description: post.excerpt,
    keywords: post.tags.join(", "),
    authors: [{ name: post.author.name }],

    // Canonical URL — metadataBase from layout resolves this to absolute
    alternates: {
      canonical: `/${slug}`,
    },

    // OpenGraph: what Facebook, LinkedIn, Slack, etc. use for rich previews
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article", // Overrides layout's default "website"
      publishedTime: post.publishedAt.toISOString(),
      authors: [post.author.name],
      images: [
        {
          url: post.coverImage, // 1200x630 — the standard OG image size
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },

    // Twitter card: what X shows when someone shares the link
    twitter: {
      card: "summary_large_image", // Large image preview (vs small "summary")
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="flex flex-col gap-6">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Back to posts
      </Link>

      <article className="flex flex-col gap-4">
        <header className="flex flex-col gap-2">
          <h1 className="font-bold text-4xl">{post.title}</h1>
          <p className="text-sm text-gray-500">
            {post.category} · {post.readingTime} min read ·{" "}
            {post.publishedAt.toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500">By {post.author.name}</p>
        </header>

        <div className="prose max-w-none">
          {post.content.split("\n\n").map((paragraph, i) => (
            <p key={i} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        <footer className="flex flex-wrap gap-2 border-t pt-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-gray-100 px-2 py-1 text-sm text-gray-600"
            >
              {tag}
            </span>
          ))}
        </footer>
      </article>
    </main>
  );
}
