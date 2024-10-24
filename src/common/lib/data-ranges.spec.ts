import { dateRanges } from 'src/common/lib/date-ranges';

describe('dateRanges', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return correct start and end of the year', () => {
    // Arrange
    const year = 2024;

    // Act
    const result = dateRanges(year);

    // Assert
    expect(result.startOfYear).toEqual(new Date('2024-01-01'));
    expect(result.endOfYear).toEqual(new Date('2024-12-31'));
  });

  it('should return correct current week start and end dates', () => {
    // Arrange
    const currentDate = new Date('2024-10-10');
    jest.setSystemTime(currentDate);

    // Act
    const result = dateRanges(2024);

    // Assert
    expect(result.currentWeekStart).toEqual(new Date('2024-10-06')); // First day of the current week (Sunday)
    expect(result.currentWeekEnd).toEqual(new Date('2024-10-12')); // Last day of the current week (Saturday)
  });

  it('should return correct previous week start and end dates', () => {
    // Arrange
    const currentDate = new Date('2024-10-10');
    jest.setSystemTime(currentDate);

    // Act
    const result = dateRanges(2024);

    // Assert
    expect(result.previousWeekStart).toEqual(new Date('2024-09-29'));
    expect(result.previousWeekEnd).toEqual(new Date('2024-10-05'));
  });
});
