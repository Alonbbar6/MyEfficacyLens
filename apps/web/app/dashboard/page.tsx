import Link from "next/link";

export const dynamic = "force-dynamic";

// Dashboard page - no authentication required
export default function Dashboard() {
  return (
    <main className="min-h-screen p-8 pb-24 bg-base-200">
      <section className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-extrabold">Efficacy Dashboard</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Politicians Card */}
          <Link href="/dashboard/politicians" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="card-title">Politicians</h2>
                  <p className="text-sm text-base-content/70">Your Representatives</p>
                </div>
              </div>
              <p className="text-base-content/70">
                Find and contact your elected officials at federal, state, and local levels.
              </p>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-primary btn-sm">View Representatives →</button>
              </div>
            </div>
          </Link>

          {/* Bills Card */}
          <Link href="/dashboard/bills" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="card-title">Bills</h2>
                  <p className="text-sm text-base-content/70">Track Legislation</p>
                </div>
              </div>
              <p className="text-base-content/70">
                Follow bills and legislation that matter to you. Get updates on their progress.
              </p>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-primary btn-sm">View Bills →</button>
              </div>
            </div>
          </Link>

          {/* Events Card */}
          <Link href="/dashboard/events" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="card-title">Events</h2>
                  <p className="text-sm text-base-content/70">Political Events</p>
                </div>
              </div>
              <p className="text-base-content/70">
                Discover town halls, debates, and other political events in your area.
              </p>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-primary btn-sm">View Events →</button>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="stats shadow w-full">
          <div className="stat">
            <div className="stat-title">Your Location</div>
            <div className="stat-value text-2xl">Not Set</div>
            <div className="stat-desc">Set your location to see your representatives</div>
          </div>
          
          <div className="stat">
            <div className="stat-title">Representatives</div>
            <div className="stat-value text-2xl">0</div>
            <div className="stat-desc">Federal, State, and Local</div>
          </div>
          
          <div className="stat">
            <div className="stat-title">Tracked Bills</div>
            <div className="stat-value text-2xl">0</div>
            <div className="stat-desc">Coming soon</div>
          </div>
        </div>
      </section>
    </main>
  );
}
