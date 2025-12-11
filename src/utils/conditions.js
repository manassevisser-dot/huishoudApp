export const evaluateCondition = (conditional, state, pageId) => {
    if (!conditional)
        return true;
    const [targetPageId, targetFieldId] = conditional.field.split('.');
    const targetValue = state[targetPageId]?.[targetFieldId];
    const condValue = conditional.value;
    switch (conditional.operator) {
        case '===':
            return targetValue === condValue;
        case '!==':
            return targetValue !== condValue;
        case '>':
        case '<':
        case '>=':
        case '<=': {
            if (targetValue === null || targetValue === undefined || targetValue === '') {
                return false;
            }
            const numericTarget = Number(targetValue);
            const numericCond = Number(condValue);
            if (!Number.isFinite(numericTarget) || !Number.isFinite(numericCond)) {
                return false;
            }
            switch (conditional.operator) {
                case '>': return numericTarget > numericCond;
                case '<': return numericTarget < numericCond;
                case '>=': return numericTarget >= numericCond;
                case '<=': return numericTarget <= numericCond;
                default: return false;
            }
        }
        default:
            return true;
    }
};
