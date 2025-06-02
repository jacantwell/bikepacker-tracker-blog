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
  
  // Debug logging (remove in production)
  console.log('Original content length:', content.length);
  console.log('Parsed markdown content:', markdownFile.content);
  console.log('Frontmatter:', markdownFile.data);
  
  // Safety check for empty content
  if (!markdownFile.content || markdownFile.content.trim() === '') {
    return (
      <div className={`markdown ${className || ''}`}>
        <p>No content found after parsing frontmatter</p>
      </div>
    );
  }
  
  return (
    <div className={`markdown ${className || ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Header styles
          h1: ({ node, ...props }) => (
            <h1 {...props} className="text-3xl md:text-4xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100" />
          ),
          h2: ({ node, ...props }) => (
            <h2 {...props} className="text-2xl md:text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100" />
          ),
          h3: ({ node, ...props }) => (
            <h3 {...props} className="text-xl md:text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-gray-100" />
          ),
          h4: ({ node, ...props }) => (
            <h4 {...props} className="text-lg md:text-xl font-bold mt-6 mb-2 text-gray-900 dark:text-gray-100" />
          ),
          // Other element styles with explicit colors
          p: ({ node, ...props }) => (
            <p {...props} className="my-4 text-lg text-gray-800 dark:text-gray-200" />
          ),
          ul: ({ node, ...props }) => (
            <ul {...props} className="list-disc pl-6 my-4 text-gray-800 dark:text-gray-200" />
          ),
          ol: ({ node, ...props }) => (
            <ol {...props} className="list-decimal pl-6 my-4 text-gray-800 dark:text-gray-200" />
          ),
          li: ({ node, ...props }) => (
            <li {...props} className="my-1 text-gray-800 dark:text-gray-200" />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              {...props}
              className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic my-6 text-gray-700 dark:text-gray-300"
            />
          ),
          // Add image styling
          img: ({ node, ...props }) => (
            <img {...props} className="max-w-full h-auto my-4 rounded-lg" />
          ),
          // Add code block styling
          pre: ({ node, ...props }) => (
            <pre {...props} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-4" />
          ),
        }}
      >
        {markdownFile.content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;