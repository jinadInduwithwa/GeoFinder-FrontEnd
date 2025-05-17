// tests/utils/testUtils.js
import React from 'react';
import { render } from '@testing-library/react';
import { CountryProvider } from '../../src/context/CountryContext.jsx';

export const renderWithProvider = (ui, initialProps = {}) => {
  return render(
    <CountryProvider {...initialProps}>{ui}</CountryProvider>
  );
};