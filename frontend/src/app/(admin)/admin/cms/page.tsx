'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Plus, FileText, Search,
  Edit, Trash2, Loader2
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../../../components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface CmsPage {
  id: string;
  title: string;
  slug: string;
  content?: string;
  status: 'published' | 'draft';
  updated_at: string;
}

export default function AdminCmsPage() {
  const { get, post, put, delete: remove, loading } = useApi();
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<CmsPage | null>(null);
  const [formData, setFormData] = useState({ title: '', slug: '', content: '' });

  const fetchPages = useCallback(async () => {
    try {
      const data = await get<CmsPage[]>('/cms');
      setPages(data);
    } catch (error) {
      console.error("Failed to fetch pages", error);
      // Fallback to mock if backend fails (for demo purposes)
      // setPages(mockPages);
      // Actually, don't fallback silently. Show error.
      toast.error("Failed to load CMS pages");
    }
  }, [get]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPages();
  }, [fetchPages]);

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.slug.trim()) {
      toast.error("Title and Slug are required");
      return;
    }

    try {
      if (editingPage) {
        await put(`/cms/${editingPage.id}`, { ...formData, status: editingPage.status });
        toast.success("Page updated successfully");
      } else {
        await post('/cms', { ...formData, status: 'draft' });
        toast.success("Page created successfully");
      }
      setIsDialogOpen(false);
      fetchPages();
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return;
    try {
      await remove(`/cms/${id}`);
      toast.success("Page deleted");
      fetchPages();
    } catch {
      toast.error("Failed to delete page");
    }
  };

  const openEdit = (page: CmsPage) => {
    setEditingPage(page);
    setFormData({ title: page.title, slug: page.slug, content: page.content || '' });
    setIsDialogOpen(true);
  };

  const openNew = () => {
    setEditingPage(null);
    setFormData({ title: '', slug: '', content: '' });
    setIsDialogOpen(true);
  };

  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage your platform pages.</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" /> New Page
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingPage ? 'Edit Page' : 'Create New Page'}</DialogTitle>
            <DialogDescription>
              {editingPage ? 'Update page details below.' : 'Add a new page to the system.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input 
                id="title" 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right">Slug</Label>
              <Input 
                id="slug" 
                value={formData.slug} 
                onChange={(e) => setFormData({...formData, slug: e.target.value})} 
                className="col-span-3" 
              />
            </div>
            {/* Simple content area for now */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content" className="text-right">Content</Label>
              <Input
                id="content"
                value={formData.content} 
                onChange={(e) => setFormData({...formData, content: e.target.value})} 
                className="col-span-3" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
           <div className="flex items-center space-x-2">
             <Search className="h-4 w-4 text-muted-foreground" />
             <Input 
               placeholder="Search pages..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="max-w-sm"
             />
           </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && pages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : filteredPages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No pages found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-blue-600" />
                        {page.title}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{page.slug}</TableCell>
                    <TableCell>
                      {page.status === 'published' ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Published</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(page.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(page)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(page.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
