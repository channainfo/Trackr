// client/src/components/Example.tsx
// A simple component to test
import React from 'react';

interface ExampleProps {
  text: string;
}

export const Example: React.FC<ExampleProps> = ({ text }) => {
  return <div data-testid="example-component">{text}</div>;
};