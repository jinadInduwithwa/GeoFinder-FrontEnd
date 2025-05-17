
import React from 'react';
import { render, waitFor, act } from '@testing-library/react';
import { CountryProvider, useCountryContext } from './CountryContext.jsx';
import { toast } from 'react-toastify';
import { mockCountries } from '../../tests/mocks/mockData';
import { renderWithProvider } from '../../tests/utils/testUtils';

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
  ToastContainer: () => null,
}));

// Test component to access context
const TestComponent = ({ callback }) => {
  const context = useCountryContext();
  callback(context);
  return null;
};

describe('CountryProvider', () => {
  let cache;

  beforeEach(() => {
    // Clear mocks and storage
    jest.clearAllMocks();
    localStorage.clear();

    // Create fresh cache
    cache = new Map();
    jest.spyOn(global, 'Map').mockImplementation(() => cache);

    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCountries),
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete global.fetch;
  });

  test('initializes with correct default state', async () => {
    // Prevent fetch from resolving
    global.fetch.mockImplementationOnce(() => new Promise(() => {}));
    let contextValues;
    await act(async () => {
      renderWithProvider(
        <TestComponent callback={(ctx) => (contextValues = ctx)} />
      );
    });

    expect(contextValues.countries).toEqual([]);
    expect(contextValues.favorites).toEqual([]);
    expect(contextValues.loading).toBe(true); // Loading is true due to pending fetch
    expect(contextValues.error).toBe(null);
    expect(contextValues.currentPage).toBe(1);
    expect(contextValues.pageSize).toBe(12);
    expect(contextValues.totalPages).toBe(1);
    expect(contextValues.language).toBe('en');
    expect(contextValues.searchQuery).toBe('');
  });

  test('fetches countries on mount', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCountries,
    });

    let contextValues;
    await act(async () => {
      renderWithProvider(
        <TestComponent callback={(ctx) => (contextValues = ctx)} />
      );
    });

    await waitFor(
      () => {
        expect(global.fetch).toHaveBeenCalledWith('https://restcountries.com/v3.1/all');
        expect(contextValues.countries).toHaveLength(2);
        expect(contextValues.allCountries).toEqual(mockCountries);
        expect(contextValues.totalPages).toBe(1);
      },
      { timeout: 3000 }
    );
  });

  test('handles fetch error', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    let contextValues;
    await act(async () => {
      renderWithProvider(
        <TestComponent callback={(ctx) => (contextValues = ctx)} />
      );
    });

    await waitFor(
      () => {
        expect(contextValues.error).toBe('Network error');
        expect(toast.error).toHaveBeenCalledWith('Network error');
        expect(contextValues.loading).toBe(false);
      },
      { timeout: 3000 }
    );
  });

  test('adds and removes favorite countries', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 'user1' }));
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCountries,
    });

    let contextValues;
    await act(async () => {
      renderWithProvider(
        <TestComponent callback={(ctx) => (contextValues = ctx)} />
      );
    });

    await waitFor(
      () => expect(contextValues.countries).toHaveLength(2),
      { timeout: 3000 }
    );

    await act(async () => {
      contextValues.addFavoriteCountry('AFG');
    });

    expect(contextValues.favorites).toEqual(['AFG']);
    expect(toast.success).toHaveBeenCalledWith('Added to favorites');
    expect(localStorage.getItem('favorites_user1')).toBe('["AFG"]');

    await act(async () => {
      contextValues.removeFavoriteCountry('AFG');
    });

    expect(contextValues.favorites).toEqual([]);
    expect(toast.success).toHaveBeenCalledWith('Removed from favorites');
    expect(localStorage.getItem('favorites_user1')).toBe('[]');
  });

  test('blocks favorite actions without user', async () => {
    let contextValues;
    await act(async () => {
      renderWithProvider(
        <TestComponent callback={(ctx) => (contextValues = ctx)} />
      );
    });

    await act(async () => {
      contextValues.addFavoriteCountry('AFG');
    });

    expect(contextValues.favorites).toEqual([]);
    expect(toast.error).toHaveBeenCalledWith('Please sign in to add favorites');

    await act(async () => {
      contextValues.removeFavoriteCountry('AFG');
    });

    expect(toast.error).toHaveBeenCalledWith('Please sign in to remove favorites');
  });

  test('applies search filter', async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockCountries,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [mockCountries[0]], // Simulate /name/Afghanistan
      });

    let contextValues;
    await act(async () => {
      renderWithProvider(
        <TestComponent callback={(ctx) => (contextValues = ctx)} />
      );
    });

    await waitFor(
      () => {
        expect(contextValues.countries).toHaveLength(2);
      },
      { timeout: 3000 }
    );

    await act(async () => {
      contextValues.setSearchQuery('Afghanistan');
      // Wait for debounce (500ms)
      await new Promise((resolve) => setTimeout(resolve, 600));
    });

    await waitFor(
      () => {
        expect(global.fetch).toHaveBeenCalledWith('https://restcountries.com/v3.1/name/Afghanistan');
        expect(contextValues.countries).toEqual([mockCountries[0]]);
        expect(contextValues.totalPages).toBe(1);
      },
      { timeout: 3000 }
    );
  });

  test('fetches countries by region', async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockCountries,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockCountries, // Simulate /region/Asia
      });

    let contextValues;
    await act(async () => {
      renderWithProvider(
        <TestComponent callback={(ctx) => (contextValues = ctx)} />
      );
    });

    await act(async () => {
      contextValues.fetchCountriesByRegion('Asia');
    });

    await waitFor(
      () => {
        expect(global.fetch).toHaveBeenCalledWith('https://restcountries.com/v3.1/region/Asia');
        expect(contextValues.countries).toHaveLength(2);
      },
      { timeout: 3000 }
    );
  });

  test('clears cache and refetches', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockCountries,
    });

    let contextValues;
    await act(async () => {
      renderWithProvider(
        <TestComponent callback={(ctx) => (contextValues = ctx)} />
      );
    });

    await waitFor(
      () => {
        expect(contextValues.countries).toHaveLength(2);
      },
      { timeout: 3000 }
    );

    await act(async () => {
      contextValues.clearCache();
    });

    await waitFor(
      () => {
        expect(localStorage.getItem('countries')).toBeNull();
        expect(toast.success).toHaveBeenCalledWith('Cache cleared');
        expect(global.fetch).toHaveBeenCalledTimes(1); // Initial fetch + refetch
      },
      { timeout: 3000 }
    );
  });

  test('provides correct filter options', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCountries,
    });

    let contextValues;
    await act(async () => {
      renderWithProvider(
        <TestComponent callback={(ctx) => (contextValues = ctx)} />
      );
    });

    await waitFor(
      () => {
        expect(contextValues.getSubregions()).toEqual(['All Subregions', 'Southern Asia', 'Southern Europe']);
        expect(contextValues.getCurrencies()).toEqual(['All Currencies', 'AFN', 'ALL']);
        expect(contextValues.getTimeZones()).toEqual(['All Time Zones', 'UTC+01:00', 'UTC+04:30']);
      },
      { timeout: 3000 }
    );
  });

  test('throws error when useCountryContext is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestComponent callback={() => {}} />)).toThrow(
      'useCountryContext must be used within a CountryProvider'
    );
    consoleError.mockRestore();
  });
});