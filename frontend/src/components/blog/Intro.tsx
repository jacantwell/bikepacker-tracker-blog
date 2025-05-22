import { Link } from 'react-router'

const Intro = () => {
  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">
        Jasper. UK to ?
      </h1>
      <div className="text-center md:text-left mt-5 md:pl-8">
        <h4 className="text-lg mb-4">
          A blog of my travels around the world.
        </h4>
        <Link 
          to="/planned-route" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          View Planned Route →
        </Link>
      </div>
    </section>
  )
}

export default Intro