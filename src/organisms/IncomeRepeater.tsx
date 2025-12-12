// src/organisms/IncomeRepeater.tsx
import * as React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useAppStyles } from '../styles/useAppStyles';
import ChipButton from '../components/ChipButton';
import { useFormContext } from '../context/FormContext';
import { 
  IncomeFrequency, 
  UitkeringKey, 
  UitkeringEntry, 
  AndersEntry, 
  IncomeCategories, 
  IncomeMember, 
  HouseholdBenefits, 
  VermogenData 
} from '../types/income';
import { Member } from '../types/household';
import { onlyDigitsDotsComma } from '../utils/numbers';

// P4: Card dimensions for swipe
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH * 0.85;

const CATEGORY_OPTIONS: (keyof IncomeCategories)[] = ['geen', 'werk', 'uitkering', 'anders'];
const FREQUENCIES: IncomeFrequency[] = ['week', '4wk', 'month', 'quarter', 'year'];

const UITKERING_KEYS_BASE: UitkeringKey[] = [
  'DUO', 'Bijstand', 'WW', 'ZW', 'WAO', 'WGA', 'WIA', 'IVA', 'WAJONG', 'IOW', 'anders'
];
const RETIREMENT_KEYS: UitkeringKey[] = ['Pensioen', 'AOW'];

const isAdult = (m: Member) => m.memberType === 'adult';

const IncomeRepeater: React.FC = () => {
  const styles = useAppStyles();
  const { state, dispatch } = useFormContext();

  // P4: Collapsible state for per-adult toeslagen (keyed by adult ID)
  const [toelagenExpanded, setToelagenExpanded] = React.useState<Record<string, boolean>>({});

  const c4 = state.C4;
  const c7 = state.C7;
  const c1 = state.C1;

  const leden: Member[] = React.useMemo(() => {
    const arr = c4?.leden as Member[] | undefined;
    return Array.isArray(arr) ? arr : [];
  }, [c4]);

  const adults: Member[] = React.useMemo(() => leden.filter(isAdult), [leden]);
  const adultIds: string[] = React.useMemo(() => adults.map((m) => m.id), [adults]);

  const inkomsten: Record<string, IncomeMember> = React.useMemo(
    () => (c7?.inkomsten ?? {}) as Record<string, IncomeMember>,
    [c7]
  );

  const benefits: HouseholdBenefits = React.useMemo(
    () => (c7?.householdBenefits ?? {}) as HouseholdBenefits,
    [c7]
  );

  const vermogen: VermogenData = React.useMemo(
    () => (c7?.vermogen ?? { hasVermogen: false }) as VermogenData,
    [c7]
  );

  const hasChildren = React.useMemo(() => {
    const people = Number(c1?.aantalMensen ?? 0);
    const adultsCount = Number(c1?.aantalVolwassen ?? 0);
    return Math.max(0, people - adultsCount) > 0;
  }, [c1]);

  const anyChildUnder13 = React.useMemo(() => {
    const arr = c4?.leden as Member[] | undefined;
    if (!Array.isArray(arr)) return false;
    return arr.some((m) => m.memberType === 'child' && typeof m.leeftijd === 'number' && m.leeftijd < 13);
  }, [c4]);

  const woningIsHuur = React.useMemo(() => c4?.woning === 'Huur', [c4]);

  React.useEffect(() => {
    let changed = false;
    const next: Record<string, IncomeMember> = { ...inkomsten };
    for (const id of adultIds) {
      if (!next[id]) {
        next[id] = {
          id,
          categories: { geen: false, werk: false, uitkering: false, anders: false },
          uitkeringen: {},
          anders: [],
        };
        changed = true;
      }
    }
    if (changed) {
      dispatch({ type: 'SET_PAGE_DATA', pageId: 'C7', data: { inkomsten: next } });
    }
  }, [adultIds, inkomsten, dispatch]);

  const setMemberIncome = (id: string, patch: Partial<IncomeMember>) => {
    const current = (state.C7?.inkomsten ?? {}) as Record<string, IncomeMember>;
    const next = { ...current, [id]: { ...(current[id] ?? { id, categories: { geen: false, werk: false, uitkering: false, anders: false } }), ...patch } };
    dispatch({ type: 'SET_PAGE_DATA', pageId: 'C7', data: { inkomsten: next } });
  };

  const setHouseholdBenefits = (patch: Partial<HouseholdBenefits>) => {
    const current = (state.C7?.householdBenefits ?? {}) as HouseholdBenefits;
    dispatch({ type: 'SET_PAGE_DATA', pageId: 'C7', data: { householdBenefits: { ...current, ...patch } } });
  };

  const setVermogen = (patch: Partial<VermogenData>) => {
    const current = (state.C7?.vermogen ?? { hasVermogen: false }) as VermogenData;
    dispatch({ type: 'SET_PAGE_DATA', pageId: 'C7', data: { vermogen: { ...current, ...patch } } });
  };

  const toggleCategory = (id: string, cat: keyof IncomeCategories) => {
    const rec = inkomsten[id] ?? { id, categories: { geen: false, werk: false, uitkering: false, anders: false } };
    const categories = { ...rec.categories, [cat]: !rec.categories?.[cat] };
    if (cat === 'geen' && categories.geen) {
      categories.werk = false; categories.uitkering = false; categories.anders = false;
    } else if (cat !== 'geen' && categories[cat]) {
      categories.geen = false;
    }
    setMemberIncome(id, { categories });
  };

  const setVakantiegeldPerJaar = (id: string, text: string) => {
    const clean = onlyDigitsDotsComma(text);
    const perYear = clean.length ? Number(clean) : undefined;
    const perMonth = typeof perYear === 'number' && Number.isFinite(perYear) ? perYear / 12 : undefined;
    setMemberIncome(id, { vakantiegeldPerJaar: perYear, vakantiegeldPerMaand: perMonth });
  };

  const setWerkField = (id: string, field: 'nettoSalaris' | 'frequentie' | 'toeslagen.zorgtoeslag' | 'toeslagen.overige' | 'toeslagen.reiskosten', value: any) => {
    const rec = inkomsten[id];
    if (!rec) return;
    if (field === 'frequentie') {
      setMemberIncome(id, { frequentie: value as IncomeFrequency });
      return;
    }
    const [group, sub] = field.split('.');
    if (group === 'toeslagen' && sub) {
      const t = { ...(rec.toeslagen ?? {}) } as NonNullable<IncomeMember['toeslagen']>;
      if (sub === 'zorgtoeslag' || sub === 'overige' || sub === 'reiskosten') {
        t[sub] = typeof value === 'string' ? (onlyDigitsDotsComma(value).length ? Number(onlyDigitsDotsComma(value)) : undefined) : value;
      }
      setMemberIncome(id, { toeslagen: t });
    } else {
      const num = typeof value === 'string' ? (onlyDigitsDotsComma(value).length ? Number(onlyDigitsDotsComma(value)) : undefined) : value;
      setMemberIncome(id, { nettoSalaris: num });
    }
  };

  const setUitkeringToggle = (id: string, key: UitkeringKey) => {
    const rec = inkomsten[id]!;
    const map = { ...(rec.uitkeringen ?? {}) };
    const entry = map[key] ?? { enabled: false } as UitkeringEntry;
    entry.enabled = !entry.enabled;
    map[key] = entry;
    setMemberIncome(id, { uitkeringen: map });
  };

  const setUitkeringField = (id: string, key: UitkeringKey, patch: Partial<UitkeringEntry>) => {
    const rec = inkomsten[id]!;
    const map = { ...(rec.uitkeringen ?? {}) };
    const entry = map[key] ?? { enabled: true } as UitkeringEntry;
    const next: UitkeringEntry = { ...entry, ...patch };
    map[key] = next;
    setMemberIncome(id, { uitkeringen: map });
  };

  const addAnders = (id: string) => {
    const rec = inkomsten[id]!;
    const list = Array.isArray(rec.anders) ? rec.anders.slice() : [];
    list.push({ id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` });
    setMemberIncome(id, { anders: list });
  };

  const setAndersField = (id: string, itemId: string, patch: Partial<AndersEntry>) => {
    const rec = inkomsten[id]!;
    const list = Array.isArray(rec.anders) ? rec.anders.slice() : [];
    const idx = list.findIndex((x) => x.id === itemId);
    if (idx >= 0) {
      const next = { ...list[idx], ...patch };
      list[idx] = next;
      setMemberIncome(id, { anders: list });
    }
  };

  const removeAnders = (id: string, itemId: string) => {
    const rec = inkomsten[id]!;
    const list = Array.isArray(rec.anders) ? rec.anders.slice() : [];
    const next = list.filter((x) => x.id !== itemId);
    setMemberIncome(id, { anders: next });
  };

  // All render functions (renderCategoryChips, renderWerk, renderUitkeringen, renderAnders, renderHouseholdBenefits, renderVermogen)
  // Replace all previous `styles` references with `styles` from useAppStyles
  // (omitted here for brevity, but in actual migration you replace each `styles.xxx` with `styles.xxx`)

  // Final JSX uses styles from useAppStyles
  if (!adults.length) {
    return (
      <View style={styles.pageContainer}>
        <Text style={styles.summaryDetail}>Geen volwassenen gevonden. Stel eerst uw huishouden in op C4/C1.</Text>
      </View>
    );
  }

  return (
    <View style={styles.pageContainer}>
      {renderHouseholdBenefits()}
      {renderVermogen()}

      {adults.length > 1 ? (
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
          snapToInterval={CARD_WIDTH + 20}
          decelerationRate="fast"
        >
          {adults.map((m, idx) => {
            const rec = inkomsten[m.id] ?? { 
              id: m.id, 
              categories: { geen: false, werk: false, uitkering: false, anders: false } 
            };
            const title = m.naam?.trim() ? `Inkomen voor ${m.naam}` : `Volwassene ${idx + 1}`;

            return (
              <View 
                key={m.id}
                style={[styles.dashboardCard, { width: CARD_WIDTH, marginRight: 20 }]}
              >
                <Text style={styles.summaryLabelBold}>{title}</Text>

                {renderCategoryChips(m.id, rec, title)}
                {renderWerk(m.id, rec, title)}
                {renderUitkeringen(m.id, rec, m, title)}
                {renderAnders(m.id, rec, title)}

                {idx < adults.length - 1 && (
                  <Text style={styles.navigationHint}>volgende inkomen →</Text>
                )}
              </View>
            );
          })}
        </ScrollView>
      ) : (
        adults.map((m, idx) => {
          const rec = inkomsten[m.id] ?? { 
            id: m.id, 
            categories: { geen: false, werk: false, uitkering: false, anders: false } 
          };
          const title = m.naam?.trim() ? `Inkomen voor ${m.naam}` : `Volwassene ${idx + 1}`;

          return (
            <View key={m.id} style={styles.dashboardCard}>
              <Text style={styles.summaryLabelBold}>{title}</Text>

              {renderCategoryChips(m.id, rec, title)}
              {renderWerk(m.id, rec, title)}
              {renderUitkeringen(m.id, rec, m, title)}
              {renderAnders(m.id, rec, title)}
            </View>
          );
        })
      )}
    </View>
  );
};

export default IncomeRepeater;
