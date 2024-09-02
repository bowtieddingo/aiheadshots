// app/dashboard/layout.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Link from 'next/link';
import { UserButton } from '@/components/UserButton';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between py-4 space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/dashboard" className="font-bold text-xl sm:text-2xl">
                AI Headshots
              </Link>
              <nav className="flex items-center space-x-2 sm:space-x-4">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Home
                </Link>
                <Link
                  href="/dashboard/past-generations"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Past Generations
                </Link>
              </nav>
            </div>
            <UserButton />
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
