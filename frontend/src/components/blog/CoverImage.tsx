import { Link } from 'react-router';
import cn from 'classnames';

type Props = {
  title: string;
  src: string;
  slug?: string;
};

const CoverImage = ({ title, src, slug }: Props) => {
  const image = (
    <img
      src={src}
      alt={`Cover Image for ${title}`}
      className={cn('shadow-sm w-full', {
        'hover:shadow-lg transition-shadow duration-200': slug,
      })}
    />
  );
  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link to={`/posts/${slug}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  );
};

export default CoverImage;