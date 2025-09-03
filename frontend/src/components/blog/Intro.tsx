import { Link } from "react-router";

const Intro = () => {
  return (
    <section className="mb-16 mt-16 flex flex-col items-center md:mb-12 md:flex-row md:justify-between">
      <h1 className="text-5xl font-bold leading-tight tracking-tighter md:pr-8 md:text-8xl">
        Jasper. UK to ?
      </h1>
      <div className="mt-5 text-center md:pl-8 md:text-left">
        <h4 className="mb-4 text-lg">A blog of my travels around the world.</h4>
        <Link
          to="/planned-route"
          className="relative inline-block w-full rounded-lg bg-blue-600 px-6 py-3 text-center font-medium text-white transition-colors hover:bg-blue-700"
        >
          View Planned Route →
          <span className="absolute -right-1 -top-1 flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            !
          </span>
        </Link>
      </div>
    </section>
  );
};

export default Intro;
