// frontend/app/page.js
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gray-100 text-gray-800">
      {/* Main welcome heading */}
      <h1 className="text-5xl font-extrabold text-blue-700 mb-6 animate-fade-in-down">
        Welcome to Your Store Application!
      </h1>

      {/* Subtitle/description */}
      <p className="text-xl text-gray-600 mb-8 max-w-2xl animate-fade-in-up">
        This is your full-stack application, successfully deployed and running.
        Explore its features by creating an account or logging in.
      </p>

      {/* Call to action buttons */}
      <div className="flex space-x-4 animate-fade-in-up delay-200">
        <Link href="/register" passHref>
          <button className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300 transform hover:scale-105">
            Register Now
          </button>
        </Link>
        <Link href="/login" passHref>
          <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105">
            Login
          </button>
        </Link>
      </div>

      {/* Optional: Add a small footer or note */}
      <p className="mt-12 text-sm text-gray-500 animate-fade-in-up delay-400">
        Powered by Next.js, Spring Boot, PostgreSQL, and Docker.
      </p>

      {/* Basic CSS for animations (can be moved to global.css) */}
      <style jsx global>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}
