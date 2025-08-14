import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-1">
      <span className="text-2xl md:text-3xl text-gray-600 font-Saira font-bold">
        SIT
      </span>
      <span className="text-2xl md:text-3xl text-orange-400 font-Saira font-bold">
        Coders
      </span>
    </Link>
  );
};

export default Logo;
