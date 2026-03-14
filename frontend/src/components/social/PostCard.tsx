import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, Repeat2, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: {
    id: string;
    content: string;
    author: {
      fullName: string;
      id: string;
      avatarUrl?: string;
    };
    _count: {
      likes: number;
      comments: number;
      reposts: number;
    };
    createdAt: string;
    isLiked?: boolean;
    isReposted?: boolean;
  };
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="mb-4 shadow-sm border-slate-200/50 dark:border-slate-800/50 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-900/50 cursor-pointer">
      <CardHeader className="flex flex-row items-start justify-between p-4 sm:p-6 pb-0">
        <div className="flex space-x-3 items-center">
          <Avatar className="w-10 h-10 border">
            <AvatarImage src={post.author.avatarUrl} alt={post.author.fullName} />
            <AvatarFallback>{post.author.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-slate-900 dark:text-slate-100 hover:underline">{post.author.fullName}</span>
              <span className="text-slate-500 text-sm">@{post.author.id.substring(0, 8)}</span>
              <span className="text-slate-500 text-sm px-1">·</span>
              <span className="text-slate-500 text-sm hover:underline">{formatDistanceToNow(new Date(post.createdAt))} ago</span>
            </div>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
              <span className="sr-only">More options</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Report Post</DropdownMenuItem>
            <DropdownMenuItem>Mute User</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Block User</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="p-4 sm:px-6 pt-3 pb-3 ml-13">
        <p className="text-slate-800 dark:text-slate-200 text-[15px] leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </CardContent>
      
      <CardFooter className="p-2 sm:px-6 pb-4">
        <div className="flex justify-between w-full max-w-md ml-13 text-slate-500">
          <Button variant="ghost" size="sm" className="space-x-2 rounded-full hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/50 group">
            <MessageCircle className="h-4 w-4 group-hover:fill-blue-100" />
            <span className="text-xs">{post._count.comments > 0 ? post._count.comments : ''}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className={`space-x-2 rounded-full hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-950/50 group ${post.isReposted ? 'text-green-500' : ''}`}>
            <Repeat2 className="h-4 w-4" />
            <span className="text-xs">{post._count.reposts > 0 ? post._count.reposts : ''}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className={`space-x-2 rounded-full hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 group ${post.isLiked ? 'text-red-500' : ''}`}>
            <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-red-500' : ''}`} />
            <span className="text-xs">{post._count.likes > 0 ? post._count.likes : ''}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="space-x-2 rounded-full hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/50">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}