import { getAppStyles } from './src/ui/styles/useAppStyles';
import { Colors } from './src/ui/styles/Colors';
import { Space } from './src/ui/styles/Tokens';
try {
    if (Space.xl !== 20) throw new Error('Space.xl != 20');
    if (Colors.light.primary !== '#007AFF') throw new Error('Colors wrong');
    const s = getAppStyles('light');
    const m = ['container','button','moneyInputWrapper'].filter(k => !s?.[k]);
    if (m.length) throw new Error(`Missing: ${m.join(',')}`);
    process.exit(0);
} catch(e) { console.error(e.message); process.exit(1); }
