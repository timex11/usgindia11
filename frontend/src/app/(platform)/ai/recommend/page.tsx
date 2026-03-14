'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';

type RecommendationResult = {
  response: string;
};

export default function AiRecommendPage() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await apiClient<RecommendationResult>('/ai/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      });
      setResult(data);
    } catch (err) {
      console.error('Failed to generate recommendations:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to generate recommendations. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          AI Recommendations
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Personalized guidance for your academic and career journey in India.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl shadow-blue-50 border border-blue-50">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="prompt"
              className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider"
            >
              What are you looking for?
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., I've finished 12th in Science. I'm interested in Biotech and want to know about top colleges in Maharashtra and their entrance exams..."
              className="w-full h-40 p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-800 bg-slate-50 border-slate-200 transition-all"
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 disabled:bg-blue-400 font-bold transition-all shadow-lg shadow-blue-200"
            >
              {isLoading ? 'Processing...' : 'Get Personalized Advice'}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
          <span className="text-xl">⚠️</span> {error}
        </div>
      )}

      {isLoading && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
          <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse"></div>
        </div>
      )}

      {result && !isLoading && (
        <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-t-blue-500 relative overflow-hidden group">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <span className="text-2xl">✨</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Your AI Roadmap
            </h2>
          </div>
          <div className="prose prose-blue max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
            {result.response}
          </div>
          <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400">
            <span>Powered by USG India AI</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
