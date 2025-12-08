export const calculateFinancialSummary = (c7: any, c10: any) => {
  const F = (freq?: string) => {
    switch (freq) {
      case 'week':
        return 52 / 12;
      case '4wk':
        return 13;
      case 'month':
        return 1;
      case 'quarter':
        return 1 / 3;
      case 'year':
        return 1 / 12;
      default:
        return 1;
    }
  };

  const perAdultSum = c7?.inkomsten
    ? Object.values(c7.inkomsten).reduce((sum: number, rec: any) => {
        if (!rec) return sum;
        const categories = rec.categories || {};
        let s = 0;

        if (categories.werk) {
          const freq = rec.frequentie;
          const netto =
            typeof rec.nettoSalaris === 'number' ? rec.nettoSalaris : 0;
          s += netto * F(freq);
          const zorg =
            typeof rec?.toeslagen?.zorgtoeslag === 'number'
              ? rec.toeslagen.zorgtoeslag
              : 0;
          const over =
            typeof rec?.toeslagen?.overige === 'number'
              ? rec.toeslagen.overige
              : 0;
          const reis =
            typeof rec?.toeslagen?.reiskosten === 'number'
              ? rec.toeslagen.reiskosten
              : 0;
          s += zorg + over + reis;
        }

        if (categories.uitkering && rec.uitkeringen) {
          for (const [key, ent] of Object.entries(rec.uitkeringen)) {
            if (!ent || !(ent as any).enabled) continue;
            const amt = typeof (ent as any).amount === 'number' ? (ent as any).amount : 0;
            s += amt * F((ent as any).frequentie);
          }
        }

        if (categories.anders && Array.isArray(rec.anders)) {
          for (const row of rec.anders) {
            const amt = typeof row?.amount === 'number' ? row.amount : 0;
            s += amt * F(row?.frequentie);
          }
        }

        const vg =
          typeof rec?.vakantiegeldPerMaand === 'number'
            ? rec.vakantiegeldPerMaand
            : typeof rec?.vakantiegeldPerJaar === 'number'
            ? rec.vakantiegeldPerJaar / 12
            : 0;
        s += vg;

        return sum + s;
      }, 0)
    : 0;

  const hb = c7?.householdBenefits || {};
  const hbSum =
    (typeof hb.huurtoeslag === 'number' ? hb.huurtoeslag : 0) +
    (typeof hb.kindgebondenBudget === 'number' ? hb.kindgebondenBudget : 0) +
    (typeof hb.kinderopvangtoeslag === 'number' ? hb.kinderopvangtoeslag : 0) +
    (typeof hb.kinderbijslag === 'number' ? hb.kinderbijslag / 3 : 0);

  const inkomenTotaalMaand = perAdultSum + hbSum;

  const lastenTotaalVast = Array.isArray(c10?.lasten)
    ? c10.lasten.reduce((sum: number, item: any) => {
        let subtotal = 0;
        for (const key of Object.keys(item)) {
          const val = item[key];
          if (typeof val === 'number' && !isNaN(val)) {
            subtotal += val;
          }
        }
        return sum + subtotal;
      }, 0)
    : 0;

  const cashflowNetto = inkomenTotaalMaand - lastenTotaalVast;
  return { inkomenTotaalMaand, lastenTotaalVast, cashflowNetto };
};
