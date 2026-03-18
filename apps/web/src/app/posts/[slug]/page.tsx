import { notFound } from "next/navigation";
import Link from "next/link";

// --- Mock database functions (each simulates a 200ms DB round-trip) ---

async function fetchPost(slug: string) {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const posts: Record<
    string,
    { id: string; title: string; content: string; authorId: string }
  > = {
    "hello-world": {
      id: "post-1",
      title: "Hello World",
      content: "This is the first post. Welcome to the blog!",
      authorId: "user-1",
    },
    "nextjs-tips": {
      id: "post-2",
      title: "Next.js Tips",
      content: "Here are some tips for building with Next.js...",
      authorId: "user-2",
    },
  };

  return posts[slug] ?? null;
}

async function fetchAuthor(authorId: string) {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const authors: Record<string, { name: string }> = {
    "user-1": { name: "Alice" },
    "user-2": { name: "Bob" },
  };

  return authors[authorId] ?? { name: "Unknown" };
}

async function fetchComments(postId: string) {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const comments: Record<string, { id: string; author: string; text: string }[]> = {
    "post-1": [
      { id: "c1", author: "Reader 1", text: "Great article!" },
      { id: "c2", author: "Reader 2", text: "Very helpful, thanks!" },
    ],
    "post-2": [
      { id: "c3", author: "Reader 3", text: "Love these tips!" },
    ],
  };

  return comments[postId] ?? [];
}

// ✅ FAST: Parallel queries — independent fetches run at the same time
async function getPostData(slug: string) {
  const start = Date.now();

  // Step 1: Post must come first (we need its IDs for the next queries)
  const post = await fetchPost(slug);
  if (!post) return null;

  // Step 2: Author and comments are independent — fire both at once
  const [author, comments] = await Promise.all([
    fetchAuthor(post.authorId),
    fetchComments(post.id),
  ]);

  const duration = Date.now() - start;
  console.log(`[post] Loaded in ${duration}ms (parallel)`);

  return { post, author, comments };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPostData(slug);

  if (!data) {
    notFound();
  }

  const { post, author, comments } = data;

  return (
    <main className="mx-auto max-w-2xl p-8">
      <Link
        href="/posts"
        className="mb-4 inline-block text-blue-600 hover:underline"
      >
        ← Back to posts
      </Link>

      <article className="space-y-6">
        <header>
          <h1 className="font-bold text-3xl">{post.title}</h1>
          <p className="mt-2 text-gray-600">By {author.name}</p>
        </header>

        <div className="prose">
          <p>{post.content}</p>
        </div>

        <section>
          <h2 className="mb-4 font-semibold text-xl">
            Comments ({comments.length})
          </h2>
          <ul className="space-y-3">
            {comments.map((comment) => (
              <li key={comment.id} className="rounded bg-gray-50 p-3">
                <strong>{comment.author}</strong>
                <p>{comment.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  );
}
