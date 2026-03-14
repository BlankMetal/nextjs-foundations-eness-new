import { Suspense } from 'react';
import { fetchPosts, fetchCategories } from '@repo/api/blog';
import Link from 'next/link';
import { FilterControls } from './filter-controls';

// searchParams is a Promise — must be typed and awaited
type Props = {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    page?: string;
  }>;
};

export default async function BlogHomePage({ searchParams }: Props) {
  // Await searchParams before accessing values
  const { category, sort, page } = await searchParams;

  const [allPosts, categories] = await Promise.all([
    fetchPosts(50),
    fetchCategories(),
  ]);

  // Filter by category if provided
  let posts = category
    ? allPosts.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      )
    : allPosts;

  // Sort by title if requested, otherwise keep default (by date)
  if (sort === 'title') {
    posts = [...posts].sort((a, b) => a.title.localeCompare(b.title));
  }

  const currentPage = parseInt(page || '1', 10);

  return (
    <main className="flex flex-col gap-8">
      <h1 className="font-bold text-4xl">
        Blog {category && <span className="text-gray-500">in {category}</span>}
      </h1>

      {/* Suspense boundary required — useSearchParams inside FilterControls
          would otherwise force the entire page to client-render */}
      <Suspense fallback={<div className="h-10 animate-pulse bg-gray-100 rounded" />}>
        <FilterControls
          categories={categories}
          currentCategory={category}
          currentSort={sort}
        />
      </Suspense>

      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <article key={post.id} className="flex flex-col gap-2 border-b pb-6">
            <Link href={`/${post.slug}`} className="hover:underline">
              <h2 className="font-semibold text-2xl">{post.title}</h2>
            </Link>
            <p className="text-sm text-gray-500">
              {post.category} · {post.readingTime} min read ·{' '}
              {post.publishedAt.toLocaleDateString()}
            </p>
            <p className="text-gray-700">{post.excerpt}</p>
            <Link
              href={`/${post.slug}`}
              className="text-sm text-blue-600 hover:underline"
            >
              Read more →
            </Link>
          </article>
        ))}
      </div>

      <p className="text-sm text-gray-500">Page {currentPage}</p>
    </main>
  );
}
