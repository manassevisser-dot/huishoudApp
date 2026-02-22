import { validateFieldInput } from './src/domain/validation/fieldValidator';

console.log('result1:', validateFieldInput('aantalMensen', 'niet-een-nummer'));
console.log('result2:', validateFieldInput('aantalMensen', null));
console.log('result3:', validateFieldInput('aantalMensen', undefined));
console.log('result4:', validateFieldInput('aantalMensen', 5));
console.log('result5:', validateFieldInput('aantalMensen', 99));
