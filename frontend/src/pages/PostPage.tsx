import { useParams, Link } from 'react-router';
import Container from '../components/layout/Container';
import Header from '../components/layout/Header';
import PostHeader from '../components/blog/PostHeader';
import PostBody from '../components/blog/PostBody';
import { usePost } from '../hooks/usePosts';
import { useState, useEffect } from 'react';

const PostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, error } = usePost(slug || '');
  const [imageLoadError, setImageLoadError] = useState(false);

  // Add a global handler for image loading errors
  useEffect(() => {
    const handleImageError = (e: Event) => {
      const img = e.target as HTMLImageElement;
      console.error(`Failed to load image: ${img.src}`);
      setImageLoadError(true);
      
      // Optional: Set a fallback image
      img.src = '/placeholder-image.jpg';
      img.alt = 'Image could not be loaded';
    };

    document.addEventListener('error', handleImageError, true);

    return () => {
      document.removeEventListener('error', handleImageError, true);
    };
  }, []);

  if (loading) {
    return (
      <Container>
        <Header />
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-pulse text-xl">Loading post...</div>
        </div>
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container>
        <Header />
        <div className="flex flex-col justify-center items-center min-h-[50vh]">
          <div className="text-red-500 text-xl mb-4">Post not found</div>
          <Link 
            to="/" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header />
      <article className="mb-32">
        <PostHeader
          title={post.title}
          coverImage={post.coverImage}
          date={post.date}
          author={post.author}
        />
        <PostBody content={post.content} />
        
        {imageLoadError && (
          <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300">
            <p className="font-bold">Note:</p>
            <p>Some images in this post could not be loaded. This may be due to server issues or missing images.</p>
          </div>
        )}
        
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
          <Link 
            to="/" 
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to home
          </Link>
        </div>
      </article>
    </Container>
  );
};

export default PostPage;