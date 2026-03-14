"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { get, post, patch, delete: del } = useApi();

  const fetchTodos = async () => {
    try {
      const data = await get<Todo[]>('/todos');
      setTodos(data);
    } catch {
      // Handled by service/interceptor
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchTodos();
  }, []);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const todo = await post<Todo>('/todos', { title: newTodo, priority: 'medium' });
      setTodos([todo, ...todos]);
      setNewTodo('');
      toast.success('Task added');
    } catch {
       // Handled by service/interceptor
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      await patch(`/todos/${id}`, { completed: !completed });
      setTodos(todos.map(t => t.id === id ? { ...t, completed: !completed } : t));
    } catch {
       // Handled by service/interceptor
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await del(`/todos/${id}`);
      setTodos(todos.filter(t => t.id !== id));
      toast.success('Task deleted');
    } catch {
       // Handled by service/interceptor
    }
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'high') return 'bg-red-500/10 text-red-400';
    if (priority === 'medium') return 'bg-blue-500/10 text-blue-400';
    return 'bg-slate-500/10 text-slate-400';
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-blue-500" />
          Focus Tasks
        </CardTitle>
        <Badge variant="secondary">{todos.filter(t => !t.completed).length} Pending</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={addTodo} className="flex gap-2">
          <Input 
            placeholder="What needs to be done?" 
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="bg-slate-950 border-slate-800 text-white"
          />
          <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700 shrink-0">
            <Plus className="w-4 h-4" />
          </Button>
        </form>

        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence initial={false}>
            {todos.map((todo) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  todo.completed 
                  ? 'bg-slate-900/30 border-slate-800/50 opacity-50' 
                  : 'bg-slate-800/50 border-slate-700 hover:border-blue-500/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button onClick={() => void toggleTodo(todo.id, todo.completed)}>
                    {todo.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 hover:text-blue-400" />
                    )}
                  </button>
                  <span className={`text-sm font-medium text-white ${todo.completed ? 'line-through text-slate-500' : ''}`}>
                    {todo.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`text-[10px] uppercase ${getPriorityBadge(todo.priority)}`}>
                    {todo.priority}
                  </Badge>
                  <button 
                    onClick={() => void deleteTodo(todo.id)}
                    className="p-1 hover:bg-red-500/20 rounded text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {todos.length === 0 && !isLoading && (
            <div className="text-center py-8 text-slate-500 italic text-sm">
              No tasks yet. Stay productive!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
