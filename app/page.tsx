import Link from 'next/link';

export default function Page() {
    return (
        <div className="h-screen">
            <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2">
                <Link 
                    href="/list" 
                    className="group relative inline-block px-12 py-6 rounded-full 
                               transition-all duration-300 ease-in-out
                               focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                               text-lg font-semibold z-50"
                    aria-label="Show list of items"
                >
                    <span className="relative z-10 text-white drop-shadow-md">Show List</span>
                    <span className="absolute inset-0 rounded-full bg-blue-600 blur-lg opacity-70  
                                     group-hover:opacity-100 group-hover:blur-md 
                                     transition-all duration-300 ease-in-out">
                    </span>
                    <span className="absolute inset-0 z-20" aria-hidden="true"></span>
                </Link>
            </div>
        </div>
    );
}