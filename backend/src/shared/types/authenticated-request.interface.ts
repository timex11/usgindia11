import { Request } from 'express';
import { Socket } from 'socket.io';

export interface SupabaseUser {
  id: string;
  sub: string;
  email?: string;
  role?: string;
  roles?: string[];
  permissions?: string[];
  collegeId?: string;
}

export interface AuthenticatedRequest extends Request {
  user: SupabaseUser;
  requestId?: string;
}

export interface AuthenticatedSocket extends Socket {
  user: SupabaseUser;
}
