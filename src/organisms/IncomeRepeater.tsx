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
  const { state, dispatch } = useFormContext();
  const { styles, colors } = useAppStyles(); // Destructure styles and colors

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

  // ========== RESTORED RENDER FUNCTIONS ==========

  const renderCategoryChips = (id: string, rec: IncomeMember, title: string) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>Ik heb</Text>
      <ScrollView horizontal contentContainerStyle={styles.chipContainer} showsHorizontalScrollIndicator={false}>
        {CATEGORY_OPTIONS.map((c) => (
          <ChipButton
            key={c}
            label={c}
            selected={!!rec.categories?.[c]}
            onPress={() => toggleCategory(id, c)}
            accessibilityLabel={`Categorie ${c} voor ${title}`}
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderWerk = (id: string, rec: IncomeMember, title: string) => {
    if (!rec.categories?.werk) return null;
    
    return (
      <View style={styles.dashboardCard}>
        <Text style={styles.summaryLabelBold}>Inkomen uit werk</Text>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Netto salaris</Text>
          <TextInput
            style={styles.numericInput}
            value={typeof rec.nettoSalaris === 'number' ? String(rec.nettoSalaris) : ''}
            keyboardType="number-pad"
            onChangeText={(t) => setWerkField(id, 'nettoSalaris', t)}
            placeholder="0.00"
            accessibilityLabel={`Netto salaris voor ${title}`}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Frequentie</Text>
          <ScrollView horizontal contentContainerStyle={styles.chipContainer} showsHorizontalScrollIndicator={false}>
            {FREQUENCIES.map((f) => (
              <ChipButton
                key={f}
                label={f}
                selected={rec.frequentie === f}
                onPress={() => setWerkField(id, 'frequentie', f)}
                accessibilityLabel={`Frequentie ${f} voor ${title}`}
              />
            ))}
          </ScrollView>
        </View>

        {/* P4: COLLAPSIBLE PER-ADULT TOESLAGEN */}
        <View style={styles.fieldContainer}>
          <TouchableOpacity 
            onPress={() => setToelagenExpanded({ 
              ...toelagenExpanded, 
              [id]: !toelagenExpanded[id] 
            })}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Text style={styles.label}>
              Toeslagen
            </Text>
            <Text style={styles.summaryLabel}>
              {toelagenExpanded[id] ? '▼' : '▶'}
            </Text>
          </TouchableOpacity>
          
          {toelagenExpanded[id] && (
            <View style={{ gap: 12, marginTop: 12 }}>
              <TextInput
                style={styles.numericInput}
                value={typeof rec.toeslagen?.zorgtoeslag === 'number' ? String(rec.toeslagen?.zorgtoeslag) : ''}
                keyboardType="number-pad"
                onChangeText={(t) => setWerkField(id, 'toeslagen.zorgtoeslag', t)}
                placeholder="Zorgtoeslag (€/mnd)"
                accessibilityLabel={`Zorgtoeslag voor ${title}`}
              />
              <TextInput
                style={styles.numericInput}
                value={typeof rec.toeslagen?.reiskosten === 'number' ? String(rec.toeslagen?.reiskosten) : ''}
                keyboardType="number-pad"
                onChangeText={(t) => setWerkField(id, 'toeslagen.reiskosten', t)}
                placeholder="Reiskostenvergoeding (€/mnd)"
                accessibilityLabel={`Reiskostenvergoeding voor ${title}`}
              />
              <TextInput
                style={styles.numericInput}
                value={typeof rec.toeslagen?.overige === 'number' ? String(rec.toeslagen?.overige) : ''}
                keyboardType="number-pad"
                onChangeText={(t) => setWerkField(id, 'toeslagen.overige', t)}
                placeholder="Overige inkomsten (€/mnd)"
                accessibilityLabel={`Overige inkomsten voor ${title}`}
              />
            </View>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Vakantiegeld (per jaar)</Text>
          <TextInput
            style={styles.numericInput}
            value={typeof rec.vakantiegeldPerJaar === 'number' ? String(rec.vakantiegeldPerJaar) : ''}
            keyboardType="number-pad"
            onChangeText={(t) => setVakantiegeldPerJaar(id, t)}
            placeholder="0.00"
            accessibilityLabel={`Vakantiegeld per jaar voor ${title}`}
          />
        </View>
      </View>
    );
  };

  const renderUitkeringen = (
    id: string,
    rec: IncomeMember,
    m: Member,
    title: string
  ) => {
    if (!rec.categories?.uitkering) return null;

    const keys: UitkeringKey[] = (() => {
      const base = [...UITKERING_KEYS_BASE];
      if (typeof m.leeftijd === 'number' && m.leeftijd > 67) {
        base.push(...RETIREMENT_KEYS);
      }
      return base;
    })();

    const entryFor = (k: UitkeringKey) =>
      (rec.uitkeringen?.[k] ?? ({ enabled: false } as UitkeringEntry));

    return (
      <View style={styles.dashboardCard}>
        <Text style={styles.summaryLabelBold}>Uitkeringen</Text>

        <View style={styles.fieldContainer}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.chipContainer}
            showsHorizontalScrollIndicator={false}
          >
            {keys.map((k) => (
              <ChipButton
                key={k}
                label={k}
                selected={!!entryFor(k).enabled}
                onPress={() => setUitkeringToggle(id, k)}
                accessibilityLabel={`Uitkering ${k} voor ${title}`}
              />
            ))}
          </ScrollView>
        </View>

        {keys.map((k) => {
          const ent = entryFor(k);
          if (!ent.enabled) return null;

          return (
            <View key={`uk-${k}`} style={styles.fieldContainer}>
              {k === 'anders' && (
                <TextInput
                  style={styles.input}
                  value={ent.omschrijving ?? ''}
                  onChangeText={(t) => setUitkeringField(id, 'anders', { omschrijving: t })}
                  placeholder="Soort uitkering (omschrijving)"
                  accessibilityLabel={`Soort uitkering (anders) voor ${title}`}
                />
              )}

              <TextInput
                style={styles.numericInput}
                value={typeof ent.amount === 'number' ? String(ent.amount) : ''}
                keyboardType="number-pad"
                onChangeText={(t) => {
                  const clean = onlyDigitsDotsComma(t);
                  setUitkeringField(id, k, { amount: clean.length ? Number(clean) : undefined });
                }}
                placeholder="Netto uitkering (€/periode)"
                accessibilityLabel={`Netto uitkering voor ${k} (${title})`}
              />

              <ScrollView
                horizontal
                contentContainerStyle={styles.chipContainer}
                showsHorizontalScrollIndicator={false}
              >
                {FREQUENCIES.map((f) => (
                  <ChipButton
                    key={`ukf-${k}-${f}`}
                    label={f}
                    selected={ent.frequentie === f}
                    onPress={() => setUitkeringField(id, k, { frequentie: f })}
                    accessibilityLabel={`Frequentie ${f} voor ${k} (${title})`}
                  />
                ))}
              </ScrollView>
            </View>
          );
        })}
      </View>
    );
  };

  const renderAnders = (id: string, rec: IncomeMember, title: string) => {
    if (!rec.categories?.anders) return null;
    const list = Array.isArray(rec.anders) ? rec.anders : [];

    return (
      <View style={styles.dashboardCard}>
        <Text style={styles.summaryLabelBold}>Anders</Text>

        {list.map((row) => (
          <View key={row.id} style={styles.fieldContainer}>
            <TextInput
              style={styles.input}
              value={row.label ?? ''}
              onChangeText={(t) => setAndersField(id, row.id, { label: t })}
              placeholder="Waarvoor?"
              accessibilityLabel={`Ander inkomen (omschrijving) voor ${title}`}
            />
            <TextInput
              style={styles.numericInput}
              value={typeof row.amount === 'number' ? String(row.amount) : ''}
              keyboardType="number-pad"
              onChangeText={(t) => {
                const clean = onlyDigitsDotsComma(t);
                setAndersField(id, row.id, { amount: clean.length ? Number(clean) : undefined });
              }}
              placeholder="Bedrag (€/periode)"
              accessibilityLabel={`Ander inkomen (bedrag) voor ${title}`}
            />
            <ScrollView horizontal contentContainerStyle={styles.chipContainer} showsHorizontalScrollIndicator={false}>
              {FREQUENCIES.map((f) => (
                <ChipButton
                  key={`af-${row.id}-${f}`}
                  label={f}
                  selected={row.frequentie === f}
                  onPress={() => setAndersField(id, row.id, { frequentie: f })}
                  accessibilityLabel={`Frequentie ${f} (anders) voor ${title}`}
                />
              ))}
            </ScrollView>

            <TouchableOpacity onPress={() => removeAnders(id, row.id)} accessibilityRole="button" accessibilityLabel={`Verwijder ander inkomen voor ${title}`}>
              <Text style={styles.secondaryButtonText}>Verwijder</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.fieldContainer}>
          <TouchableOpacity style={styles.button} onPress={() => addAnders(id)} accessibilityRole="button" accessibilityLabel={`Voeg ander inkomen toe voor ${title}`}>
            <Text style={styles.buttonText}>+ Toevoegen</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderHouseholdBenefits = () => (
    <View style={styles.dashboardCard}>
      <Text style={styles.summaryLabelBold}>Toeslagen (huishouden)</Text>
      {woningIsHuur && (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Huurtoeslag (€/mnd)</Text>
          <TextInput
            style={styles.numericInput}
            value={typeof benefits.huurtoeslag === 'number' ? String(benefits.huurtoeslag) : ''}
            keyboardType="number-pad"
            onChangeText={(t) =>
              setHouseholdBenefits({
                huurtoeslag: onlyDigitsDotsComma(t).length ? Number(onlyDigitsDotsComma(t)) : undefined,
              })
            }
            placeholder="0.00"
            accessibilityLabel="Huurtoeslag (huishouden)"
          />
        </View>
      )}

      {hasChildren && (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>KindgebondenBudget (€/mnd)</Text>
          <TextInput
            style={styles.numericInput}
            value={typeof benefits.kindgebondenBudget === 'number' ? String(benefits.kindgebondenBudget) : ''}
            keyboardType="number-pad"
            onChangeText={(t) =>
              setHouseholdBenefits({
                kindgebondenBudget: onlyDigitsDotsComma(t).length ? Number(onlyDigitsDotsComma(t)) : undefined,
              })
            }
            placeholder="0.00"
            accessibilityLabel="KindgebondenBudget (huishouden)"
          />
        </View>
      )}

      {anyChildUnder13 && (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Kinderopvangtoeslag (€/mnd)</Text>
          <TextInput
            style={styles.numericInput}
            value={typeof benefits.kinderopvangtoeslag === 'number' ? String(benefits.kinderopvangtoeslag) : ''}
            keyboardType="number-pad"
            onChangeText={(t) =>
              setHouseholdBenefits({
                kinderopvangtoeslag: onlyDigitsDotsComma(t).length ? Number(onlyDigitsDotsComma(t)) : undefined,
              })
            }
            placeholder="0.00"
            accessibilityLabel="Kinderopvangtoeslag (huishouden)"
          />
        </View>
      )}

      {hasChildren && (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Kinderbijslag (€/kwartaal)</Text>
          <TextInput
            style={styles.numericInput}
            value={typeof benefits.kinderbijslag === 'number' ? String(benefits.kinderbijslag) : ''}
            keyboardType="number-pad"
            onChangeText={(t) =>
              setHouseholdBenefits({
                kinderbijslag: onlyDigitsDotsComma(t).length ? Number(onlyDigitsDotsComma(t)) : undefined,
              })
            }
            placeholder="0.00"
            accessibilityLabel="Kinderbijslag (huishouden, per 3 maanden)"
          />
        </View>
      )}
    </View>
  );

  const renderVermogen = () => (
    <View style={styles.dashboardCard}>
      <Text style={styles.summaryLabelBold}>Vermogen (huishouden)</Text>
      
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Heeft u vermogen?</Text>
        <ScrollView horizontal contentContainerStyle={styles.chipContainer} showsHorizontalScrollIndicator={false}>
          <ChipButton
            label="Nee"
            selected={!vermogen.hasVermogen}
            onPress={() => setVermogen({ hasVermogen: false, waarde: undefined })}
            accessibilityLabel="Vermogen: Nee"
          />
          <ChipButton
            label="Ja"
            selected={vermogen.hasVermogen}
            onPress={() => setVermogen({ hasVermogen: true })}
            accessibilityLabel="Vermogen: Ja"
          />
        </ScrollView>
      </View>

      {vermogen.hasVermogen && (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Totale waarde vermogen (€)</Text>
          <TextInput
            style={styles.numericInput}
            value={typeof vermogen.waarde === 'number' ? String(vermogen.waarde) : ''}
            keyboardType="number-pad"
            onChangeText={(t) => {
              const clean = onlyDigitsDotsComma(t);
              setVermogen({ waarde: clean.length ? Number(clean) : undefined });
            }}
            placeholder="0.00"
            accessibilityLabel="Totale waarde vermogen"
          />
        </View>
      )}
    </View>
  );

  // ========== MAIN RENDER ==========

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

      {/* P4: SWIPE PATTERN FOR ADULTS (if > 1 adult) */}
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
                style={[
                  styles.dashboardCard,
                  { 
                    width: CARD_WIDTH,
                    marginRight: 20,
                  }
                ]}
              >
                <Text style={styles.summaryLabelBold}>{title}</Text>

                {renderCategoryChips(m.id, rec, title)}
                {renderWerk(m.id, rec, title)}
                {renderUitkeringen(m.id, rec, m, title)}
                {renderAnders(m.id, rec, title)}

                {/* P4: Navigation hint (not on last card) */}
                {idx < adults.length - 1 && (
                  <Text style={styles.navigationHint}>volgende inkomen →</Text>
                )}
              </View>
            );
          })}
        </ScrollView>
      ) : (
        // Single adult - no swipe
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