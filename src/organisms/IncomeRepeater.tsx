
// src/organisms/IncomeRepeater.new.tsx
import * as React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getAppStyles } from '../styles/AppStyles';
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

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH * 0.85;

const CATEGORY_OPTIONS: (keyof IncomeCategories)[] = ['geen', 'werk', 'uitkering', 'DUO', 'anders'];
const FREQUENCIES: IncomeFrequency[] = ['week', '4wk', 'month'];

const UITKERING_KEYS_BASE: UitkeringKey[] = [
  'Bijstand', 'WW', 'ZW', 'WAO', 'WGA', 'WIA', 'IVA', 'WAJONG', 'IOW', 'anders'
];
const RETIREMENT_KEYS: UitkeringKey[] = ['Pensioen', 'AOW'];

const isAdult = (m: Member) => m.memberType === 'adult';
const getAge = (member: Member): number => member.leeftijd || 0;

const getUitkeringChipsForAge = (age: number): UitkeringKey[] => {
  if (age > 66) return RETIREMENT_KEYS;
  if (age >= 60) return ['IOW', ...UITKERING_KEYS_BASE.filter(k => !RETIREMENT_KEYS.includes(k))];
  return UITKERING_KEYS_BASE.filter(k => !RETIREMENT_KEYS.includes(k) && k !== 'IOW');
};

const isBijstandAanvullend = (rec: IncomeMember): boolean => {
  if (!rec.categories.uitkering) return false;
  const uitkeringen = rec.uitkeringen || {};
  const bijstandEnabled = uitkeringen['Bijstand']?.enabled;
  if (!bijstandEnabled) return false;
  
  return Object.keys(uitkeringen).some(key => key !== 'Bijstand' && uitkeringen[key]?.enabled);
};

const shouldShowVakantiegeld = (rec: IncomeMember): boolean => {
  if (rec.categories.geen) return false;
  if (rec.categories.DUO) return false;

  if (rec.categories.uitkering) {
    if (isBijstandAanvullend(rec)) return false;
  }
  
  return rec.categories.werk || rec.categories.uitkering || rec.categories.anders;
};


const IncomeRepeater: React.FC = () => {
  const { state, dispatch } = useFormContext();
  const { theme } = useTheme();
  const styles = getAppStyles(theme);

  const c4 = state.C4;
  const c7 = state.C7;
  const c1 = state.C1;

  const leden: Member[] = React.useMemo(() => (Array.isArray(c4?.leden) ? c4.leden : []), [c4]);
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
          categories: { geen: false, werk: false, uitkering: false, anders: false, DUO: false },
          uitkeringen: {},
          anders: [],
          duo: {},
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
    const next = { ...current, [id]: { ...(current[id] ?? { id, categories: { geen: false, werk: false, uitkering: false, anders: false, DUO: false } }), ...patch } };
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
    const rec = inkomsten[id] ?? { id, categories: { geen: false, werk: false, uitkering: false, anders: false, DUO: false } };
    let categories = { ...(rec.categories || {}), [cat]: !rec.categories?.[cat] };
    
    if (cat === 'geen' && categories.geen) {
      categories = { geen: true, werk: false, uitkering: false, anders: false, DUO: false };
    } else if (cat !== 'geen' && categories[cat]) {
      categories.geen = false;
    }
    
    if (cat === 'DUO' && categories.DUO) {
        categories.uitkering = false;
        const newUitkeringen = { ...rec.uitkeringen };
        if (newUitkeringen['Bijstand']) {
          newUitkeringen['Bijstand'] = { ...newUitkeringen['Bijstand'], enabled: false };
        }
        setMemberIncome(id, { categories, uitkeringen: newUitkeringen });
    } else if (cat === 'uitkering' && categories.uitkering && rec.categories.DUO){
        categories.DUO = false;
        setMemberIncome(id, { categories });
    } else {
      setMemberIncome(id, { categories });
    }
  };
  
  const renderPerAdultIncome = () => {
    return adults.map((m, idx) => {
        const rec = inkomsten[m.id] ?? { 
          id: m.id, 
          categories: { geen: false, werk: false, uitkering: false, anders: false, DUO: false } 
        };
        const title = m.naam?.trim() ? `Inkomen voor ${m.naam}` : `Volwassene ${idx + 1}`;
        const age = getAge(m);

        return (
            <View key={m.id} style={[styles.dashboardCard, { width: CARD_WIDTH, marginRight: 20 }]}>
              <Text style={styles.summaryLabelBold}>{title}</Text>
              {renderCategoryChips(m.id, rec, title, age)}
              {rec.categories.werk && renderWerkSection(m.id, rec, title)}
              {rec.categories.uitkering && renderUitkeringSection(m.id, rec, m, title)}
              {rec.categories.DUO && renderDuoSection(m.id, rec, title)}
              {rec.categories.anders && renderAndersSection(m.id, rec, title)}

              {!rec.categories.geen && (
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Zorgtoeslag (€/mnd)</Text>
                  <TextInput
                    style={styles.numericInput}
                    value={typeof rec.toeslagen?.zorgtoeslag === 'number' ? String(rec.toeslagen.zorgtoeslag) : ''}
                    keyboardType="number-pad"
                    onChangeText={t => {
                        const currentToeslagen = rec.toeslagen || {};
                        setMemberIncome(m.id, { toeslagen: { ...currentToeslagen, zorgtoeslag: onlyDigitsDotsComma(t).length ? Number(onlyDigitsDotsComma(t)) : undefined } });
                    }}
                    placeholder="0.00"
                    accessibilityLabel={`Zorgtoeslag voor ${title}`}
                  />
                </View>
              )}
              
              {shouldShowVakantiegeld(rec) && (
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Vakantiegeld (per jaar)</Text>
                  <TextInput
                    style={styles.numericInput}
                    value={typeof rec.vakantiegeldPerJaar === 'number' ? String(rec.vakantiegeldPerJaar) : ''}
                    keyboardType="number-pad"
                    onChangeText={t => setMemberIncome(m.id, { vakantiegeldPerJaar: onlyDigitsDotsComma(t).length ? Number(onlyDigitsDotsComma(t)) : undefined })}
                    placeholder="0.00"
                    accessibilityLabel={`Vakantiegeld per jaar voor ${title}`}
                  />
                </View>
              )}

              {idx < adults.length - 1 && (
                  <Text style={styles.navigationHint}>→ volgende volwassene</Text>
              )}
            </View>
        );
    });
  };
  
  const renderCategoryChips = (id: string, rec: IncomeMember, title: string, age: number) => {
    const availableCategories = CATEGORY_OPTIONS.filter(c => c !== 'DUO' || age < 37);

    return (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Ik heb</Text>
          <ScrollView horizontal contentContainerStyle={styles.chipContainer} showsHorizontalScrollIndicator={false}>
            {availableCategories.map((c) => (
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
  };
  
  const renderWerkSection = (id: string, rec: IncomeMember, title: string) => (
    <View>
        <Text style={styles.summaryLabelBold}>Inkomen uit werk</Text>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Netto salaris</Text>
          <TextInput
            style={styles.numericInput}
            value={typeof rec.nettoSalaris === 'number' ? String(rec.nettoSalaris) : ''}
            keyboardType="number-pad"
            onChangeText={(t) => setMemberIncome(id, { nettoSalaris: onlyDigitsDotsComma(t).length ? Number(onlyDigitsDotsComma(t)) : undefined })}
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
                onPress={() => setMemberIncome(id, { frequentie: f })}
                accessibilityLabel={`Frequentie ${f} voor ${title}`}
              />
            ))}
          </ScrollView>
        </View>
    </View>
  );

  const renderUitkeringSection = (id: string, rec: IncomeMember, m: Member, title: string) => {
    const age = getAge(m);
    const availableUitkeringen = getUitkeringChipsForAge(age);
    const aanvullend = isBijstandAanvullend(rec);

    const setUitkeringToggle = (key: UitkeringKey) => {
        if ((key === 'Bijstand' && rec.categories.DUO)) {
            Alert.alert('Niet toegestaan', 'DUO en Bijstand kunnen niet samen worden geselecteerd.');
            return;
        }
        if((key === 'WAJONG' && rec.uitkeringen?.['Bijstand']?.enabled) || (key === 'Bijstand' && rec.uitkeringen?.['WAJONG']?.enabled)){
            Alert.alert('Niet toegestaan', 'WAJONG en Bijstand kunnen niet samen worden geselecteerd.');
            return;
        }

        const map = { ...(rec.uitkeringen ?? {}) };
        const entry = map[key] ?? { enabled: false } as UitkeringEntry;
        entry.enabled = !entry.enabled;
        map[key] = entry;
        setMemberIncome(id, { uitkeringen: map });
    };

    const setUitkeringField = (key: UitkeringKey, patch: Partial<UitkeringEntry>) => {
        const map = { ...(rec.uitkeringen ?? {}) };
        const entry = map[key] ?? { enabled: true } as UitkeringEntry;
        map[key] = { ...entry, ...patch };
        setMemberIncome(id, { uitkeringen: map });
    };

    const renderUitkeringInput = (key: UitkeringKey, isAanvullendBijstand: boolean = false) => {
        const entry = rec.uitkeringen?.[key];
        if (!entry?.enabled) return null;

        return (
            <View key={key} style={styles.fieldContainer}>
                <Text style={styles.label}>{isAanvullendBijstand ? "Mijn aanvullende bijstand is (€/mnd)" : `${key} (€/mnd)`}</Text>
                <TextInput
                  style={styles.numericInput}
                  value={typeof entry.amount === 'number' ? String(entry.amount) : ''}
                  keyboardType="number-pad"
                  onChangeText={t => setUitkeringField(key, { amount: onlyDigitsDotsComma(t).length ? Number(onlyDigitsDotsComma(t)) : undefined })}
                  placeholder="0.00"
                />
                {key === 'ZW' && (
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Frequentie</Text>
                        <ScrollView horizontal contentContainerStyle={styles.chipContainer} showsHorizontalScrollIndicator={false}>
                            {FREQUENCIES.map(f => (
                                <ChipButton
                                    key={f}
                                    label={f}
                                    selected={entry.frequentie === f}
                                    onPress={() => setUitkeringField(key, { frequentie: f })}
                                />
                            ))}
                        </ScrollView>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View>
            <Text style={styles.summaryLabelBold}>Uitkeringen</Text>
            <View style={styles.fieldContainer}>
              <ScrollView horizontal contentContainerStyle={styles.chipContainer} showsHorizontalScrollIndicator={false}>
                {availableUitkeringen.map((k) => (
                  <ChipButton
                    key={k}
                    label={k}
                    selected={!!rec.uitkeringen?.[k]?.enabled}
                    onPress={() => setUitkeringToggle(k)}
                  />
                ))}
              </ScrollView>
            </View>
            {availableUitkeringen.filter(k => k !== 'Bijstand').map(k => renderUitkeringInput(k))}
            {aanvullend ? null : renderUitkeringInput('Bijstand')}
            {aanvullend && renderUitkeringInput('Bijstand', true)}
        </View>
    );
  };
  
  const renderDuoSection = (id: string, rec: IncomeMember, title: string) => {
      const setDuoField = (patch: Partial<IncomeMember['duo']>) => {
          const currentDuo = rec.duo || {};
          setMemberIncome(id, { duo: { ...currentDuo, ...patch } });
      };

      return (
        <View>
            <Text style={styles.summaryLabelBold}>DUO</Text>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Basisbeurs (€/mnd)</Text>
              <TextInput
                style={styles.numericInput}
                value={typeof rec.duo?.basisbeurs === 'number' ? String(rec.duo.basisbeurs) : ''}
                keyboardType="number-pad"
                onChangeText={t => setDuoField({ basisbeurs: onlyDigitsDotsComma(t).length ? Number(onlyDigitsDotsComma(t)) : undefined })}
                placeholder="0.00"
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Lening (€/mnd)</Text>
              <TextInput
                style={styles.numericInput}
                value={typeof rec.duo?.lening === 'number' ? String(rec.duo.lening) : ''}
                keyboardType="number-pad"
                onChangeText={t => setDuoField({ lening: onlyDigitsDotsComma(t).length ? Number(onlyDigitsDotsComma(t)) : undefined })}
                placeholder="0.00"
              />
            </View>
        </View>
      );
  };
  
  const renderAndersSection = (id: string, rec: IncomeMember, title: string) => {
    const addAnders = () => {
        const list = rec.anders ? [...rec.anders] : [];
        list.push({ id: `a-${Date.now()}` });
        setMemberIncome(id, { anders: list });
    };

    const removeAnders = (itemId: string) => {
        const list = rec.anders ? rec.anders.filter(item => item.id !== itemId) : [];
        setMemberIncome(id, { anders: list });
    };

    const setAndersField = (itemId: string, patch: Partial<AndersEntry>) => {
        const list = rec.anders ? rec.anders.map(item => item.id === itemId ? { ...item, ...patch } : item) : [];
        setMemberIncome(id, { anders: list });
    };

    return (
        <View>
            <Text style={styles.summaryLabelBold}>Ik verdien:</Text>
            {rec.anders?.map(item => (
                <View key={item.id} style={styles.fieldContainer}>
                    <TextInput
                      style={styles.input}
                      value={item.label || ''}
                      onChangeText={t => setAndersField(item.id, { label: t })}
                      placeholder="Met"
                    />
                    <TextInput
                      style={styles.numericInput}
                      value={typeof item.amount === 'number' ? String(item.amount) : ''}
                      keyboardType="number-pad"
                      onChangeText={t => setAndersField(item.id, { amount: onlyDigitsDotsComma(t).length ? Number(onlyDigitsDotsComma(t)) : undefined })}
                      placeholder="Verdienste (€/mnd)"
                    />
                    <TouchableOpacity onPress={() => removeAnders(item.id)}>
                        <Text style={styles.secondaryButtonText}>Verwijder</Text>
                    </TouchableOpacity>
                </View>
            ))}
            <TouchableOpacity style={styles.button} onPress={addAnders}>
                <Text style={styles.buttonText}>+ Toevoegen</Text>
            </TouchableOpacity>
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


  if (!adults.length) {
    return (
      <View style={styles.pageContainer}>
        <Text style={styles.summaryDetail}>Geen volwassenen gevonden. Stel eerst uw huishouden in op C4/C1.</Text>
      </View>
    );
  }

  return (
    <View style={styles.pageContainer}>
      {adults.length > 1 ? (
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
          snapToInterval={CARD_WIDTH + 20}
          decelerationRate="fast"
        >
          {renderPerAdultIncome()}
        </ScrollView>
      ) : (
        renderPerAdultIncome()
      )}
      {renderHouseholdBenefits()}
      {renderVermogen()}
    </View>
  );
};

export default IncomeRepeater;
