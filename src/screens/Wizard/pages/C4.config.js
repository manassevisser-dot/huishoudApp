export const C4Config = {
    id: 'C4',
    title: 'Huishouden Details',
    fields: [
        {
            id: 'leden',
            label: 'Leden van het huishouden',
            type: 'repeater-array',
            required: true,
            defaultValue: [],
            validation: { lengthEqualsTo: 'C1.aantalMensen' },
        },
    ],
};
