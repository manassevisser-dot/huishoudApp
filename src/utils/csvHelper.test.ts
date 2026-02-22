// src/utils/csvHelper.test.ts
import { parseRawCsv } from './csvHelper';

describe('csvHelper', () => {
  describe('parseRawCsv', () => {
    it('moet een lege array retourneren bij een lege string', () => {
      expect(parseRawCsv('')).toEqual([]);
    });

    it('moet een lege array retourneren als er geen data-rijen zijn (alleen header)', () => {
      const csv = 'id,name,age';
      expect(parseRawCsv(csv)).toEqual([]);
    });

    it('moet standaard komma-gescheiden csv correct parsen', () => {
      const csv = `id,name,city
1,Jan,Amsterdam
2,Piet,Rotterdam`;
      
      const result = parseRawCsv(csv);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: '1', name: 'Jan', city: 'Amsterdam' });
      expect(result[1]).toEqual({ id: '2', name: 'Piet', city: 'Rotterdam' });
    });

    it('moet puntkomma (;) herkennen als scheidingsteken', () => {
      const csv = 'id;name\n1;Annet';
      const result = parseRawCsv(csv);
      
      expect(result[0]).toEqual({ id: '1', name: 'Annet' });
    });

    it('moet tabs (\\t) herkennen als scheidingsteken', () => {
      const csv = 'id\tname\n1\tKees';
      const result = parseRawCsv(csv);
      
      expect(result[0]).toEqual({ id: '1', name: 'Kees' });
    });

    it('moet quotes (") verwijderen uit de waarden en headers', () => {
      const csv = '"id","full name"\n"1","Jan Janssen"';
      const result = parseRawCsv(csv);
      
      expect(result[0]).toEqual({ id: '1', 'full name': 'Jan Janssen' });
    });

    it('moet Byte Order Marks (BOM) negeren', () => {
      const csv = '\uFEFFid,name\n1,Jan';
      const result = parseRawCsv(csv);
      
      expect(result[0]).toEqual({ id: '1', name: 'Jan' });
    });

    it('moet omgaan met extra spaties rondom de waarden', () => {
      const csv = 'id , name \n 1 , Jan ';
      const result = parseRawCsv(csv);
      
      expect(result[0]).toEqual({ id: '1', name: 'Jan' });
    });

    it('moet lege waarden als een lege string retourneren', () => {
      const csv = 'id,name,note\n1,Jan,';
      const result = parseRawCsv(csv);
      
      expect(result[0].note).toBe('');
    });

    it('moet correct omgaan met verschillende regelovergangen (\\r\\n vs \\n)', () => {
      const csv = 'id,name\r\n1,Jan\n2,Piet';
      const result = parseRawCsv(csv);
      
      expect(result).toHaveLength(2);
      expect(result[1].id).toBe('2');
    });
  });
});