import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-4">😕</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">404 - Page Not Found</h1>
        <p className="text-gray-600 text-lg mb-6">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/admin/dashboard"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
