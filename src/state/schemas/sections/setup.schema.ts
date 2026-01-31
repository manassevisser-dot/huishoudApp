import { z } from 'zod';

export const SetupSchema = z.object({
  aantalMensen: z.number()
    .min(1, { message: 'setup.aantalMensen.min' })
    .max(10, { message: 'setup.aantalMensen.max' }) // Hier ging de test op stuk
    .default(1),
  aantalVolwassen: z.number()
    .min(1, { message: 'setup.aantalVolwassen.min' })
    .default(1),
  autoCount: z.enum(['Nee', 'Een', 'Twee']).default('Nee'),
  heeftHuisdieren: z.boolean().default(false),
  woningType: z.enum(['Huur', 'Koop', 'Anders']).default('Huur'),
}).default({
  aantalMensen: 1,
  aantalVolwassen: 1,
  autoCount: 'Nee',
  heeftHuisdieren: false,
  woningType: 'Huur'
});