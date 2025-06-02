import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import matter from 'gray-matter';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className }) => {
  // Parse frontmatter and extract the actual markdown content
  const markdownFile = matter(content);
  
  return (
    <div className={`markdown ${className || ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
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
        {markdownFile.content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;