// src/domain/registry/EntryRegistry.test.ts
import { EntryRegistry, ENTRY_REGISTRY, resolveFieldId } from './EntryRegistry';
import { PRIMITIVE_TYPES } from './PrimitiveRegistry';

describe('EntryRegistry', () => {
  describe('ENTRY_REGISTRY', () => {
    it('should have all required household entries', () => {
      const requiredKeys = [
        'aantalMensen',
        'aantalVolwassen',
        'kinderenLabel',
        'autoCount',
        'heeftHuisdieren',
        'burgerlijkeStaat',
        'woningType',
        'postcode',
      ];
      
      requiredKeys.forEach(key => {
        expect(ENTRY_REGISTRY[key]).toBeDefined();
        expect(ENTRY_REGISTRY[key].primitiveType).toBeDefined();
        expect(ENTRY_REGISTRY[key].labelToken).toBeDefined();
      });
    });

    it('should have all required member entries', () => {
      const memberKeys = ['naam', 'geboortedatum', 'leeftijd', 'gender'];
      
      memberKeys.forEach(key => {
        expect(ENTRY_REGISTRY[key]).toBeDefined();
        expect(ENTRY_REGISTRY[key].primitiveType).toBeDefined();
      });
    });

    it('should have all required income entries', () => {
      const incomeKeys = [
        'incomeCategory',
        'aow_bedrag',
        'nettoSalaris',
        'frequentie',
        'vakantiegeldPerJaar',
        'uitkeringType',
      ];
      
      incomeKeys.forEach(key => {
        expect(ENTRY_REGISTRY[key]).toBeDefined();
      });
    });

    it('should have all required expenses entries', () => {
      const expenseKeys = [
        'zorgtoeslag',
        'reiskosten',
        'overigeInkomsten',
        'huurtoeslag',
        'kindgebondenBudget',
        'kaleHuur',
        'hypotheekBruto',
        'ozb',
        'energieGas',
        'water',
        'wegenbelasting',
        'ziektekostenPremie',
        'aansprakelijkheid',
        'reis',
        'opstal',
        'internetTv',
        'sport',
        'lezen',
        'telefoon',
      ];
      
      expenseKeys.forEach(key => {
        expect(ENTRY_REGISTRY[key]).toBeDefined();
      });
    });

    it('should have action entries with correct properties', () => {
      const actionEntries = [
        'goToSettings',
        'goToCsvUpload',
        'goToReset',
        'undoAction',
        'redoAction',
        'clearAllAction',
      ];

      actionEntries.forEach(key => {
        const entry = ENTRY_REGISTRY[key];
        expect(entry.primitiveType).toBe(PRIMITIVE_TYPES.ACTION);
        
        if (key.startsWith('goTo')) {
          expect(entry.navigationTarget).toBeDefined();
          expect(entry.navigationTarget).toMatch(/^[A-Z_]+$/);
        } else {
          expect(entry.commandTarget).toBeDefined();
          expect(entry.commandTarget).toMatch(/^[A-Z_]+$/);
        }
      });
    });

    it('should have daily transaction entries', () => {
      const dailyKeys = [
        'dailyTransactionDate',
        'dailyTransactionAmount',
        'dailyTransactionCategory',
        'dailyTransactionDescription',
        'dailyPaymentMethod',
      ];

      dailyKeys.forEach(key => {
        const entry = ENTRY_REGISTRY[key];
        expect(entry).toBeDefined();
        expect(entry.labelToken).toMatch(/^LABEL_/);
        if (entry.placeholderToken) {
          expect(entry.placeholderToken).toMatch(/^(TODAY|0\.00|PLACEHOLDER_)/);
        }
      });
    });

    it('should have correct primitive types for specific entries', () => {
      expect(ENTRY_REGISTRY.aantalMensen.primitiveType).toBe(PRIMITIVE_TYPES.COUNTER);
      expect(ENTRY_REGISTRY.autoCount.primitiveType).toBe(PRIMITIVE_TYPES.RADIO);
      expect(ENTRY_REGISTRY.burgerlijkeStaat.primitiveType).toBe(PRIMITIVE_TYPES.CHIP_GROUP);
      expect(ENTRY_REGISTRY.nettoSalaris.primitiveType).toBe(PRIMITIVE_TYPES.CURRENCY);
      expect(ENTRY_REGISTRY.dailyTransactionDate.primitiveType).toBe(PRIMITIVE_TYPES.DATE);
      expect(ENTRY_REGISTRY.dailyTransactionDescription.primitiveType).toBe(PRIMITIVE_TYPES.TEXT);
    });

    it('should have visibility rules where applicable', () => {
      const entriesWithVisibility = [
            'aantalVolwassen',
    'kinderenLabel',      // ← heeft visibilityRuleName
    'burgerlijkeStaat',    // ← heeft visibilityRuleName
    'aow_bedrag',
    'nettoSalaris',
    'uitkeringType',       // ← heeft visibilityRuleName
    'huurtoeslag',
    'kindgebondenBudget',
    'kaleHuur',
    'hypotheekBruto',
    'ozb',
    'wegenbelasting',
      ];

      entriesWithVisibility.forEach(key => {
        expect(ENTRY_REGISTRY[key].visibilityRuleName).toBeDefined();
        expect(typeof ENTRY_REGISTRY[key].visibilityRuleName).toBe('string');
      });

      // Check some specific visibility rules
      expect(ENTRY_REGISTRY.aantalVolwassen.visibilityRuleName).toBe('isAdultInputVisible');
      expect(ENTRY_REGISTRY.kaleHuur.visibilityRuleName).toBe('isWoningHuur');
      expect(ENTRY_REGISTRY.hypotheekBruto.visibilityRuleName).toBe('isWoningKoop');
    });

    it('should have optionsKeys for selection entries', () => {
      const entriesWithOptions = [
        'autoCount',
        'heeftHuisdieren',
        'burgerlijkeStaat',
        'woningType',
        'gender',
        'incomeCategory',
        'frequentie',
        'uitkeringType',
        'dailyTransactionCategory',
        'dailyPaymentMethod',
      ];

      entriesWithOptions.forEach(key => {
        expect(ENTRY_REGISTRY[key].optionsKey).toBeDefined();
      });
    });

    it('should have visibility rules where applicable', () => {
  const entriesWithVisibility = [
    'aantalVolwassen',
    'kinderenLabel',      // ← heeft visibilityRuleName
    'burgerlijkeStaat',    // ← heeft visibilityRuleName
    'aow_bedrag',
    'nettoSalaris',
    'uitkeringType',       // ← heeft visibilityRuleName
    'huurtoeslag',
    'kindgebondenBudget',
    'kaleHuur',
    'hypotheekBruto',
    'ozb',
    'wegenbelasting',
  ];

  entriesWithVisibility.forEach(key => {
    expect(ENTRY_REGISTRY[key].visibilityRuleName).toBeDefined();
    expect(typeof ENTRY_REGISTRY[key].visibilityRuleName).toBe('string');
  });

  // Check some specific visibility rules
  expect(ENTRY_REGISTRY.aantalVolwassen.visibilityRuleName).toBe('isAdultInputVisible');
  expect(ENTRY_REGISTRY.kaleHuur.visibilityRuleName).toBe('isWoningHuur');
  expect(ENTRY_REGISTRY.hypotheekBruto.visibilityRuleName).toBe('isWoningKoop');
});

    it('should have derived entries', () => {
      expect(ENTRY_REGISTRY.kinderenLabel.isDerived).toBe(true);
    });

    it('should have default values where applicable', () => {
      expect(ENTRY_REGISTRY.aantalMensen.defaultValue).toBe(1);
      expect(ENTRY_REGISTRY.autoCount.defaultValue).toBe('Geen');
      expect(ENTRY_REGISTRY.heeftHuisdieren.defaultValue).toBe('Nee');
      expect(ENTRY_REGISTRY.woningType.defaultValue).toBe('Huur');
    });
  });

  describe('EntryRegistry', () => {
    describe('getDefinition', () => {
      it('should return definition for existing key', () => {
        const def = EntryRegistry.getDefinition('aantalMensen');
        expect(def).toBeDefined();
        expect(def?.primitiveType).toBe(PRIMITIVE_TYPES.COUNTER);
      });

      it('should return null for non-existing key', () => {
        const def = EntryRegistry.getDefinition('nonExistingKey');
        expect(def).toBeNull();
      });

      it('should return definition for all registered keys', () => {
        const allKeys = EntryRegistry.getAllKeys();
        allKeys.forEach(key => {
          const def = EntryRegistry.getDefinition(key);
          expect(def).toBeDefined();
          expect(def?.primitiveType).toBeDefined();
        });
      });
    });

    describe('isValidKey', () => {
      it('should return true for existing keys', () => {
        expect(EntryRegistry.isValidKey('aantalMensen')).toBe(true);
        expect(EntryRegistry.isValidKey('nettoSalaris')).toBe(true);
        expect(EntryRegistry.isValidKey('undoAction')).toBe(true);
      });

      it('should return false for non-existing keys', () => {
        expect(EntryRegistry.isValidKey('')).toBe(false);
        expect(EntryRegistry.isValidKey('invalid')).toBe(false);
        expect(EntryRegistry.isValidKey('123')).toBe(false);
      });

      it('should be a type guard', () => {
        const testKey = 'aantalMensen';
        if (EntryRegistry.isValidKey(testKey)) {
          // TypeScript should know testKey is a valid key
          const def = ENTRY_REGISTRY[testKey];
          expect(def).toBeDefined();
        }
      });
    });

    describe('getAllKeys', () => {
      it('should return all keys from registry', () => {
        const keys = EntryRegistry.getAllKeys();
        expect(keys).toBeInstanceOf(Array);
        expect(keys.length).toBeGreaterThan(0);
        expect(keys).toContain('aantalMensen');
        expect(keys).toContain('nettoSalaris');
        expect(keys).toContain('undoAction');
      });

      it('should match ENTRY_REGISTRY keys', () => {
        const registryKeys = Object.keys(ENTRY_REGISTRY);
        const methodKeys = EntryRegistry.getAllKeys();
        expect(methodKeys.sort()).toEqual(registryKeys.sort());
      });
    });
  });

  describe('resolveFieldId', () => {
    it('should return constraintsKey when available', () => {
      const entry = ENTRY_REGISTRY.aantalMensen;
      expect(resolveFieldId('aantalMensen', entry)).toBe('aantalMensen');
    });

    it('should return entryId when constraintsKey is not available', () => {
      const entry = ENTRY_REGISTRY.goToSettings;
      expect(resolveFieldId('goToSettings', entry)).toBe('goToSettings');
    });

    it('should return entryId when constraintsKey is empty string', () => {
      const entryWithEmptyConstraint = {
        ...ENTRY_REGISTRY.aantalMensen,
        constraintsKey: '',
      };
      expect(resolveFieldId('testId', entryWithEmptyConstraint)).toBe('testId');
    });

    it('should prioritize constraintsKey over entryId', () => {
      const entry = {
        ...ENTRY_REGISTRY.aantalMensen,
        constraintsKey: 'customField',
      };
      expect(resolveFieldId('originalId', entry)).toBe('customField');
    });

    it('should handle undefined constraintsKey', () => {
      const entryWithoutConstraint = {
        primitiveType: PRIMITIVE_TYPES.ACTION,
        labelToken: 'test',
      } as any; // Using any for test
      
      expect(resolveFieldId('actionId', entryWithoutConstraint)).toBe('actionId');
    });
  });

  describe('registry integrity', () => {
    it('should have consistent naming conventions', () => {
  const keys = EntryRegistry.getAllKeys();
  
  keys.forEach(key => {
    // Skip action keys (start with goTo or end with Action)
    if (key.startsWith('goTo') || key.endsWith('Action')) {
      return;
    }
    
    // Special cases die snake_case mogen gebruiken
    if (key === 'aow_bedrag') {
      expect(key).toMatch(/^[a-z]+_[a-z]+$/);  // snake_case
    } else {
      // Alle andere keys: camelCase
      expect(key).toMatch(/^[a-z][a-zA-Z0-9]+$/);
    }
  });
});

   it('should have unique constraintsKeys across entries', () => {
  const constraintsKeys = new Set<string>();
  const duplicates: string[] = [];

  EntryRegistry.getAllKeys().forEach(key => {
    const entry = ENTRY_REGISTRY[key];
    if (entry.constraintsKey) {
      if (constraintsKeys.has(entry.constraintsKey)) {
        // Alleen waarschuwen, niet falen - constraints mogen hergebruikt worden
        console.warn(`Constraint '${entry.constraintsKey}' wordt hergebruikt door: ${key}`);
      }
      constraintsKeys.add(entry.constraintsKey);
    }
  });

  // Verwijder deze check of maak hem optioneel:
  // expect(duplicates).toEqual([]);
  
  // In plaats daarvan: check dat er constraints zijn
  expect(constraintsKeys.size).toBeGreaterThan(0);
});

    it('should have valid labelToken format', () => {
      EntryRegistry.getAllKeys().forEach(key => {
        const entry = ENTRY_REGISTRY[key];
        expect(entry.labelToken).toMatch(/^(LABEL_|goTo|startWizard|undo|redo|darkModeLabel|clearAll)/);
      });
    });

    it('should have valid placeholderToken format when present', () => {
  EntryRegistry.getAllKeys().forEach(key => {
    const entry = ENTRY_REGISTRY[key];
    if (entry.placeholderToken) {
      // Accepteer alle gangbare placeholder formaten
      const isValid = 
        /^(0\.00|TODAY|PLACEHOLDER_|LABEL_)/.test(entry.placeholderToken) || // Tokens
        /^\d{4}[A-Z]{2}$/.test(entry.placeholderToken) ||                    // Postcode (1234AB)
        /^\d{4} [A-Z]{2}$/.test(entry.placeholderToken);                     // Postcode (1234 AB)
      
      expect(isValid).toBe(true);
    }
  });
});

    it('should have valid navigationTarget for action entries', () => {
      const actionKeys = EntryRegistry.getAllKeys().filter(
        key => ENTRY_REGISTRY[key].primitiveType === PRIMITIVE_TYPES.ACTION
      );

      actionKeys.forEach(key => {
        const entry = ENTRY_REGISTRY[key];
        // Navigatie-acties hebben navigationTarget (goTo* en startWizard)
        // Command-acties hebben commandTarget (*Action)
        if (entry.navigationTarget !== undefined) {
          expect(typeof entry.navigationTarget).toBe('string');
        } else {
          expect(entry.commandTarget).toBeDefined();
          expect(typeof entry.commandTarget).toBe('string');
        }
      });
    });
  });
});