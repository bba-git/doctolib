import Link from 'next/link';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Doctolib</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/auth/signin"
              className="text-gray-600 hover:text-gray-900"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Sign up
            </Link>
          </div>
        </div>

        <div className="py-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Book appointments with healthcare professionals
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Find and book appointments with doctors, specialists, and healthcare providers in your area.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">For Patients</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 text-green-500">✓</span>
                    <span className="ml-3 text-gray-500">Find and book appointments easily</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 text-green-500">✓</span>
                    <span className="ml-3 text-gray-500">Manage your appointments online</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 text-green-500">✓</span>
                    <span className="ml-3 text-gray-500">Receive appointment reminders</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">For Professionals</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 text-green-500">✓</span>
                    <span className="ml-3 text-gray-500">Manage your schedule efficiently</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 text-green-500">✓</span>
                    <span className="ml-3 text-gray-500">Set your availability</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 text-green-500">✓</span>
                    <span className="ml-3 text-gray-500">Connect with patients</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
