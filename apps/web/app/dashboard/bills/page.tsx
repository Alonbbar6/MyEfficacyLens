'use client';

import { useState, useEffect } from 'react';
import { Bill } from '@efficacy/shared-types';
import BillCard from '@/components/BillCard';

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('FL');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch bills on component mount and when filters change
  useEffect(() => {
    fetchBills();
  }, [selectedState]);

  const fetchBills = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        state: selectedState,
        limit: '20',
      });

      if (searchQuery.trim()) {
        params.append('query', searchQuery.trim());
      }

      const response = await fetch(`/api/bills?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch bills');
      }

      if (data.success) {
        setBills(data.data);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Error fetching bills:', err);
      setError(err instanceof Error ? err.message : 'Failed to load bills');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBills();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (searchQuery.trim()) {
      fetchBills();
    }
  };

  // Filter bills by status
  const filteredBills = bills.filter((bill) => {
    if (statusFilter === 'all') return true;
    return bill.status.toLowerCase().includes(statusFilter.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Bills & Legislation</h1>
          <p className="text-base-content/70">
            Track bills and legislation in {selectedState}
          </p>
        </div>

        {/* Filters and Search */}
        <div className="card bg-base-100 shadow-lg mb-6">
          <div className="card-body">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              {/* State Selector */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">State</span>
                </label>
                <select
                  className="select select-bordered w-full md:w-32"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  <option value="FL">Florida</option>
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  <option value="TX">Texas</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="IL">Illinois</option>
                  <option value="OH">Ohio</option>
                  <option value="GA">Georgia</option>
                  <option value="NC">North Carolina</option>
                  <option value="MI">Michigan</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Status</span>
                </label>
                <select
                  className="select select-bordered w-full md:w-40"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="introduced">Introduced</option>
                  <option value="passed">Passed</option>
                  <option value="failed">Failed</option>
                  <option value="vetoed">Vetoed</option>
                </select>
              </div>

              {/* Search Input */}
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text font-medium">Search Bills</span>
                </label>
                <div className="join w-full">
                  <input
                    type="text"
                    placeholder="Search by keyword..."
                    className="input input-bordered join-item flex-1"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="btn join-item"
                      onClick={handleClearSearch}
                    >
                      Clear
                    </button>
                  )}
                  <button type="submit" className="btn btn-primary join-item">
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="alert alert-error shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="font-bold">Error loading bills</h3>
              <div className="text-sm">{error}</div>
            </div>
            <button className="btn btn-sm" onClick={fetchBills}>
              Retry
            </button>
          </div>
        )}

        {/* Bills Grid */}
        {!loading && !error && (
          <>
            <div className="flex justify-between items-center mb-4">
              <p className="text-base-content/70">
                Showing {filteredBills.length} bill{filteredBills.length !== 1 ? 's' : ''}
              </p>
            </div>

            {filteredBills.length === 0 ? (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body text-center py-12">
                  <div className="text-6xl mb-4">📜</div>
                  <h2 className="text-2xl font-bold mb-2">No Bills Found</h2>
                  <p className="text-base-content/70">
                    {searchQuery
                      ? 'Try adjusting your search or filters'
                      : 'No bills available for the selected state'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredBills.map((bill) => (
                  <BillCard key={bill.id} bill={bill} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
