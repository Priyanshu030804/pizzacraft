import { ReactNode } from 'react';

declare module 'react-router-dom' {
  export interface LinkProps {
    to: string;
    className?: string;
    children?: ReactNode;
    target?: string;
    rel?: string;
  }

  export const Link: React.FC<LinkProps>;
  export const BrowserRouter: React.FC<{ children?: ReactNode }>;
  export const Routes: React.FC<{ children?: ReactNode }>;
  export const Route: React.FC<{ 
    path: string; 
    element: React.ReactElement 
  }>;
}

declare module 'lucide-react' {
  export interface IconProps {
    className?: string;
    size?: number | string;
    color?: string;
    strokeWidth?: number;
  }

  export const Clock: React.FC<IconProps>;
  export const Truck: React.FC<IconProps>;
  export const Shield: React.FC<IconProps>;
  export const Star: React.FC<IconProps>;
}
