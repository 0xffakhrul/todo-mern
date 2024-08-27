import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Auth = () => {
  return (
    <div className="max-w-7xl min-h-screen mx-auto flex flex-col items-center justify-center py-12 sm:py-24 lg:py-32">
      <h1 className="pb-8 bg-gradient-to-l from-cyan-200 to-purple-400 bg-clip-text text-transparent text-7xl font-black text-center">
        Start Todoing now.
      </h1>
      <SignedOut>
        <div className="space-x-4">
          <SignUpButton mode="modal">
            <button className="px-6 py-2 bg-purple-500/40 rounded-lg text-lg font-black text-purple-300">
              Sign Up
            </button>
          </SignUpButton>
          <SignInButton mode="modal">
            <button className="px-6 py-2 bg-green-500/40 rounded-lg text-lg font-black text-green-300 ">
              Sign In
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        <UserButton />
        <Link to="/dashboard">
          <p className="pt-3 text-purple-500">Go to dashboard</p>
        </Link>
      </SignedIn>
    </div>
  );
};

export default Auth;
