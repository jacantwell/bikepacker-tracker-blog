import MarkdownRenderer from './MarkdownRenderer';

type Props = {
  content: string;
};

const PostBody = ({ content }: Props) => {
  return (
    <div className="max-w-2xl mx-auto">
      <MarkdownRenderer content={content} />
    </div>
  );
};

export default PostBody;