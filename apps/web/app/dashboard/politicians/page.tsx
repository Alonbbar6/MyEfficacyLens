'use client';

import { useState, useEffect } from 'react';
import { politiciansApi, Politician } from '@/lib/api/politicians';

export default function PoliticiansPage() {
  const [politicians, setPoliticians] = useState<Politician[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState('20500'); // Default to DC
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  useEffect(() => {
    loadPoliticians();
  }, []);

  const loadPoliticians = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await politiciansApi.getRepresentativesByAddress(address);
      setPoliticians(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadPoliticians();
  };

  const filteredPoliticians = politicians.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || p.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const getPartyColor = (party: string) => {
    switch (party) {
      case 'Democrat': return 'bg-blue-100 text-blue-800';
      case 'Republican': return 'bg-red-100 text-red-800';
      case 'Independent': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Federal': return 'bg-indigo-100 text-indigo-800';
      case 'State': return 'bg-green-100 text-green-800';
      case 'Local': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Representatives</h1>
          <p className="text-base-content/70">
            Find and contact your elected officials at all levels of government
          </p>
        </div>

        {/* Location Input */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title">Your Location</h2>
            <p className="text-sm text-base-content/70 mb-2">
              Enter your state, city, or zip code to find your representatives
            </p>
            <form onSubmit={handleAddressSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter state, city, or zip code..."
                className="input input-bordered flex-1"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                Find Representatives
              </button>
            </form>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs text-base-content/60">Examples:</span>
              <button
                type="button"
                className="text-xs link link-primary"
                onClick={() => setAddress('Florida')}
              >
                Florida
              </button>
              <button
                type="button"
                className="text-xs link link-primary"
                onClick={() => setAddress('Miami, FL')}
              >
                Miami, FL
              </button>
              <button
                type="button"
                className="text-xs link link-primary"
                onClick={() => setAddress('New York')}
              >
                New York
              </button>
              <button
                type="button"
                className="text-xs link link-primary"
                onClick={() => setAddress('CA')}
              >
                California
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex flex-wrap gap-4">
              {/* Search */}
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search by name or position..."
                  className="input input-bordered w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Level Filter */}
              <div className="flex gap-2">
                <button
                  className={`btn btn-sm ${selectedLevel === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setSelectedLevel('all')}
                >
                  All
                </button>
                <button
                  className={`btn btn-sm ${selectedLevel === 'Federal' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setSelectedLevel('Federal')}
                >
                  Federal
                </button>
                <button
                  className={`btn btn-sm ${selectedLevel === 'State' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setSelectedLevel('State')}
                >
                  State
                </button>
                <button
                  className={`btn btn-sm ${selectedLevel === 'Local' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setSelectedLevel('Local')}
                >
                  Local
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="alert alert-error mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Politicians List */}
        {!loading && !error && (
          <>
            <div className="mb-4 text-sm text-base-content/70">
              Showing {filteredPoliticians.length} of {politicians.length} representatives
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPoliticians.map((politician) => (
                <div key={politician.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                  <div className="card-body">
                    {/* Photo and Name */}
                    <div className="flex items-start gap-4 mb-4">
                      {politician.photo ? (
                        <img
                          src={politician.photo}
                          alt={politician.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-2xl font-bold text-primary">
                            {politician.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="card-title text-lg">{politician.name}</h3>
                        <p className="text-sm text-base-content/70">{politician.position}</p>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`badge ${getPartyColor(politician.party)}`}>
                        {politician.party}
                      </span>
                      <span className={`badge ${getLevelColor(politician.level)}`}>
                        {politician.level}
                      </span>
                      {politician.district && (
                        <span className="badge badge-outline">
                          {politician.district}
                        </span>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 text-sm">
                      {politician.phone && (
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <a href={`tel:${politician.phone}`} className="link link-hover">
                            {politician.phone}
                          </a>
                        </div>
                      )}
                      {politician.email && (
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <a href={`mailto:${politician.email}`} className="link link-hover">
                            Email
                          </a>
                        </div>
                      )}
                      {politician.website && (
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                          <a href={politician.website} target="_blank" rel="noopener noreferrer" className="link link-hover">
                            Website
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Social Media */}
                    {(politician.socialMedia?.twitter || politician.socialMedia?.facebook) && (
                      <div className="flex gap-2 mt-4">
                        {politician.socialMedia.twitter && (
                          <a
                            href={`https://twitter.com/${politician.socialMedia.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-circle btn-sm btn-ghost"
                          >
                            𝕏
                          </a>
                        )}
                        {politician.socialMedia.facebook && (
                          <a
                            href={`https://facebook.com/${politician.socialMedia.facebook}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-circle btn-sm btn-ghost"
                          >
                            f
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredPoliticians.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-base-content/70">
                  No representatives found matching your criteria.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
