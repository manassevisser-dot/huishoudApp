import { getAppStyles } from '../useAppStyles';
import { Colors } from '../Colors';

// Mock React Native StyleSheet omdat we in Node draaien
jest.mock('react-native', () => ({
  StyleSheet: {
    create: (obj: any) => obj, // Geef gewoon het object terug
  },
  Platform: {
    select: (objs: any) => objs.ios || objs.default, // Simuleer iOS
  },
}));

describe('Style System Integrity', () => {
  it('should generate styles for light mode without crashing', () => {
    const styles = getAppStyles('light');
    
    // 1. Check of er stijlen uitkomen
    expect(styles).toBeDefined();
    
    // 2. Check of modules zijn samengevoegd (het object mag niet leeg zijn)
    expect(Object.keys(styles).length).toBeGreaterThan(0);
  });

  it('should generate styles for dark mode', () => {
    const styles = getAppStyles('dark');
    expect(styles).toBeDefined();
    expect(Object.keys(styles).length).toBeGreaterThan(0);
  });
});
