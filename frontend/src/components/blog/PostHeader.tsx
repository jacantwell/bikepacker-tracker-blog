// import Avatar from './Avatar'
// import CoverImage from './CoverImage'
// import DateFormatter from './DateFormatter'
import { Author } from '../../types/Author'

type Props = {
  title: string
  coverImage: string
  date: string
  author: Author
}

const PostHeader = ({ title, coverImage, date, author }: Props) => {
  return (
    <>
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center md:text-left">
        {title}
      </h1>
      <div className="hidden md:block md:mb-12">
        {/* <Avatar name={author.name} picture={author.picture} /> */}
      </div>
      <div className="mb-8 md:mb-16 sm:mx-0">
        {/* <CoverImage title={title} src={coverImage} /> */}
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="block md:hidden mb-6">
          {/* <Avatar name={author.name} picture={author.picture} /> */}
        </div>
        <div className="mb-6 text-lg">
          {/* <DateFormatter dateString={date} /> */}
        </div>
      </div>
    </>
  )
}

export default PostHeader