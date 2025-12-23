// Debug Component to track re-renders
import React, { useEffect, useRef } from 'react';

const RenderTracker: React.FC<{ name: string; children: React.ReactNode }> = ({ name, children }) => {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    console.log(`${name} rendered ${renderCount.current} times`);
  });

  return <>{children}</>;
};

export default RenderTracker;
