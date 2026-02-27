import { getAppStyles } from './useAppStyles';

jest.mock('react-native', () => ({
  StyleSheet: { create: (obj: any) => obj },
  Platform: { 
  select: <T>(objs: { ios?: T; default: T }): T => {
    if ('ios' in objs) {
      return objs.ios ?? objs.default;
    }
    return objs.default;
  }
},
}));

describe('Style System Integrity', () => {
  it('should generate styles for light mode without crashing', () => {
    const styles = getAppStyles('light');
    expect(styles).toBeDefined();
    expect(Object.keys(styles).length).toBeGreaterThan(0);
  });

  it('should generate styles for dark mode', () => {
    const styles = getAppStyles('dark');
    expect(styles).toBeDefined();
    expect(Object.keys(styles).length).toBeGreaterThan(0);
  });
});
