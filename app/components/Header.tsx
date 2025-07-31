import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-semibold text-gray-900">
                keanswon
            </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
                <Link 
                href="/record-lift" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                >
                record a lift
                </Link>
                <Link 
                href="/yourlifts" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                >
                your lifts
                </Link>
                <Link 
                href="/data" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                >
                your progress
                </Link>
            </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
            <button
                type="button"
                className="text-gray-600 hover:text-gray-900 p-2"
                aria-label="Open menu"
            >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            </div>
        </div>
        </nav>
    </header>
  )
}