'use client';

import React, { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Plus, 
  Search,
  MoreVertical,
  User
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Image from 'next/image';
import { CreateCommunityPostDialog } from "@/components/community/create-post-dialog";

interface Post {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  upvotes?: number;
  comment_count?: number;
  created_at: string;
  author: {
    full_name: string;
    avatar_url: string;
    role: string;
  };
}

export default function CommunityPage() {
  const { get, loading } = useApi();
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const isMounted = React.useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const fetchPosts = React.useCallback(async () => {
    try {
      const data = await get<Post[]>('/community/posts');
      if (isMounted.current) {
        setPosts(Array.isArray(data) ? data : []);
      }
    } catch {
      // Handled by useApi
    }
  }, [get]);

  useEffect(() => {
    const initFetch = async () => {
      // Small delay to ensure we are out of the synchronous effect execution phase
      await Promise.resolve();
      if (isMounted.current) {
        await fetchPosts();
      }
    };
    initFetch();
  }, [fetchPosts]);

  const tags = ["All", "Career", "Tech", "Academic", "Government", "Events"];

  const filteredPosts = posts.filter(post => {
    const searchLower = search.toLowerCase();
    const title = post.title?.toLowerCase() || "";
    const content = post.content?.toLowerCase() || "";
    const matchesSearch = title.includes(searchLower) || content.includes(searchLower);
    const postTags = post.tags || [];
    const matchesTag = selectedTag === "All" || postTags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community Feed</h1>
          <p className="text-muted-foreground">Engage with your peers, share knowledge, and stay updated.</p>
        </div>
        <Button className="gap-2" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          Create Post
        </Button>
      </div>

      <CreateCommunityPostDialog 
        isOpen={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
        onSuccess={fetchPosts}
      />

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search discussions..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {tags.map(tag => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(tag)}
              className="rounded-full shrink-0"
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map(i => (
            <Card key={i} className="w-full">
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-3 w-[100px]" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </Card>
          ))
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <Card key={post.id} className="hover:border-slate-300 transition-colors border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-start gap-4 pb-2">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 border">
                  {post.author?.avatar_url ? (
                    <Image src={post.author.avatar_url} alt={post.author.full_name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">{post.author?.full_name || "Community Member"}</h3>
                      <p className="text-xs text-slate-500">
                        {post.author?.role || "Student"} • {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-xl mt-2">{post.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-slate-600 text-sm line-clamp-3">{post.content}</p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-slate-100 text-[10px]">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t py-3 gap-6">
                <button className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm">
                  <ThumbsUp className="w-4 h-4" />
                  {post.upvotes || 0}
                </button>
                <button className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm">
                  <MessageSquare className="w-4 h-4" />
                  {post.comment_count || 0} Comments
                </button>
                <button className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm ml-auto">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500">No posts found. Start a conversation!</p>
          </div>
        )}
      </div>
    </div>
  );
}
