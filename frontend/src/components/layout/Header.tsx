import { Link } from 'react-router'

const Header = () => {
  return (
    <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight mb-20 mt-8 flex items-center">
      <Link to="/" className="hover:underline">
        Bikepacker Tracker
      </Link>
      .
    </h2>
  )
}

export default Header