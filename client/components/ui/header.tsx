'use client';
import Link from 'next/link';
import Logo from './logo';
import MobileMenu from './mobile-menu';
import { useMyContext } from '../context/MyContext.js';

export default function Header() {
  console.log("header");
  const { data } = useMyContext();

  return (
    <header className="fixed w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="shrink-0 mr-4">
            <Logo />
          </div>
          <h2 className='font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out'>
            url.com
          </h2>
          <nav className="hidden md:flex md:grow">
            <ul className="flex grow justify-end flex-wrap items-center">
              {data ? (
                <>
                  <li className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out">
                    Welcome, {data.username}
                  </li>
                  <li>
                    <Link href="/createurl" className="btn-sm text-white bg-blue-600 hover:bg-blue-700 ml-3">
                      Create URL
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" className="btn-sm text-gray-200 bg-gray-900 hover:bg-gray-800 ml-3">
                      Dashboard
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/signin" className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out">Sign in</Link>
                  </li>
                  <li>
                    <Link href="/signup" className="btn-sm text-gray-200 bg-gray-900 hover:bg-gray-800 ml-3">
                      <span>Sign up</span>
                      <svg className="w-3 h-3 fill-current text-gray-400 shrink-0 ml-2 -mr-1" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z" fillRule="nonzero" />
                      </svg>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}