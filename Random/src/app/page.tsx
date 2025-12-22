'use client';

import { useState } from 'react';

interface ResearchSummary {
  businessSnapshot: {
    name: string;
    industry: string;
    location: string;
    description: string;
  };
  qualityAndReviews: {
    overallRating: string;
    ratingExplanation: string;
    reviewHighlights: string[];
    qualityIndicators: string[];
    negativeIndicators: string[];
  };
  distributionAndPricing: {
    distributionChannels: string[];
    pricingSignals: string[];
    marketPosition: string;
  };
  outreachPitch: {
    contactEmail: string;
    similarSPs: string[];
  };
}

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [research, setResearch] = useState<ResearchSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      setError('Please enter a business name, website, or Google Maps link');
      return;
    }

    setLoading(true);
    setError(null);
    setResearch(null);

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: input.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch research');
      }

      const data = await response.json();
      setResearch(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          SP Research Copilot
        </h1>
        <p className="text-gray-600 mb-8">
          Internal tool for BDMs to research businesses
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
              Business Name, Website, or Google Maps Link
            </label>
            <input
              id="input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., Acme Restaurant, https://example.com, or https://maps.google.com/..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Researching...' : 'Submit'}
            </button>
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>
        </form>

        {/* Research Results */}
        {research && research.businessSnapshot && (
          <div className="space-y-6">
            {/* Business Snapshot */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Business Snapshot
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Name: </span>
                  <span className="text-gray-900">{research.businessSnapshot?.name || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Industry: </span>
                  <span className="text-gray-900">{research.businessSnapshot?.industry || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Location: </span>
                  <span className="text-gray-900">{research.businessSnapshot?.location || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Description: </span>
                  <span className="text-gray-900">{research.businessSnapshot?.description || 'N/A'}</span>
                </div>
              </div>
            </section>

            {/* Quality & Reviews */}
            {research.qualityAndReviews && (
              <section className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  2. Quality & Reviews (AI Generated)
                </h2>
                <div className="space-y-4">
                  <div>
                    <span className="font-medium text-gray-700">Overall Rating: </span>
                    <span className="text-gray-900">{research.qualityAndReviews?.overallRating || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 mb-2 block">Rating Explanation:</span>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-200">
                      {research.qualityAndReviews?.ratingExplanation || 'No explanation available'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 mb-2 block">Review Highlights:</span>
                    <ul className="list-disc list-inside space-y-1 text-gray-900 ml-4">
                      {research.qualityAndReviews?.reviewHighlights && research.qualityAndReviews.reviewHighlights.length > 0 ? (
                        research.qualityAndReviews.reviewHighlights.map((highlight, idx) => (
                          <li key={idx}>{highlight}</li>
                        ))
                      ) : (
                        <li className="text-gray-500">No highlights available</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 mb-2 block">Quality Indicators:</span>
                    <ul className="list-disc list-inside space-y-1 text-gray-900 ml-4">
                      {research.qualityAndReviews?.qualityIndicators && research.qualityAndReviews.qualityIndicators.length > 0 ? (
                        research.qualityAndReviews.qualityIndicators.map((indicator, idx) => (
                          <li key={idx}>{indicator}</li>
                        ))
                      ) : (
                        <li className="text-gray-500">No indicators available</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 mb-2 block">Negative Indicators:</span>
                    <ul className="list-disc list-inside space-y-1 text-red-700 ml-4">
                      {research.qualityAndReviews?.negativeIndicators && research.qualityAndReviews.negativeIndicators.length > 0 ? (
                        research.qualityAndReviews.negativeIndicators.map((indicator, idx) => (
                          <li key={idx}>{indicator}</li>
                        ))
                      ) : (
                        <li className="text-gray-500">No negative indicators found</li>
                      )}
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {/* Distribution & Pricing Signals */}
            {research.distributionAndPricing && (
              <section className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  3. Distribution & Pricing Signals
                </h2>
                <div className="space-y-4">
                  <div>
                    <span className="font-medium text-gray-700 mb-2 block">Distribution Channels:</span>
                    <ul className="list-disc list-inside space-y-1 text-gray-900 ml-4">
                      {research.distributionAndPricing?.distributionChannels && research.distributionAndPricing.distributionChannels.length > 0 ? (
                        research.distributionAndPricing.distributionChannels.map((channel, idx) => (
                          <li key={idx}>{channel}</li>
                        ))
                      ) : (
                        <li className="text-gray-500">No channels available</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 mb-2 block">Pricing Signals:</span>
                    <ul className="list-disc list-inside space-y-1 text-gray-900 ml-4">
                      {research.distributionAndPricing?.pricingSignals && research.distributionAndPricing.pricingSignals.length > 0 ? (
                        research.distributionAndPricing.pricingSignals.map((signal, idx) => (
                          <li key={idx}>{signal}</li>
                        ))
                      ) : (
                        <li className="text-gray-500">No pricing signals available</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Market Position: </span>
                    <span className="text-gray-900">{research.distributionAndPricing?.marketPosition || 'N/A'}</span>
                  </div>
                </div>
              </section>
            )}

            {/* Outreach Pitch */}
            {research.outreachPitch && (
              <section className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  4. Outreach Pitch
                </h2>
                <div className="space-y-4">
                  <div>
                    <span className="font-medium text-gray-700">Contact Email: </span>
                    <span className="text-gray-900">{research.outreachPitch?.contactEmail || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 mb-2 block">Similar Service Providers:</span>
                    <ul className="list-disc list-inside space-y-1 text-gray-900 ml-4">
                      {research.outreachPitch?.similarSPs && research.outreachPitch.similarSPs.length > 0 ? (
                        research.outreachPitch.similarSPs.map((sp, idx) => (
                          <li key={idx}>{sp}</li>
                        ))
                      ) : (
                        <li className="text-gray-500">No similar SPs found</li>
                      )}
                    </ul>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

