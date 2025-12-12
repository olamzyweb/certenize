import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Home, Book, Wallet } from "lucide-react";

const NotFound = () => {
  const VITE_APP_NAME = import.meta.env.VITE_APP_NAME || 'Certenize';  
  const location = useLocation();

  useEffect(() => {
    console.warn("404 — Route not found:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>404 | Page Not Found – {VITE_APP_NAME}</title>
        <meta
          name="description"
          content={`The page you're trying to access does not exist on ${VITE_APP_NAME}.`}
        />
      </Helmet>

      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white px-6">
        {/* Animated 404 */}
        <h1 className="text-8xl font-extrabold tracking-tight mb-3 animate-pulse">
          404
        </h1>

        <p className="text-xl text-gray-400 mb-8">
          The page you're seeking has been moved, deleted, or never existed.
        </p>

        {/* Search */}
        <div className="flex w-full max-w-sm items-center space-x-2 mb-6">
          <Input
            placeholder={`Search ${VITE_APP_NAME}...`}
            className="bg-zinc-900 border-zinc-700 text-white"
          />
          <Button variant="secondary" className="bg-white text-black hover:bg-zinc-200">
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <a
            href="/"
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-zinc-200"
          >
            <Home size={18} /> Home
          </a>

          <a
            href="/assessment"
            className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-lg hover:bg-zinc-800"
          >
            <Book size={18} /> Take Assessment
          </a>

          <a
            href="/gallery"
            className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-lg hover:bg-zinc-800"
          >
            <Wallet size={18} /> Your Certificates
          </a>
        </div>

        {/* Back button */}
        <Button
          asChild
          className="bg-white text-black font-medium hover:bg-gray-200"
        >
          <a href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back Home
          </a>
        </Button>

        {/* Footer text */}
        <p className="mt-6 text-sm text-gray-500">
          {VITE_APP_NAME} • Blockchain Education & Soulbound Credentials
        </p>
      </div>
    </>
  );
};

export default NotFound;
