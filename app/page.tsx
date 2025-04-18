import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-blue-900 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Engineering Exam Platform</h1>
          </div>
          <nav className="flex space-x-4">
            <Link href="/login">
              <Button
                variant="outline"
                className="text-white border-white hover:bg-blue-800"
              >
                Login
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-6">
        <div className="max-w-4xl mx-auto mt-12 text-center">
          <h1 className="text-4xl font-bold mb-6">
            Welcome to the Engineering Exam Platform
          </h1>
          <p className="text-xl mb-8">
            A secure and comprehensive platform for engineering exam preparation
            and assessment
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold mb-4">For Students</h2>
              <p className="mb-6">
                Take practice tests, track your progress, and improve your
                performance with detailed analytics
              </p>
              <Link href="/student/login">
                <Button className="w-full">Student Login</Button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold mb-4">For Teachers</h2>
              <p className="mb-6">
                Create and schedule tests, analyze student performance, and
                generate detailed reports
              </p>
              <Link href="/teacher/login">
                <Button className="w-full">Teacher Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 p-6 border-t">
        <div className="container mx-auto text-center text-gray-600">
          <p>
            © {new Date().getFullYear()} Engineering Exam Platform. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
