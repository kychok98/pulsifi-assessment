import { safeDate } from './date';

describe('safeDate', () => {
  it('should return YYYY-MM-DD from ISO string', () => {
    expect(safeDate('2024-08-22T10:00:00')).toBe('2024-08-22');
  });

  it('should return full string if already YYYY-MM-DD', () => {
    expect(safeDate('2024-08-22')).toBe('2024-08-22');
  });

  it('should return empty string if input is empty', () => {
    expect(safeDate('')).toBe('');
  });
});
