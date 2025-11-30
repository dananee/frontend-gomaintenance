export default function Home() {
  // Middleware handles redirects:
  // - Authenticated users -> /dashboard
  // - Unauthenticated users -> /login
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Redirecting...</h1>
      </div>
    </div>
  );
}
