import { Button } from '@mui/material';
import { Link } from '@tanstack/react-router';

export default function Header() {
  return (
    <header>
      <div className="mx-auto px-5 pt-16 md:px-10 md:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">
            The{' '}
            <span className="bg-gradient-to-r from-red-300 via-pink-400 to-purple-500 text-transparent bg-clip-text">
              Simple, Easy and Effective
            </span>{' '}
            Dating Platform
          </h1>
          <p className="mb-6 text-sm text-gray-500 sm:text-xl lg:mb-8">
            Say goodbye to poor communication, wasted time, bad
            conversations, and ghosting. With PalLine, we offer
            conversation starters, hand picked matchmaking, tailor
            made experiences, safety and security, and so much more.
          </p>
          {/* Button */}
          <Link to="/sign-up">
            <Button variant="contained">Sign Up</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
