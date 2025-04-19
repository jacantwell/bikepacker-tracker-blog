import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className }) => {
  // Add base URL to image paths if they're not absolute and we're not in development mode
  const baseApiUrl = import.meta.env.VITE_API_URL || '';
  
  return (
    <div className={`markdown ${className || ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Custom image component to handle relative vs absolute URLs
          img: ({ node, ...props }) => {
            let src = props.src || '';
            
            // If src is not an absolute URL and doesn't start with the API base URL
            if (
              src && 
              !src.startsWith('http') && 
              !src.startsWith(baseApiUrl) &&
              baseApiUrl &&
              !src.startsWith('data:')
            ) {
              // Append the base API URL to the src
              src = `${baseApiUrl}${src}`;
            }
            
            return (
              <img
                {...props}
                src={src}
                alt={props.alt || ''}
                className="rounded-md my-6 max-w-full"
                loading="lazy"
              />
            );
          },

          // Custom link component 
          a: ({ node, ...props }) => (
            <a
              {...props}
              className="text-blue-600 dark:text-blue-400 hover:underline"
              target={props.href?.startsWith('http') ? '_blank' : undefined}
              rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            />
          ),
          // Header styles
          h1: ({ node, ...props }) => <h1 {...props} className="text-3xl md:text-4xl font-bold mt-8 mb-4" />,
          h2: ({ node, ...props }) => <h2 {...props} className="text-2xl md:text-3xl font-bold mt-8 mb-4" />,
          h3: ({ node, ...props }) => <h3 {...props} className="text-xl md:text-2xl font-bold mt-6 mb-3" />,
          h4: ({ node, ...props }) => <h4 {...props} className="text-lg md:text-xl font-bold mt-6 mb-2" />,
          // Other element styles
          p: ({ node, ...props }) => <p {...props} className="my-4 text-lg" />,
          ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-6 my-4" />,
          ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-6 my-4" />,
          li: ({ node, ...props }) => <li {...props} className="my-1" />,
          blockquote: ({ node, ...props }) => (
            <blockquote
              {...props}
              className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic my-6"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;