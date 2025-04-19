import { Link } from 'react-router';
import Avatar from './Avatar';
import CoverImage from './CoverImage';
import DateFormatter from './DateFormatter';
import { Author } from '../../types/Author';

type Props = {
  title: string;
  coverImage: string;
  date: string;
  excerpt: string;
  author: Author;
  slug: string;
};

const backendUrl = import.meta.env.VITE_API_URL;
const PostPreview = ({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: Props) => {
  console.log(author)
  return (
    <div>
      <div className="mb-5">
        <CoverImage slug={slug} title={title} src={backendUrl+coverImage} />
      </div>
      <h3 className="text-3xl mb-3 leading-snug">
        <Link to={`/posts/${slug}`} className="hover:underline">
          {title}
        </Link>
      </h3>
      <div className="text-lg mb-4">
        <DateFormatter dateString={date} />
      </div>
      <p className="text-lg leading-relaxed mb-4">{excerpt}</p>
      <Avatar name={author.name} picture={backendUrl+author.picture} />
    </div>
  );
};

export default PostPreview;