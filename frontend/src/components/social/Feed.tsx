import { useState, useEffect } from 'react';
import { PostCard } from './PostCard';
import { CreatePost } from './CreatePost';
import { Skeleton } from '@/components/ui/skeleton';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';

interface Post {
  id: string;
  content: string;
  author: {
    id: string;
    fullName: string;
    avatarUrl?: string;
  };
  _count: {
    likes: number;
    comments: number;
    reposts: number;
  };
  createdAt: string;
  isLiked?: boolean;
}

export function Feed() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const { get } = useApi();

  const fetchFeed = async () => {
    try {
      const response = await get<{ data: Post[] }>('/social/feed');
      setPosts(response.data || []);
    } catch (error) {
      toast.error("Failed to load feed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [get]);

  const onPostCreated = () => {
    fetchFeed();
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex-1">
      <CreatePost onPostCreated={onPostCreated} />
      
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
              </div>
              <Skeleton className="h-24 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 pb-20">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          
          <div className="text-center py-8">
            <p className="text-sm text-slate-500">You&apos;re all caught up!</p>
          </div>
        </div>
      )}
    </div>
  );
}
