'use client';

import { Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <div className={className}>
      <Suspense 
        fallback={
          <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-900/20 rounded-xl">
            <span className="animate-pulse">Loading 3D Scene...</span>
          </div>
        }
      >
        <Spline scene={scene} />
      </Suspense>
    </div>
  );
}
