import React from 'react';
import Link from 'next/link';

const Button = ({ children, onClick, size, variant, href, isLoading }) => {
  const buttonStyle =
    'py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white';
  if (href) {
    return (
      <Link href={href}>
        <button className={buttonStyle} onClick={onClick} disabled={isLoading}>
          {children}
        </button>
      </Link>
    );
  }
  return (
    <button className={buttonStyle} onClick={onClick} disabled={isLoading}>
      {children}
    </button>
  );
};

export default Button;
