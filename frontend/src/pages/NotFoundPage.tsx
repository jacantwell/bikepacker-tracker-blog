import { Link } from 'react-router'
import Container from '../components/layout/Container'

const NotFoundPage = () => {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8 mb-8">
          404
        </h1>
        <h2 className="text-xl md:text-2xl mb-8">
          Oops! We couldn't find that page.
        </h2>
        <Link to="/" className="bg-black hover:bg-white hover:text-black border border-black text-white font-bold py-3 px-12 transition-colors">
          Return Home
        </Link>
      </div>
    </Container>
  )
}

export default NotFoundPage