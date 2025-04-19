import { useParams, Link } from "react-router";
import Container from "../components/layout/Container";
import PostHeader from "../components/blog/PostHeader";
import PostBody from "../components/blog/PostBody";
import { usePost } from "../hooks/usePosts";
import { useState, useEffect } from "react";

const PostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, error } = usePost(slug || "");
  const [imageLoadError, setImageLoadError] = useState(false);

  // Add a global handler for image loading errors
  useEffect(() => {
    const handleImageError = (e: Event) => {
      const img = e.target as HTMLImageElement;
      console.error(`Failed to load image: ${img.src}`);
      setImageLoadError(true);

      // Optional: Set a fallback image
      img.src = "/placeholder-image.jpg";
      img.alt = "Image could not be loaded";
    };

    document.addEventListener("error", handleImageError, true);

    return () => {
      document.removeEventListener("error", handleImageError, true);
    };
  }, []);

  if (loading) {
    return (
      <Container>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="animate-pulse text-xl">Loading post...</div>
        </div>
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container>
        <div className="flex min-h-[50vh] flex-col items-center justify-center">
          <div className="mb-4 text-xl text-red-500">Post not found</div>
          <Link
            to="/"
            className="inline-block rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Return to Home
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <article className="mb-32">
        <PostHeader
          title={post.title}
          coverImage={post.coverImage}
          date={post.date}
          author={post.author}
        />
        <PostBody content={post.content} />

        {imageLoadError && (
          <div className="mt-6 border-l-4 border-yellow-500 bg-yellow-100 p-4 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
            <p className="font-bold">Note:</p>
            <p>
              Some images in this post could not be loaded. This may be due to
              server issues or missing images.
            </p>
          </div>
        )}

        <div className="mt-12 border-t border-gray-200 pt-6 dark:border-gray-800">
          <Link
            to="/"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            ← Back to home
          </Link>
        </div>
      </article>
    </Container>
  );
};

export default PostPage;
