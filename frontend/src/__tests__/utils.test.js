/**
 * 🧪 UNIT TESTS (#41)
 * Example tests for utility functions using Jest
 */

import {
  searchItems,
  filterItems,
  sortItems,
  bulkDelete,
  bulkUpdate,
  paginate,
  exportToJSON,
  exportToCSV,
} from '../utils/adminHelpers';

describe('Admin Helpers', () => {
  const mockData = [
    { id: 1, name: 'Item 1', category: 'A', price: 100 },
    { id: 2, name: 'Item 2', category: 'B', price: 200 },
    { id: 3, name: 'Item 3', category: 'A', price: 150 },
  ];

  describe('searchItems', () => {
    it('should search by single field', () => {
      const result = searchItems(mockData, 'Item 1', ['name']);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('should search across multiple fields', () => {
      const result = searchItems(mockData, 'A', ['category', 'name']);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no match', () => {
      const result = searchItems(mockData, 'nonexistent', ['name']);
      expect(result).toHaveLength(0);
    });

    it('should handle empty query', () => {
      const result = searchItems(mockData, '', ['name']);
      expect(result).toEqual(mockData);
    });
  });

  describe('filterItems', () => {
    it('should filter by single condition', () => {
      const result = filterItems(mockData, { category: 'A' });
      expect(result).toHaveLength(2);
    });

    it('should filter by multiple conditions', () => {
      const result = filterItems(mockData, { category: 'A', price: 100 });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('should return all items when filter is empty', () => {
      const result = filterItems(mockData, {});
      expect(result).toEqual(mockData);
    });
  });

  describe('sortItems', () => {
    it('should sort ascending', () => {
      const result = sortItems(mockData, 'price', 'asc');
      expect(result[0].price).toBe(100);
      expect(result[2].price).toBe(200);
    });

    it('should sort descending', () => {
      const result = sortItems(mockData, 'price', 'desc');
      expect(result[0].price).toBe(200);
      expect(result[2].price).toBe(100);
    });

    it('should handle string sorting', () => {
      const result = sortItems(mockData, 'name', 'asc');
      expect(result[0].name).toBe('Item 1');
    });
  });

  describe('bulkDelete', () => {
    it('should delete items by ids', () => {
      const result = bulkDelete(mockData, [1, 3]);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    it('should handle empty ids array', () => {
      const result = bulkDelete(mockData, []);
      expect(result).toEqual(mockData);
    });
  });

  describe('bulkUpdate', () => {
    it('should update multiple items', () => {
      const result = bulkUpdate(mockData, [1, 2], { category: 'C' });
      expect(result[0].category).toBe('C');
      expect(result[1].category).toBe('C');
      expect(result[2].category).toBe('A');
    });

    it('should preserve unmodified items', () => {
      const result = bulkUpdate(mockData, [1], { price: 500 });
      expect(result[1].price).toBe(200);
    });
  });

  describe('paginate', () => {
    it('should paginate correctly', () => {
      const result = paginate(mockData, 0, 2);
      expect(result.data).toHaveLength(2);
      expect(result.page).toBe(0);
      expect(result.totalPages).toBe(2);
    });

    it('should handle second page', () => {
      const result = paginate(mockData, 1, 2);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe(3);
    });

    it('should return total count', () => {
      const result = paginate(mockData, 0, 10);
      expect(result.total).toBe(3);
    });
  });
});

describe('Logger', () => {
  it('should log messages with different levels', () => {
    const { logger } = require('../utils/logger');
    expect(() => {
      logger.debug('Debug message');
      logger.info('Info message');
      logger.warn('Warning message');
      logger.error('Error message');
    }).not.toThrow();
  });

  it('should store logs in memory', () => {
    const { logger } = require('../utils/logger');
    const initialCount = logger.getLogs().length;
    logger.info('Test log');
    expect(logger.getLogs().length).toBeGreaterThan(initialCount);
  });
});

describe('Analytics', () => {
  it('should track events', () => {
    const { analytics } = require('../utils/analytics');
    const eventCount = analytics.events.length;
    analytics.trackEvent('test_event', { data: 'test' });
    expect(analytics.events.length).toBeGreaterThan(eventCount);
  });

  it('should set user ID', () => {
    const { analytics } = require('../utils/analytics');
    analytics.setUserId('user123');
    expect(analytics.userId).toBe('user123');
  });

  it('should generate session statistics', () => {
    const { analytics } = require('../utils/analytics');
    const stats = analytics.getStats();
    expect(stats).toHaveProperty('sessionId');
    expect(stats).toHaveProperty('totalEvents');
  });
});
