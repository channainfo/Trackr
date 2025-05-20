// client/src/components/Example.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Example } from './example';

describe('Example Component', () => {
  it('renders with provided text', () => {
    render(<Example text="Hello Testing!" />);

    const element = screen.getByTestId('example-component');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Hello Testing!');
  });
});