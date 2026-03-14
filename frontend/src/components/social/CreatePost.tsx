import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Image as ImageIcon, Link as LinkIcon, Smile, Loader2 } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

interface CreatePostProps {
  onPostCreated?: () => void;
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { post } = useApi();
  const { user } = useAuthStore();

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      await post('/social/posts', { content });
      toast.success("Post shared!");
      setContent('');
      if (onPostCreated) onPostCreated();
    } catch {
      toast.error("Failed to share post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6 shadow-sm border-slate-200/50 dark:border-slate-800/50">
      <CardContent className="p-4 sm:p-6">
        <div className="flex gap-4">
          <Avatar className="w-10 h-10 border">
            <AvatarImage src={(user?.user_metadata?.avatar_url as string) || user?.avatarUrl || ''} alt={user?.fullName || 'User'} />
            <AvatarFallback>{user?.fullName?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <Textarea
              placeholder="What's happening in your organization?"
              className="min-h-[100px] text-lg resize-none bg-transparent border-none focus-visible:ring-0 px-0 placeholder:text-slate-500"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
            />
            
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex space-x-2 text-brand-primary">
                <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50">
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50">
                  <LinkIcon className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50">
                  <Smile className="h-5 w-5" />
                </Button>
              </div>
              
              <Button 
                onClick={handleSubmit} 
                disabled={!content.trim() || isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 transition-all active:scale-95"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Post'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
