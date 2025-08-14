import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

function Resources() {
  return (
    <div className='pt-20 h-screen bg-orange-50'>
      <div className=' md:max-w-[90%] h-full lg:max-w-[80%] mx-auto'>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mt-4 text-4xl font-bold text-gray-900 sm:text-5xl">
            Coming soon... 
          </h1>

          {/* Actions */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/home"
              className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-white shadow hover:bg-orange-700 active:scale-[0.99]"
            >
              Explore posts <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resources;