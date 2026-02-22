import {
    Space,
    Type,
    Radius,
    Sizes,
    Shadows,
    Opacity,
    Tokens,
  } from './Tokens';
  
  describe('Design Tokens', () => {
    describe('Space', () => {
      it('heeft de verwachte vaste waarden', () => {
        expect(Space).toEqual({
          xs: 4, sm: 8, badge: 6, md: 12, lg: 16, xl: 20, xxl: 24,
        });
      });
  
      it('alle waardes zijn numbers en > 0', () => {
        Object.values(Space).forEach(v => {
          expect(typeof v).toBe('number');
          expect(v).toBeGreaterThan(0);
        });
      });
    });
  
    describe('Type', () => {
      it('heeft de verwachte vaste waarden', () => {
        expect(Type).toEqual({
          xs: 12, sm: 14, md: 16, lg: 17, xl: 18, h2: 28, kpi: 48,
        });
      });
  
      it('alle waardes zijn numbers en realistisch (>= 10)', () => {
        Object.values(Type).forEach(v => {
          expect(typeof v).toBe('number');
          expect(v).toBeGreaterThanOrEqual(10);
        });
      });
    });
  
    describe('Radius', () => {
      it('heeft de verwachte vaste waarden', () => {
        expect(Radius).toEqual({
          xs: 4,
          sm: 6,
          md: 8,
          lg: 10,
          xl: 12,
          round: 20,
          circle: 999,
          pill: 20,
        });
      });
  
      it('alle waardes zijn numbers en >= 0', () => {
        Object.values(Radius).forEach(v => {
          expect(typeof v).toBe('number');
          expect(v).toBeGreaterThanOrEqual(0);
        });
      });
    });
  
    describe('Sizes', () => {
      it('heeft de verwachte vaste waarden', () => {
        expect(Sizes).toEqual({
          inputHeight: 48,
          checkbox: 24,
          toggleWidth: 80,
          hitTarget: 44,
          counterValue: 48,
        });
      });
  
      it('alle waardes zijn numbers en > 0', () => {
        Object.values(Sizes).forEach(v => {
          expect(typeof v).toBe('number');
          expect(v).toBeGreaterThan(0);
        });
      });
    });
  
    describe('Shadows', () => {
      it('heeft de drie primaire varianten met iOS/Android subkeys', () => {
        const shapeCheck = (s: any) => {
          expect(s).toHaveProperty('ios');
          expect(s.ios).toHaveProperty('y');
          expect(s.ios).toHaveProperty('radius');
          expect(s.ios).toHaveProperty('opacity');
  
          expect(s).toHaveProperty('android');
          expect(s.android).toHaveProperty('elevation');
  
          expect(typeof s.ios.y).toBe('number');
          expect(typeof s.ios.radius).toBe('number');
          expect(typeof s.ios.opacity).toBe('number');
          expect(typeof s.android.elevation).toBe('number');
  
          // redelijke bandbreedtes
          expect(s.ios.opacity).toBeGreaterThan(0);
          expect(s.ios.opacity).toBeLessThanOrEqual(1);
        };
  
        shapeCheck(Shadows.sm);
        shapeCheck(Shadows.md);
        shapeCheck(Shadows.lg);
      });
  
      it('aliassen level1/2/3 wijzen naar dezelfde referenties als sm/md/lg', () => {
        expect(Shadows.level1).toBe(Shadows.sm);
        expect(Shadows.level2).toBe(Shadows.md);
        expect(Shadows.level3).toBe(Shadows.lg);
      });
    });
  
    describe('Opacity', () => {
      it('heeft de verwachte vaste waarden', () => {
        expect(Opacity).toEqual({
          transparent: 0,
          disabled: 0.5,
          solid: 1,
        });
      });
  
      it('alle waardes liggen tussen 0 en 1 (inclusief)', () => {
        Object.values(Opacity).forEach(v => {
          expect(typeof v).toBe('number');
          expect(v).toBeGreaterThanOrEqual(0);
          expect(v).toBeLessThanOrEqual(1);
        });
      });
    });
  
    describe('Tokens (aggregaat)', () => {
      it('bevat alle deelverzamelingen 1:1', () => {
        expect(Tokens.Space).toBe(Space);
        expect(Tokens.Type).toBe(Type);
        expect(Tokens.Radius).toBe(Radius);
        expect(Tokens.Sizes).toBe(Sizes);
        expect(Tokens.Shadows).toBe(Shadows);
        expect(Tokens.Opacity).toBe(Opacity);
      });
  
      it('heeft geen onverwachte extra sleutels', () => {
        expect(Object.keys(Tokens).sort()).toEqual(
          ['Space', 'Type', 'Radius', 'Sizes', 'Shadows', 'Opacity'].sort()
        );
      });
    });
  });
  it('snapshot van alle Tokens', () => {
    expect(Tokens).toMatchSnapshot();
  });