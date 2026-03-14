'use client';

import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Plus, Eye, Edit3, Trash2 } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  author: string;
  status: 'published' | 'draft' | 'archived';
  publishedAt: string;
}

export const CmsTab = () => {
  const posts: BlogPost[] = [
    { id: '1', title: 'Top 10 Scholarships for Indian Students in 2026', author: 'Admin', status: 'published', publishedAt: '2026-01-15' },
    { id: '2', title: 'How to Build a Professional Resume', author: 'Career Team', status: 'published', publishedAt: '2026-01-10' },
    { id: '3', title: 'The Future of AI in Education', author: 'Tech Lead', status: 'draft', publishedAt: '-' },
  ];

  const columns = [
    { header: 'Title', accessorKey: 'title' },
    { header: 'Author', accessorKey: 'author' },
    { 
      header: 'Status', 
      accessorKey: 'status',
      cell: (post: BlogPost) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          post.status === 'published' ? 'bg-green-100 text-green-700' : 
          post.status === 'draft' ? 'bg-amber-100 text-amber-700' : 
          'bg-gray-100 text-gray-700'
        }`}>
          {post.status}
        </span>
      )
    },
    { header: 'Date', accessorKey: 'publishedAt' },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (_post: BlogPost) => (
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-gray-100 rounded text-gray-500" title="View">
            <Eye size={16} />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded text-gray-500" title="Edit">
            <Edit3 size={16} />
          </button>
          <button className="p-1 hover:bg-red-50 rounded text-red-500" title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Content Management</h3>
          <p className="text-sm text-gray-500">Manage blog posts, announcements, and site pages.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
          <Plus size={18} />
          New Post
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm col-span-2">
          <h4 className="font-semibold text-gray-800 mb-4">Recent Posts</h4>
          <DataTable columns={columns} data={posts} />
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-4">Quick Stats</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Posts</span>
                <span className="font-bold">24</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Views</span>
                <span className="font-bold">12.5k</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Scheduled</span>
                <span className="font-bold">3</span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-900 p-6 rounded-xl text-white shadow-lg">
            <h4 className="font-semibold mb-2">SEO Health</h4>
            <p className="text-xs text-indigo-200 mb-4">Your content visibility is increasing!</p>
            <div className="w-full bg-indigo-800 rounded-full h-2 mb-2">
              <div className="bg-indigo-400 h-2 rounded-full w-3/4" />
            </div>
            <span className="text-xs font-bold">75% Score</span>
          </div>
        </div>
      </div>
    </div>
  );
};
