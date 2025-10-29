import { Bill } from '@efficacy/shared-types';
import Link from 'next/link';

interface BillCardProps {
  bill: Bill;
}

export default function BillCard({ bill }: BillCardProps) {
  // Format date to readable string
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Get badge color based on status
  const getStatusBadgeClass = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('passed') || statusLower.includes('enacted')) {
      return 'badge-success';
    }
    if (statusLower.includes('failed') || statusLower.includes('vetoed')) {
      return 'badge-error';
    }
    if (statusLower.includes('introduced')) {
      return 'badge-info';
    }
    if (statusLower.includes('committee')) {
      return 'badge-warning';
    }
    return 'badge-primary';
  };

  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-200">
      <div className="card-body">
        {/* Bill Number and Status */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-efficacy-clarity">
              {bill.number}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`badge badge-sm ${getStatusBadgeClass(bill.status)}`}>
                {bill.status}
              </span>
              <span className="badge badge-sm badge-outline">
                {bill.level}
              </span>
            </div>
          </div>
        </div>

        {/* Bill Title */}
        <h4 className="text-base font-semibold line-clamp-2 mb-2">
          {bill.title}
        </h4>

        {/* Bill Summary */}
        {bill.summary && (
          <p className="text-sm text-base-content/70 line-clamp-3 mb-3">
            {bill.summary}
          </p>
        )}

        {/* Sponsor Information */}
        {bill.sponsor && (
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="w-4 h-4 text-base-content/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-sm text-base-content/70">
              Sponsor: <span className="font-medium">{bill.sponsor.name}</span>
              {bill.sponsor.party && (
                <span className="ml-1">({bill.sponsor.party})</span>
              )}
            </span>
          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-2 gap-2 text-xs text-base-content/60 mb-4">
          <div>
            <span className="font-medium">Introduced:</span>{' '}
            {formatDate(bill.introducedDate)}
          </div>
          {bill.lastActionDate && (
            <div>
              <span className="font-medium">Last Action:</span>{' '}
              {formatDate(bill.lastActionDate)}
            </div>
          )}
        </div>

        {/* Subjects/Tags */}
        {bill.subjects && bill.subjects.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {bill.subjects.slice(0, 3).map((subject, index) => (
              <span
                key={index}
                className="badge badge-sm badge-ghost"
              >
                {subject}
              </span>
            ))}
            {bill.subjects.length > 3 && (
              <span className="badge badge-sm badge-ghost">
                +{bill.subjects.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Votes (if available) */}
        {bill.votes && (
          <div className="flex items-center gap-4 text-xs mb-4">
            <div className="flex items-center gap-1">
              <span className="text-success font-medium">✓ {bill.votes.yea}</span>
              <span className="text-base-content/50">Yea</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-error font-medium">✗ {bill.votes.nay}</span>
              <span className="text-base-content/50">Nay</span>
            </div>
            {bill.votes.present > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-warning font-medium">○ {bill.votes.present}</span>
                <span className="text-base-content/50">Present</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="card-actions justify-end">
          {bill.fullText && (
            <a
              href={bill.fullText}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline btn-primary"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              View Full Text
            </a>
          )}
          <button className="btn btn-sm btn-primary">
            Track Bill
          </button>
        </div>
      </div>
    </div>
  );
}
