# Analyse, vergelijking en aanbevelingen - Claude

**Geëxporteerd:** 5-1-2026, 10:51:54
**Aantal berichten:** 91

---
**Claude:**

| Aspect | Document 1 | Document 2 | Document 3 | Status |
| --- | --- | --- | --- | --- |
| Privacy-First UVP | ✅ Expliciet benoemd | ✅ Centraal principe | ✅ Gedefinieerd als kern-UVP | Volledig aligned |
| Geen bankkoppeling | ✅ Risico-eliminatie | ⚠️ Impliciet | ✅ Expliciet onderdeel UVP | Consistent |
| Passkeys als primair | ✅ Gouden standaard | ✅ Hoogste score (5/5) | ✅ Geselecteerd als primair | Unaniem |
| Social Login vermijden | ✅ Bewust vermeden | ⚠️ Hoge privacy-impact | ❌ Niet genoemd | Consensus bereikt |
| Compliance frameworks | ✅ GDPR, ISO 27001/27701, NIST | ✅ GDPR, ISO 27701, NIST, OWASP | ✅ ISO 27701:2025, NIST 1.1 | Volledig gedekt |

| Document | Standpunt | Aanbeveling |
| --- | --- | --- |
| Document 1 | ❌ Bewust vermijden | ✅ Volgen |
| Document 2 | ⚠️ Hoge privacy-impact, maar "optioneel" suggereert beschikbaarheid | ❌ Te risicovol |
| Document 3 | 🤷 Niet genoemd | - |

```
┌─────────────────────────────────────┐
│   User wil inloggen/registreren     │
└──────────────┬──────────────────────┘
               │
        ┌──────▼──────┐
        │ Passkey      │  ← PRIMAIR (UX: 5/5, Security: 5/5, Privacy: Laag)
        │ beschikbaar? │
        └──┬────────┬──┘
           │ Ja     │ Nee
           │        │
           ▼        ▼
     ┌─────────┐  ┌─────────────┐
     │ Biometric│  │ Magic Link  │  ← FALLBACK (UX: 4/5, Security: 3/5)
     │ Unlock   │  │ versturen   │
     └─────────┘  └──────┬──────┘
                         │ Fallback
                         ▼
                  ┌──────────────┐
                  │ Wachtwoord + │  ← LEGACY (UX: 3/5, Security: 4/5)
                  │ MFA (TOTP)   │     Alleen voor MVP-compatibiliteit
                  └──────────────┘
```

```
┌─────────────────────────────────────┐
│   User wil inloggen/registreren     │
└──────────────┬──────────────────────┘
               │
        ┌──────▼──────┐
        │ Passkey      │  ← PRIMAIR (UX: 5/5, Security: 5/5, Privacy: Laag)
        │ beschikbaar? │
        └──┬────────┬──┘
           │ Ja     │ Nee
           │        │
           ▼        ▼
     ┌─────────┐  ┌─────────────┐
     │ Biometric│  │ Magic Link  │  ← FALLBACK (UX: 4/5, Security: 3/5)
     │ Unlock   │  │ versturen   │
     └─────────┘  └──────┬──────┘
                         │ Fallback
                         ▼
                  ┌──────────────┐
                  │ Wachtwoord + │  ← LEGACY (UX: 3/5, Security: 4/5)
                  │ MFA (TOTP)   │     Alleen voor MVP-compatibiliteit
                  └──────────────┘
```

```
navigator.credentials.create()
```

```js
// Pseudo-code voor unified flow
async function handleAuthAttempt(identifier) {
  const user = await checkUserExists(identifier); // Email/phone check
  
  if (user.exists) {
    // SIGN-IN flow
    if (user.hasPasskey) {
      return initiateWebAuthn(user.id);
    } else {
      return showPasswordForm(identifier);
    }
  } else {
    // SIGN-UP flow
    return initiateRegistration(identifier, {
      suggestPasskey: true,
      progressiveProfile: true // Alleen essentials vragen
    });
  }
}
```

### UX Implementatie
**Eén knop voor beide flows:**
```
┌─────────────────────────────────────┐
│  📧 E-mailadres                     │
│  ┌───────────────────────────────┐ │
│  │ user@example.com              │ │
│  └───────────────────────────────┘ │
│                                     │
│  [ Ga verder ]  ← Detecteert auto  │
│                    of signup/signin │
└─────────────────────────────────────┘
```

### Progressive Profiling (Sign-up)
**Fase 1 - Alleen essentials:**
- Email (identificatie)
- Passkey registratie (of wachtwoord als fallback)

**Fase 2 - Op natuurlijke momenten:**
- Gezinssamenstelling → Bij eerste gebruik budgetverdeling
- Inkomsten/lasten → Wanneer dashboard insight vraagt

**Voordeel:** Lagere signup-friction, hogere conversie

---

## 4. Privacy Governance: Geconsolideerd Framework

### Compliance Matrix (Alle Bronnen)

| **Framework** | **Document 1** | **Document 2** | **Document 3** | **Implementatie Status** |
|---------------|---------------|---------------|---------------|------------------------|
| **GDPR/AVG** | ✅ Genoemd | ✅ Kern-principe | ✅ Impliciet | 🟢 Basis compliant |
| **ISO 27001** | ✅ Expliciet | ❌ | ❌ | 🟡 Nog te implementeren |
| **ISO 27701:2025** | ✅ Update genoemd | ✅ Privacy Management | ✅ Versie 2025 | 🟢 Target framework |
| **NIST Privacy Framework** | ✅ V1.1 | ✅ Risicogebaseerd | ✅ Protect/Govern | 🟢 Aligned |
| **OWASP ASVS** | ✅ Secure coding | ✅ Auth richtlijnen | ❌ | 🟡 Toepassen in code review |
| **ENISA Guidelines** | ✅ Data Protection Engineering | ❌ | ❌ | 🟡 Referentie voor PETs |

### DPIA Trigger Points (Nieuw uit analyse)
Een **Data Protection Impact Assessment** is verplicht bij:
1. **Introductie analytics** voor armoedeonderzoek (Document 1 & 3)
2. **Data-aggregatie** voor trendanalyse (Document 2)
3. **Nieuwe datavelden** buiten huidige minimale set

**Aanbeveling:** Plan DPIA **vóór** implementatie van Fase 4 (Research Architecture)

---

## 5. Zero-Knowledge Architectuur: Technische Diepduik

### Huidige Status vs Target State

**Huidige implementatie (uit Document 3):**
- ✅ Geen bankkoppeling
- ✅ Lokale transactie-invoer
- ⚠️ Encryptie-status onduidelijk

**Target architectuur (uit alle documenten):**
```
┌─────────────────────────────────────────────┐
│          USER DEVICE (Client-side)          │
│  ┌───────────────────────────────────────┐  │
│  │ 1. User Data (plaintext)              │  │
│  │    - Transacties, budget, gezinsdata  │  │
│  └──────────────┬────────────────────────┘  │
│                 │ Encrypted with             │
│                 ▼ Device Key (biometric lock)│
│  ┌───────────────────────────────────────┐  │
│  │ 2. Encrypted Blob (AES-256-GCM)      │  │
│  └──────────────┬────────────────────────┘  │
└─────────────────┼──────────────────────────┘
                  │ Stored on
                  ▼
┌─────────────────────────────────────────────┐
│          SERVER (Backend)                   │
│  ┌───────────────────────────────────────┐  │
│  │ 3. Encrypted Data (server kan niet    │  │
│  │    decrypten zonder device key)       │  │
│  └───────────────────────────────────────┘  │
│  ┌───────────────────────────────────────┐  │
│  │ 4. Metadata (niet-gevoelig)           │  │
│  │    - User ID, created_at, sync_status │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

```js
// Pseudo-code voor unified flow
async function handleAuthAttempt(identifier) {
  const user = await checkUserExists(identifier); // Email/phone check
  
  if (user.exists) {
    // SIGN-IN flow
    if (user.hasPasskey) {
      return initiateWebAuthn(user.id);
    } else {
      return showPasswordForm(identifier);
    }
  } else {
    // SIGN-UP flow
    return initiateRegistration(identifier, {
      suggestPasskey: true,
      progressiveProfile: true // Alleen essentials vragen
    });
  }
}
```

### UX Implementatie
**Eén knop voor beide flows:**
```
┌─────────────────────────────────────┐
│  📧 E-mailadres                     │
│  ┌───────────────────────────────┐ │
│  │ user@example.com              │ │
│  └───────────────────────────────┘ │
│                                     │
│  [ Ga verder ]  ← Detecteert auto  │
│                    of signup/signin │
└─────────────────────────────────────┘
```

### Progressive Profiling (Sign-up)
**Fase 1 - Alleen essentials:**
- Email (identificatie)
- Passkey registratie (of wachtwoord als fallback)

**Fase 2 - Op natuurlijke momenten:**
- Gezinssamenstelling → Bij eerste gebruik budgetverdeling
- Inkomsten/lasten → Wanneer dashboard insight vraagt

**Voordeel:** Lagere signup-friction, hogere conversie

---

## 4. Privacy Governance: Geconsolideerd Framework

### Compliance Matrix (Alle Bronnen)

| **Framework** | **Document 1** | **Document 2** | **Document 3** | **Implementatie Status** |
|---------------|---------------|---------------|---------------|------------------------|
| **GDPR/AVG** | ✅ Genoemd | ✅ Kern-principe | ✅ Impliciet | 🟢 Basis compliant |
| **ISO 27001** | ✅ Expliciet | ❌ | ❌ | 🟡 Nog te implementeren |
| **ISO 27701:2025** | ✅ Update genoemd | ✅ Privacy Management | ✅ Versie 2025 | 🟢 Target framework |
| **NIST Privacy Framework** | ✅ V1.1 | ✅ Risicogebaseerd | ✅ Protect/Govern | 🟢 Aligned |
| **OWASP ASVS** | ✅ Secure coding | ✅ Auth richtlijnen | ❌ | 🟡 Toepassen in code review |
| **ENISA Guidelines** | ✅ Data Protection Engineering | ❌ | ❌ | 🟡 Referentie voor PETs |

### DPIA Trigger Points (Nieuw uit analyse)
Een **Data Protection Impact Assessment** is verplicht bij:
1. **Introductie analytics** voor armoedeonderzoek (Document 1 & 3)
2. **Data-aggregatie** voor trendanalyse (Document 2)
3. **Nieuwe datavelden** buiten huidige minimale set

**Aanbeveling:** Plan DPIA **vóór** implementatie van Fase 4 (Research Architecture)

---

## 5. Zero-Knowledge Architectuur: Technische Diepduik

### Huidige Status vs Target State

**Huidige implementatie (uit Document 3):**
- ✅ Geen bankkoppeling
- ✅ Lokale transactie-invoer
- ⚠️ Encryptie-status onduidelijk

**Target architectuur (uit alle documenten):**
```
┌─────────────────────────────────────────────┐
│          USER DEVICE (Client-side)          │
│  ┌───────────────────────────────────────┐  │
│  │ 1. User Data (plaintext)              │  │
│  │    - Transacties, budget, gezinsdata  │  │
│  └──────────────┬────────────────────────┘  │
│                 │ Encrypted with             │
│                 ▼ Device Key (biometric lock)│
│  ┌───────────────────────────────────────┐  │
│  │ 2. Encrypted Blob (AES-256-GCM)      │  │
│  └──────────────┬────────────────────────┘  │
└─────────────────┼──────────────────────────┘
                  │ Stored on
                  ▼
┌─────────────────────────────────────────────┐
│          SERVER (Backend)                   │
│  ┌───────────────────────────────────────┐  │
│  │ 3. Encrypted Data (server kan niet    │  │
│  │    decrypten zonder device key)       │  │
│  └───────────────────────────────────────┘  │
│  ┌───────────────────────────────────────┐  │
│  │ 4. Metadata (niet-gevoelig)           │  │
│  │    - User ID, created_at, sync_status │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

```
SubtleCrypto API
```

```
Jetpack Security
```

```
// Pseudo-code voor key derivation
const deviceKey = await deriveKeyFromBiometric({
  userID: user.id,
  biometricData: faceID_or_fingerprint,
  salt: stored_device_salt
});

const encryptedData = await encryptWithKey(userData, deviceKey);
```

```js
// Pseudo-code voor key derivation
const deviceKey = await deriveKeyFromBiometric({
  userID: user.id,
  biometricData: faceID_or_fingerprint,
  salt: stored_device_salt
});

const encryptedData = await encryptWithKey(userData, deviceKey);
```

```json
{
  "user_id": "uuid",
  "email_hash": "sha256(email)", // Voor duplicate check
  "created_at": "timestamp",
  "last_login": "timestamp"
}
```

```js
{
  "user_id": "uuid",
  "email_hash": "sha256(email)", // Voor duplicate check
  "created_at": "timestamp",
  "last_login": "timestamp"
}
```

```json
{
  "adults_count": 2,
  "children": [
    {"age_bracket": "0-5", "name_encrypted": "..."}, // Naam alleen lokaal opgeslagen
    {"age_bracket": "6-12", "name_encrypted": "..."}
  ],
  "income_sources": [
    {"type": "salary", "frequency": "monthly", "amount_encrypted": "..."}
  ]
}
```

```js
{
  "adults_count": 2,
  "children": [
    {"age_bracket": "0-5", "name_encrypted": "..."}, // Naam alleen lokaal opgeslagen
    {"age_bracket": "6-12", "name_encrypted": "..."}
  ],
  "income_sources": [
    {"type": "salary", "frequency": "monthly", "amount_encrypted": "..."}
  ]
}
```

```json
{
  "transaction_id": "uuid",
  "date": "2024-12-07",
  "category_id": "groceries", // Niet-gevoelig
  "amount_encrypted": "...",
  "notes_encrypted": "..." // Optioneel
}
```

```js
{
  "transaction_id": "uuid",
  "date": "2024-12-07",
  "category_id": "groceries", // Niet-gevoelig
  "amount_encrypted": "...",
  "notes_encrypted": "..." // Optioneel
}
```

```
@github/webauthn-json
```

```
diffprivlib
```

```json
{
       "user_id_hash": "sha256(...)",
       "action": "transaction_created",
       "timestamp": "2024-12-07T10:30:00Z",
       "ip_subnet": "192.168.1.0/24" // Laatste octet verwijderd
     }
```

```js
{
       "user_id_hash": "sha256(...)",
       "action": "transaction_created",
       "timestamp": "2024-12-07T10:30:00Z",
       "ip_subnet": "192.168.1.0/24" // Laatste octet verwijderd
     }
```

```
describe('Encryption', () => {
  test('Data onleesbaar zonder device key', async () => {
    const plaintext = { amount: 50, category: 'groceries' };
    const encrypted = await encrypt(plaintext, deviceKey);
    
    // Zonder key → moet failure geven
    await expect(decrypt(encrypted, wrongKey)).rejects.toThrow();
  });
  
  test('Passkey registratie genereert unieke credentials', async () => {
    const cred1 = await createPasskey(user1);
    const cred2 = await createPasskey(user1); // Tweede device
    
    expect(cred1.id).not.toBe(cred2.id);
  });
});
```

### Integration Tests (Flow)
1. **Unified Auth Flow:**
   - Nieuwe gebruiker → Sign-up → Passkey prompt → Success
   - Bestaande gebruiker → Email herkend → Passkey challenge → Login
   
2. **Recovery Flow:**
   - Device verloren → Magic link → Nieuwe passkey registratie
   
3. **Data Persistence:**
   - Transactie opslaan → Logout → Login op nieuw device → Data zichtbaar (maar encrypted in DB)

### Manual Security Tests (Pentesting)
- SQL injection pogingen op transactie-endpoints
- XSS via notitievelden
- CSRF op state-changing actions
- Session fixation attacks
- Brute force wachtwoord pogingen (rate limiting check)

### Compliance Audit Checklist
- [ ] Privacy policy bevat alle GDPR verplichte elementen
- [ ] Consent is opt-in, niet pre-checked
- [ ] Data export werkt binnen 30 dagen (GDPR art. 20)
- [ ] Account verwijdering werkt binnen 30 dagen (GDPR art. 17)
- [ ] Breach notification procedure gedocumenteerd (72u GDPR art. 33)
- [ ] DPIA uitgevoerd voor high-risk processing

---

## 11. Aanbevolen Tech Stack (Aanvulling op Documenten)

### Authentication
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Passkeys | `@simplewebauthn/browser` + `@simplewebauthn/server` | Best-in-class WebAuthn impl |
| Magic Links | `nodemailer` + custom JWT | Full control, geen vendor lock-in |
| MFA (TOTP) | `otplib` | Open standard, offline-capable |

### Encryption
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Web | `SubtleCrypto API` (native) | Zero dependencies, browser-native |
| Mobile iOS | `CryptoKit` + Secure Enclave | Hardware-backed security |
| Mobile Android | `Jetpack Security` | Google-maintained, best practices |

### Privacy-Enhancing Technologies (Fase 4)
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Differential Privacy | `diffprivlib` (Python) | IBM-backed, production-ready |
| Secure Aggregation | `TensorFlow Federated` | Proven in production (Google) |

### Infrastructure
| **Component** | **Service** | **Privacy Rationale** |
|--------------|-----------|---------------------|
| Hosting | **Hetzner** of **OVH** (EU) | GDPR-compliant, EU data residency |
| Database | **PostgreSQL** + `pgcrypto` | Open-source, encryption-at-rest native |
| Email | **Postmark** of **Mailgun EU** | Transactional focus, GDPR-compliant |
| Monitoring | **Plausible Analytics** | Privacy-friendly alternative to Google Analytics |

**Anti-pattern:** Vermijd AWS US-regio's of Cloudflare Analytics (data doorgifte VS)

---

## 12. Definitieve Aanbevelingen (Prioriteiten)

### 🔥 Kritiek (Start vandaag)
1. **Audit huidige encryptie status** → Indien plaintext, urgent fixen
2. **Implementeer rate limiting** op auth endpoints (prevent brute force)
3. **Token expiry check** → Max 1 uur voor access tokens

### ⚡ Hoog (Volgende sprint)
4. **Passkey MVP implementatie** (WebAuthn basic flow)
5. **Privacy policy opstellen** (GDPR-template gebruiken)
6. **Magic link recovery** (fallback voor passkeys)

### 📊 Medium (Q1 2025)
7. **Unified sign-up/sign-in flow** (zie sectie 3)
8. **DPIA template** en eerste uitvoering
9. **External security audit** (budget: €5-15k voor SME pentesting)

### 🔮 Strategisch (Q2-Q4 2025)
10. **ISO 27701 certificering** voorbereiden (indien B2B/funding relevant)
11. **Differential Privacy analytics** (alleen voor onderzoeksdoeleinde)
12. **Multi-device sync** met end-to-end encryptie

---

## 13. Risico Matrix

| **Risico** | **Impact** | **Kans** | **Mitigatie** | **Owner** |
|-----------|-----------|---------|--------------|----------|
| Data breach door weak encryption | 🔴 Zeer hoog | 🟡 Middel | Client-side encryption implementeren (Fase 2) | CTO |
| Passkey adoption te laag | 🟡 Middel | 🟢 Laag | Magic link als fallback + educatie in onboarding | Product |
| GDPR non-compliance bij launch | 🔴 Hoog | 🟡 Middel | Privacy policy + DPIA vóór launch | Legal |
| Social login verzoek van stakeholders | 🟡 Middel | 🟢 Laag | Data-driven argument voorbereiden (zie sectie 8) | Product |
| Key recovery failure (user verliest device) | 🟠 Hoog | 🟡 Middel | Multi-recovery opties: magic link + recovery codes | DevOps |

---

## 14. Slot: Van Strategie naar Executie

### ✅ Wat is Crystal Clear
- **Passkeys = primaire auth** (unaniem in alle docs)
- **Privacy-First = non-negotiable** (strategische kern)
- **Geen social login** (past niet bij branding)
- **Compliance frameworks** (ISO 27701 + NIST als fundering)

### ⚠️ Wat Onmiddellijke Aandacht Vereist
1. Encryptie-status huidige data → **Audit this week**
2. Rate limiting auth endpoints → **Implement ASAP**
3. Privacy policy definitieve versie → **Legal review Q1 2025**

### 🚀 Volgende Concrete Stappen

**Deze week:**
- [ ] Tech lead voert encryptie-audit uit
- [ ] Product owner prioriteert Fase 2 backlog items
- [ ] Founder beslist: certificering wel/niet (ISO 27701)

**Volgende sprint (2 weken):**
- [ ] Passkey proof-of-concept (1 developer, 40u)
- [ ] Privacy policy eerste draft (Legal consult 4u)
- [ ] Security audit offerte aanvragen (3 aanbieders)

**Q1 2025 Milestone:**
- [ ] Passkeys live in productie
- [ ] GDPR-compliant privacy stack
- [ ] Externe security audit afgerond
- [ ] Klaar voor limited public beta

---

## 📎 Bijlagen

### A. Referentie Links
- **WebAuthn Demo:** https://webauthn.io
- **GDPR Checklist:** https://gdpr.eu/checklist/
- **NIST Privacy Framework:** https://www.nist.gov/privacy-framework
- **OWASP ASVS:** https://owasp.org/www-project-application-security-verification-standard/

### B. Template: DPIA Kickoff Vragen
1. Welke nieuwe data verzamelen we?
2. Voor welk expliciet doel?
3. Kunnen we dit doel bereiken met minder data?
4. Hoe lang bewaren we dit?
5. Wie heeft toegang (intern/extern)?
6. Wat zijn de risico's voor betrokkenen?
7. Welke technische maatregelen nemen we?
8. Is er een Data Processing Agreement (DPA) nodig?

### C. Voorbeeld Recovery Code UI
```
╔════════════════════════════════════════╗
║  🔐 Bewaar deze codes op veilige plek  ║
║                                        ║
║  ABCD-EFGH-IJKL-MNOP                  ║
║  QRST-UVWX-YZAB-CDEF                  ║
║  GHIJ-KLMN-OPQR-STUV                  ║
║                                        ║
║  ✅ Gedownload                        ║
║  📧 Per email                         ║
║  🖨️ Print                             ║
╚════════════════════════════════════════╝
```

```js
describe('Encryption', () => {
  test('Data onleesbaar zonder device key', async () => {
    const plaintext = { amount: 50, category: 'groceries' };
    const encrypted = await encrypt(plaintext, deviceKey);
    
    // Zonder key → moet failure geven
    await expect(decrypt(encrypted, wrongKey)).rejects.toThrow();
  });
  
  test('Passkey registratie genereert unieke credentials', async () => {
    const cred1 = await createPasskey(user1);
    const cred2 = await createPasskey(user1); // Tweede device
    
    expect(cred1.id).not.toBe(cred2.id);
  });
});
```

### Integration Tests (Flow)
1. **Unified Auth Flow:**
   - Nieuwe gebruiker → Sign-up → Passkey prompt → Success
   - Bestaande gebruiker → Email herkend → Passkey challenge → Login
   
2. **Recovery Flow:**
   - Device verloren → Magic link → Nieuwe passkey registratie
   
3. **Data Persistence:**
   - Transactie opslaan → Logout → Login op nieuw device → Data zichtbaar (maar encrypted in DB)

### Manual Security Tests (Pentesting)
- SQL injection pogingen op transactie-endpoints
- XSS via notitievelden
- CSRF op state-changing actions
- Session fixation attacks
- Brute force wachtwoord pogingen (rate limiting check)

### Compliance Audit Checklist
- [ ] Privacy policy bevat alle GDPR verplichte elementen
- [ ] Consent is opt-in, niet pre-checked
- [ ] Data export werkt binnen 30 dagen (GDPR art. 20)
- [ ] Account verwijdering werkt binnen 30 dagen (GDPR art. 17)
- [ ] Breach notification procedure gedocumenteerd (72u GDPR art. 33)
- [ ] DPIA uitgevoerd voor high-risk processing

---

## 11. Aanbevolen Tech Stack (Aanvulling op Documenten)

### Authentication
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Passkeys | `@simplewebauthn/browser` + `@simplewebauthn/server` | Best-in-class WebAuthn impl |
| Magic Links | `nodemailer` + custom JWT | Full control, geen vendor lock-in |
| MFA (TOTP) | `otplib` | Open standard, offline-capable |

### Encryption
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Web | `SubtleCrypto API` (native) | Zero dependencies, browser-native |
| Mobile iOS | `CryptoKit` + Secure Enclave | Hardware-backed security |
| Mobile Android | `Jetpack Security` | Google-maintained, best practices |

### Privacy-Enhancing Technologies (Fase 4)
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Differential Privacy | `diffprivlib` (Python) | IBM-backed, production-ready |
| Secure Aggregation | `TensorFlow Federated` | Proven in production (Google) |

### Infrastructure
| **Component** | **Service** | **Privacy Rationale** |
|--------------|-----------|---------------------|
| Hosting | **Hetzner** of **OVH** (EU) | GDPR-compliant, EU data residency |
| Database | **PostgreSQL** + `pgcrypto` | Open-source, encryption-at-rest native |
| Email | **Postmark** of **Mailgun EU** | Transactional focus, GDPR-compliant |
| Monitoring | **Plausible Analytics** | Privacy-friendly alternative to Google Analytics |

**Anti-pattern:** Vermijd AWS US-regio's of Cloudflare Analytics (data doorgifte VS)

---

## 12. Definitieve Aanbevelingen (Prioriteiten)

### 🔥 Kritiek (Start vandaag)
1. **Audit huidige encryptie status** → Indien plaintext, urgent fixen
2. **Implementeer rate limiting** op auth endpoints (prevent brute force)
3. **Token expiry check** → Max 1 uur voor access tokens

### ⚡ Hoog (Volgende sprint)
4. **Passkey MVP implementatie** (WebAuthn basic flow)
5. **Privacy policy opstellen** (GDPR-template gebruiken)
6. **Magic link recovery** (fallback voor passkeys)

### 📊 Medium (Q1 2025)
7. **Unified sign-up/sign-in flow** (zie sectie 3)
8. **DPIA template** en eerste uitvoering
9. **External security audit** (budget: €5-15k voor SME pentesting)

### 🔮 Strategisch (Q2-Q4 2025)
10. **ISO 27701 certificering** voorbereiden (indien B2B/funding relevant)
11. **Differential Privacy analytics** (alleen voor onderzoeksdoeleinde)
12. **Multi-device sync** met end-to-end encryptie

---

## 13. Risico Matrix

| **Risico** | **Impact** | **Kans** | **Mitigatie** | **Owner** |
|-----------|-----------|---------|--------------|----------|
| Data breach door weak encryption | 🔴 Zeer hoog | 🟡 Middel | Client-side encryption implementeren (Fase 2) | CTO |
| Passkey adoption te laag | 🟡 Middel | 🟢 Laag | Magic link als fallback + educatie in onboarding | Product |
| GDPR non-compliance bij launch | 🔴 Hoog | 🟡 Middel | Privacy policy + DPIA vóór launch | Legal |
| Social login verzoek van stakeholders | 🟡 Middel | 🟢 Laag | Data-driven argument voorbereiden (zie sectie 8) | Product |
| Key recovery failure (user verliest device) | 🟠 Hoog | 🟡 Middel | Multi-recovery opties: magic link + recovery codes | DevOps |

---

## 14. Slot: Van Strategie naar Executie

### ✅ Wat is Crystal Clear
- **Passkeys = primaire auth** (unaniem in alle docs)
- **Privacy-First = non-negotiable** (strategische kern)
- **Geen social login** (past niet bij branding)
- **Compliance frameworks** (ISO 27701 + NIST als fundering)

### ⚠️ Wat Onmiddellijke Aandacht Vereist
1. Encryptie-status huidige data → **Audit this week**
2. Rate limiting auth endpoints → **Implement ASAP**
3. Privacy policy definitieve versie → **Legal review Q1 2025**

### 🚀 Volgende Concrete Stappen

**Deze week:**
- [ ] Tech lead voert encryptie-audit uit
- [ ] Product owner prioriteert Fase 2 backlog items
- [ ] Founder beslist: certificering wel/niet (ISO 27701)

**Volgende sprint (2 weken):**
- [ ] Passkey proof-of-concept (1 developer, 40u)
- [ ] Privacy policy eerste draft (Legal consult 4u)
- [ ] Security audit offerte aanvragen (3 aanbieders)

**Q1 2025 Milestone:**
- [ ] Passkeys live in productie
- [ ] GDPR-compliant privacy stack
- [ ] Externe security audit afgerond
- [ ] Klaar voor limited public beta

---

## 📎 Bijlagen

### A. Referentie Links
- **WebAuthn Demo:** https://webauthn.io
- **GDPR Checklist:** https://gdpr.eu/checklist/
- **NIST Privacy Framework:** https://www.nist.gov/privacy-framework
- **OWASP ASVS:** https://owasp.org/www-project-application-security-verification-standard/

### B. Template: DPIA Kickoff Vragen
1. Welke nieuwe data verzamelen we?
2. Voor welk expliciet doel?
3. Kunnen we dit doel bereiken met minder data?
4. Hoe lang bewaren we dit?
5. Wie heeft toegang (intern/extern)?
6. Wat zijn de risico's voor betrokkenen?
7. Welke technische maatregelen nemen we?
8. Is er een Data Processing Agreement (DPA) nodig?

### C. Voorbeeld Recovery Code UI
```
╔════════════════════════════════════════╗
║  🔐 Bewaar deze codes op veilige plek  ║
║                                        ║
║  ABCD-EFGH-IJKL-MNOP                  ║
║  QRST-UVWX-YZAB-CDEF                  ║
║  GHIJ-KLMN-OPQR-STUV                  ║
║                                        ║
║  ✅ Gedownload                        ║
║  📧 Per email                         ║
║  🖨️ Print                             ║
╚════════════════════════════════════════╝
```

```sql
budget-app/
├── android/                 # Native Android code
├── ios/                     # Native iOS code
├── src/
│   ├── app/                 # Screen routes (voor React Navigation of Expo Router)
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   └── passkey-setup.tsx
│   │   ├── onboarding/      # Setup flow (C1, C4, C7, C10)
│   │   │   ├── household.tsx      # C1: Gezinssamenstelling
│   │   │   ├── details.tsx        # C4: Details
│   │   │   ├── income.tsx         # C7: Vaste inkomsten
│   │   │   └── expenses.tsx       # C10: Vaste lasten
│   │   ├── dashboard/
│   │   │   └── index.tsx
│   │   ├── transactions/
│   │   │   ├── daily-input.tsx    # "Noot van Manasse" logica
│   │   │   └── overview.tsx       # Edit/Delete functionaliteit
│   │   └── settings/
│   │       ├── privacy.tsx
│   │       └── profile.tsx
│   │
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Base components (buttons, inputs, cards)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── SaveConfirmation.tsx  # Voor "Opslaan" bevestiging
│   │   ├── forms/
│   │   │   ├── TransactionForm.tsx
│   │   │   └── HouseholdForm.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── NavigationGuard.tsx   # Voor unsaved changes warning
│   │
│   ├── features/            # Feature-specific logic & components
│   │   ├── auth/
│   │   │   ├── hooks/
│   │   │   │   ├── usePasskey.ts
│   │   │   │   ├── useMagicLink.ts
│   │   │   │   └── useBiometric.ts
│   │   │   ├── components/
│   │   │   │   └── PasskeyPrompt.tsx
│   │   │   └── services/
│   │   │       ├── webauthn.service.ts
│   │   │       └── auth.service.ts
│   │   │
│   │   ├── encryption/       # 🔐 Zero-Knowledge crypto
│   │   │   ├── crypto.service.ts      # AES-256-GCM
│   │   │   ├── keychain.service.ts    # iOS/Android keychain
│   │   │   └── types.ts
│   │   │
│   │   ├── transactions/
│   │   │   ├── hooks/
│   │   │   │   ├── useTransactions.ts
│   │   │   │   └── useCategories.ts
│   │   │   ├── components/
│   │   │   │   └── CategoryChips.tsx  # Conditionele rendering (kinderen)
│   │   │   └── services/
│   │   │       └── transaction.service.ts
│   │   │
│   │   └── budget/
│   │       ├── hooks/
│   │       │   └── useBudgetCalculation.ts
│   │       └── components/
│   │           └── BudgetOverview.tsx
│   │
│   ├── lib/                 # Core utilities (shared across features)
│   │   ├── api/
│   │   │   ├── client.ts           # Axios/Fetch wrapper
│   │   │   ├── endpoints.ts
│   │   │   └── interceptors.ts
│   │   ├── storage/
│   │   │   ├── secure-storage.ts   # Encrypted storage wrapper
│   │   │   └── migrations.ts       # Data model versioning
│   │   ├── validation/
│   │   │   ├── schemas.ts          # Zod/Yup schemas
│   │   │   └── validators.ts
│   │   └── i18n/
│   │       ├── index.ts
│   │       └── translations/
│   │           ├── nl.json
│   │           └── en.json
│   │
│   ├── types/               # TypeScript interfaces
│   │   ├── user.types.ts
│   │   ├── transaction.types.ts
│   │   ├── household.types.ts
│   │   └── auth.types.ts
│   │
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── fonts.ts
│   │   ├── screens.ts       # Screen names voor navigation
│   │   └── config.ts        # App config (niet-gevoelig)
│   │
│   ├── hooks/               # Global custom hooks
│   │   ├── useAppState.ts
│   │   ├── useSecureNavigate.ts  # Navigation met unsaved check
│   │   └── useOfflineSync.ts
│   │
│   ├── store/               # State management (Redux/Zustand)
│   │   ├── slices/
│   │   │   ├── auth.slice.ts
│   │   │   ├── household.slice.ts
│   │   │   └── transactions.slice.ts
│   │   ├── store.ts
│   │   └── hooks.ts         # Typed hooks (useAppDispatch, useAppSelector)
│   │
│   ├── utils/
│   │   ├── date.utils.ts
│   │   ├── currency.utils.ts
│   │   ├── logger.ts        # Privacy-compliant logging (geen PII)
│   │   └── error-handler.ts
│   │
│   └── assets/
│       ├── fonts/
│       ├── images/
│       │   ├── icons/
│       │   └── illustrations/
│       └── animations/       # Lottie files
│
├── __tests__/               # Tests (mirrors src/ structure)
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example             # Template (NOOIT echte keys committen)
├── .gitignore
├── app.json                 # Expo config
├── package.json
├── tsconfig.json
└── README.md
```

```sql
budget-app/
├── android/                 # Native Android code
├── ios/                     # Native iOS code
├── src/
│   ├── app/                 # Screen routes (voor React Navigation of Expo Router)
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   └── passkey-setup.tsx
│   │   ├── onboarding/      # Setup flow (C1, C4, C7, C10)
│   │   │   ├── household.tsx      # C1: Gezinssamenstelling
│   │   │   ├── details.tsx        # C4: Details
│   │   │   ├── income.tsx         # C7: Vaste inkomsten
│   │   │   └── expenses.tsx       # C10: Vaste lasten
│   │   ├── dashboard/
│   │   │   └── index.tsx
│   │   ├── transactions/
│   │   │   ├── daily-input.tsx    # "Noot van Manasse" logica
│   │   │   └── overview.tsx       # Edit/Delete functionaliteit
│   │   └── settings/
│   │       ├── privacy.tsx
│   │       └── profile.tsx
│   │
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Base components (buttons, inputs, cards)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── SaveConfirmation.tsx  # Voor "Opslaan" bevestiging
│   │   ├── forms/
│   │   │   ├── TransactionForm.tsx
│   │   │   └── HouseholdForm.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── NavigationGuard.tsx   # Voor unsaved changes warning
│   │
│   ├── features/            # Feature-specific logic & components
│   │   ├── auth/
│   │   │   ├── hooks/
│   │   │   │   ├── usePasskey.ts
│   │   │   │   ├── useMagicLink.ts
│   │   │   │   └── useBiometric.ts
│   │   │   ├── components/
│   │   │   │   └── PasskeyPrompt.tsx
│   │   │   └── services/
│   │   │       ├── webauthn.service.ts
│   │   │       └── auth.service.ts
│   │   │
│   │   ├── encryption/       # 🔐 Zero-Knowledge crypto
│   │   │   ├── crypto.service.ts      # AES-256-GCM
│   │   │   ├── keychain.service.ts    # iOS/Android keychain
│   │   │   └── types.ts
│   │   │
│   │   ├── transactions/
│   │   │   ├── hooks/
│   │   │   │   ├── useTransactions.ts
│   │   │   │   └── useCategories.ts
│   │   │   ├── components/
│   │   │   │   └── CategoryChips.tsx  # Conditionele rendering (kinderen)
│   │   │   └── services/
│   │   │       └── transaction.service.ts
│   │   │
│   │   └── budget/
│   │       ├── hooks/
│   │       │   └── useBudgetCalculation.ts
│   │       └── components/
│   │           └── BudgetOverview.tsx
│   │
│   ├── lib/                 # Core utilities (shared across features)
│   │   ├── api/
│   │   │   ├── client.ts           # Axios/Fetch wrapper
│   │   │   ├── endpoints.ts
│   │   │   └── interceptors.ts
│   │   ├── storage/
│   │   │   ├── secure-storage.ts   # Encrypted storage wrapper
│   │   │   └── migrations.ts       # Data model versioning
│   │   ├── validation/
│   │   │   ├── schemas.ts          # Zod/Yup schemas
│   │   │   └── validators.ts
│   │   └── i18n/
│   │       ├── index.ts
│   │       └── translations/
│   │           ├── nl.json
│   │           └── en.json
│   │
│   ├── types/               # TypeScript interfaces
│   │   ├── user.types.ts
│   │   ├── transaction.types.ts
│   │   ├── household.types.ts
│   │   └── auth.types.ts
│   │
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── fonts.ts
│   │   ├── screens.ts       # Screen names voor navigation
│   │   └── config.ts        # App config (niet-gevoelig)
│   │
│   ├── hooks/               # Global custom hooks
│   │   ├── useAppState.ts
│   │   ├── useSecureNavigate.ts  # Navigation met unsaved check
│   │   └── useOfflineSync.ts
│   │
│   ├── store/               # State management (Redux/Zustand)
│   │   ├── slices/
│   │   │   ├── auth.slice.ts
│   │   │   ├── household.slice.ts
│   │   │   └── transactions.slice.ts
│   │   ├── store.ts
│   │   └── hooks.ts         # Typed hooks (useAppDispatch, useAppSelector)
│   │
│   ├── utils/
│   │   ├── date.utils.ts
│   │   ├── currency.utils.ts
│   │   ├── logger.ts        # Privacy-compliant logging (geen PII)
│   │   └── error-handler.ts
│   │
│   └── assets/
│       ├── fonts/
│       ├── images/
│       │   ├── icons/
│       │   └── illustrations/
│       └── animations/       # Lottie files
│
├── __tests__/               # Tests (mirrors src/ structure)
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example             # Template (NOOIT echte keys committen)
├── .gitignore
├── app.json                 # Expo config
├── package.json
├── tsconfig.json
└── README.md
```

```
features/encryption/
```

```
src/
├── features/encryption/          # 🔐 KRITIEK
│   ├── crypto.service.ts         # AES-256-GCM implementatie
│   ├── keychain.service.ts       # iOS/Android keychain
│   └── __tests__/
│       └── crypto.test.ts        # Unit tests voor encryptie
│
├── features/auth/
│   ├── services/
│   │   ├── webauthn.service.ts   # Passkey implementatie
│   │   ├── magic-link.service.ts
│   │   └── token.service.ts      # JWT handling (max 1u expiry)
│   └── __tests__/
│
└── lib/storage/
    ├── secure-storage.ts          # Encrypted AsyncStorage wrapper
    └── migrations.ts              # Voor schema updates zonder data loss
```

```
src/
├── features/encryption/          # 🔐 KRITIEK
│   ├── crypto.service.ts         # AES-256-GCM implementatie
│   ├── keychain.service.ts       # iOS/Android keychain
│   └── __tests__/
│       └── crypto.test.ts        # Unit tests voor encryptie
│
├── features/auth/
│   ├── services/
│   │   ├── webauthn.service.ts   # Passkey implementatie
│   │   ├── magic-link.service.ts
│   │   └── token.service.ts      # JWT handling (max 1u expiry)
│   └── __tests__/
│
└── lib/storage/
    ├── secure-storage.ts          # Encrypted AsyncStorage wrapper
    └── migrations.ts              # Voor schema updates zonder data loss
```

```
crypto.service.ts
```

```
webauthn.service.ts
```

```
.env.example
```

- CTO statusrapport fase 3 audit goedgekeurd
- Markdown bestanden combineren met PowerShell
- Verbeteringssuggestions gevraagd
- Scripts analyseren en verbeteringsadvies
- Scripts organiseren en opschonen
- Audit-script update en verbeterpunten analyseren
- Haakje of puntkomma zoeken in code
- Wat is dit?
- Protocol en documentenanalyse met validatie
- Flow 2 architect prompt evaluation
- Flow 6 analyse en optimalisatie
- CU-assembler prompt optimalisatie voor WAI-audit
- CU-assembler ultimate prompt ophalen
- Audit-script optimalisatie voor WAI-001 tot WAI-006
- Mappenstructuur aanmaken
- Prompt optimization en vergelijking PR2
- CSV service parsing and validation improvements
- Code analyse en verbeteringsadvies
- Identificatie bestanden voor theme-code integratie
- Untitled
- Resuming project development context
- Untitled
- Implementation plan development
- Dagelijkse invoer voor transactiebeheer
- Applying a specific diff
- Analyse, vergelijking en aanbevelingen
- React Native app wizard flow implementation
- Financial household management app architecture
- Untitled
- AI CTO initialization and project planning

| - Storage: Encrypted in OS keychain (iCloud Keychain | Google Password Manager) |
| --- | --- |
| - Privacy voordeel: Geen centraal wachtwoord database | geen credential stuffing mogelijk |

- Flow: Email → Beveiligde token (JWT met 15min TTL) → Auto-login
- Use case:

| - Security: Rate limiting (max 3 requests/15min) | token single-use |
| --- | --- |
| - Privacy: Email-gebaseerd | geen third-party tracking |

- Recovery wanneer passkey-device verloren is
- Onboarding nieuwe devices
- Fallback voor oudere browsers

| Key | Value |
| --- | --- |
| Scope | Alleen voor MVP-lancering (brede compatibiliteit) |
| MFA methode | TOTP (bijv. Google Authenticator) > SMS OTP |
| Migratiestrategie | Actief promoten passkey-upgrade na eerste login |
| Sunset plan | Optioneel maken na 70% passkey adoption |

| Key | Value |
| --- | --- |
| Reden | Conflicteert met "Privacy-First" branding |
| Data leakage | Name, email, friend graph, analytics tracking |
| Alternatief | Passkeys bieden vergelijkbare UX zonder privacy-trade-off |

- Web:  (native browser)
- Mobile:

| Key | Value |
| --- | --- |
| iOS | CryptoKit + Secure Enclave |
| Android | + Keystore |
| iOS | CryptoKit + Secure Enclave |
| Android | + Keystore |

| Key | Value |
| --- | --- |
| iOS | CryptoKit + Secure Enclave |
| Android | + Keystore |

| Key | Value |
| --- | --- |
| Probleem | Gebruiker verliest device met enige sleutel |
| Oplossing | Encrypted backup key in cloud, ontgrendeld via: |

| Recovery codes (gegenereerd bij setup | offline opgeslagen door user) |
| --- | --- |
| - Recovery codes (gegenereerd bij setup | offline opgeslagen door user) |

- Secondary device met passkey
- Recovery codes (gegenereerd bij setup, offline opgeslagen door user)

| - Pseudonimisatie: User ID is random UUID | niet afleidbaar |
| --- | --- |
| - Minimalisatie: Geen onnodige metadata (bijv. IP-logs | device fingerprints) |

- Setup flow (C1→C4→C7→C10)
- Dagelijkse transactie-invoer
- "Noot van Manasse" logica (save confirmation)
- Dashboard basis

- Implementeer Passkey registratie

WebAuthn library:  (web) of native APIs
Prompt tijdens onboarding: "Veiliger inloggen met gezichtsherkenning"
Fallback naar wachtwoord blijft beschikbaar
- WebAuthn library:  (web) of native APIs
- Prompt tijdens onboarding: "Veiliger inloggen met gezichtsherkenning"
- Fallback naar wachtwoord blijft beschikbaar
- Magic Link recovery

| Email service: Transactional email provider (bijv. SendGrid | Postmark) |
| --- | --- |
| - Email service: Transactional email provider (bijv. SendGrid | Postmark) |

- WebAuthn library:  (web) of native APIs
- Prompt tijdens onboarding: "Veiliger inloggen met gezichtsherkenning"
- Fallback naar wachtwoord blijft beschikbaar

| Key | Value |
| --- | --- |
| Email service | Transactional email provider (bijv. SendGrid, Postmark) |
| Token TTL | 15 minuten |
| Rate limiting | 3 pogingen per 15 min per IP |

- Encrypt-at-rest voor transacties en budgetdata
- Key derivation via biometric unlock (iOS/Android)
- Web fallback: PBKDF2 van master password

- Backend security audit

Penetration test door externe partij
OWASP Top 10 compliance check
API rate limiting en DDoS protectie
- Penetration test door externe partij
- OWASP Top 10 compliance check
- API rate limiting en DDoS protectie

- Penetration test door externe partij
- OWASP Top 10 compliance check
- API rate limiting en DDoS protectie

- Vraag gezinsdetails pas bij eerste budgetberekening
- "Waarom vragen we dit?" tooltips bij elk veld

- "Mijn gegevens" pagina met:

Data export (JSON download)
Account verwijdering (met bevestiging)
Toestemming intrekken voor analytics
- Data export (JSON download)
- Account verwijdering (met bevestiging)
- Toestemming intrekken voor analytics

- Data export (JSON download)
- Account verwijdering (met bevestiging)
- Toestemming intrekken voor analytics

- Differential Privacy implementatie

Library:  (Python) voor backend analytics
ε-budget: 1.0 voor aggregate queries
Geen individuele data-export naar onderzoekers
- Library:  (Python) voor backend analytics
- ε-budget: 1.0 voor aggregate queries
- Geen individuele data-export naar onderzoekers
- Federated Analytics (optioneel)

| Alleen model updates naar server | geen raw data |
| --- | --- |
| - Alleen model updates naar server | geen raw data |

Alleen geaggregeerde trends zichtbaar
Minimum threshold: 100 users per cohort
- Alleen geaggregeerde trends zichtbaar
- Minimum threshold: 100 users per cohort

| Key | Value |
| --- | --- |
| Library | (Python) voor backend analytics |
| ε | budget: 1.0 voor aggregate queries |
| Geen individuele data | export naar onderzoekers |

- On-device model training (TensorFlow Lite)
- Alleen model updates naar server, geen raw data

- Alleen geaggregeerde trends zichtbaar
- Minimum threshold: 100 users per cohort

| - Data leakage (email | naam | friend graph naar Meta/Google) |
| --- | --- | --- |
| - Complexiteit: OAuth flows | token refresh | revocation handling |

- Implementeer met opt-in consent (niet pre-checked)
- Minimaliseer scopes (alleen email, geen profile of friends)
- Transparante UI: "Dit deelt jouw email met [Provider]"

| - Document 1: "Lokale encryptiesleutels" → suggestie | geen confirmatie |
| --- | --- |
| - Document 2: "Zero-Knowledge Architectuur" → doel | geen implementatie |

| Key | Value |
| --- | --- |
| Audit huidige state | Controleer of transacties in database plaintext zijn |
| Indien plaintext | Urgent implementeren in Fase 2 (zie sectie 5) |
| Indien encrypted | Documenteer key management strategie |

| Key | Value |
| --- | --- |
| Voeg ISO 27018 toe (cloud privacy, relevant als je cloud | infra gebruikt) |
| Volg ENISA Cloud Security Guidelines voor hosting | keuzes |

- Auth Token Security

| HTTPOnly | Secure | SameSite=Strict cookies |
| --- | --- | --- |
| - HTTPOnly | Secure | SameSite=Strict cookies |

| Sanitize user input (transactie notities | gezinsnamen) |
| --- | --- |
| - Sanitize user input (transactie notities | gezinsnamen) |

| Audit logs: Wie | wat | wanneer → maar geen bedragen of content |
| --- | --- | --- |
| - Audit logs: Wie | wat | wanneer → maar geen bedragen of content |

- Huidige JWT expiry? → Check en zet op max 1 uur
- Implementeer refresh tokens (30 dagen) met rotation
- HTTPOnly, Secure, SameSite=Strict cookies

- Sanitize user input (transactie notities, gezinsnamen)
- Prevent XSS: Library DOMPurify voor web
- Rate limiting op alle POST endpoints

| Key | Value |
| --- | --- |
| Audit logs | Wie, wat, wanneer → maar geen bedragen of content |
| Voorbeeld GDPR | compliant log: |

- Dependency Audit

Run npm audit / pip-audit
Update kritieke vulnerabilities
Pin versies voor reproducible builds
- Run npm audit / pip-audit
- Update kritieke vulnerabilities
- Pin versies voor reproducible builds

- Run npm audit / pip-audit
- Update kritieke vulnerabilities
- Pin versies voor reproducible builds

- Passkey Implementatie (zie Fase 2)
- Encrypted Backup Systeem
- DPIA Template (reusable voor toekomstige features)

- Differential Privacy Analytics
- Formal Security Audit door third-party
- ISO 27701 Certificering (optioneel, maar sterk voor B2B/funding)

- ✅ Sneller te implementeren (minder boilerplate)
- ✅ Makkelijker te navigeren voor kleine teams
- ✅ Privacy-kritische code is geïsoleerd ()
- ✅ Past bij "Noot van Manasse" logica (eenvoudige component structuur)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dmedium.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddev.to&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddev.to&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Drobinwieruch.de&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dobytes.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dreboot.studio&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddev.to&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgithub.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dwaldo.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dreactjs.org&w=32&q=75)

### RecentsHide

### 3.docx

### 2.docx

### 1.docx

# 🔐 Geïntegreerde Privacy & Identity Architectuur

## Executive Summary

## 1. Strategische Positionering: Consistentie Analyse

### Kernbevindingen uit alle documenten

### 🎯 Conclusie

## 2. Authenticatie Architectuur: Definitieve Hiërarchie

### Geconsolideerde Beslisboom

### Technische Specificaties per Methode

#### 1️⃣ Passkeys / WebAuthn (FIDO2)

#### 2️⃣ Magic Links

#### 3️⃣ Wachtwoord + MFA

#### 4️⃣ Social Login: NIET IMPLEMENTEREN

## 3. Sign-up vs Sign-in: Unified Identity Flow

### Probleem in Huidige Implementatie

### 🆕 Aanbevolen Oplossing: Progressive Identity Discovery

### Implementatie Aanbevelingen

## 6. Data Model: Privacy-Conscious Design

### Minimale Dataset (MVP)

### Privacy-by-Design Principes Toegepast:

## 7. Roadmap: Geïntegreerde Fasering

### ✅ Fase 1: MVP - Foundation (Voltooid volgens Doc 3)

### 🔄 Fase 2: Security Hardening (Huidige focus)

### 🚀 Fase 3: UX Refinement & Governance (Q2 2025)

### 🔬 Fase 4: Research-Ready Architecture (Q3-Q4 2025)

## 8. Kritieke Verschillen & Aanbevelingen

### 🔴 Conflict: Social Login Vermelden

### 🟡 Onduidelijkheid: Huidige Encryptie Status

### 🟢 Consistentie: Compliance Frameworks

## 9. Technische Debt & Quick Wins

### Snelle Verbeteringen (< 1 week werk)

### Middelgroot (1-2 maanden)

### Langetermijn (Fase 4)

## 10. Testplan: Privacy & Security Validation

### Unit Tests (Technisch)

## Optie A: Privacy-First App Structuur (Aanbevolen)

## Optie B: Feature-Based Structuur (Schaalbaar voor groter team)

## 🎯 Mijn Aanbeveling voor Jouw Situatie

### Start met Optie A, want:

### Privacy-Specifieke Folders (Critial!)

## 📋 Volgende Stappen

| New chatChatsProjectsArtifactsCodeAll chatsMManasseFree planAnalyse | vergelijking en aanbevelingenShare227 linesdocx121 linesdocx82 linesdocxanalyseer vergelijk en combineer in 1 document met aanbevelingen7 dec 2025 |
| --- | --- |
| Definitieve Analyse | Vergelijking & Aanbevelingen |

Deze analyse consolideert drie documentatiebronnen tot één strategisch implementatieplan. Alle bronnen convergeren naar dezelfde kernwaarden: privacy-first architectuur, passkeys als authenticatiestandaard, en dataminimalisatie als fundament. Het project bevindt zich in transitie van Fase 2 naar Fase 3, met een compliance-score van 93% en een heldere roadmap naar productierijpheid.

Alle bronnen wijzen naar één coherente visie. Geen conflicterende aanbevelingen gedetecteerd.

Documenten suggereren separate flows, maar moderne best practice is één unified experience.

javascript

Library-keuzes:

Key Management:
javascript
Recovery scenario:

| Household Data (gevoelig | encrypted): |
| --- | --- |
| Transacties (gevoelig | encrypted): |

Compliance status: 93% ✅

Prioriteit 1 - Auth Upgrade:

| Key | Value |
| --- | --- |
| Prioriteit 2 | Data Protection: |
| 3. Client | side encryptie implementeren |

| Key | Value |
| --- | --- |
| Deliverable | Veilige authenticatie en encrypted data storage |
| Tijdslijn | 2-3 maanden |

Prioriteit 1 - Progressive Profiling:
5. Unified sign-up/sign-in flow (zie sectie 3)
6. Contextual data collection

Prioriteit 2 - Compliance Formalisering:
7. DPIA documentatie opstellen
8. Privacy policy generator (gebruiksvriendelijke versie)
9. Consent management dashboard

| Key | Value |
| --- | --- |
| Prioriteit 3 | Personalisatie (uit Doc 3): |
| 10. Conditionele rendering van kinderen | chips |
| 11. Transactie | overzicht met Edit/Delete |
| Deliverable | Production-ready app met volledige GDPR compliance |
| Tijdslijn | 3 maanden |

Alleen als onderzoeksfunctie gewenst:

| Key | Value |
| --- | --- |
| Deliverable | Onderzoek mogelijk zonder privacy-compromis |
| Tijdslijn | 6 maanden (optioneel) |

Definitief besluit: NIET implementeren, zelfs niet optioneel. Redenen:

Uitzondering: Als marktonderzoek expliciet aantoont dat dit dealbreaker is voor doelgroep, dan:

Vraag: Is data momenteel encrypted-at-rest?
Uit documenten:

Aanbeveling:

Alle documenten noemen ISO 27701 en NIST Privacy Framework → Sterk fundament.
Aanbeveling:

json

javascript

| Key | Value |
| --- | --- |
| Document versie | 1.0 |
| Datum | 7 december 2024 |
| Status | Definitief implementatieplan |
| Volgende review | Q1 2025 na Fase 2 voltooiingwat is de mappen structuur van de app?8 dec 2025React Native app folder structure best practices 202410 resultsReact Native folder structure \| Mediummedium.comUltimate Folder Structure For Your React Native Project - DEV Communitydev.toHow to Organize Your Components in React Native: Folder Structure and Project Organization - DEV Communitydev.toReact Folder Structure in 5 Steps [2025]robinwieruch.deProject Structure \| React Native / Expo Starterobytes.com4 folder structures to organize your React & React Native project - rebootreboot.studioThe Folder Structure of a React Native App - DEV Communitydev.toGitHub - sury4karmakar/ReactNative-ProjectStructure: 🔸 Best Folder Structure For Every React Native Project ... 🔸 In This Repo We Are Demonstrate How To Structure And Manage Your React Native Project ...github.comReact Native project structure: a best practices guidewaldo.comFile Structure – Reactreactjs.orgIk zie dat je vraagt naar de mappenstructuur van jouw app, maar die informatie staat niet in de documenten die je hebt gedeeld. De documenten bevatten strategische analyses over privacy, authenticatie en compliance, maar geen technische details over de huidige mappenstructuur. |
| Laten we dit aanpakken | ik geef je twee opties gebaseerd op moderne best practices voor een privacy-first budgetapp: |

Gebaseerd op jouw requirements (passkeys, encryptie, geen social login, dataminimalisatie):

Feature-Based App StructureCode # Feature-Based App Structuur (Alternatief)

```
budget-app/
├── src/
│   ├── modules/              # Zelfstandige feature modules
│   │   │
│   │   ├── auth/             # 🔐 Authenticatie module
│   │   │   ├── screens/
│   │   │   │   ├── LoginScr

Gebaseerd op de documentatie (93% compliance, Fase 2→3 transitie):

Ongeacht welke structuur je kiest, deze folders zijn non-negotiable:

Wil je dat ik:
A. De huidige status audit (controleren welke structuur je nu hebt)?
B. Een migratie-plan maken van huidige → Optie A?
C. Specifieke bestanden genereren (bijv. , )?
D. Een .gitignore en  maken met privacy best practices?
Kies A, B, C of D — of meerdere!Claude is AI and can make mistakes. Please double-check cited sources. Sonnet 4.5Claude is AI and can make mistakes. Please double-check cited sources.

---

**Claude:**

- CTO statusrapport fase 3 audit goedgekeurd
- Markdown bestanden combineren met PowerShell
- Verbeteringssuggestions gevraagd
- Scripts analyseren en verbeteringsadvies
- Scripts organiseren en opschonen
- Audit-script update en verbeterpunten analyseren
- Haakje of puntkomma zoeken in code
- Wat is dit?
- Protocol en documentenanalyse met validatie
- Flow 2 architect prompt evaluation
- Flow 6 analyse en optimalisatie
- CU-assembler prompt optimalisatie voor WAI-audit
- CU-assembler ultimate prompt ophalen
- Audit-script optimalisatie voor WAI-001 tot WAI-006
- Mappenstructuur aanmaken
- Prompt optimization en vergelijking PR2
- CSV service parsing and validation improvements
- Code analyse en verbeteringsadvies
- Identificatie bestanden voor theme-code integratie
- Untitled
- Resuming project development context
- Untitled
- Implementation plan development
- Dagelijkse invoer voor transactiebeheer
- Applying a specific diff
- Analyse, vergelijking en aanbevelingen
- React Native app wizard flow implementation
- Financial household management app architecture
- Untitled
- AI CTO initialization and project planning

### RecentsHide

ChatsProjectsArtifactsCodeAll chats

---

**Claude:**

ChatsProjectsArtifactsCode

---

**Claude:**

- CTO statusrapport fase 3 audit goedgekeurd
- Markdown bestanden combineren met PowerShell
- Verbeteringssuggestions gevraagd
- Scripts analyseren en verbeteringsadvies
- Scripts organiseren en opschonen
- Audit-script update en verbeterpunten analyseren
- Haakje of puntkomma zoeken in code
- Wat is dit?
- Protocol en documentenanalyse met validatie
- Flow 2 architect prompt evaluation
- Flow 6 analyse en optimalisatie
- CU-assembler prompt optimalisatie voor WAI-audit
- CU-assembler ultimate prompt ophalen
- Audit-script optimalisatie voor WAI-001 tot WAI-006
- Mappenstructuur aanmaken
- Prompt optimization en vergelijking PR2
- CSV service parsing and validation improvements
- Code analyse en verbeteringsadvies
- Identificatie bestanden voor theme-code integratie
- Untitled
- Resuming project development context
- Untitled
- Implementation plan development
- Dagelijkse invoer voor transactiebeheer
- Applying a specific diff
- Analyse, vergelijking en aanbevelingen
- React Native app wizard flow implementation
- Financial household management app architecture
- Untitled
- AI CTO initialization and project planning

### RecentsHide

All chats

---

**Claude:**

CTO statusrapport fase 3 audit goedgekeurd

---

**Claude:**

Markdown bestanden combineren met PowerShell

---

**Claude:**

Verbeteringssuggestions gevraagd

---

**Claude:**

Scripts analyseren en verbeteringsadvies

---

**Claude:**

Scripts organiseren en opschonen

---

**Claude:**

Audit-script update en verbeterpunten analyseren

---

**Claude:**

Haakje of puntkomma zoeken in code

---

**Claude:**

Wat is dit?

---

**Claude:**

Protocol en documentenanalyse met validatie

---

**Claude:**

Flow 2 architect prompt evaluation

---

**Claude:**

Flow 6 analyse en optimalisatie

---

**Claude:**

CU-assembler prompt optimalisatie voor WAI-audit

---

**Claude:**

CU-assembler ultimate prompt ophalen

---

**Claude:**

Audit-script optimalisatie voor WAI-001 tot WAI-006

---

**Claude:**

Mappenstructuur aanmaken

---

**Claude:**

Prompt optimization en vergelijking PR2

---

**Claude:**

CSV service parsing and validation improvements

---

**Claude:**

Code analyse en verbeteringsadvies

---

**Claude:**

Identificatie bestanden voor theme-code integratie

---

**Claude:**

Untitled

---

**Claude:**

Resuming project development context

---

**Claude:**

Implementation plan development

---

**Claude:**

Dagelijkse invoer voor transactiebeheer

---

**Claude:**

Applying a specific diff

---

**Claude:**

Analyse, vergelijking en aanbevelingen

---

**Claude:**

React Native app wizard flow implementation

---

**Claude:**

Financial household management app architecture

---

**Claude:**

AI CTO initialization and project planning

---

**Claude:**

All chats

---

**Claude:**

MManasseFree plan

---

**Claude:**

M

---

**Claude:**

ManasseFree plan

---

**Claude:**

| Aspect | Document 1 | Document 2 | Document 3 | Status |
| --- | --- | --- | --- | --- |
| Privacy-First UVP | ✅ Expliciet benoemd | ✅ Centraal principe | ✅ Gedefinieerd als kern-UVP | Volledig aligned |
| Geen bankkoppeling | ✅ Risico-eliminatie | ⚠️ Impliciet | ✅ Expliciet onderdeel UVP | Consistent |
| Passkeys als primair | ✅ Gouden standaard | ✅ Hoogste score (5/5) | ✅ Geselecteerd als primair | Unaniem |
| Social Login vermijden | ✅ Bewust vermeden | ⚠️ Hoge privacy-impact | ❌ Niet genoemd | Consensus bereikt |
| Compliance frameworks | ✅ GDPR, ISO 27001/27701, NIST | ✅ GDPR, ISO 27701, NIST, OWASP | ✅ ISO 27701:2025, NIST 1.1 | Volledig gedekt |

| Document | Standpunt | Aanbeveling |
| --- | --- | --- |
| Document 1 | ❌ Bewust vermijden | ✅ Volgen |
| Document 2 | ⚠️ Hoge privacy-impact, maar "optioneel" suggereert beschikbaarheid | ❌ Te risicovol |
| Document 3 | 🤷 Niet genoemd | - |

```
┌─────────────────────────────────────┐
│   User wil inloggen/registreren     │
└──────────────┬──────────────────────┘
               │
        ┌──────▼──────┐
        │ Passkey      │  ← PRIMAIR (UX: 5/5, Security: 5/5, Privacy: Laag)
        │ beschikbaar? │
        └──┬────────┬──┘
           │ Ja     │ Nee
           │        │
           ▼        ▼
     ┌─────────┐  ┌─────────────┐
     │ Biometric│  │ Magic Link  │  ← FALLBACK (UX: 4/5, Security: 3/5)
     │ Unlock   │  │ versturen   │
     └─────────┘  └──────┬──────┘
                         │ Fallback
                         ▼
                  ┌──────────────┐
                  │ Wachtwoord + │  ← LEGACY (UX: 3/5, Security: 4/5)
                  │ MFA (TOTP)   │     Alleen voor MVP-compatibiliteit
                  └──────────────┘
```

```
┌─────────────────────────────────────┐
│   User wil inloggen/registreren     │
└──────────────┬──────────────────────┘
               │
        ┌──────▼──────┐
        │ Passkey      │  ← PRIMAIR (UX: 5/5, Security: 5/5, Privacy: Laag)
        │ beschikbaar? │
        └──┬────────┬──┘
           │ Ja     │ Nee
           │        │
           ▼        ▼
     ┌─────────┐  ┌─────────────┐
     │ Biometric│  │ Magic Link  │  ← FALLBACK (UX: 4/5, Security: 3/5)
     │ Unlock   │  │ versturen   │
     └─────────┘  └──────┬──────┘
                         │ Fallback
                         ▼
                  ┌──────────────┐
                  │ Wachtwoord + │  ← LEGACY (UX: 3/5, Security: 4/5)
                  │ MFA (TOTP)   │     Alleen voor MVP-compatibiliteit
                  └──────────────┘
```

```
navigator.credentials.create()
```

```js
// Pseudo-code voor unified flow
async function handleAuthAttempt(identifier) {
  const user = await checkUserExists(identifier); // Email/phone check
  
  if (user.exists) {
    // SIGN-IN flow
    if (user.hasPasskey) {
      return initiateWebAuthn(user.id);
    } else {
      return showPasswordForm(identifier);
    }
  } else {
    // SIGN-UP flow
    return initiateRegistration(identifier, {
      suggestPasskey: true,
      progressiveProfile: true // Alleen essentials vragen
    });
  }
}
```

### UX Implementatie
**Eén knop voor beide flows:**
```
┌─────────────────────────────────────┐
│  📧 E-mailadres                     │
│  ┌───────────────────────────────┐ │
│  │ user@example.com              │ │
│  └───────────────────────────────┘ │
│                                     │
│  [ Ga verder ]  ← Detecteert auto  │
│                    of signup/signin │
└─────────────────────────────────────┘
```

### Progressive Profiling (Sign-up)
**Fase 1 - Alleen essentials:**
- Email (identificatie)
- Passkey registratie (of wachtwoord als fallback)

**Fase 2 - Op natuurlijke momenten:**
- Gezinssamenstelling → Bij eerste gebruik budgetverdeling
- Inkomsten/lasten → Wanneer dashboard insight vraagt

**Voordeel:** Lagere signup-friction, hogere conversie

---

## 4. Privacy Governance: Geconsolideerd Framework

### Compliance Matrix (Alle Bronnen)

| **Framework** | **Document 1** | **Document 2** | **Document 3** | **Implementatie Status** |
|---------------|---------------|---------------|---------------|------------------------|
| **GDPR/AVG** | ✅ Genoemd | ✅ Kern-principe | ✅ Impliciet | 🟢 Basis compliant |
| **ISO 27001** | ✅ Expliciet | ❌ | ❌ | 🟡 Nog te implementeren |
| **ISO 27701:2025** | ✅ Update genoemd | ✅ Privacy Management | ✅ Versie 2025 | 🟢 Target framework |
| **NIST Privacy Framework** | ✅ V1.1 | ✅ Risicogebaseerd | ✅ Protect/Govern | 🟢 Aligned |
| **OWASP ASVS** | ✅ Secure coding | ✅ Auth richtlijnen | ❌ | 🟡 Toepassen in code review |
| **ENISA Guidelines** | ✅ Data Protection Engineering | ❌ | ❌ | 🟡 Referentie voor PETs |

### DPIA Trigger Points (Nieuw uit analyse)
Een **Data Protection Impact Assessment** is verplicht bij:
1. **Introductie analytics** voor armoedeonderzoek (Document 1 & 3)
2. **Data-aggregatie** voor trendanalyse (Document 2)
3. **Nieuwe datavelden** buiten huidige minimale set

**Aanbeveling:** Plan DPIA **vóór** implementatie van Fase 4 (Research Architecture)

---

## 5. Zero-Knowledge Architectuur: Technische Diepduik

### Huidige Status vs Target State

**Huidige implementatie (uit Document 3):**
- ✅ Geen bankkoppeling
- ✅ Lokale transactie-invoer
- ⚠️ Encryptie-status onduidelijk

**Target architectuur (uit alle documenten):**
```
┌─────────────────────────────────────────────┐
│          USER DEVICE (Client-side)          │
│  ┌───────────────────────────────────────┐  │
│  │ 1. User Data (plaintext)              │  │
│  │    - Transacties, budget, gezinsdata  │  │
│  └──────────────┬────────────────────────┘  │
│                 │ Encrypted with             │
│                 ▼ Device Key (biometric lock)│
│  ┌───────────────────────────────────────┐  │
│  │ 2. Encrypted Blob (AES-256-GCM)      │  │
│  └──────────────┬────────────────────────┘  │
└─────────────────┼──────────────────────────┘
                  │ Stored on
                  ▼
┌─────────────────────────────────────────────┐
│          SERVER (Backend)                   │
│  ┌───────────────────────────────────────┐  │
│  │ 3. Encrypted Data (server kan niet    │  │
│  │    decrypten zonder device key)       │  │
│  └───────────────────────────────────────┘  │
│  ┌───────────────────────────────────────┐  │
│  │ 4. Metadata (niet-gevoelig)           │  │
│  │    - User ID, created_at, sync_status │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

```js
// Pseudo-code voor unified flow
async function handleAuthAttempt(identifier) {
  const user = await checkUserExists(identifier); // Email/phone check
  
  if (user.exists) {
    // SIGN-IN flow
    if (user.hasPasskey) {
      return initiateWebAuthn(user.id);
    } else {
      return showPasswordForm(identifier);
    }
  } else {
    // SIGN-UP flow
    return initiateRegistration(identifier, {
      suggestPasskey: true,
      progressiveProfile: true // Alleen essentials vragen
    });
  }
}
```

### UX Implementatie
**Eén knop voor beide flows:**
```
┌─────────────────────────────────────┐
│  📧 E-mailadres                     │
│  ┌───────────────────────────────┐ │
│  │ user@example.com              │ │
│  └───────────────────────────────┘ │
│                                     │
│  [ Ga verder ]  ← Detecteert auto  │
│                    of signup/signin │
└─────────────────────────────────────┘
```

### Progressive Profiling (Sign-up)
**Fase 1 - Alleen essentials:**
- Email (identificatie)
- Passkey registratie (of wachtwoord als fallback)

**Fase 2 - Op natuurlijke momenten:**
- Gezinssamenstelling → Bij eerste gebruik budgetverdeling
- Inkomsten/lasten → Wanneer dashboard insight vraagt

**Voordeel:** Lagere signup-friction, hogere conversie

---

## 4. Privacy Governance: Geconsolideerd Framework

### Compliance Matrix (Alle Bronnen)

| **Framework** | **Document 1** | **Document 2** | **Document 3** | **Implementatie Status** |
|---------------|---------------|---------------|---------------|------------------------|
| **GDPR/AVG** | ✅ Genoemd | ✅ Kern-principe | ✅ Impliciet | 🟢 Basis compliant |
| **ISO 27001** | ✅ Expliciet | ❌ | ❌ | 🟡 Nog te implementeren |
| **ISO 27701:2025** | ✅ Update genoemd | ✅ Privacy Management | ✅ Versie 2025 | 🟢 Target framework |
| **NIST Privacy Framework** | ✅ V1.1 | ✅ Risicogebaseerd | ✅ Protect/Govern | 🟢 Aligned |
| **OWASP ASVS** | ✅ Secure coding | ✅ Auth richtlijnen | ❌ | 🟡 Toepassen in code review |
| **ENISA Guidelines** | ✅ Data Protection Engineering | ❌ | ❌ | 🟡 Referentie voor PETs |

### DPIA Trigger Points (Nieuw uit analyse)
Een **Data Protection Impact Assessment** is verplicht bij:
1. **Introductie analytics** voor armoedeonderzoek (Document 1 & 3)
2. **Data-aggregatie** voor trendanalyse (Document 2)
3. **Nieuwe datavelden** buiten huidige minimale set

**Aanbeveling:** Plan DPIA **vóór** implementatie van Fase 4 (Research Architecture)

---

## 5. Zero-Knowledge Architectuur: Technische Diepduik

### Huidige Status vs Target State

**Huidige implementatie (uit Document 3):**
- ✅ Geen bankkoppeling
- ✅ Lokale transactie-invoer
- ⚠️ Encryptie-status onduidelijk

**Target architectuur (uit alle documenten):**
```
┌─────────────────────────────────────────────┐
│          USER DEVICE (Client-side)          │
│  ┌───────────────────────────────────────┐  │
│  │ 1. User Data (plaintext)              │  │
│  │    - Transacties, budget, gezinsdata  │  │
│  └──────────────┬────────────────────────┘  │
│                 │ Encrypted with             │
│                 ▼ Device Key (biometric lock)│
│  ┌───────────────────────────────────────┐  │
│  │ 2. Encrypted Blob (AES-256-GCM)      │  │
│  └──────────────┬────────────────────────┘  │
└─────────────────┼──────────────────────────┘
                  │ Stored on
                  ▼
┌─────────────────────────────────────────────┐
│          SERVER (Backend)                   │
│  ┌───────────────────────────────────────┐  │
│  │ 3. Encrypted Data (server kan niet    │  │
│  │    decrypten zonder device key)       │  │
│  └───────────────────────────────────────┘  │
│  ┌───────────────────────────────────────┐  │
│  │ 4. Metadata (niet-gevoelig)           │  │
│  │    - User ID, created_at, sync_status │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

```
SubtleCrypto API
```

```
Jetpack Security
```

```
// Pseudo-code voor key derivation
const deviceKey = await deriveKeyFromBiometric({
  userID: user.id,
  biometricData: faceID_or_fingerprint,
  salt: stored_device_salt
});

const encryptedData = await encryptWithKey(userData, deviceKey);
```

```js
// Pseudo-code voor key derivation
const deviceKey = await deriveKeyFromBiometric({
  userID: user.id,
  biometricData: faceID_or_fingerprint,
  salt: stored_device_salt
});

const encryptedData = await encryptWithKey(userData, deviceKey);
```

```json
{
  "user_id": "uuid",
  "email_hash": "sha256(email)", // Voor duplicate check
  "created_at": "timestamp",
  "last_login": "timestamp"
}
```

```js
{
  "user_id": "uuid",
  "email_hash": "sha256(email)", // Voor duplicate check
  "created_at": "timestamp",
  "last_login": "timestamp"
}
```

```json
{
  "adults_count": 2,
  "children": [
    {"age_bracket": "0-5", "name_encrypted": "..."}, // Naam alleen lokaal opgeslagen
    {"age_bracket": "6-12", "name_encrypted": "..."}
  ],
  "income_sources": [
    {"type": "salary", "frequency": "monthly", "amount_encrypted": "..."}
  ]
}
```

```js
{
  "adults_count": 2,
  "children": [
    {"age_bracket": "0-5", "name_encrypted": "..."}, // Naam alleen lokaal opgeslagen
    {"age_bracket": "6-12", "name_encrypted": "..."}
  ],
  "income_sources": [
    {"type": "salary", "frequency": "monthly", "amount_encrypted": "..."}
  ]
}
```

```json
{
  "transaction_id": "uuid",
  "date": "2024-12-07",
  "category_id": "groceries", // Niet-gevoelig
  "amount_encrypted": "...",
  "notes_encrypted": "..." // Optioneel
}
```

```js
{
  "transaction_id": "uuid",
  "date": "2024-12-07",
  "category_id": "groceries", // Niet-gevoelig
  "amount_encrypted": "...",
  "notes_encrypted": "..." // Optioneel
}
```

```
@github/webauthn-json
```

```
diffprivlib
```

```json
{
       "user_id_hash": "sha256(...)",
       "action": "transaction_created",
       "timestamp": "2024-12-07T10:30:00Z",
       "ip_subnet": "192.168.1.0/24" // Laatste octet verwijderd
     }
```

```js
{
       "user_id_hash": "sha256(...)",
       "action": "transaction_created",
       "timestamp": "2024-12-07T10:30:00Z",
       "ip_subnet": "192.168.1.0/24" // Laatste octet verwijderd
     }
```

```
describe('Encryption', () => {
  test('Data onleesbaar zonder device key', async () => {
    const plaintext = { amount: 50, category: 'groceries' };
    const encrypted = await encrypt(plaintext, deviceKey);
    
    // Zonder key → moet failure geven
    await expect(decrypt(encrypted, wrongKey)).rejects.toThrow();
  });
  
  test('Passkey registratie genereert unieke credentials', async () => {
    const cred1 = await createPasskey(user1);
    const cred2 = await createPasskey(user1); // Tweede device
    
    expect(cred1.id).not.toBe(cred2.id);
  });
});
```

### Integration Tests (Flow)
1. **Unified Auth Flow:**
   - Nieuwe gebruiker → Sign-up → Passkey prompt → Success
   - Bestaande gebruiker → Email herkend → Passkey challenge → Login
   
2. **Recovery Flow:**
   - Device verloren → Magic link → Nieuwe passkey registratie
   
3. **Data Persistence:**
   - Transactie opslaan → Logout → Login op nieuw device → Data zichtbaar (maar encrypted in DB)

### Manual Security Tests (Pentesting)
- SQL injection pogingen op transactie-endpoints
- XSS via notitievelden
- CSRF op state-changing actions
- Session fixation attacks
- Brute force wachtwoord pogingen (rate limiting check)

### Compliance Audit Checklist
- [ ] Privacy policy bevat alle GDPR verplichte elementen
- [ ] Consent is opt-in, niet pre-checked
- [ ] Data export werkt binnen 30 dagen (GDPR art. 20)
- [ ] Account verwijdering werkt binnen 30 dagen (GDPR art. 17)
- [ ] Breach notification procedure gedocumenteerd (72u GDPR art. 33)
- [ ] DPIA uitgevoerd voor high-risk processing

---

## 11. Aanbevolen Tech Stack (Aanvulling op Documenten)

### Authentication
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Passkeys | `@simplewebauthn/browser` + `@simplewebauthn/server` | Best-in-class WebAuthn impl |
| Magic Links | `nodemailer` + custom JWT | Full control, geen vendor lock-in |
| MFA (TOTP) | `otplib` | Open standard, offline-capable |

### Encryption
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Web | `SubtleCrypto API` (native) | Zero dependencies, browser-native |
| Mobile iOS | `CryptoKit` + Secure Enclave | Hardware-backed security |
| Mobile Android | `Jetpack Security` | Google-maintained, best practices |

### Privacy-Enhancing Technologies (Fase 4)
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Differential Privacy | `diffprivlib` (Python) | IBM-backed, production-ready |
| Secure Aggregation | `TensorFlow Federated` | Proven in production (Google) |

### Infrastructure
| **Component** | **Service** | **Privacy Rationale** |
|--------------|-----------|---------------------|
| Hosting | **Hetzner** of **OVH** (EU) | GDPR-compliant, EU data residency |
| Database | **PostgreSQL** + `pgcrypto` | Open-source, encryption-at-rest native |
| Email | **Postmark** of **Mailgun EU** | Transactional focus, GDPR-compliant |
| Monitoring | **Plausible Analytics** | Privacy-friendly alternative to Google Analytics |

**Anti-pattern:** Vermijd AWS US-regio's of Cloudflare Analytics (data doorgifte VS)

---

## 12. Definitieve Aanbevelingen (Prioriteiten)

### 🔥 Kritiek (Start vandaag)
1. **Audit huidige encryptie status** → Indien plaintext, urgent fixen
2. **Implementeer rate limiting** op auth endpoints (prevent brute force)
3. **Token expiry check** → Max 1 uur voor access tokens

### ⚡ Hoog (Volgende sprint)
4. **Passkey MVP implementatie** (WebAuthn basic flow)
5. **Privacy policy opstellen** (GDPR-template gebruiken)
6. **Magic link recovery** (fallback voor passkeys)

### 📊 Medium (Q1 2025)
7. **Unified sign-up/sign-in flow** (zie sectie 3)
8. **DPIA template** en eerste uitvoering
9. **External security audit** (budget: €5-15k voor SME pentesting)

### 🔮 Strategisch (Q2-Q4 2025)
10. **ISO 27701 certificering** voorbereiden (indien B2B/funding relevant)
11. **Differential Privacy analytics** (alleen voor onderzoeksdoeleinde)
12. **Multi-device sync** met end-to-end encryptie

---

## 13. Risico Matrix

| **Risico** | **Impact** | **Kans** | **Mitigatie** | **Owner** |
|-----------|-----------|---------|--------------|----------|
| Data breach door weak encryption | 🔴 Zeer hoog | 🟡 Middel | Client-side encryption implementeren (Fase 2) | CTO |
| Passkey adoption te laag | 🟡 Middel | 🟢 Laag | Magic link als fallback + educatie in onboarding | Product |
| GDPR non-compliance bij launch | 🔴 Hoog | 🟡 Middel | Privacy policy + DPIA vóór launch | Legal |
| Social login verzoek van stakeholders | 🟡 Middel | 🟢 Laag | Data-driven argument voorbereiden (zie sectie 8) | Product |
| Key recovery failure (user verliest device) | 🟠 Hoog | 🟡 Middel | Multi-recovery opties: magic link + recovery codes | DevOps |

---

## 14. Slot: Van Strategie naar Executie

### ✅ Wat is Crystal Clear
- **Passkeys = primaire auth** (unaniem in alle docs)
- **Privacy-First = non-negotiable** (strategische kern)
- **Geen social login** (past niet bij branding)
- **Compliance frameworks** (ISO 27701 + NIST als fundering)

### ⚠️ Wat Onmiddellijke Aandacht Vereist
1. Encryptie-status huidige data → **Audit this week**
2. Rate limiting auth endpoints → **Implement ASAP**
3. Privacy policy definitieve versie → **Legal review Q1 2025**

### 🚀 Volgende Concrete Stappen

**Deze week:**
- [ ] Tech lead voert encryptie-audit uit
- [ ] Product owner prioriteert Fase 2 backlog items
- [ ] Founder beslist: certificering wel/niet (ISO 27701)

**Volgende sprint (2 weken):**
- [ ] Passkey proof-of-concept (1 developer, 40u)
- [ ] Privacy policy eerste draft (Legal consult 4u)
- [ ] Security audit offerte aanvragen (3 aanbieders)

**Q1 2025 Milestone:**
- [ ] Passkeys live in productie
- [ ] GDPR-compliant privacy stack
- [ ] Externe security audit afgerond
- [ ] Klaar voor limited public beta

---

## 📎 Bijlagen

### A. Referentie Links
- **WebAuthn Demo:** https://webauthn.io
- **GDPR Checklist:** https://gdpr.eu/checklist/
- **NIST Privacy Framework:** https://www.nist.gov/privacy-framework
- **OWASP ASVS:** https://owasp.org/www-project-application-security-verification-standard/

### B. Template: DPIA Kickoff Vragen
1. Welke nieuwe data verzamelen we?
2. Voor welk expliciet doel?
3. Kunnen we dit doel bereiken met minder data?
4. Hoe lang bewaren we dit?
5. Wie heeft toegang (intern/extern)?
6. Wat zijn de risico's voor betrokkenen?
7. Welke technische maatregelen nemen we?
8. Is er een Data Processing Agreement (DPA) nodig?

### C. Voorbeeld Recovery Code UI
```
╔════════════════════════════════════════╗
║  🔐 Bewaar deze codes op veilige plek  ║
║                                        ║
║  ABCD-EFGH-IJKL-MNOP                  ║
║  QRST-UVWX-YZAB-CDEF                  ║
║  GHIJ-KLMN-OPQR-STUV                  ║
║                                        ║
║  ✅ Gedownload                        ║
║  📧 Per email                         ║
║  🖨️ Print                             ║
╚════════════════════════════════════════╝
```

```js
describe('Encryption', () => {
  test('Data onleesbaar zonder device key', async () => {
    const plaintext = { amount: 50, category: 'groceries' };
    const encrypted = await encrypt(plaintext, deviceKey);
    
    // Zonder key → moet failure geven
    await expect(decrypt(encrypted, wrongKey)).rejects.toThrow();
  });
  
  test('Passkey registratie genereert unieke credentials', async () => {
    const cred1 = await createPasskey(user1);
    const cred2 = await createPasskey(user1); // Tweede device
    
    expect(cred1.id).not.toBe(cred2.id);
  });
});
```

### Integration Tests (Flow)
1. **Unified Auth Flow:**
   - Nieuwe gebruiker → Sign-up → Passkey prompt → Success
   - Bestaande gebruiker → Email herkend → Passkey challenge → Login
   
2. **Recovery Flow:**
   - Device verloren → Magic link → Nieuwe passkey registratie
   
3. **Data Persistence:**
   - Transactie opslaan → Logout → Login op nieuw device → Data zichtbaar (maar encrypted in DB)

### Manual Security Tests (Pentesting)
- SQL injection pogingen op transactie-endpoints
- XSS via notitievelden
- CSRF op state-changing actions
- Session fixation attacks
- Brute force wachtwoord pogingen (rate limiting check)

### Compliance Audit Checklist
- [ ] Privacy policy bevat alle GDPR verplichte elementen
- [ ] Consent is opt-in, niet pre-checked
- [ ] Data export werkt binnen 30 dagen (GDPR art. 20)
- [ ] Account verwijdering werkt binnen 30 dagen (GDPR art. 17)
- [ ] Breach notification procedure gedocumenteerd (72u GDPR art. 33)
- [ ] DPIA uitgevoerd voor high-risk processing

---

## 11. Aanbevolen Tech Stack (Aanvulling op Documenten)

### Authentication
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Passkeys | `@simplewebauthn/browser` + `@simplewebauthn/server` | Best-in-class WebAuthn impl |
| Magic Links | `nodemailer` + custom JWT | Full control, geen vendor lock-in |
| MFA (TOTP) | `otplib` | Open standard, offline-capable |

### Encryption
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Web | `SubtleCrypto API` (native) | Zero dependencies, browser-native |
| Mobile iOS | `CryptoKit` + Secure Enclave | Hardware-backed security |
| Mobile Android | `Jetpack Security` | Google-maintained, best practices |

### Privacy-Enhancing Technologies (Fase 4)
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Differential Privacy | `diffprivlib` (Python) | IBM-backed, production-ready |
| Secure Aggregation | `TensorFlow Federated` | Proven in production (Google) |

### Infrastructure
| **Component** | **Service** | **Privacy Rationale** |
|--------------|-----------|---------------------|
| Hosting | **Hetzner** of **OVH** (EU) | GDPR-compliant, EU data residency |
| Database | **PostgreSQL** + `pgcrypto` | Open-source, encryption-at-rest native |
| Email | **Postmark** of **Mailgun EU** | Transactional focus, GDPR-compliant |
| Monitoring | **Plausible Analytics** | Privacy-friendly alternative to Google Analytics |

**Anti-pattern:** Vermijd AWS US-regio's of Cloudflare Analytics (data doorgifte VS)

---

## 12. Definitieve Aanbevelingen (Prioriteiten)

### 🔥 Kritiek (Start vandaag)
1. **Audit huidige encryptie status** → Indien plaintext, urgent fixen
2. **Implementeer rate limiting** op auth endpoints (prevent brute force)
3. **Token expiry check** → Max 1 uur voor access tokens

### ⚡ Hoog (Volgende sprint)
4. **Passkey MVP implementatie** (WebAuthn basic flow)
5. **Privacy policy opstellen** (GDPR-template gebruiken)
6. **Magic link recovery** (fallback voor passkeys)

### 📊 Medium (Q1 2025)
7. **Unified sign-up/sign-in flow** (zie sectie 3)
8. **DPIA template** en eerste uitvoering
9. **External security audit** (budget: €5-15k voor SME pentesting)

### 🔮 Strategisch (Q2-Q4 2025)
10. **ISO 27701 certificering** voorbereiden (indien B2B/funding relevant)
11. **Differential Privacy analytics** (alleen voor onderzoeksdoeleinde)
12. **Multi-device sync** met end-to-end encryptie

---

## 13. Risico Matrix

| **Risico** | **Impact** | **Kans** | **Mitigatie** | **Owner** |
|-----------|-----------|---------|--------------|----------|
| Data breach door weak encryption | 🔴 Zeer hoog | 🟡 Middel | Client-side encryption implementeren (Fase 2) | CTO |
| Passkey adoption te laag | 🟡 Middel | 🟢 Laag | Magic link als fallback + educatie in onboarding | Product |
| GDPR non-compliance bij launch | 🔴 Hoog | 🟡 Middel | Privacy policy + DPIA vóór launch | Legal |
| Social login verzoek van stakeholders | 🟡 Middel | 🟢 Laag | Data-driven argument voorbereiden (zie sectie 8) | Product |
| Key recovery failure (user verliest device) | 🟠 Hoog | 🟡 Middel | Multi-recovery opties: magic link + recovery codes | DevOps |

---

## 14. Slot: Van Strategie naar Executie

### ✅ Wat is Crystal Clear
- **Passkeys = primaire auth** (unaniem in alle docs)
- **Privacy-First = non-negotiable** (strategische kern)
- **Geen social login** (past niet bij branding)
- **Compliance frameworks** (ISO 27701 + NIST als fundering)

### ⚠️ Wat Onmiddellijke Aandacht Vereist
1. Encryptie-status huidige data → **Audit this week**
2. Rate limiting auth endpoints → **Implement ASAP**
3. Privacy policy definitieve versie → **Legal review Q1 2025**

### 🚀 Volgende Concrete Stappen

**Deze week:**
- [ ] Tech lead voert encryptie-audit uit
- [ ] Product owner prioriteert Fase 2 backlog items
- [ ] Founder beslist: certificering wel/niet (ISO 27701)

**Volgende sprint (2 weken):**
- [ ] Passkey proof-of-concept (1 developer, 40u)
- [ ] Privacy policy eerste draft (Legal consult 4u)
- [ ] Security audit offerte aanvragen (3 aanbieders)

**Q1 2025 Milestone:**
- [ ] Passkeys live in productie
- [ ] GDPR-compliant privacy stack
- [ ] Externe security audit afgerond
- [ ] Klaar voor limited public beta

---

## 📎 Bijlagen

### A. Referentie Links
- **WebAuthn Demo:** https://webauthn.io
- **GDPR Checklist:** https://gdpr.eu/checklist/
- **NIST Privacy Framework:** https://www.nist.gov/privacy-framework
- **OWASP ASVS:** https://owasp.org/www-project-application-security-verification-standard/

### B. Template: DPIA Kickoff Vragen
1. Welke nieuwe data verzamelen we?
2. Voor welk expliciet doel?
3. Kunnen we dit doel bereiken met minder data?
4. Hoe lang bewaren we dit?
5. Wie heeft toegang (intern/extern)?
6. Wat zijn de risico's voor betrokkenen?
7. Welke technische maatregelen nemen we?
8. Is er een Data Processing Agreement (DPA) nodig?

### C. Voorbeeld Recovery Code UI
```
╔════════════════════════════════════════╗
║  🔐 Bewaar deze codes op veilige plek  ║
║                                        ║
║  ABCD-EFGH-IJKL-MNOP                  ║
║  QRST-UVWX-YZAB-CDEF                  ║
║  GHIJ-KLMN-OPQR-STUV                  ║
║                                        ║
║  ✅ Gedownload                        ║
║  📧 Per email                         ║
║  🖨️ Print                             ║
╚════════════════════════════════════════╝
```

```sql
budget-app/
├── android/                 # Native Android code
├── ios/                     # Native iOS code
├── src/
│   ├── app/                 # Screen routes (voor React Navigation of Expo Router)
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   └── passkey-setup.tsx
│   │   ├── onboarding/      # Setup flow (C1, C4, C7, C10)
│   │   │   ├── household.tsx      # C1: Gezinssamenstelling
│   │   │   ├── details.tsx        # C4: Details
│   │   │   ├── income.tsx         # C7: Vaste inkomsten
│   │   │   └── expenses.tsx       # C10: Vaste lasten
│   │   ├── dashboard/
│   │   │   └── index.tsx
│   │   ├── transactions/
│   │   │   ├── daily-input.tsx    # "Noot van Manasse" logica
│   │   │   └── overview.tsx       # Edit/Delete functionaliteit
│   │   └── settings/
│   │       ├── privacy.tsx
│   │       └── profile.tsx
│   │
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Base components (buttons, inputs, cards)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── SaveConfirmation.tsx  # Voor "Opslaan" bevestiging
│   │   ├── forms/
│   │   │   ├── TransactionForm.tsx
│   │   │   └── HouseholdForm.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── NavigationGuard.tsx   # Voor unsaved changes warning
│   │
│   ├── features/            # Feature-specific logic & components
│   │   ├── auth/
│   │   │   ├── hooks/
│   │   │   │   ├── usePasskey.ts
│   │   │   │   ├── useMagicLink.ts
│   │   │   │   └── useBiometric.ts
│   │   │   ├── components/
│   │   │   │   └── PasskeyPrompt.tsx
│   │   │   └── services/
│   │   │       ├── webauthn.service.ts
│   │   │       └── auth.service.ts
│   │   │
│   │   ├── encryption/       # 🔐 Zero-Knowledge crypto
│   │   │   ├── crypto.service.ts      # AES-256-GCM
│   │   │   ├── keychain.service.ts    # iOS/Android keychain
│   │   │   └── types.ts
│   │   │
│   │   ├── transactions/
│   │   │   ├── hooks/
│   │   │   │   ├── useTransactions.ts
│   │   │   │   └── useCategories.ts
│   │   │   ├── components/
│   │   │   │   └── CategoryChips.tsx  # Conditionele rendering (kinderen)
│   │   │   └── services/
│   │   │       └── transaction.service.ts
│   │   │
│   │   └── budget/
│   │       ├── hooks/
│   │       │   └── useBudgetCalculation.ts
│   │       └── components/
│   │           └── BudgetOverview.tsx
│   │
│   ├── lib/                 # Core utilities (shared across features)
│   │   ├── api/
│   │   │   ├── client.ts           # Axios/Fetch wrapper
│   │   │   ├── endpoints.ts
│   │   │   └── interceptors.ts
│   │   ├── storage/
│   │   │   ├── secure-storage.ts   # Encrypted storage wrapper
│   │   │   └── migrations.ts       # Data model versioning
│   │   ├── validation/
│   │   │   ├── schemas.ts          # Zod/Yup schemas
│   │   │   └── validators.ts
│   │   └── i18n/
│   │       ├── index.ts
│   │       └── translations/
│   │           ├── nl.json
│   │           └── en.json
│   │
│   ├── types/               # TypeScript interfaces
│   │   ├── user.types.ts
│   │   ├── transaction.types.ts
│   │   ├── household.types.ts
│   │   └── auth.types.ts
│   │
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── fonts.ts
│   │   ├── screens.ts       # Screen names voor navigation
│   │   └── config.ts        # App config (niet-gevoelig)
│   │
│   ├── hooks/               # Global custom hooks
│   │   ├── useAppState.ts
│   │   ├── useSecureNavigate.ts  # Navigation met unsaved check
│   │   └── useOfflineSync.ts
│   │
│   ├── store/               # State management (Redux/Zustand)
│   │   ├── slices/
│   │   │   ├── auth.slice.ts
│   │   │   ├── household.slice.ts
│   │   │   └── transactions.slice.ts
│   │   ├── store.ts
│   │   └── hooks.ts         # Typed hooks (useAppDispatch, useAppSelector)
│   │
│   ├── utils/
│   │   ├── date.utils.ts
│   │   ├── currency.utils.ts
│   │   ├── logger.ts        # Privacy-compliant logging (geen PII)
│   │   └── error-handler.ts
│   │
│   └── assets/
│       ├── fonts/
│       ├── images/
│       │   ├── icons/
│       │   └── illustrations/
│       └── animations/       # Lottie files
│
├── __tests__/               # Tests (mirrors src/ structure)
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example             # Template (NOOIT echte keys committen)
├── .gitignore
├── app.json                 # Expo config
├── package.json
├── tsconfig.json
└── README.md
```

```sql
budget-app/
├── android/                 # Native Android code
├── ios/                     # Native iOS code
├── src/
│   ├── app/                 # Screen routes (voor React Navigation of Expo Router)
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   └── passkey-setup.tsx
│   │   ├── onboarding/      # Setup flow (C1, C4, C7, C10)
│   │   │   ├── household.tsx      # C1: Gezinssamenstelling
│   │   │   ├── details.tsx        # C4: Details
│   │   │   ├── income.tsx         # C7: Vaste inkomsten
│   │   │   └── expenses.tsx       # C10: Vaste lasten
│   │   ├── dashboard/
│   │   │   └── index.tsx
│   │   ├── transactions/
│   │   │   ├── daily-input.tsx    # "Noot van Manasse" logica
│   │   │   └── overview.tsx       # Edit/Delete functionaliteit
│   │   └── settings/
│   │       ├── privacy.tsx
│   │       └── profile.tsx
│   │
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Base components (buttons, inputs, cards)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── SaveConfirmation.tsx  # Voor "Opslaan" bevestiging
│   │   ├── forms/
│   │   │   ├── TransactionForm.tsx
│   │   │   └── HouseholdForm.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── NavigationGuard.tsx   # Voor unsaved changes warning
│   │
│   ├── features/            # Feature-specific logic & components
│   │   ├── auth/
│   │   │   ├── hooks/
│   │   │   │   ├── usePasskey.ts
│   │   │   │   ├── useMagicLink.ts
│   │   │   │   └── useBiometric.ts
│   │   │   ├── components/
│   │   │   │   └── PasskeyPrompt.tsx
│   │   │   └── services/
│   │   │       ├── webauthn.service.ts
│   │   │       └── auth.service.ts
│   │   │
│   │   ├── encryption/       # 🔐 Zero-Knowledge crypto
│   │   │   ├── crypto.service.ts      # AES-256-GCM
│   │   │   ├── keychain.service.ts    # iOS/Android keychain
│   │   │   └── types.ts
│   │   │
│   │   ├── transactions/
│   │   │   ├── hooks/
│   │   │   │   ├── useTransactions.ts
│   │   │   │   └── useCategories.ts
│   │   │   ├── components/
│   │   │   │   └── CategoryChips.tsx  # Conditionele rendering (kinderen)
│   │   │   └── services/
│   │   │       └── transaction.service.ts
│   │   │
│   │   └── budget/
│   │       ├── hooks/
│   │       │   └── useBudgetCalculation.ts
│   │       └── components/
│   │           └── BudgetOverview.tsx
│   │
│   ├── lib/                 # Core utilities (shared across features)
│   │   ├── api/
│   │   │   ├── client.ts           # Axios/Fetch wrapper
│   │   │   ├── endpoints.ts
│   │   │   └── interceptors.ts
│   │   ├── storage/
│   │   │   ├── secure-storage.ts   # Encrypted storage wrapper
│   │   │   └── migrations.ts       # Data model versioning
│   │   ├── validation/
│   │   │   ├── schemas.ts          # Zod/Yup schemas
│   │   │   └── validators.ts
│   │   └── i18n/
│   │       ├── index.ts
│   │       └── translations/
│   │           ├── nl.json
│   │           └── en.json
│   │
│   ├── types/               # TypeScript interfaces
│   │   ├── user.types.ts
│   │   ├── transaction.types.ts
│   │   ├── household.types.ts
│   │   └── auth.types.ts
│   │
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── fonts.ts
│   │   ├── screens.ts       # Screen names voor navigation
│   │   └── config.ts        # App config (niet-gevoelig)
│   │
│   ├── hooks/               # Global custom hooks
│   │   ├── useAppState.ts
│   │   ├── useSecureNavigate.ts  # Navigation met unsaved check
│   │   └── useOfflineSync.ts
│   │
│   ├── store/               # State management (Redux/Zustand)
│   │   ├── slices/
│   │   │   ├── auth.slice.ts
│   │   │   ├── household.slice.ts
│   │   │   └── transactions.slice.ts
│   │   ├── store.ts
│   │   └── hooks.ts         # Typed hooks (useAppDispatch, useAppSelector)
│   │
│   ├── utils/
│   │   ├── date.utils.ts
│   │   ├── currency.utils.ts
│   │   ├── logger.ts        # Privacy-compliant logging (geen PII)
│   │   └── error-handler.ts
│   │
│   └── assets/
│       ├── fonts/
│       ├── images/
│       │   ├── icons/
│       │   └── illustrations/
│       └── animations/       # Lottie files
│
├── __tests__/               # Tests (mirrors src/ structure)
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example             # Template (NOOIT echte keys committen)
├── .gitignore
├── app.json                 # Expo config
├── package.json
├── tsconfig.json
└── README.md
```

```
features/encryption/
```

```
src/
├── features/encryption/          # 🔐 KRITIEK
│   ├── crypto.service.ts         # AES-256-GCM implementatie
│   ├── keychain.service.ts       # iOS/Android keychain
│   └── __tests__/
│       └── crypto.test.ts        # Unit tests voor encryptie
│
├── features/auth/
│   ├── services/
│   │   ├── webauthn.service.ts   # Passkey implementatie
│   │   ├── magic-link.service.ts
│   │   └── token.service.ts      # JWT handling (max 1u expiry)
│   └── __tests__/
│
└── lib/storage/
    ├── secure-storage.ts          # Encrypted AsyncStorage wrapper
    └── migrations.ts              # Voor schema updates zonder data loss
```

```
src/
├── features/encryption/          # 🔐 KRITIEK
│   ├── crypto.service.ts         # AES-256-GCM implementatie
│   ├── keychain.service.ts       # iOS/Android keychain
│   └── __tests__/
│       └── crypto.test.ts        # Unit tests voor encryptie
│
├── features/auth/
│   ├── services/
│   │   ├── webauthn.service.ts   # Passkey implementatie
│   │   ├── magic-link.service.ts
│   │   └── token.service.ts      # JWT handling (max 1u expiry)
│   └── __tests__/
│
└── lib/storage/
    ├── secure-storage.ts          # Encrypted AsyncStorage wrapper
    └── migrations.ts              # Voor schema updates zonder data loss
```

```
crypto.service.ts
```

```
webauthn.service.ts
```

```
.env.example
```

| - Storage: Encrypted in OS keychain (iCloud Keychain | Google Password Manager) |
| --- | --- |
| - Privacy voordeel: Geen centraal wachtwoord database | geen credential stuffing mogelijk |

- Flow: Email → Beveiligde token (JWT met 15min TTL) → Auto-login
- Use case:

| - Security: Rate limiting (max 3 requests/15min) | token single-use |
| --- | --- |
| - Privacy: Email-gebaseerd | geen third-party tracking |

- Recovery wanneer passkey-device verloren is
- Onboarding nieuwe devices
- Fallback voor oudere browsers

| Key | Value |
| --- | --- |
| Scope | Alleen voor MVP-lancering (brede compatibiliteit) |
| MFA methode | TOTP (bijv. Google Authenticator) > SMS OTP |
| Migratiestrategie | Actief promoten passkey-upgrade na eerste login |
| Sunset plan | Optioneel maken na 70% passkey adoption |

| Key | Value |
| --- | --- |
| Reden | Conflicteert met "Privacy-First" branding |
| Data leakage | Name, email, friend graph, analytics tracking |
| Alternatief | Passkeys bieden vergelijkbare UX zonder privacy-trade-off |

- Web:  (native browser)
- Mobile:

| Key | Value |
| --- | --- |
| iOS | CryptoKit + Secure Enclave |
| Android | + Keystore |
| iOS | CryptoKit + Secure Enclave |
| Android | + Keystore |

| Key | Value |
| --- | --- |
| iOS | CryptoKit + Secure Enclave |
| Android | + Keystore |

| Key | Value |
| --- | --- |
| Probleem | Gebruiker verliest device met enige sleutel |
| Oplossing | Encrypted backup key in cloud, ontgrendeld via: |

| Recovery codes (gegenereerd bij setup | offline opgeslagen door user) |
| --- | --- |
| - Recovery codes (gegenereerd bij setup | offline opgeslagen door user) |

- Secondary device met passkey
- Recovery codes (gegenereerd bij setup, offline opgeslagen door user)

| - Pseudonimisatie: User ID is random UUID | niet afleidbaar |
| --- | --- |
| - Minimalisatie: Geen onnodige metadata (bijv. IP-logs | device fingerprints) |

- Setup flow (C1→C4→C7→C10)
- Dagelijkse transactie-invoer
- "Noot van Manasse" logica (save confirmation)
- Dashboard basis

- Implementeer Passkey registratie

WebAuthn library:  (web) of native APIs
Prompt tijdens onboarding: "Veiliger inloggen met gezichtsherkenning"
Fallback naar wachtwoord blijft beschikbaar
- WebAuthn library:  (web) of native APIs
- Prompt tijdens onboarding: "Veiliger inloggen met gezichtsherkenning"
- Fallback naar wachtwoord blijft beschikbaar
- Magic Link recovery

| Email service: Transactional email provider (bijv. SendGrid | Postmark) |
| --- | --- |
| - Email service: Transactional email provider (bijv. SendGrid | Postmark) |

- WebAuthn library:  (web) of native APIs
- Prompt tijdens onboarding: "Veiliger inloggen met gezichtsherkenning"
- Fallback naar wachtwoord blijft beschikbaar

| Key | Value |
| --- | --- |
| Email service | Transactional email provider (bijv. SendGrid, Postmark) |
| Token TTL | 15 minuten |
| Rate limiting | 3 pogingen per 15 min per IP |

- Encrypt-at-rest voor transacties en budgetdata
- Key derivation via biometric unlock (iOS/Android)
- Web fallback: PBKDF2 van master password

- Backend security audit

Penetration test door externe partij
OWASP Top 10 compliance check
API rate limiting en DDoS protectie
- Penetration test door externe partij
- OWASP Top 10 compliance check
- API rate limiting en DDoS protectie

- Penetration test door externe partij
- OWASP Top 10 compliance check
- API rate limiting en DDoS protectie

- Vraag gezinsdetails pas bij eerste budgetberekening
- "Waarom vragen we dit?" tooltips bij elk veld

- "Mijn gegevens" pagina met:

Data export (JSON download)
Account verwijdering (met bevestiging)
Toestemming intrekken voor analytics
- Data export (JSON download)
- Account verwijdering (met bevestiging)
- Toestemming intrekken voor analytics

- Data export (JSON download)
- Account verwijdering (met bevestiging)
- Toestemming intrekken voor analytics

- Differential Privacy implementatie

Library:  (Python) voor backend analytics
ε-budget: 1.0 voor aggregate queries
Geen individuele data-export naar onderzoekers
- Library:  (Python) voor backend analytics
- ε-budget: 1.0 voor aggregate queries
- Geen individuele data-export naar onderzoekers
- Federated Analytics (optioneel)

| Alleen model updates naar server | geen raw data |
| --- | --- |
| - Alleen model updates naar server | geen raw data |

Alleen geaggregeerde trends zichtbaar
Minimum threshold: 100 users per cohort
- Alleen geaggregeerde trends zichtbaar
- Minimum threshold: 100 users per cohort

| Key | Value |
| --- | --- |
| Library | (Python) voor backend analytics |
| ε | budget: 1.0 voor aggregate queries |
| Geen individuele data | export naar onderzoekers |

- On-device model training (TensorFlow Lite)
- Alleen model updates naar server, geen raw data

- Alleen geaggregeerde trends zichtbaar
- Minimum threshold: 100 users per cohort

| - Data leakage (email | naam | friend graph naar Meta/Google) |
| --- | --- | --- |
| - Complexiteit: OAuth flows | token refresh | revocation handling |

- Implementeer met opt-in consent (niet pre-checked)
- Minimaliseer scopes (alleen email, geen profile of friends)
- Transparante UI: "Dit deelt jouw email met [Provider]"

| - Document 1: "Lokale encryptiesleutels" → suggestie | geen confirmatie |
| --- | --- |
| - Document 2: "Zero-Knowledge Architectuur" → doel | geen implementatie |

| Key | Value |
| --- | --- |
| Audit huidige state | Controleer of transacties in database plaintext zijn |
| Indien plaintext | Urgent implementeren in Fase 2 (zie sectie 5) |
| Indien encrypted | Documenteer key management strategie |

| Key | Value |
| --- | --- |
| Voeg ISO 27018 toe (cloud privacy, relevant als je cloud | infra gebruikt) |
| Volg ENISA Cloud Security Guidelines voor hosting | keuzes |

- Auth Token Security

| HTTPOnly | Secure | SameSite=Strict cookies |
| --- | --- | --- |
| - HTTPOnly | Secure | SameSite=Strict cookies |

| Sanitize user input (transactie notities | gezinsnamen) |
| --- | --- |
| - Sanitize user input (transactie notities | gezinsnamen) |

| Audit logs: Wie | wat | wanneer → maar geen bedragen of content |
| --- | --- | --- |
| - Audit logs: Wie | wat | wanneer → maar geen bedragen of content |

- Huidige JWT expiry? → Check en zet op max 1 uur
- Implementeer refresh tokens (30 dagen) met rotation
- HTTPOnly, Secure, SameSite=Strict cookies

- Sanitize user input (transactie notities, gezinsnamen)
- Prevent XSS: Library DOMPurify voor web
- Rate limiting op alle POST endpoints

| Key | Value |
| --- | --- |
| Audit logs | Wie, wat, wanneer → maar geen bedragen of content |
| Voorbeeld GDPR | compliant log: |

- Dependency Audit

Run npm audit / pip-audit
Update kritieke vulnerabilities
Pin versies voor reproducible builds
- Run npm audit / pip-audit
- Update kritieke vulnerabilities
- Pin versies voor reproducible builds

- Run npm audit / pip-audit
- Update kritieke vulnerabilities
- Pin versies voor reproducible builds

- Passkey Implementatie (zie Fase 2)
- Encrypted Backup Systeem
- DPIA Template (reusable voor toekomstige features)

- Differential Privacy Analytics
- Formal Security Audit door third-party
- ISO 27701 Certificering (optioneel, maar sterk voor B2B/funding)

- ✅ Sneller te implementeren (minder boilerplate)
- ✅ Makkelijker te navigeren voor kleine teams
- ✅ Privacy-kritische code is geïsoleerd ()
- ✅ Past bij "Noot van Manasse" logica (eenvoudige component structuur)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dmedium.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddev.to&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddev.to&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Drobinwieruch.de&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dobytes.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dreboot.studio&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddev.to&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgithub.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dwaldo.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dreactjs.org&w=32&q=75)

### 3.docx

### 2.docx

### 1.docx

# 🔐 Geïntegreerde Privacy & Identity Architectuur

## Executive Summary

## 1. Strategische Positionering: Consistentie Analyse

### Kernbevindingen uit alle documenten

### 🎯 Conclusie

## 2. Authenticatie Architectuur: Definitieve Hiërarchie

### Geconsolideerde Beslisboom

### Technische Specificaties per Methode

#### 1️⃣ Passkeys / WebAuthn (FIDO2)

#### 2️⃣ Magic Links

#### 3️⃣ Wachtwoord + MFA

#### 4️⃣ Social Login: NIET IMPLEMENTEREN

## 3. Sign-up vs Sign-in: Unified Identity Flow

### Probleem in Huidige Implementatie

### 🆕 Aanbevolen Oplossing: Progressive Identity Discovery

### Implementatie Aanbevelingen

## 6. Data Model: Privacy-Conscious Design

### Minimale Dataset (MVP)

### Privacy-by-Design Principes Toegepast:

## 7. Roadmap: Geïntegreerde Fasering

### ✅ Fase 1: MVP - Foundation (Voltooid volgens Doc 3)

### 🔄 Fase 2: Security Hardening (Huidige focus)

### 🚀 Fase 3: UX Refinement & Governance (Q2 2025)

### 🔬 Fase 4: Research-Ready Architecture (Q3-Q4 2025)

## 8. Kritieke Verschillen & Aanbevelingen

### 🔴 Conflict: Social Login Vermelden

### 🟡 Onduidelijkheid: Huidige Encryptie Status

### 🟢 Consistentie: Compliance Frameworks

## 9. Technische Debt & Quick Wins

### Snelle Verbeteringen (< 1 week werk)

### Middelgroot (1-2 maanden)

### Langetermijn (Fase 4)

## 10. Testplan: Privacy & Security Validation

### Unit Tests (Technisch)

## Optie A: Privacy-First App Structuur (Aanbevolen)

## Optie B: Feature-Based Structuur (Schaalbaar voor groter team)

## 🎯 Mijn Aanbeveling voor Jouw Situatie

### Start met Optie A, want:

### Privacy-Specifieke Folders (Critial!)

## 📋 Volgende Stappen

| Analyse | vergelijking en aanbevelingenShare227 linesdocx121 linesdocx82 linesdocxanalyseer vergelijk en combineer in 1 document met aanbevelingen7 dec 2025 |
| --- | --- |
| Definitieve Analyse | Vergelijking & Aanbevelingen |

Deze analyse consolideert drie documentatiebronnen tot één strategisch implementatieplan. Alle bronnen convergeren naar dezelfde kernwaarden: privacy-first architectuur, passkeys als authenticatiestandaard, en dataminimalisatie als fundament. Het project bevindt zich in transitie van Fase 2 naar Fase 3, met een compliance-score van 93% en een heldere roadmap naar productierijpheid.

Alle bronnen wijzen naar één coherente visie. Geen conflicterende aanbevelingen gedetecteerd.

Documenten suggereren separate flows, maar moderne best practice is één unified experience.

javascript

Library-keuzes:

Key Management:
javascript
Recovery scenario:

| Household Data (gevoelig | encrypted): |
| --- | --- |
| Transacties (gevoelig | encrypted): |

Compliance status: 93% ✅

Prioriteit 1 - Auth Upgrade:

| Key | Value |
| --- | --- |
| Prioriteit 2 | Data Protection: |
| 3. Client | side encryptie implementeren |

| Key | Value |
| --- | --- |
| Deliverable | Veilige authenticatie en encrypted data storage |
| Tijdslijn | 2-3 maanden |

Prioriteit 1 - Progressive Profiling:
5. Unified sign-up/sign-in flow (zie sectie 3)
6. Contextual data collection

Prioriteit 2 - Compliance Formalisering:
7. DPIA documentatie opstellen
8. Privacy policy generator (gebruiksvriendelijke versie)
9. Consent management dashboard

| Key | Value |
| --- | --- |
| Prioriteit 3 | Personalisatie (uit Doc 3): |
| 10. Conditionele rendering van kinderen | chips |
| 11. Transactie | overzicht met Edit/Delete |
| Deliverable | Production-ready app met volledige GDPR compliance |
| Tijdslijn | 3 maanden |

Alleen als onderzoeksfunctie gewenst:

| Key | Value |
| --- | --- |
| Deliverable | Onderzoek mogelijk zonder privacy-compromis |
| Tijdslijn | 6 maanden (optioneel) |

Definitief besluit: NIET implementeren, zelfs niet optioneel. Redenen:

Uitzondering: Als marktonderzoek expliciet aantoont dat dit dealbreaker is voor doelgroep, dan:

Vraag: Is data momenteel encrypted-at-rest?
Uit documenten:

Aanbeveling:

Alle documenten noemen ISO 27701 en NIST Privacy Framework → Sterk fundament.
Aanbeveling:

json

javascript

| Key | Value |
| --- | --- |
| Document versie | 1.0 |
| Datum | 7 december 2024 |
| Status | Definitief implementatieplan |
| Volgende review | Q1 2025 na Fase 2 voltooiingwat is de mappen structuur van de app?8 dec 2025React Native app folder structure best practices 202410 resultsReact Native folder structure \| Mediummedium.comUltimate Folder Structure For Your React Native Project - DEV Communitydev.toHow to Organize Your Components in React Native: Folder Structure and Project Organization - DEV Communitydev.toReact Folder Structure in 5 Steps [2025]robinwieruch.deProject Structure \| React Native / Expo Starterobytes.com4 folder structures to organize your React & React Native project - rebootreboot.studioThe Folder Structure of a React Native App - DEV Communitydev.toGitHub - sury4karmakar/ReactNative-ProjectStructure: 🔸 Best Folder Structure For Every React Native Project ... 🔸 In This Repo We Are Demonstrate How To Structure And Manage Your React Native Project ...github.comReact Native project structure: a best practices guidewaldo.comFile Structure – Reactreactjs.orgIk zie dat je vraagt naar de mappenstructuur van jouw app, maar die informatie staat niet in de documenten die je hebt gedeeld. De documenten bevatten strategische analyses over privacy, authenticatie en compliance, maar geen technische details over de huidige mappenstructuur. |
| Laten we dit aanpakken | ik geef je twee opties gebaseerd op moderne best practices voor een privacy-first budgetapp: |

Gebaseerd op jouw requirements (passkeys, encryptie, geen social login, dataminimalisatie):

Feature-Based App StructureCode # Feature-Based App Structuur (Alternatief)

```
budget-app/
├── src/
│   ├── modules/              # Zelfstandige feature modules
│   │   │
│   │   ├── auth/             # 🔐 Authenticatie module
│   │   │   ├── screens/
│   │   │   │   ├── LoginScr

Gebaseerd op de documentatie (93% compliance, Fase 2→3 transitie):

Ongeacht welke structuur je kiest, deze folders zijn non-negotiable:

Wil je dat ik:
A. De huidige status audit (controleren welke structuur je nu hebt)?
B. Een migratie-plan maken van huidige → Optie A?
C. Specifieke bestanden genereren (bijv. , )?
D. Een .gitignore en  maken met privacy best practices?
Kies A, B, C of D — of meerdere!Claude is AI and can make mistakes. Please double-check cited sources. Sonnet 4.5Claude is AI and can make mistakes. Please double-check cited sources.

---

**Claude:**

Analyse, vergelijking en aanbevelingenShare

---

**Claude:**

Share

---

**Claude:**

| Aspect | Document 1 | Document 2 | Document 3 | Status |
| --- | --- | --- | --- | --- |
| Privacy-First UVP | ✅ Expliciet benoemd | ✅ Centraal principe | ✅ Gedefinieerd als kern-UVP | Volledig aligned |
| Geen bankkoppeling | ✅ Risico-eliminatie | ⚠️ Impliciet | ✅ Expliciet onderdeel UVP | Consistent |
| Passkeys als primair | ✅ Gouden standaard | ✅ Hoogste score (5/5) | ✅ Geselecteerd als primair | Unaniem |
| Social Login vermijden | ✅ Bewust vermeden | ⚠️ Hoge privacy-impact | ❌ Niet genoemd | Consensus bereikt |
| Compliance frameworks | ✅ GDPR, ISO 27001/27701, NIST | ✅ GDPR, ISO 27701, NIST, OWASP | ✅ ISO 27701:2025, NIST 1.1 | Volledig gedekt |

| Document | Standpunt | Aanbeveling |
| --- | --- | --- |
| Document 1 | ❌ Bewust vermijden | ✅ Volgen |
| Document 2 | ⚠️ Hoge privacy-impact, maar "optioneel" suggereert beschikbaarheid | ❌ Te risicovol |
| Document 3 | 🤷 Niet genoemd | - |

```
┌─────────────────────────────────────┐
│   User wil inloggen/registreren     │
└──────────────┬──────────────────────┘
               │
        ┌──────▼──────┐
        │ Passkey      │  ← PRIMAIR (UX: 5/5, Security: 5/5, Privacy: Laag)
        │ beschikbaar? │
        └──┬────────┬──┘
           │ Ja     │ Nee
           │        │
           ▼        ▼
     ┌─────────┐  ┌─────────────┐
     │ Biometric│  │ Magic Link  │  ← FALLBACK (UX: 4/5, Security: 3/5)
     │ Unlock   │  │ versturen   │
     └─────────┘  └──────┬──────┘
                         │ Fallback
                         ▼
                  ┌──────────────┐
                  │ Wachtwoord + │  ← LEGACY (UX: 3/5, Security: 4/5)
                  │ MFA (TOTP)   │     Alleen voor MVP-compatibiliteit
                  └──────────────┘
```

```
┌─────────────────────────────────────┐
│   User wil inloggen/registreren     │
└──────────────┬──────────────────────┘
               │
        ┌──────▼──────┐
        │ Passkey      │  ← PRIMAIR (UX: 5/5, Security: 5/5, Privacy: Laag)
        │ beschikbaar? │
        └──┬────────┬──┘
           │ Ja     │ Nee
           │        │
           ▼        ▼
     ┌─────────┐  ┌─────────────┐
     │ Biometric│  │ Magic Link  │  ← FALLBACK (UX: 4/5, Security: 3/5)
     │ Unlock   │  │ versturen   │
     └─────────┘  └──────┬──────┘
                         │ Fallback
                         ▼
                  ┌──────────────┐
                  │ Wachtwoord + │  ← LEGACY (UX: 3/5, Security: 4/5)
                  │ MFA (TOTP)   │     Alleen voor MVP-compatibiliteit
                  └──────────────┘
```

```
navigator.credentials.create()
```

```js
// Pseudo-code voor unified flow
async function handleAuthAttempt(identifier) {
  const user = await checkUserExists(identifier); // Email/phone check
  
  if (user.exists) {
    // SIGN-IN flow
    if (user.hasPasskey) {
      return initiateWebAuthn(user.id);
    } else {
      return showPasswordForm(identifier);
    }
  } else {
    // SIGN-UP flow
    return initiateRegistration(identifier, {
      suggestPasskey: true,
      progressiveProfile: true // Alleen essentials vragen
    });
  }
}
```

### UX Implementatie
**Eén knop voor beide flows:**
```
┌─────────────────────────────────────┐
│  📧 E-mailadres                     │
│  ┌───────────────────────────────┐ │
│  │ user@example.com              │ │
│  └───────────────────────────────┘ │
│                                     │
│  [ Ga verder ]  ← Detecteert auto  │
│                    of signup/signin │
└─────────────────────────────────────┘
```

### Progressive Profiling (Sign-up)
**Fase 1 - Alleen essentials:**
- Email (identificatie)
- Passkey registratie (of wachtwoord als fallback)

**Fase 2 - Op natuurlijke momenten:**
- Gezinssamenstelling → Bij eerste gebruik budgetverdeling
- Inkomsten/lasten → Wanneer dashboard insight vraagt

**Voordeel:** Lagere signup-friction, hogere conversie

---

## 4. Privacy Governance: Geconsolideerd Framework

### Compliance Matrix (Alle Bronnen)

| **Framework** | **Document 1** | **Document 2** | **Document 3** | **Implementatie Status** |
|---------------|---------------|---------------|---------------|------------------------|
| **GDPR/AVG** | ✅ Genoemd | ✅ Kern-principe | ✅ Impliciet | 🟢 Basis compliant |
| **ISO 27001** | ✅ Expliciet | ❌ | ❌ | 🟡 Nog te implementeren |
| **ISO 27701:2025** | ✅ Update genoemd | ✅ Privacy Management | ✅ Versie 2025 | 🟢 Target framework |
| **NIST Privacy Framework** | ✅ V1.1 | ✅ Risicogebaseerd | ✅ Protect/Govern | 🟢 Aligned |
| **OWASP ASVS** | ✅ Secure coding | ✅ Auth richtlijnen | ❌ | 🟡 Toepassen in code review |
| **ENISA Guidelines** | ✅ Data Protection Engineering | ❌ | ❌ | 🟡 Referentie voor PETs |

### DPIA Trigger Points (Nieuw uit analyse)
Een **Data Protection Impact Assessment** is verplicht bij:
1. **Introductie analytics** voor armoedeonderzoek (Document 1 & 3)
2. **Data-aggregatie** voor trendanalyse (Document 2)
3. **Nieuwe datavelden** buiten huidige minimale set

**Aanbeveling:** Plan DPIA **vóór** implementatie van Fase 4 (Research Architecture)

---

## 5. Zero-Knowledge Architectuur: Technische Diepduik

### Huidige Status vs Target State

**Huidige implementatie (uit Document 3):**
- ✅ Geen bankkoppeling
- ✅ Lokale transactie-invoer
- ⚠️ Encryptie-status onduidelijk

**Target architectuur (uit alle documenten):**
```
┌─────────────────────────────────────────────┐
│          USER DEVICE (Client-side)          │
│  ┌───────────────────────────────────────┐  │
│  │ 1. User Data (plaintext)              │  │
│  │    - Transacties, budget, gezinsdata  │  │
│  └──────────────┬────────────────────────┘  │
│                 │ Encrypted with             │
│                 ▼ Device Key (biometric lock)│
│  ┌───────────────────────────────────────┐  │
│  │ 2. Encrypted Blob (AES-256-GCM)      │  │
│  └──────────────┬────────────────────────┘  │
└─────────────────┼──────────────────────────┘
                  │ Stored on
                  ▼
┌─────────────────────────────────────────────┐
│          SERVER (Backend)                   │
│  ┌───────────────────────────────────────┐  │
│  │ 3. Encrypted Data (server kan niet    │  │
│  │    decrypten zonder device key)       │  │
│  └───────────────────────────────────────┘  │
│  ┌───────────────────────────────────────┐  │
│  │ 4. Metadata (niet-gevoelig)           │  │
│  │    - User ID, created_at, sync_status │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

```js
// Pseudo-code voor unified flow
async function handleAuthAttempt(identifier) {
  const user = await checkUserExists(identifier); // Email/phone check
  
  if (user.exists) {
    // SIGN-IN flow
    if (user.hasPasskey) {
      return initiateWebAuthn(user.id);
    } else {
      return showPasswordForm(identifier);
    }
  } else {
    // SIGN-UP flow
    return initiateRegistration(identifier, {
      suggestPasskey: true,
      progressiveProfile: true // Alleen essentials vragen
    });
  }
}
```

### UX Implementatie
**Eén knop voor beide flows:**
```
┌─────────────────────────────────────┐
│  📧 E-mailadres                     │
│  ┌───────────────────────────────┐ │
│  │ user@example.com              │ │
│  └───────────────────────────────┘ │
│                                     │
│  [ Ga verder ]  ← Detecteert auto  │
│                    of signup/signin │
└─────────────────────────────────────┘
```

### Progressive Profiling (Sign-up)
**Fase 1 - Alleen essentials:**
- Email (identificatie)
- Passkey registratie (of wachtwoord als fallback)

**Fase 2 - Op natuurlijke momenten:**
- Gezinssamenstelling → Bij eerste gebruik budgetverdeling
- Inkomsten/lasten → Wanneer dashboard insight vraagt

**Voordeel:** Lagere signup-friction, hogere conversie

---

## 4. Privacy Governance: Geconsolideerd Framework

### Compliance Matrix (Alle Bronnen)

| **Framework** | **Document 1** | **Document 2** | **Document 3** | **Implementatie Status** |
|---------------|---------------|---------------|---------------|------------------------|
| **GDPR/AVG** | ✅ Genoemd | ✅ Kern-principe | ✅ Impliciet | 🟢 Basis compliant |
| **ISO 27001** | ✅ Expliciet | ❌ | ❌ | 🟡 Nog te implementeren |
| **ISO 27701:2025** | ✅ Update genoemd | ✅ Privacy Management | ✅ Versie 2025 | 🟢 Target framework |
| **NIST Privacy Framework** | ✅ V1.1 | ✅ Risicogebaseerd | ✅ Protect/Govern | 🟢 Aligned |
| **OWASP ASVS** | ✅ Secure coding | ✅ Auth richtlijnen | ❌ | 🟡 Toepassen in code review |
| **ENISA Guidelines** | ✅ Data Protection Engineering | ❌ | ❌ | 🟡 Referentie voor PETs |

### DPIA Trigger Points (Nieuw uit analyse)
Een **Data Protection Impact Assessment** is verplicht bij:
1. **Introductie analytics** voor armoedeonderzoek (Document 1 & 3)
2. **Data-aggregatie** voor trendanalyse (Document 2)
3. **Nieuwe datavelden** buiten huidige minimale set

**Aanbeveling:** Plan DPIA **vóór** implementatie van Fase 4 (Research Architecture)

---

## 5. Zero-Knowledge Architectuur: Technische Diepduik

### Huidige Status vs Target State

**Huidige implementatie (uit Document 3):**
- ✅ Geen bankkoppeling
- ✅ Lokale transactie-invoer
- ⚠️ Encryptie-status onduidelijk

**Target architectuur (uit alle documenten):**
```
┌─────────────────────────────────────────────┐
│          USER DEVICE (Client-side)          │
│  ┌───────────────────────────────────────┐  │
│  │ 1. User Data (plaintext)              │  │
│  │    - Transacties, budget, gezinsdata  │  │
│  └──────────────┬────────────────────────┘  │
│                 │ Encrypted with             │
│                 ▼ Device Key (biometric lock)│
│  ┌───────────────────────────────────────┐  │
│  │ 2. Encrypted Blob (AES-256-GCM)      │  │
│  └──────────────┬────────────────────────┘  │
└─────────────────┼──────────────────────────┘
                  │ Stored on
                  ▼
┌─────────────────────────────────────────────┐
│          SERVER (Backend)                   │
│  ┌───────────────────────────────────────┐  │
│  │ 3. Encrypted Data (server kan niet    │  │
│  │    decrypten zonder device key)       │  │
│  └───────────────────────────────────────┘  │
│  ┌───────────────────────────────────────┐  │
│  │ 4. Metadata (niet-gevoelig)           │  │
│  │    - User ID, created_at, sync_status │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

```
SubtleCrypto API
```

```
Jetpack Security
```

```
// Pseudo-code voor key derivation
const deviceKey = await deriveKeyFromBiometric({
  userID: user.id,
  biometricData: faceID_or_fingerprint,
  salt: stored_device_salt
});

const encryptedData = await encryptWithKey(userData, deviceKey);
```

```js
// Pseudo-code voor key derivation
const deviceKey = await deriveKeyFromBiometric({
  userID: user.id,
  biometricData: faceID_or_fingerprint,
  salt: stored_device_salt
});

const encryptedData = await encryptWithKey(userData, deviceKey);
```

```json
{
  "user_id": "uuid",
  "email_hash": "sha256(email)", // Voor duplicate check
  "created_at": "timestamp",
  "last_login": "timestamp"
}
```

```js
{
  "user_id": "uuid",
  "email_hash": "sha256(email)", // Voor duplicate check
  "created_at": "timestamp",
  "last_login": "timestamp"
}
```

```json
{
  "adults_count": 2,
  "children": [
    {"age_bracket": "0-5", "name_encrypted": "..."}, // Naam alleen lokaal opgeslagen
    {"age_bracket": "6-12", "name_encrypted": "..."}
  ],
  "income_sources": [
    {"type": "salary", "frequency": "monthly", "amount_encrypted": "..."}
  ]
}
```

```js
{
  "adults_count": 2,
  "children": [
    {"age_bracket": "0-5", "name_encrypted": "..."}, // Naam alleen lokaal opgeslagen
    {"age_bracket": "6-12", "name_encrypted": "..."}
  ],
  "income_sources": [
    {"type": "salary", "frequency": "monthly", "amount_encrypted": "..."}
  ]
}
```

```json
{
  "transaction_id": "uuid",
  "date": "2024-12-07",
  "category_id": "groceries", // Niet-gevoelig
  "amount_encrypted": "...",
  "notes_encrypted": "..." // Optioneel
}
```

```js
{
  "transaction_id": "uuid",
  "date": "2024-12-07",
  "category_id": "groceries", // Niet-gevoelig
  "amount_encrypted": "...",
  "notes_encrypted": "..." // Optioneel
}
```

```
@github/webauthn-json
```

```
diffprivlib
```

```json
{
       "user_id_hash": "sha256(...)",
       "action": "transaction_created",
       "timestamp": "2024-12-07T10:30:00Z",
       "ip_subnet": "192.168.1.0/24" // Laatste octet verwijderd
     }
```

```js
{
       "user_id_hash": "sha256(...)",
       "action": "transaction_created",
       "timestamp": "2024-12-07T10:30:00Z",
       "ip_subnet": "192.168.1.0/24" // Laatste octet verwijderd
     }
```

```
describe('Encryption', () => {
  test('Data onleesbaar zonder device key', async () => {
    const plaintext = { amount: 50, category: 'groceries' };
    const encrypted = await encrypt(plaintext, deviceKey);
    
    // Zonder key → moet failure geven
    await expect(decrypt(encrypted, wrongKey)).rejects.toThrow();
  });
  
  test('Passkey registratie genereert unieke credentials', async () => {
    const cred1 = await createPasskey(user1);
    const cred2 = await createPasskey(user1); // Tweede device
    
    expect(cred1.id).not.toBe(cred2.id);
  });
});
```

### Integration Tests (Flow)
1. **Unified Auth Flow:**
   - Nieuwe gebruiker → Sign-up → Passkey prompt → Success
   - Bestaande gebruiker → Email herkend → Passkey challenge → Login
   
2. **Recovery Flow:**
   - Device verloren → Magic link → Nieuwe passkey registratie
   
3. **Data Persistence:**
   - Transactie opslaan → Logout → Login op nieuw device → Data zichtbaar (maar encrypted in DB)

### Manual Security Tests (Pentesting)
- SQL injection pogingen op transactie-endpoints
- XSS via notitievelden
- CSRF op state-changing actions
- Session fixation attacks
- Brute force wachtwoord pogingen (rate limiting check)

### Compliance Audit Checklist
- [ ] Privacy policy bevat alle GDPR verplichte elementen
- [ ] Consent is opt-in, niet pre-checked
- [ ] Data export werkt binnen 30 dagen (GDPR art. 20)
- [ ] Account verwijdering werkt binnen 30 dagen (GDPR art. 17)
- [ ] Breach notification procedure gedocumenteerd (72u GDPR art. 33)
- [ ] DPIA uitgevoerd voor high-risk processing

---

## 11. Aanbevolen Tech Stack (Aanvulling op Documenten)

### Authentication
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Passkeys | `@simplewebauthn/browser` + `@simplewebauthn/server` | Best-in-class WebAuthn impl |
| Magic Links | `nodemailer` + custom JWT | Full control, geen vendor lock-in |
| MFA (TOTP) | `otplib` | Open standard, offline-capable |

### Encryption
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Web | `SubtleCrypto API` (native) | Zero dependencies, browser-native |
| Mobile iOS | `CryptoKit` + Secure Enclave | Hardware-backed security |
| Mobile Android | `Jetpack Security` | Google-maintained, best practices |

### Privacy-Enhancing Technologies (Fase 4)
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Differential Privacy | `diffprivlib` (Python) | IBM-backed, production-ready |
| Secure Aggregation | `TensorFlow Federated` | Proven in production (Google) |

### Infrastructure
| **Component** | **Service** | **Privacy Rationale** |
|--------------|-----------|---------------------|
| Hosting | **Hetzner** of **OVH** (EU) | GDPR-compliant, EU data residency |
| Database | **PostgreSQL** + `pgcrypto` | Open-source, encryption-at-rest native |
| Email | **Postmark** of **Mailgun EU** | Transactional focus, GDPR-compliant |
| Monitoring | **Plausible Analytics** | Privacy-friendly alternative to Google Analytics |

**Anti-pattern:** Vermijd AWS US-regio's of Cloudflare Analytics (data doorgifte VS)

---

## 12. Definitieve Aanbevelingen (Prioriteiten)

### 🔥 Kritiek (Start vandaag)
1. **Audit huidige encryptie status** → Indien plaintext, urgent fixen
2. **Implementeer rate limiting** op auth endpoints (prevent brute force)
3. **Token expiry check** → Max 1 uur voor access tokens

### ⚡ Hoog (Volgende sprint)
4. **Passkey MVP implementatie** (WebAuthn basic flow)
5. **Privacy policy opstellen** (GDPR-template gebruiken)
6. **Magic link recovery** (fallback voor passkeys)

### 📊 Medium (Q1 2025)
7. **Unified sign-up/sign-in flow** (zie sectie 3)
8. **DPIA template** en eerste uitvoering
9. **External security audit** (budget: €5-15k voor SME pentesting)

### 🔮 Strategisch (Q2-Q4 2025)
10. **ISO 27701 certificering** voorbereiden (indien B2B/funding relevant)
11. **Differential Privacy analytics** (alleen voor onderzoeksdoeleinde)
12. **Multi-device sync** met end-to-end encryptie

---

## 13. Risico Matrix

| **Risico** | **Impact** | **Kans** | **Mitigatie** | **Owner** |
|-----------|-----------|---------|--------------|----------|
| Data breach door weak encryption | 🔴 Zeer hoog | 🟡 Middel | Client-side encryption implementeren (Fase 2) | CTO |
| Passkey adoption te laag | 🟡 Middel | 🟢 Laag | Magic link als fallback + educatie in onboarding | Product |
| GDPR non-compliance bij launch | 🔴 Hoog | 🟡 Middel | Privacy policy + DPIA vóór launch | Legal |
| Social login verzoek van stakeholders | 🟡 Middel | 🟢 Laag | Data-driven argument voorbereiden (zie sectie 8) | Product |
| Key recovery failure (user verliest device) | 🟠 Hoog | 🟡 Middel | Multi-recovery opties: magic link + recovery codes | DevOps |

---

## 14. Slot: Van Strategie naar Executie

### ✅ Wat is Crystal Clear
- **Passkeys = primaire auth** (unaniem in alle docs)
- **Privacy-First = non-negotiable** (strategische kern)
- **Geen social login** (past niet bij branding)
- **Compliance frameworks** (ISO 27701 + NIST als fundering)

### ⚠️ Wat Onmiddellijke Aandacht Vereist
1. Encryptie-status huidige data → **Audit this week**
2. Rate limiting auth endpoints → **Implement ASAP**
3. Privacy policy definitieve versie → **Legal review Q1 2025**

### 🚀 Volgende Concrete Stappen

**Deze week:**
- [ ] Tech lead voert encryptie-audit uit
- [ ] Product owner prioriteert Fase 2 backlog items
- [ ] Founder beslist: certificering wel/niet (ISO 27701)

**Volgende sprint (2 weken):**
- [ ] Passkey proof-of-concept (1 developer, 40u)
- [ ] Privacy policy eerste draft (Legal consult 4u)
- [ ] Security audit offerte aanvragen (3 aanbieders)

**Q1 2025 Milestone:**
- [ ] Passkeys live in productie
- [ ] GDPR-compliant privacy stack
- [ ] Externe security audit afgerond
- [ ] Klaar voor limited public beta

---

## 📎 Bijlagen

### A. Referentie Links
- **WebAuthn Demo:** https://webauthn.io
- **GDPR Checklist:** https://gdpr.eu/checklist/
- **NIST Privacy Framework:** https://www.nist.gov/privacy-framework
- **OWASP ASVS:** https://owasp.org/www-project-application-security-verification-standard/

### B. Template: DPIA Kickoff Vragen
1. Welke nieuwe data verzamelen we?
2. Voor welk expliciet doel?
3. Kunnen we dit doel bereiken met minder data?
4. Hoe lang bewaren we dit?
5. Wie heeft toegang (intern/extern)?
6. Wat zijn de risico's voor betrokkenen?
7. Welke technische maatregelen nemen we?
8. Is er een Data Processing Agreement (DPA) nodig?

### C. Voorbeeld Recovery Code UI
```
╔════════════════════════════════════════╗
║  🔐 Bewaar deze codes op veilige plek  ║
║                                        ║
║  ABCD-EFGH-IJKL-MNOP                  ║
║  QRST-UVWX-YZAB-CDEF                  ║
║  GHIJ-KLMN-OPQR-STUV                  ║
║                                        ║
║  ✅ Gedownload                        ║
║  📧 Per email                         ║
║  🖨️ Print                             ║
╚════════════════════════════════════════╝
```

```js
describe('Encryption', () => {
  test('Data onleesbaar zonder device key', async () => {
    const plaintext = { amount: 50, category: 'groceries' };
    const encrypted = await encrypt(plaintext, deviceKey);
    
    // Zonder key → moet failure geven
    await expect(decrypt(encrypted, wrongKey)).rejects.toThrow();
  });
  
  test('Passkey registratie genereert unieke credentials', async () => {
    const cred1 = await createPasskey(user1);
    const cred2 = await createPasskey(user1); // Tweede device
    
    expect(cred1.id).not.toBe(cred2.id);
  });
});
```

### Integration Tests (Flow)
1. **Unified Auth Flow:**
   - Nieuwe gebruiker → Sign-up → Passkey prompt → Success
   - Bestaande gebruiker → Email herkend → Passkey challenge → Login
   
2. **Recovery Flow:**
   - Device verloren → Magic link → Nieuwe passkey registratie
   
3. **Data Persistence:**
   - Transactie opslaan → Logout → Login op nieuw device → Data zichtbaar (maar encrypted in DB)

### Manual Security Tests (Pentesting)
- SQL injection pogingen op transactie-endpoints
- XSS via notitievelden
- CSRF op state-changing actions
- Session fixation attacks
- Brute force wachtwoord pogingen (rate limiting check)

### Compliance Audit Checklist
- [ ] Privacy policy bevat alle GDPR verplichte elementen
- [ ] Consent is opt-in, niet pre-checked
- [ ] Data export werkt binnen 30 dagen (GDPR art. 20)
- [ ] Account verwijdering werkt binnen 30 dagen (GDPR art. 17)
- [ ] Breach notification procedure gedocumenteerd (72u GDPR art. 33)
- [ ] DPIA uitgevoerd voor high-risk processing

---

## 11. Aanbevolen Tech Stack (Aanvulling op Documenten)

### Authentication
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Passkeys | `@simplewebauthn/browser` + `@simplewebauthn/server` | Best-in-class WebAuthn impl |
| Magic Links | `nodemailer` + custom JWT | Full control, geen vendor lock-in |
| MFA (TOTP) | `otplib` | Open standard, offline-capable |

### Encryption
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Web | `SubtleCrypto API` (native) | Zero dependencies, browser-native |
| Mobile iOS | `CryptoKit` + Secure Enclave | Hardware-backed security |
| Mobile Android | `Jetpack Security` | Google-maintained, best practices |

### Privacy-Enhancing Technologies (Fase 4)
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Differential Privacy | `diffprivlib` (Python) | IBM-backed, production-ready |
| Secure Aggregation | `TensorFlow Federated` | Proven in production (Google) |

### Infrastructure
| **Component** | **Service** | **Privacy Rationale** |
|--------------|-----------|---------------------|
| Hosting | **Hetzner** of **OVH** (EU) | GDPR-compliant, EU data residency |
| Database | **PostgreSQL** + `pgcrypto` | Open-source, encryption-at-rest native |
| Email | **Postmark** of **Mailgun EU** | Transactional focus, GDPR-compliant |
| Monitoring | **Plausible Analytics** | Privacy-friendly alternative to Google Analytics |

**Anti-pattern:** Vermijd AWS US-regio's of Cloudflare Analytics (data doorgifte VS)

---

## 12. Definitieve Aanbevelingen (Prioriteiten)

### 🔥 Kritiek (Start vandaag)
1. **Audit huidige encryptie status** → Indien plaintext, urgent fixen
2. **Implementeer rate limiting** op auth endpoints (prevent brute force)
3. **Token expiry check** → Max 1 uur voor access tokens

### ⚡ Hoog (Volgende sprint)
4. **Passkey MVP implementatie** (WebAuthn basic flow)
5. **Privacy policy opstellen** (GDPR-template gebruiken)
6. **Magic link recovery** (fallback voor passkeys)

### 📊 Medium (Q1 2025)
7. **Unified sign-up/sign-in flow** (zie sectie 3)
8. **DPIA template** en eerste uitvoering
9. **External security audit** (budget: €5-15k voor SME pentesting)

### 🔮 Strategisch (Q2-Q4 2025)
10. **ISO 27701 certificering** voorbereiden (indien B2B/funding relevant)
11. **Differential Privacy analytics** (alleen voor onderzoeksdoeleinde)
12. **Multi-device sync** met end-to-end encryptie

---

## 13. Risico Matrix

| **Risico** | **Impact** | **Kans** | **Mitigatie** | **Owner** |
|-----------|-----------|---------|--------------|----------|
| Data breach door weak encryption | 🔴 Zeer hoog | 🟡 Middel | Client-side encryption implementeren (Fase 2) | CTO |
| Passkey adoption te laag | 🟡 Middel | 🟢 Laag | Magic link als fallback + educatie in onboarding | Product |
| GDPR non-compliance bij launch | 🔴 Hoog | 🟡 Middel | Privacy policy + DPIA vóór launch | Legal |
| Social login verzoek van stakeholders | 🟡 Middel | 🟢 Laag | Data-driven argument voorbereiden (zie sectie 8) | Product |
| Key recovery failure (user verliest device) | 🟠 Hoog | 🟡 Middel | Multi-recovery opties: magic link + recovery codes | DevOps |

---

## 14. Slot: Van Strategie naar Executie

### ✅ Wat is Crystal Clear
- **Passkeys = primaire auth** (unaniem in alle docs)
- **Privacy-First = non-negotiable** (strategische kern)
- **Geen social login** (past niet bij branding)
- **Compliance frameworks** (ISO 27701 + NIST als fundering)

### ⚠️ Wat Onmiddellijke Aandacht Vereist
1. Encryptie-status huidige data → **Audit this week**
2. Rate limiting auth endpoints → **Implement ASAP**
3. Privacy policy definitieve versie → **Legal review Q1 2025**

### 🚀 Volgende Concrete Stappen

**Deze week:**
- [ ] Tech lead voert encryptie-audit uit
- [ ] Product owner prioriteert Fase 2 backlog items
- [ ] Founder beslist: certificering wel/niet (ISO 27701)

**Volgende sprint (2 weken):**
- [ ] Passkey proof-of-concept (1 developer, 40u)
- [ ] Privacy policy eerste draft (Legal consult 4u)
- [ ] Security audit offerte aanvragen (3 aanbieders)

**Q1 2025 Milestone:**
- [ ] Passkeys live in productie
- [ ] GDPR-compliant privacy stack
- [ ] Externe security audit afgerond
- [ ] Klaar voor limited public beta

---

## 📎 Bijlagen

### A. Referentie Links
- **WebAuthn Demo:** https://webauthn.io
- **GDPR Checklist:** https://gdpr.eu/checklist/
- **NIST Privacy Framework:** https://www.nist.gov/privacy-framework
- **OWASP ASVS:** https://owasp.org/www-project-application-security-verification-standard/

### B. Template: DPIA Kickoff Vragen
1. Welke nieuwe data verzamelen we?
2. Voor welk expliciet doel?
3. Kunnen we dit doel bereiken met minder data?
4. Hoe lang bewaren we dit?
5. Wie heeft toegang (intern/extern)?
6. Wat zijn de risico's voor betrokkenen?
7. Welke technische maatregelen nemen we?
8. Is er een Data Processing Agreement (DPA) nodig?

### C. Voorbeeld Recovery Code UI
```
╔════════════════════════════════════════╗
║  🔐 Bewaar deze codes op veilige plek  ║
║                                        ║
║  ABCD-EFGH-IJKL-MNOP                  ║
║  QRST-UVWX-YZAB-CDEF                  ║
║  GHIJ-KLMN-OPQR-STUV                  ║
║                                        ║
║  ✅ Gedownload                        ║
║  📧 Per email                         ║
║  🖨️ Print                             ║
╚════════════════════════════════════════╝
```

```sql
budget-app/
├── android/                 # Native Android code
├── ios/                     # Native iOS code
├── src/
│   ├── app/                 # Screen routes (voor React Navigation of Expo Router)
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   └── passkey-setup.tsx
│   │   ├── onboarding/      # Setup flow (C1, C4, C7, C10)
│   │   │   ├── household.tsx      # C1: Gezinssamenstelling
│   │   │   ├── details.tsx        # C4: Details
│   │   │   ├── income.tsx         # C7: Vaste inkomsten
│   │   │   └── expenses.tsx       # C10: Vaste lasten
│   │   ├── dashboard/
│   │   │   └── index.tsx
│   │   ├── transactions/
│   │   │   ├── daily-input.tsx    # "Noot van Manasse" logica
│   │   │   └── overview.tsx       # Edit/Delete functionaliteit
│   │   └── settings/
│   │       ├── privacy.tsx
│   │       └── profile.tsx
│   │
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Base components (buttons, inputs, cards)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── SaveConfirmation.tsx  # Voor "Opslaan" bevestiging
│   │   ├── forms/
│   │   │   ├── TransactionForm.tsx
│   │   │   └── HouseholdForm.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── NavigationGuard.tsx   # Voor unsaved changes warning
│   │
│   ├── features/            # Feature-specific logic & components
│   │   ├── auth/
│   │   │   ├── hooks/
│   │   │   │   ├── usePasskey.ts
│   │   │   │   ├── useMagicLink.ts
│   │   │   │   └── useBiometric.ts
│   │   │   ├── components/
│   │   │   │   └── PasskeyPrompt.tsx
│   │   │   └── services/
│   │   │       ├── webauthn.service.ts
│   │   │       └── auth.service.ts
│   │   │
│   │   ├── encryption/       # 🔐 Zero-Knowledge crypto
│   │   │   ├── crypto.service.ts      # AES-256-GCM
│   │   │   ├── keychain.service.ts    # iOS/Android keychain
│   │   │   └── types.ts
│   │   │
│   │   ├── transactions/
│   │   │   ├── hooks/
│   │   │   │   ├── useTransactions.ts
│   │   │   │   └── useCategories.ts
│   │   │   ├── components/
│   │   │   │   └── CategoryChips.tsx  # Conditionele rendering (kinderen)
│   │   │   └── services/
│   │   │       └── transaction.service.ts
│   │   │
│   │   └── budget/
│   │       ├── hooks/
│   │       │   └── useBudgetCalculation.ts
│   │       └── components/
│   │           └── BudgetOverview.tsx
│   │
│   ├── lib/                 # Core utilities (shared across features)
│   │   ├── api/
│   │   │   ├── client.ts           # Axios/Fetch wrapper
│   │   │   ├── endpoints.ts
│   │   │   └── interceptors.ts
│   │   ├── storage/
│   │   │   ├── secure-storage.ts   # Encrypted storage wrapper
│   │   │   └── migrations.ts       # Data model versioning
│   │   ├── validation/
│   │   │   ├── schemas.ts          # Zod/Yup schemas
│   │   │   └── validators.ts
│   │   └── i18n/
│   │       ├── index.ts
│   │       └── translations/
│   │           ├── nl.json
│   │           └── en.json
│   │
│   ├── types/               # TypeScript interfaces
│   │   ├── user.types.ts
│   │   ├── transaction.types.ts
│   │   ├── household.types.ts
│   │   └── auth.types.ts
│   │
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── fonts.ts
│   │   ├── screens.ts       # Screen names voor navigation
│   │   └── config.ts        # App config (niet-gevoelig)
│   │
│   ├── hooks/               # Global custom hooks
│   │   ├── useAppState.ts
│   │   ├── useSecureNavigate.ts  # Navigation met unsaved check
│   │   └── useOfflineSync.ts
│   │
│   ├── store/               # State management (Redux/Zustand)
│   │   ├── slices/
│   │   │   ├── auth.slice.ts
│   │   │   ├── household.slice.ts
│   │   │   └── transactions.slice.ts
│   │   ├── store.ts
│   │   └── hooks.ts         # Typed hooks (useAppDispatch, useAppSelector)
│   │
│   ├── utils/
│   │   ├── date.utils.ts
│   │   ├── currency.utils.ts
│   │   ├── logger.ts        # Privacy-compliant logging (geen PII)
│   │   └── error-handler.ts
│   │
│   └── assets/
│       ├── fonts/
│       ├── images/
│       │   ├── icons/
│       │   └── illustrations/
│       └── animations/       # Lottie files
│
├── __tests__/               # Tests (mirrors src/ structure)
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example             # Template (NOOIT echte keys committen)
├── .gitignore
├── app.json                 # Expo config
├── package.json
├── tsconfig.json
└── README.md
```

```sql
budget-app/
├── android/                 # Native Android code
├── ios/                     # Native iOS code
├── src/
│   ├── app/                 # Screen routes (voor React Navigation of Expo Router)
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   └── passkey-setup.tsx
│   │   ├── onboarding/      # Setup flow (C1, C4, C7, C10)
│   │   │   ├── household.tsx      # C1: Gezinssamenstelling
│   │   │   ├── details.tsx        # C4: Details
│   │   │   ├── income.tsx         # C7: Vaste inkomsten
│   │   │   └── expenses.tsx       # C10: Vaste lasten
│   │   ├── dashboard/
│   │   │   └── index.tsx
│   │   ├── transactions/
│   │   │   ├── daily-input.tsx    # "Noot van Manasse" logica
│   │   │   └── overview.tsx       # Edit/Delete functionaliteit
│   │   └── settings/
│   │       ├── privacy.tsx
│   │       └── profile.tsx
│   │
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Base components (buttons, inputs, cards)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── SaveConfirmation.tsx  # Voor "Opslaan" bevestiging
│   │   ├── forms/
│   │   │   ├── TransactionForm.tsx
│   │   │   └── HouseholdForm.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── NavigationGuard.tsx   # Voor unsaved changes warning
│   │
│   ├── features/            # Feature-specific logic & components
│   │   ├── auth/
│   │   │   ├── hooks/
│   │   │   │   ├── usePasskey.ts
│   │   │   │   ├── useMagicLink.ts
│   │   │   │   └── useBiometric.ts
│   │   │   ├── components/
│   │   │   │   └── PasskeyPrompt.tsx
│   │   │   └── services/
│   │   │       ├── webauthn.service.ts
│   │   │       └── auth.service.ts
│   │   │
│   │   ├── encryption/       # 🔐 Zero-Knowledge crypto
│   │   │   ├── crypto.service.ts      # AES-256-GCM
│   │   │   ├── keychain.service.ts    # iOS/Android keychain
│   │   │   └── types.ts
│   │   │
│   │   ├── transactions/
│   │   │   ├── hooks/
│   │   │   │   ├── useTransactions.ts
│   │   │   │   └── useCategories.ts
│   │   │   ├── components/
│   │   │   │   └── CategoryChips.tsx  # Conditionele rendering (kinderen)
│   │   │   └── services/
│   │   │       └── transaction.service.ts
│   │   │
│   │   └── budget/
│   │       ├── hooks/
│   │       │   └── useBudgetCalculation.ts
│   │       └── components/
│   │           └── BudgetOverview.tsx
│   │
│   ├── lib/                 # Core utilities (shared across features)
│   │   ├── api/
│   │   │   ├── client.ts           # Axios/Fetch wrapper
│   │   │   ├── endpoints.ts
│   │   │   └── interceptors.ts
│   │   ├── storage/
│   │   │   ├── secure-storage.ts   # Encrypted storage wrapper
│   │   │   └── migrations.ts       # Data model versioning
│   │   ├── validation/
│   │   │   ├── schemas.ts          # Zod/Yup schemas
│   │   │   └── validators.ts
│   │   └── i18n/
│   │       ├── index.ts
│   │       └── translations/
│   │           ├── nl.json
│   │           └── en.json
│   │
│   ├── types/               # TypeScript interfaces
│   │   ├── user.types.ts
│   │   ├── transaction.types.ts
│   │   ├── household.types.ts
│   │   └── auth.types.ts
│   │
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── fonts.ts
│   │   ├── screens.ts       # Screen names voor navigation
│   │   └── config.ts        # App config (niet-gevoelig)
│   │
│   ├── hooks/               # Global custom hooks
│   │   ├── useAppState.ts
│   │   ├── useSecureNavigate.ts  # Navigation met unsaved check
│   │   └── useOfflineSync.ts
│   │
│   ├── store/               # State management (Redux/Zustand)
│   │   ├── slices/
│   │   │   ├── auth.slice.ts
│   │   │   ├── household.slice.ts
│   │   │   └── transactions.slice.ts
│   │   ├── store.ts
│   │   └── hooks.ts         # Typed hooks (useAppDispatch, useAppSelector)
│   │
│   ├── utils/
│   │   ├── date.utils.ts
│   │   ├── currency.utils.ts
│   │   ├── logger.ts        # Privacy-compliant logging (geen PII)
│   │   └── error-handler.ts
│   │
│   └── assets/
│       ├── fonts/
│       ├── images/
│       │   ├── icons/
│       │   └── illustrations/
│       └── animations/       # Lottie files
│
├── __tests__/               # Tests (mirrors src/ structure)
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example             # Template (NOOIT echte keys committen)
├── .gitignore
├── app.json                 # Expo config
├── package.json
├── tsconfig.json
└── README.md
```

```
features/encryption/
```

```
src/
├── features/encryption/          # 🔐 KRITIEK
│   ├── crypto.service.ts         # AES-256-GCM implementatie
│   ├── keychain.service.ts       # iOS/Android keychain
│   └── __tests__/
│       └── crypto.test.ts        # Unit tests voor encryptie
│
├── features/auth/
│   ├── services/
│   │   ├── webauthn.service.ts   # Passkey implementatie
│   │   ├── magic-link.service.ts
│   │   └── token.service.ts      # JWT handling (max 1u expiry)
│   └── __tests__/
│
└── lib/storage/
    ├── secure-storage.ts          # Encrypted AsyncStorage wrapper
    └── migrations.ts              # Voor schema updates zonder data loss
```

```
src/
├── features/encryption/          # 🔐 KRITIEK
│   ├── crypto.service.ts         # AES-256-GCM implementatie
│   ├── keychain.service.ts       # iOS/Android keychain
│   └── __tests__/
│       └── crypto.test.ts        # Unit tests voor encryptie
│
├── features/auth/
│   ├── services/
│   │   ├── webauthn.service.ts   # Passkey implementatie
│   │   ├── magic-link.service.ts
│   │   └── token.service.ts      # JWT handling (max 1u expiry)
│   └── __tests__/
│
└── lib/storage/
    ├── secure-storage.ts          # Encrypted AsyncStorage wrapper
    └── migrations.ts              # Voor schema updates zonder data loss
```

```
crypto.service.ts
```

```
webauthn.service.ts
```

```
.env.example
```

| - Storage: Encrypted in OS keychain (iCloud Keychain | Google Password Manager) |
| --- | --- |
| - Privacy voordeel: Geen centraal wachtwoord database | geen credential stuffing mogelijk |

- Flow: Email → Beveiligde token (JWT met 15min TTL) → Auto-login
- Use case:

| - Security: Rate limiting (max 3 requests/15min) | token single-use |
| --- | --- |
| - Privacy: Email-gebaseerd | geen third-party tracking |

- Recovery wanneer passkey-device verloren is
- Onboarding nieuwe devices
- Fallback voor oudere browsers

| Key | Value |
| --- | --- |
| Scope | Alleen voor MVP-lancering (brede compatibiliteit) |
| MFA methode | TOTP (bijv. Google Authenticator) > SMS OTP |
| Migratiestrategie | Actief promoten passkey-upgrade na eerste login |
| Sunset plan | Optioneel maken na 70% passkey adoption |

| Key | Value |
| --- | --- |
| Reden | Conflicteert met "Privacy-First" branding |
| Data leakage | Name, email, friend graph, analytics tracking |
| Alternatief | Passkeys bieden vergelijkbare UX zonder privacy-trade-off |

- Web:  (native browser)
- Mobile:

| Key | Value |
| --- | --- |
| iOS | CryptoKit + Secure Enclave |
| Android | + Keystore |
| iOS | CryptoKit + Secure Enclave |
| Android | + Keystore |

| Key | Value |
| --- | --- |
| iOS | CryptoKit + Secure Enclave |
| Android | + Keystore |

| Key | Value |
| --- | --- |
| Probleem | Gebruiker verliest device met enige sleutel |
| Oplossing | Encrypted backup key in cloud, ontgrendeld via: |

| Recovery codes (gegenereerd bij setup | offline opgeslagen door user) |
| --- | --- |
| - Recovery codes (gegenereerd bij setup | offline opgeslagen door user) |

- Secondary device met passkey
- Recovery codes (gegenereerd bij setup, offline opgeslagen door user)

| - Pseudonimisatie: User ID is random UUID | niet afleidbaar |
| --- | --- |
| - Minimalisatie: Geen onnodige metadata (bijv. IP-logs | device fingerprints) |

- Setup flow (C1→C4→C7→C10)
- Dagelijkse transactie-invoer
- "Noot van Manasse" logica (save confirmation)
- Dashboard basis

- Implementeer Passkey registratie

WebAuthn library:  (web) of native APIs
Prompt tijdens onboarding: "Veiliger inloggen met gezichtsherkenning"
Fallback naar wachtwoord blijft beschikbaar
- WebAuthn library:  (web) of native APIs
- Prompt tijdens onboarding: "Veiliger inloggen met gezichtsherkenning"
- Fallback naar wachtwoord blijft beschikbaar
- Magic Link recovery

| Email service: Transactional email provider (bijv. SendGrid | Postmark) |
| --- | --- |
| - Email service: Transactional email provider (bijv. SendGrid | Postmark) |

- WebAuthn library:  (web) of native APIs
- Prompt tijdens onboarding: "Veiliger inloggen met gezichtsherkenning"
- Fallback naar wachtwoord blijft beschikbaar

| Key | Value |
| --- | --- |
| Email service | Transactional email provider (bijv. SendGrid, Postmark) |
| Token TTL | 15 minuten |
| Rate limiting | 3 pogingen per 15 min per IP |

- Encrypt-at-rest voor transacties en budgetdata
- Key derivation via biometric unlock (iOS/Android)
- Web fallback: PBKDF2 van master password

- Backend security audit

Penetration test door externe partij
OWASP Top 10 compliance check
API rate limiting en DDoS protectie
- Penetration test door externe partij
- OWASP Top 10 compliance check
- API rate limiting en DDoS protectie

- Penetration test door externe partij
- OWASP Top 10 compliance check
- API rate limiting en DDoS protectie

- Vraag gezinsdetails pas bij eerste budgetberekening
- "Waarom vragen we dit?" tooltips bij elk veld

- "Mijn gegevens" pagina met:

Data export (JSON download)
Account verwijdering (met bevestiging)
Toestemming intrekken voor analytics
- Data export (JSON download)
- Account verwijdering (met bevestiging)
- Toestemming intrekken voor analytics

- Data export (JSON download)
- Account verwijdering (met bevestiging)
- Toestemming intrekken voor analytics

- Differential Privacy implementatie

Library:  (Python) voor backend analytics
ε-budget: 1.0 voor aggregate queries
Geen individuele data-export naar onderzoekers
- Library:  (Python) voor backend analytics
- ε-budget: 1.0 voor aggregate queries
- Geen individuele data-export naar onderzoekers
- Federated Analytics (optioneel)

| Alleen model updates naar server | geen raw data |
| --- | --- |
| - Alleen model updates naar server | geen raw data |

Alleen geaggregeerde trends zichtbaar
Minimum threshold: 100 users per cohort
- Alleen geaggregeerde trends zichtbaar
- Minimum threshold: 100 users per cohort

| Key | Value |
| --- | --- |
| Library | (Python) voor backend analytics |
| ε | budget: 1.0 voor aggregate queries |
| Geen individuele data | export naar onderzoekers |

- On-device model training (TensorFlow Lite)
- Alleen model updates naar server, geen raw data

- Alleen geaggregeerde trends zichtbaar
- Minimum threshold: 100 users per cohort

| - Data leakage (email | naam | friend graph naar Meta/Google) |
| --- | --- | --- |
| - Complexiteit: OAuth flows | token refresh | revocation handling |

- Implementeer met opt-in consent (niet pre-checked)
- Minimaliseer scopes (alleen email, geen profile of friends)
- Transparante UI: "Dit deelt jouw email met [Provider]"

| - Document 1: "Lokale encryptiesleutels" → suggestie | geen confirmatie |
| --- | --- |
| - Document 2: "Zero-Knowledge Architectuur" → doel | geen implementatie |

| Key | Value |
| --- | --- |
| Audit huidige state | Controleer of transacties in database plaintext zijn |
| Indien plaintext | Urgent implementeren in Fase 2 (zie sectie 5) |
| Indien encrypted | Documenteer key management strategie |

| Key | Value |
| --- | --- |
| Voeg ISO 27018 toe (cloud privacy, relevant als je cloud | infra gebruikt) |
| Volg ENISA Cloud Security Guidelines voor hosting | keuzes |

- Auth Token Security

| HTTPOnly | Secure | SameSite=Strict cookies |
| --- | --- | --- |
| - HTTPOnly | Secure | SameSite=Strict cookies |

| Sanitize user input (transactie notities | gezinsnamen) |
| --- | --- |
| - Sanitize user input (transactie notities | gezinsnamen) |

| Audit logs: Wie | wat | wanneer → maar geen bedragen of content |
| --- | --- | --- |
| - Audit logs: Wie | wat | wanneer → maar geen bedragen of content |

- Huidige JWT expiry? → Check en zet op max 1 uur
- Implementeer refresh tokens (30 dagen) met rotation
- HTTPOnly, Secure, SameSite=Strict cookies

- Sanitize user input (transactie notities, gezinsnamen)
- Prevent XSS: Library DOMPurify voor web
- Rate limiting op alle POST endpoints

| Key | Value |
| --- | --- |
| Audit logs | Wie, wat, wanneer → maar geen bedragen of content |
| Voorbeeld GDPR | compliant log: |

- Dependency Audit

Run npm audit / pip-audit
Update kritieke vulnerabilities
Pin versies voor reproducible builds
- Run npm audit / pip-audit
- Update kritieke vulnerabilities
- Pin versies voor reproducible builds

- Run npm audit / pip-audit
- Update kritieke vulnerabilities
- Pin versies voor reproducible builds

- Passkey Implementatie (zie Fase 2)
- Encrypted Backup Systeem
- DPIA Template (reusable voor toekomstige features)

- Differential Privacy Analytics
- Formal Security Audit door third-party
- ISO 27701 Certificering (optioneel, maar sterk voor B2B/funding)

- ✅ Sneller te implementeren (minder boilerplate)
- ✅ Makkelijker te navigeren voor kleine teams
- ✅ Privacy-kritische code is geïsoleerd ()
- ✅ Past bij "Noot van Manasse" logica (eenvoudige component structuur)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dmedium.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddev.to&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddev.to&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Drobinwieruch.de&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dobytes.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dreboot.studio&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddev.to&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgithub.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dwaldo.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dreactjs.org&w=32&q=75)

### 3.docx

### 2.docx

### 1.docx

# 🔐 Geïntegreerde Privacy & Identity Architectuur

## Executive Summary

## 1. Strategische Positionering: Consistentie Analyse

### Kernbevindingen uit alle documenten

### 🎯 Conclusie

## 2. Authenticatie Architectuur: Definitieve Hiërarchie

### Geconsolideerde Beslisboom

### Technische Specificaties per Methode

#### 1️⃣ Passkeys / WebAuthn (FIDO2)

#### 2️⃣ Magic Links

#### 3️⃣ Wachtwoord + MFA

#### 4️⃣ Social Login: NIET IMPLEMENTEREN

## 3. Sign-up vs Sign-in: Unified Identity Flow

### Probleem in Huidige Implementatie

### 🆕 Aanbevolen Oplossing: Progressive Identity Discovery

### Implementatie Aanbevelingen

## 6. Data Model: Privacy-Conscious Design

### Minimale Dataset (MVP)

### Privacy-by-Design Principes Toegepast:

## 7. Roadmap: Geïntegreerde Fasering

### ✅ Fase 1: MVP - Foundation (Voltooid volgens Doc 3)

### 🔄 Fase 2: Security Hardening (Huidige focus)

### 🚀 Fase 3: UX Refinement & Governance (Q2 2025)

### 🔬 Fase 4: Research-Ready Architecture (Q3-Q4 2025)

## 8. Kritieke Verschillen & Aanbevelingen

### 🔴 Conflict: Social Login Vermelden

### 🟡 Onduidelijkheid: Huidige Encryptie Status

### 🟢 Consistentie: Compliance Frameworks

## 9. Technische Debt & Quick Wins

### Snelle Verbeteringen (< 1 week werk)

### Middelgroot (1-2 maanden)

### Langetermijn (Fase 4)

## 10. Testplan: Privacy & Security Validation

### Unit Tests (Technisch)

## Optie A: Privacy-First App Structuur (Aanbevolen)

## Optie B: Feature-Based Structuur (Schaalbaar voor groter team)

## 🎯 Mijn Aanbeveling voor Jouw Situatie

### Start met Optie A, want:

### Privacy-Specifieke Folders (Critial!)

## 📋 Volgende Stappen

227 linesdocx121 linesdocx82 linesdocxanalyseer vergelijk en combineer in 1 document met aanbevelingen7 dec 2025
Definitieve Analyse, Vergelijking & Aanbevelingen

Deze analyse consolideert drie documentatiebronnen tot één strategisch implementatieplan. Alle bronnen convergeren naar dezelfde kernwaarden: privacy-first architectuur, passkeys als authenticatiestandaard, en dataminimalisatie als fundament. Het project bevindt zich in transitie van Fase 2 naar Fase 3, met een compliance-score van 93% en een heldere roadmap naar productierijpheid.

Alle bronnen wijzen naar één coherente visie. Geen conflicterende aanbevelingen gedetecteerd.

Documenten suggereren separate flows, maar moderne best practice is één unified experience.

javascript

Library-keuzes:

Key Management:
javascript
Recovery scenario:

| Household Data (gevoelig | encrypted): |
| --- | --- |
| Transacties (gevoelig | encrypted): |

Compliance status: 93% ✅

Prioriteit 1 - Auth Upgrade:

| Key | Value |
| --- | --- |
| Prioriteit 2 | Data Protection: |
| 3. Client | side encryptie implementeren |

| Key | Value |
| --- | --- |
| Deliverable | Veilige authenticatie en encrypted data storage |
| Tijdslijn | 2-3 maanden |

Prioriteit 1 - Progressive Profiling:
5. Unified sign-up/sign-in flow (zie sectie 3)
6. Contextual data collection

Prioriteit 2 - Compliance Formalisering:
7. DPIA documentatie opstellen
8. Privacy policy generator (gebruiksvriendelijke versie)
9. Consent management dashboard

| Key | Value |
| --- | --- |
| Prioriteit 3 | Personalisatie (uit Doc 3): |
| 10. Conditionele rendering van kinderen | chips |
| 11. Transactie | overzicht met Edit/Delete |
| Deliverable | Production-ready app met volledige GDPR compliance |
| Tijdslijn | 3 maanden |

Alleen als onderzoeksfunctie gewenst:

| Key | Value |
| --- | --- |
| Deliverable | Onderzoek mogelijk zonder privacy-compromis |
| Tijdslijn | 6 maanden (optioneel) |

Definitief besluit: NIET implementeren, zelfs niet optioneel. Redenen:

Uitzondering: Als marktonderzoek expliciet aantoont dat dit dealbreaker is voor doelgroep, dan:

Vraag: Is data momenteel encrypted-at-rest?
Uit documenten:

Aanbeveling:

Alle documenten noemen ISO 27701 en NIST Privacy Framework → Sterk fundament.
Aanbeveling:

json

javascript

| Key | Value |
| --- | --- |
| Document versie | 1.0 |
| Datum | 7 december 2024 |
| Status | Definitief implementatieplan |
| Volgende review | Q1 2025 na Fase 2 voltooiingwat is de mappen structuur van de app?8 dec 2025React Native app folder structure best practices 202410 resultsReact Native folder structure \| Mediummedium.comUltimate Folder Structure For Your React Native Project - DEV Communitydev.toHow to Organize Your Components in React Native: Folder Structure and Project Organization - DEV Communitydev.toReact Folder Structure in 5 Steps [2025]robinwieruch.deProject Structure \| React Native / Expo Starterobytes.com4 folder structures to organize your React & React Native project - rebootreboot.studioThe Folder Structure of a React Native App - DEV Communitydev.toGitHub - sury4karmakar/ReactNative-ProjectStructure: 🔸 Best Folder Structure For Every React Native Project ... 🔸 In This Repo We Are Demonstrate How To Structure And Manage Your React Native Project ...github.comReact Native project structure: a best practices guidewaldo.comFile Structure – Reactreactjs.orgIk zie dat je vraagt naar de mappenstructuur van jouw app, maar die informatie staat niet in de documenten die je hebt gedeeld. De documenten bevatten strategische analyses over privacy, authenticatie en compliance, maar geen technische details over de huidige mappenstructuur. |
| Laten we dit aanpakken | ik geef je twee opties gebaseerd op moderne best practices voor een privacy-first budgetapp: |

Gebaseerd op jouw requirements (passkeys, encryptie, geen social login, dataminimalisatie):

Feature-Based App StructureCode # Feature-Based App Structuur (Alternatief)

```
budget-app/
├── src/
│   ├── modules/              # Zelfstandige feature modules
│   │   │
│   │   ├── auth/             # 🔐 Authenticatie module
│   │   │   ├── screens/
│   │   │   │   ├── LoginScr

Gebaseerd op de documentatie (93% compliance, Fase 2→3 transitie):

Ongeacht welke structuur je kiest, deze folders zijn non-negotiable:

Wil je dat ik:
A. De huidige status audit (controleren welke structuur je nu hebt)?
B. Een migratie-plan maken van huidige → Optie A?
C. Specifieke bestanden genereren (bijv. , )?
D. Een .gitignore en  maken met privacy best practices?
Kies A, B, C of D — of meerdere!Claude is AI and can make mistakes. Please double-check cited sources. Sonnet 4.5Claude is AI and can make mistakes. Please double-check cited sources.

---

**Claude:**

### 3.docx

### 2.docx

### 1.docx

227 linesdocx121 linesdocx82 linesdocx

---

**Claude:**

### 3.docx

227 linesdocx

---

**Claude:**

### 3.docx

227 lines

---

**Claude:**

docx

---

**Claude:**

### 2.docx

121 linesdocx

---

**Claude:**

### 2.docx

121 lines

---

**Claude:**

### 1.docx

82 linesdocx

---

**Claude:**

### 1.docx

82 lines

---

**Claude:**

analyseer vergelijk en combineer in 1 document met aanbevelingen7 dec 2025

---

**Claude:**

analyseer vergelijk en combineer in 1 document met aanbevelingen

---

**Claude:**

7 dec 2025

---

**Claude:**

| Aspect | Document 1 | Document 2 | Document 3 | Status |
| --- | --- | --- | --- | --- |
| Privacy-First UVP | ✅ Expliciet benoemd | ✅ Centraal principe | ✅ Gedefinieerd als kern-UVP | Volledig aligned |
| Geen bankkoppeling | ✅ Risico-eliminatie | ⚠️ Impliciet | ✅ Expliciet onderdeel UVP | Consistent |
| Passkeys als primair | ✅ Gouden standaard | ✅ Hoogste score (5/5) | ✅ Geselecteerd als primair | Unaniem |
| Social Login vermijden | ✅ Bewust vermeden | ⚠️ Hoge privacy-impact | ❌ Niet genoemd | Consensus bereikt |
| Compliance frameworks | ✅ GDPR, ISO 27001/27701, NIST | ✅ GDPR, ISO 27701, NIST, OWASP | ✅ ISO 27701:2025, NIST 1.1 | Volledig gedekt |

| Document | Standpunt | Aanbeveling |
| --- | --- | --- |
| Document 1 | ❌ Bewust vermijden | ✅ Volgen |
| Document 2 | ⚠️ Hoge privacy-impact, maar "optioneel" suggereert beschikbaarheid | ❌ Te risicovol |
| Document 3 | 🤷 Niet genoemd | - |

```
┌─────────────────────────────────────┐
│   User wil inloggen/registreren     │
└──────────────┬──────────────────────┘
               │
        ┌──────▼──────┐
        │ Passkey      │  ← PRIMAIR (UX: 5/5, Security: 5/5, Privacy: Laag)
        │ beschikbaar? │
        └──┬────────┬──┘
           │ Ja     │ Nee
           │        │
           ▼        ▼
     ┌─────────┐  ┌─────────────┐
     │ Biometric│  │ Magic Link  │  ← FALLBACK (UX: 4/5, Security: 3/5)
     │ Unlock   │  │ versturen   │
     └─────────┘  └──────┬──────┘
                         │ Fallback
                         ▼
                  ┌──────────────┐
                  │ Wachtwoord + │  ← LEGACY (UX: 3/5, Security: 4/5)
                  │ MFA (TOTP)   │     Alleen voor MVP-compatibiliteit
                  └──────────────┘
```

```
┌─────────────────────────────────────┐
│   User wil inloggen/registreren     │
└──────────────┬──────────────────────┘
               │
        ┌──────▼──────┐
        │ Passkey      │  ← PRIMAIR (UX: 5/5, Security: 5/5, Privacy: Laag)
        │ beschikbaar? │
        └──┬────────┬──┘
           │ Ja     │ Nee
           │        │
           ▼        ▼
     ┌─────────┐  ┌─────────────┐
     │ Biometric│  │ Magic Link  │  ← FALLBACK (UX: 4/5, Security: 3/5)
     │ Unlock   │  │ versturen   │
     └─────────┘  └──────┬──────┘
                         │ Fallback
                         ▼
                  ┌──────────────┐
                  │ Wachtwoord + │  ← LEGACY (UX: 3/5, Security: 4/5)
                  │ MFA (TOTP)   │     Alleen voor MVP-compatibiliteit
                  └──────────────┘
```

```
navigator.credentials.create()
```

```js
// Pseudo-code voor unified flow
async function handleAuthAttempt(identifier) {
  const user = await checkUserExists(identifier); // Email/phone check
  
  if (user.exists) {
    // SIGN-IN flow
    if (user.hasPasskey) {
      return initiateWebAuthn(user.id);
    } else {
      return showPasswordForm(identifier);
    }
  } else {
    // SIGN-UP flow
    return initiateRegistration(identifier, {
      suggestPasskey: true,
      progressiveProfile: true // Alleen essentials vragen
    });
  }
}
```

### UX Implementatie
**Eén knop voor beide flows:**
```
┌─────────────────────────────────────┐
│  📧 E-mailadres                     │
│  ┌───────────────────────────────┐ │
│  │ user@example.com              │ │
│  └───────────────────────────────┘ │
│                                     │
│  [ Ga verder ]  ← Detecteert auto  │
│                    of signup/signin │
└─────────────────────────────────────┘
```

### Progressive Profiling (Sign-up)
**Fase 1 - Alleen essentials:**
- Email (identificatie)
- Passkey registratie (of wachtwoord als fallback)

**Fase 2 - Op natuurlijke momenten:**
- Gezinssamenstelling → Bij eerste gebruik budgetverdeling
- Inkomsten/lasten → Wanneer dashboard insight vraagt

**Voordeel:** Lagere signup-friction, hogere conversie

---

## 4. Privacy Governance: Geconsolideerd Framework

### Compliance Matrix (Alle Bronnen)

| **Framework** | **Document 1** | **Document 2** | **Document 3** | **Implementatie Status** |
|---------------|---------------|---------------|---------------|------------------------|
| **GDPR/AVG** | ✅ Genoemd | ✅ Kern-principe | ✅ Impliciet | 🟢 Basis compliant |
| **ISO 27001** | ✅ Expliciet | ❌ | ❌ | 🟡 Nog te implementeren |
| **ISO 27701:2025** | ✅ Update genoemd | ✅ Privacy Management | ✅ Versie 2025 | 🟢 Target framework |
| **NIST Privacy Framework** | ✅ V1.1 | ✅ Risicogebaseerd | ✅ Protect/Govern | 🟢 Aligned |
| **OWASP ASVS** | ✅ Secure coding | ✅ Auth richtlijnen | ❌ | 🟡 Toepassen in code review |
| **ENISA Guidelines** | ✅ Data Protection Engineering | ❌ | ❌ | 🟡 Referentie voor PETs |

### DPIA Trigger Points (Nieuw uit analyse)
Een **Data Protection Impact Assessment** is verplicht bij:
1. **Introductie analytics** voor armoedeonderzoek (Document 1 & 3)
2. **Data-aggregatie** voor trendanalyse (Document 2)
3. **Nieuwe datavelden** buiten huidige minimale set

**Aanbeveling:** Plan DPIA **vóór** implementatie van Fase 4 (Research Architecture)

---

## 5. Zero-Knowledge Architectuur: Technische Diepduik

### Huidige Status vs Target State

**Huidige implementatie (uit Document 3):**
- ✅ Geen bankkoppeling
- ✅ Lokale transactie-invoer
- ⚠️ Encryptie-status onduidelijk

**Target architectuur (uit alle documenten):**
```
┌─────────────────────────────────────────────┐
│          USER DEVICE (Client-side)          │
│  ┌───────────────────────────────────────┐  │
│  │ 1. User Data (plaintext)              │  │
│  │    - Transacties, budget, gezinsdata  │  │
│  └──────────────┬────────────────────────┘  │
│                 │ Encrypted with             │
│                 ▼ Device Key (biometric lock)│
│  ┌───────────────────────────────────────┐  │
│  │ 2. Encrypted Blob (AES-256-GCM)      │  │
│  └──────────────┬────────────────────────┘  │
└─────────────────┼──────────────────────────┘
                  │ Stored on
                  ▼
┌─────────────────────────────────────────────┐
│          SERVER (Backend)                   │
│  ┌───────────────────────────────────────┐  │
│  │ 3. Encrypted Data (server kan niet    │  │
│  │    decrypten zonder device key)       │  │
│  └───────────────────────────────────────┘  │
│  ┌───────────────────────────────────────┐  │
│  │ 4. Metadata (niet-gevoelig)           │  │
│  │    - User ID, created_at, sync_status │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

```js
// Pseudo-code voor unified flow
async function handleAuthAttempt(identifier) {
  const user = await checkUserExists(identifier); // Email/phone check
  
  if (user.exists) {
    // SIGN-IN flow
    if (user.hasPasskey) {
      return initiateWebAuthn(user.id);
    } else {
      return showPasswordForm(identifier);
    }
  } else {
    // SIGN-UP flow
    return initiateRegistration(identifier, {
      suggestPasskey: true,
      progressiveProfile: true // Alleen essentials vragen
    });
  }
}
```

### UX Implementatie
**Eén knop voor beide flows:**
```
┌─────────────────────────────────────┐
│  📧 E-mailadres                     │
│  ┌───────────────────────────────┐ │
│  │ user@example.com              │ │
│  └───────────────────────────────┘ │
│                                     │
│  [ Ga verder ]  ← Detecteert auto  │
│                    of signup/signin │
└─────────────────────────────────────┘
```

### Progressive Profiling (Sign-up)
**Fase 1 - Alleen essentials:**
- Email (identificatie)
- Passkey registratie (of wachtwoord als fallback)

**Fase 2 - Op natuurlijke momenten:**
- Gezinssamenstelling → Bij eerste gebruik budgetverdeling
- Inkomsten/lasten → Wanneer dashboard insight vraagt

**Voordeel:** Lagere signup-friction, hogere conversie

---

## 4. Privacy Governance: Geconsolideerd Framework

### Compliance Matrix (Alle Bronnen)

| **Framework** | **Document 1** | **Document 2** | **Document 3** | **Implementatie Status** |
|---------------|---------------|---------------|---------------|------------------------|
| **GDPR/AVG** | ✅ Genoemd | ✅ Kern-principe | ✅ Impliciet | 🟢 Basis compliant |
| **ISO 27001** | ✅ Expliciet | ❌ | ❌ | 🟡 Nog te implementeren |
| **ISO 27701:2025** | ✅ Update genoemd | ✅ Privacy Management | ✅ Versie 2025 | 🟢 Target framework |
| **NIST Privacy Framework** | ✅ V1.1 | ✅ Risicogebaseerd | ✅ Protect/Govern | 🟢 Aligned |
| **OWASP ASVS** | ✅ Secure coding | ✅ Auth richtlijnen | ❌ | 🟡 Toepassen in code review |
| **ENISA Guidelines** | ✅ Data Protection Engineering | ❌ | ❌ | 🟡 Referentie voor PETs |

### DPIA Trigger Points (Nieuw uit analyse)
Een **Data Protection Impact Assessment** is verplicht bij:
1. **Introductie analytics** voor armoedeonderzoek (Document 1 & 3)
2. **Data-aggregatie** voor trendanalyse (Document 2)
3. **Nieuwe datavelden** buiten huidige minimale set

**Aanbeveling:** Plan DPIA **vóór** implementatie van Fase 4 (Research Architecture)

---

## 5. Zero-Knowledge Architectuur: Technische Diepduik

### Huidige Status vs Target State

**Huidige implementatie (uit Document 3):**
- ✅ Geen bankkoppeling
- ✅ Lokale transactie-invoer
- ⚠️ Encryptie-status onduidelijk

**Target architectuur (uit alle documenten):**
```
┌─────────────────────────────────────────────┐
│          USER DEVICE (Client-side)          │
│  ┌───────────────────────────────────────┐  │
│  │ 1. User Data (plaintext)              │  │
│  │    - Transacties, budget, gezinsdata  │  │
│  └──────────────┬────────────────────────┘  │
│                 │ Encrypted with             │
│                 ▼ Device Key (biometric lock)│
│  ┌───────────────────────────────────────┐  │
│  │ 2. Encrypted Blob (AES-256-GCM)      │  │
│  └──────────────┬────────────────────────┘  │
└─────────────────┼──────────────────────────┘
                  │ Stored on
                  ▼
┌─────────────────────────────────────────────┐
│          SERVER (Backend)                   │
│  ┌───────────────────────────────────────┐  │
│  │ 3. Encrypted Data (server kan niet    │  │
│  │    decrypten zonder device key)       │  │
│  └───────────────────────────────────────┘  │
│  ┌───────────────────────────────────────┐  │
│  │ 4. Metadata (niet-gevoelig)           │  │
│  │    - User ID, created_at, sync_status │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

```
SubtleCrypto API
```

```
Jetpack Security
```

```
// Pseudo-code voor key derivation
const deviceKey = await deriveKeyFromBiometric({
  userID: user.id,
  biometricData: faceID_or_fingerprint,
  salt: stored_device_salt
});

const encryptedData = await encryptWithKey(userData, deviceKey);
```

```js
// Pseudo-code voor key derivation
const deviceKey = await deriveKeyFromBiometric({
  userID: user.id,
  biometricData: faceID_or_fingerprint,
  salt: stored_device_salt
});

const encryptedData = await encryptWithKey(userData, deviceKey);
```

```json
{
  "user_id": "uuid",
  "email_hash": "sha256(email)", // Voor duplicate check
  "created_at": "timestamp",
  "last_login": "timestamp"
}
```

```js
{
  "user_id": "uuid",
  "email_hash": "sha256(email)", // Voor duplicate check
  "created_at": "timestamp",
  "last_login": "timestamp"
}
```

```json
{
  "adults_count": 2,
  "children": [
    {"age_bracket": "0-5", "name_encrypted": "..."}, // Naam alleen lokaal opgeslagen
    {"age_bracket": "6-12", "name_encrypted": "..."}
  ],
  "income_sources": [
    {"type": "salary", "frequency": "monthly", "amount_encrypted": "..."}
  ]
}
```

```js
{
  "adults_count": 2,
  "children": [
    {"age_bracket": "0-5", "name_encrypted": "..."}, // Naam alleen lokaal opgeslagen
    {"age_bracket": "6-12", "name_encrypted": "..."}
  ],
  "income_sources": [
    {"type": "salary", "frequency": "monthly", "amount_encrypted": "..."}
  ]
}
```

```json
{
  "transaction_id": "uuid",
  "date": "2024-12-07",
  "category_id": "groceries", // Niet-gevoelig
  "amount_encrypted": "...",
  "notes_encrypted": "..." // Optioneel
}
```

```js
{
  "transaction_id": "uuid",
  "date": "2024-12-07",
  "category_id": "groceries", // Niet-gevoelig
  "amount_encrypted": "...",
  "notes_encrypted": "..." // Optioneel
}
```

```
@github/webauthn-json
```

```
diffprivlib
```

```json
{
       "user_id_hash": "sha256(...)",
       "action": "transaction_created",
       "timestamp": "2024-12-07T10:30:00Z",
       "ip_subnet": "192.168.1.0/24" // Laatste octet verwijderd
     }
```

```js
{
       "user_id_hash": "sha256(...)",
       "action": "transaction_created",
       "timestamp": "2024-12-07T10:30:00Z",
       "ip_subnet": "192.168.1.0/24" // Laatste octet verwijderd
     }
```

```
describe('Encryption', () => {
  test('Data onleesbaar zonder device key', async () => {
    const plaintext = { amount: 50, category: 'groceries' };
    const encrypted = await encrypt(plaintext, deviceKey);
    
    // Zonder key → moet failure geven
    await expect(decrypt(encrypted, wrongKey)).rejects.toThrow();
  });
  
  test('Passkey registratie genereert unieke credentials', async () => {
    const cred1 = await createPasskey(user1);
    const cred2 = await createPasskey(user1); // Tweede device
    
    expect(cred1.id).not.toBe(cred2.id);
  });
});
```

### Integration Tests (Flow)
1. **Unified Auth Flow:**
   - Nieuwe gebruiker → Sign-up → Passkey prompt → Success
   - Bestaande gebruiker → Email herkend → Passkey challenge → Login
   
2. **Recovery Flow:**
   - Device verloren → Magic link → Nieuwe passkey registratie
   
3. **Data Persistence:**
   - Transactie opslaan → Logout → Login op nieuw device → Data zichtbaar (maar encrypted in DB)

### Manual Security Tests (Pentesting)
- SQL injection pogingen op transactie-endpoints
- XSS via notitievelden
- CSRF op state-changing actions
- Session fixation attacks
- Brute force wachtwoord pogingen (rate limiting check)

### Compliance Audit Checklist
- [ ] Privacy policy bevat alle GDPR verplichte elementen
- [ ] Consent is opt-in, niet pre-checked
- [ ] Data export werkt binnen 30 dagen (GDPR art. 20)
- [ ] Account verwijdering werkt binnen 30 dagen (GDPR art. 17)
- [ ] Breach notification procedure gedocumenteerd (72u GDPR art. 33)
- [ ] DPIA uitgevoerd voor high-risk processing

---

## 11. Aanbevolen Tech Stack (Aanvulling op Documenten)

### Authentication
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Passkeys | `@simplewebauthn/browser` + `@simplewebauthn/server` | Best-in-class WebAuthn impl |
| Magic Links | `nodemailer` + custom JWT | Full control, geen vendor lock-in |
| MFA (TOTP) | `otplib` | Open standard, offline-capable |

### Encryption
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Web | `SubtleCrypto API` (native) | Zero dependencies, browser-native |
| Mobile iOS | `CryptoKit` + Secure Enclave | Hardware-backed security |
| Mobile Android | `Jetpack Security` | Google-maintained, best practices |

### Privacy-Enhancing Technologies (Fase 4)
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Differential Privacy | `diffprivlib` (Python) | IBM-backed, production-ready |
| Secure Aggregation | `TensorFlow Federated` | Proven in production (Google) |

### Infrastructure
| **Component** | **Service** | **Privacy Rationale** |
|--------------|-----------|---------------------|
| Hosting | **Hetzner** of **OVH** (EU) | GDPR-compliant, EU data residency |
| Database | **PostgreSQL** + `pgcrypto` | Open-source, encryption-at-rest native |
| Email | **Postmark** of **Mailgun EU** | Transactional focus, GDPR-compliant |
| Monitoring | **Plausible Analytics** | Privacy-friendly alternative to Google Analytics |

**Anti-pattern:** Vermijd AWS US-regio's of Cloudflare Analytics (data doorgifte VS)

---

## 12. Definitieve Aanbevelingen (Prioriteiten)

### 🔥 Kritiek (Start vandaag)
1. **Audit huidige encryptie status** → Indien plaintext, urgent fixen
2. **Implementeer rate limiting** op auth endpoints (prevent brute force)
3. **Token expiry check** → Max 1 uur voor access tokens

### ⚡ Hoog (Volgende sprint)
4. **Passkey MVP implementatie** (WebAuthn basic flow)
5. **Privacy policy opstellen** (GDPR-template gebruiken)
6. **Magic link recovery** (fallback voor passkeys)

### 📊 Medium (Q1 2025)
7. **Unified sign-up/sign-in flow** (zie sectie 3)
8. **DPIA template** en eerste uitvoering
9. **External security audit** (budget: €5-15k voor SME pentesting)

### 🔮 Strategisch (Q2-Q4 2025)
10. **ISO 27701 certificering** voorbereiden (indien B2B/funding relevant)
11. **Differential Privacy analytics** (alleen voor onderzoeksdoeleinde)
12. **Multi-device sync** met end-to-end encryptie

---

## 13. Risico Matrix

| **Risico** | **Impact** | **Kans** | **Mitigatie** | **Owner** |
|-----------|-----------|---------|--------------|----------|
| Data breach door weak encryption | 🔴 Zeer hoog | 🟡 Middel | Client-side encryption implementeren (Fase 2) | CTO |
| Passkey adoption te laag | 🟡 Middel | 🟢 Laag | Magic link als fallback + educatie in onboarding | Product |
| GDPR non-compliance bij launch | 🔴 Hoog | 🟡 Middel | Privacy policy + DPIA vóór launch | Legal |
| Social login verzoek van stakeholders | 🟡 Middel | 🟢 Laag | Data-driven argument voorbereiden (zie sectie 8) | Product |
| Key recovery failure (user verliest device) | 🟠 Hoog | 🟡 Middel | Multi-recovery opties: magic link + recovery codes | DevOps |

---

## 14. Slot: Van Strategie naar Executie

### ✅ Wat is Crystal Clear
- **Passkeys = primaire auth** (unaniem in alle docs)
- **Privacy-First = non-negotiable** (strategische kern)
- **Geen social login** (past niet bij branding)
- **Compliance frameworks** (ISO 27701 + NIST als fundering)

### ⚠️ Wat Onmiddellijke Aandacht Vereist
1. Encryptie-status huidige data → **Audit this week**
2. Rate limiting auth endpoints → **Implement ASAP**
3. Privacy policy definitieve versie → **Legal review Q1 2025**

### 🚀 Volgende Concrete Stappen

**Deze week:**
- [ ] Tech lead voert encryptie-audit uit
- [ ] Product owner prioriteert Fase 2 backlog items
- [ ] Founder beslist: certificering wel/niet (ISO 27701)

**Volgende sprint (2 weken):**
- [ ] Passkey proof-of-concept (1 developer, 40u)
- [ ] Privacy policy eerste draft (Legal consult 4u)
- [ ] Security audit offerte aanvragen (3 aanbieders)

**Q1 2025 Milestone:**
- [ ] Passkeys live in productie
- [ ] GDPR-compliant privacy stack
- [ ] Externe security audit afgerond
- [ ] Klaar voor limited public beta

---

## 📎 Bijlagen

### A. Referentie Links
- **WebAuthn Demo:** https://webauthn.io
- **GDPR Checklist:** https://gdpr.eu/checklist/
- **NIST Privacy Framework:** https://www.nist.gov/privacy-framework
- **OWASP ASVS:** https://owasp.org/www-project-application-security-verification-standard/

### B. Template: DPIA Kickoff Vragen
1. Welke nieuwe data verzamelen we?
2. Voor welk expliciet doel?
3. Kunnen we dit doel bereiken met minder data?
4. Hoe lang bewaren we dit?
5. Wie heeft toegang (intern/extern)?
6. Wat zijn de risico's voor betrokkenen?
7. Welke technische maatregelen nemen we?
8. Is er een Data Processing Agreement (DPA) nodig?

### C. Voorbeeld Recovery Code UI
```
╔════════════════════════════════════════╗
║  🔐 Bewaar deze codes op veilige plek  ║
║                                        ║
║  ABCD-EFGH-IJKL-MNOP                  ║
║  QRST-UVWX-YZAB-CDEF                  ║
║  GHIJ-KLMN-OPQR-STUV                  ║
║                                        ║
║  ✅ Gedownload                        ║
║  📧 Per email                         ║
║  🖨️ Print                             ║
╚════════════════════════════════════════╝
```

```js
describe('Encryption', () => {
  test('Data onleesbaar zonder device key', async () => {
    const plaintext = { amount: 50, category: 'groceries' };
    const encrypted = await encrypt(plaintext, deviceKey);
    
    // Zonder key → moet failure geven
    await expect(decrypt(encrypted, wrongKey)).rejects.toThrow();
  });
  
  test('Passkey registratie genereert unieke credentials', async () => {
    const cred1 = await createPasskey(user1);
    const cred2 = await createPasskey(user1); // Tweede device
    
    expect(cred1.id).not.toBe(cred2.id);
  });
});
```

### Integration Tests (Flow)
1. **Unified Auth Flow:**
   - Nieuwe gebruiker → Sign-up → Passkey prompt → Success
   - Bestaande gebruiker → Email herkend → Passkey challenge → Login
   
2. **Recovery Flow:**
   - Device verloren → Magic link → Nieuwe passkey registratie
   
3. **Data Persistence:**
   - Transactie opslaan → Logout → Login op nieuw device → Data zichtbaar (maar encrypted in DB)

### Manual Security Tests (Pentesting)
- SQL injection pogingen op transactie-endpoints
- XSS via notitievelden
- CSRF op state-changing actions
- Session fixation attacks
- Brute force wachtwoord pogingen (rate limiting check)

### Compliance Audit Checklist
- [ ] Privacy policy bevat alle GDPR verplichte elementen
- [ ] Consent is opt-in, niet pre-checked
- [ ] Data export werkt binnen 30 dagen (GDPR art. 20)
- [ ] Account verwijdering werkt binnen 30 dagen (GDPR art. 17)
- [ ] Breach notification procedure gedocumenteerd (72u GDPR art. 33)
- [ ] DPIA uitgevoerd voor high-risk processing

---

## 11. Aanbevolen Tech Stack (Aanvulling op Documenten)

### Authentication
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Passkeys | `@simplewebauthn/browser` + `@simplewebauthn/server` | Best-in-class WebAuthn impl |
| Magic Links | `nodemailer` + custom JWT | Full control, geen vendor lock-in |
| MFA (TOTP) | `otplib` | Open standard, offline-capable |

### Encryption
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Web | `SubtleCrypto API` (native) | Zero dependencies, browser-native |
| Mobile iOS | `CryptoKit` + Secure Enclave | Hardware-backed security |
| Mobile Android | `Jetpack Security` | Google-maintained, best practices |

### Privacy-Enhancing Technologies (Fase 4)
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Differential Privacy | `diffprivlib` (Python) | IBM-backed, production-ready |
| Secure Aggregation | `TensorFlow Federated` | Proven in production (Google) |

### Infrastructure
| **Component** | **Service** | **Privacy Rationale** |
|--------------|-----------|---------------------|
| Hosting | **Hetzner** of **OVH** (EU) | GDPR-compliant, EU data residency |
| Database | **PostgreSQL** + `pgcrypto` | Open-source, encryption-at-rest native |
| Email | **Postmark** of **Mailgun EU** | Transactional focus, GDPR-compliant |
| Monitoring | **Plausible Analytics** | Privacy-friendly alternative to Google Analytics |

**Anti-pattern:** Vermijd AWS US-regio's of Cloudflare Analytics (data doorgifte VS)

---

## 12. Definitieve Aanbevelingen (Prioriteiten)

### 🔥 Kritiek (Start vandaag)
1. **Audit huidige encryptie status** → Indien plaintext, urgent fixen
2. **Implementeer rate limiting** op auth endpoints (prevent brute force)
3. **Token expiry check** → Max 1 uur voor access tokens

### ⚡ Hoog (Volgende sprint)
4. **Passkey MVP implementatie** (WebAuthn basic flow)
5. **Privacy policy opstellen** (GDPR-template gebruiken)
6. **Magic link recovery** (fallback voor passkeys)

### 📊 Medium (Q1 2025)
7. **Unified sign-up/sign-in flow** (zie sectie 3)
8. **DPIA template** en eerste uitvoering
9. **External security audit** (budget: €5-15k voor SME pentesting)

### 🔮 Strategisch (Q2-Q4 2025)
10. **ISO 27701 certificering** voorbereiden (indien B2B/funding relevant)
11. **Differential Privacy analytics** (alleen voor onderzoeksdoeleinde)
12. **Multi-device sync** met end-to-end encryptie

---

## 13. Risico Matrix

| **Risico** | **Impact** | **Kans** | **Mitigatie** | **Owner** |
|-----------|-----------|---------|--------------|----------|
| Data breach door weak encryption | 🔴 Zeer hoog | 🟡 Middel | Client-side encryption implementeren (Fase 2) | CTO |
| Passkey adoption te laag | 🟡 Middel | 🟢 Laag | Magic link als fallback + educatie in onboarding | Product |
| GDPR non-compliance bij launch | 🔴 Hoog | 🟡 Middel | Privacy policy + DPIA vóór launch | Legal |
| Social login verzoek van stakeholders | 🟡 Middel | 🟢 Laag | Data-driven argument voorbereiden (zie sectie 8) | Product |
| Key recovery failure (user verliest device) | 🟠 Hoog | 🟡 Middel | Multi-recovery opties: magic link + recovery codes | DevOps |

---

## 14. Slot: Van Strategie naar Executie

### ✅ Wat is Crystal Clear
- **Passkeys = primaire auth** (unaniem in alle docs)
- **Privacy-First = non-negotiable** (strategische kern)
- **Geen social login** (past niet bij branding)
- **Compliance frameworks** (ISO 27701 + NIST als fundering)

### ⚠️ Wat Onmiddellijke Aandacht Vereist
1. Encryptie-status huidige data → **Audit this week**
2. Rate limiting auth endpoints → **Implement ASAP**
3. Privacy policy definitieve versie → **Legal review Q1 2025**

### 🚀 Volgende Concrete Stappen

**Deze week:**
- [ ] Tech lead voert encryptie-audit uit
- [ ] Product owner prioriteert Fase 2 backlog items
- [ ] Founder beslist: certificering wel/niet (ISO 27701)

**Volgende sprint (2 weken):**
- [ ] Passkey proof-of-concept (1 developer, 40u)
- [ ] Privacy policy eerste draft (Legal consult 4u)
- [ ] Security audit offerte aanvragen (3 aanbieders)

**Q1 2025 Milestone:**
- [ ] Passkeys live in productie
- [ ] GDPR-compliant privacy stack
- [ ] Externe security audit afgerond
- [ ] Klaar voor limited public beta

---

## 📎 Bijlagen

### A. Referentie Links
- **WebAuthn Demo:** https://webauthn.io
- **GDPR Checklist:** https://gdpr.eu/checklist/
- **NIST Privacy Framework:** https://www.nist.gov/privacy-framework
- **OWASP ASVS:** https://owasp.org/www-project-application-security-verification-standard/

### B. Template: DPIA Kickoff Vragen
1. Welke nieuwe data verzamelen we?
2. Voor welk expliciet doel?
3. Kunnen we dit doel bereiken met minder data?
4. Hoe lang bewaren we dit?
5. Wie heeft toegang (intern/extern)?
6. Wat zijn de risico's voor betrokkenen?
7. Welke technische maatregelen nemen we?
8. Is er een Data Processing Agreement (DPA) nodig?

### C. Voorbeeld Recovery Code UI
```
╔════════════════════════════════════════╗
║  🔐 Bewaar deze codes op veilige plek  ║
║                                        ║
║  ABCD-EFGH-IJKL-MNOP                  ║
║  QRST-UVWX-YZAB-CDEF                  ║
║  GHIJ-KLMN-OPQR-STUV                  ║
║                                        ║
║  ✅ Gedownload                        ║
║  📧 Per email                         ║
║  🖨️ Print                             ║
╚════════════════════════════════════════╝
```

| - Storage: Encrypted in OS keychain (iCloud Keychain | Google Password Manager) |
| --- | --- |
| - Privacy voordeel: Geen centraal wachtwoord database | geen credential stuffing mogelijk |

- Flow: Email → Beveiligde token (JWT met 15min TTL) → Auto-login
- Use case:

| - Security: Rate limiting (max 3 requests/15min) | token single-use |
| --- | --- |
| - Privacy: Email-gebaseerd | geen third-party tracking |

- Recovery wanneer passkey-device verloren is
- Onboarding nieuwe devices
- Fallback voor oudere browsers

| Key | Value |
| --- | --- |
| Scope | Alleen voor MVP-lancering (brede compatibiliteit) |
| MFA methode | TOTP (bijv. Google Authenticator) > SMS OTP |
| Migratiestrategie | Actief promoten passkey-upgrade na eerste login |
| Sunset plan | Optioneel maken na 70% passkey adoption |

| Key | Value |
| --- | --- |
| Reden | Conflicteert met "Privacy-First" branding |
| Data leakage | Name, email, friend graph, analytics tracking |
| Alternatief | Passkeys bieden vergelijkbare UX zonder privacy-trade-off |

- Web:  (native browser)
- Mobile:

| Key | Value |
| --- | --- |
| iOS | CryptoKit + Secure Enclave |
| Android | + Keystore |
| iOS | CryptoKit + Secure Enclave |
| Android | + Keystore |

| Key | Value |
| --- | --- |
| iOS | CryptoKit + Secure Enclave |
| Android | + Keystore |

| Key | Value |
| --- | --- |
| Probleem | Gebruiker verliest device met enige sleutel |
| Oplossing | Encrypted backup key in cloud, ontgrendeld via: |

| Recovery codes (gegenereerd bij setup | offline opgeslagen door user) |
| --- | --- |
| - Recovery codes (gegenereerd bij setup | offline opgeslagen door user) |

- Secondary device met passkey
- Recovery codes (gegenereerd bij setup, offline opgeslagen door user)

| - Pseudonimisatie: User ID is random UUID | niet afleidbaar |
| --- | --- |
| - Minimalisatie: Geen onnodige metadata (bijv. IP-logs | device fingerprints) |

- Setup flow (C1→C4→C7→C10)
- Dagelijkse transactie-invoer
- "Noot van Manasse" logica (save confirmation)
- Dashboard basis

- Implementeer Passkey registratie

WebAuthn library:  (web) of native APIs
Prompt tijdens onboarding: "Veiliger inloggen met gezichtsherkenning"
Fallback naar wachtwoord blijft beschikbaar
- WebAuthn library:  (web) of native APIs
- Prompt tijdens onboarding: "Veiliger inloggen met gezichtsherkenning"
- Fallback naar wachtwoord blijft beschikbaar
- Magic Link recovery

| Email service: Transactional email provider (bijv. SendGrid | Postmark) |
| --- | --- |
| - Email service: Transactional email provider (bijv. SendGrid | Postmark) |

- WebAuthn library:  (web) of native APIs
- Prompt tijdens onboarding: "Veiliger inloggen met gezichtsherkenning"
- Fallback naar wachtwoord blijft beschikbaar

| Key | Value |
| --- | --- |
| Email service | Transactional email provider (bijv. SendGrid, Postmark) |
| Token TTL | 15 minuten |
| Rate limiting | 3 pogingen per 15 min per IP |

- Encrypt-at-rest voor transacties en budgetdata
- Key derivation via biometric unlock (iOS/Android)
- Web fallback: PBKDF2 van master password

- Backend security audit

Penetration test door externe partij
OWASP Top 10 compliance check
API rate limiting en DDoS protectie
- Penetration test door externe partij
- OWASP Top 10 compliance check
- API rate limiting en DDoS protectie

- Penetration test door externe partij
- OWASP Top 10 compliance check
- API rate limiting en DDoS protectie

- Vraag gezinsdetails pas bij eerste budgetberekening
- "Waarom vragen we dit?" tooltips bij elk veld

- "Mijn gegevens" pagina met:

Data export (JSON download)
Account verwijdering (met bevestiging)
Toestemming intrekken voor analytics
- Data export (JSON download)
- Account verwijdering (met bevestiging)
- Toestemming intrekken voor analytics

- Data export (JSON download)
- Account verwijdering (met bevestiging)
- Toestemming intrekken voor analytics

- Differential Privacy implementatie

Library:  (Python) voor backend analytics
ε-budget: 1.0 voor aggregate queries
Geen individuele data-export naar onderzoekers
- Library:  (Python) voor backend analytics
- ε-budget: 1.0 voor aggregate queries
- Geen individuele data-export naar onderzoekers
- Federated Analytics (optioneel)

| Alleen model updates naar server | geen raw data |
| --- | --- |
| - Alleen model updates naar server | geen raw data |

Alleen geaggregeerde trends zichtbaar
Minimum threshold: 100 users per cohort
- Alleen geaggregeerde trends zichtbaar
- Minimum threshold: 100 users per cohort

| Key | Value |
| --- | --- |
| Library | (Python) voor backend analytics |
| ε | budget: 1.0 voor aggregate queries |
| Geen individuele data | export naar onderzoekers |

- On-device model training (TensorFlow Lite)
- Alleen model updates naar server, geen raw data

- Alleen geaggregeerde trends zichtbaar
- Minimum threshold: 100 users per cohort

| - Data leakage (email | naam | friend graph naar Meta/Google) |
| --- | --- | --- |
| - Complexiteit: OAuth flows | token refresh | revocation handling |

- Implementeer met opt-in consent (niet pre-checked)
- Minimaliseer scopes (alleen email, geen profile of friends)
- Transparante UI: "Dit deelt jouw email met [Provider]"

| - Document 1: "Lokale encryptiesleutels" → suggestie | geen confirmatie |
| --- | --- |
| - Document 2: "Zero-Knowledge Architectuur" → doel | geen implementatie |

| Key | Value |
| --- | --- |
| Audit huidige state | Controleer of transacties in database plaintext zijn |
| Indien plaintext | Urgent implementeren in Fase 2 (zie sectie 5) |
| Indien encrypted | Documenteer key management strategie |

| Key | Value |
| --- | --- |
| Voeg ISO 27018 toe (cloud privacy, relevant als je cloud | infra gebruikt) |
| Volg ENISA Cloud Security Guidelines voor hosting | keuzes |

- Auth Token Security

| HTTPOnly | Secure | SameSite=Strict cookies |
| --- | --- | --- |
| - HTTPOnly | Secure | SameSite=Strict cookies |

| Sanitize user input (transactie notities | gezinsnamen) |
| --- | --- |
| - Sanitize user input (transactie notities | gezinsnamen) |

| Audit logs: Wie | wat | wanneer → maar geen bedragen of content |
| --- | --- | --- |
| - Audit logs: Wie | wat | wanneer → maar geen bedragen of content |

- Huidige JWT expiry? → Check en zet op max 1 uur
- Implementeer refresh tokens (30 dagen) met rotation
- HTTPOnly, Secure, SameSite=Strict cookies

- Sanitize user input (transactie notities, gezinsnamen)
- Prevent XSS: Library DOMPurify voor web
- Rate limiting op alle POST endpoints

| Key | Value |
| --- | --- |
| Audit logs | Wie, wat, wanneer → maar geen bedragen of content |
| Voorbeeld GDPR | compliant log: |

- Dependency Audit

Run npm audit / pip-audit
Update kritieke vulnerabilities
Pin versies voor reproducible builds
- Run npm audit / pip-audit
- Update kritieke vulnerabilities
- Pin versies voor reproducible builds

- Run npm audit / pip-audit
- Update kritieke vulnerabilities
- Pin versies voor reproducible builds

- Passkey Implementatie (zie Fase 2)
- Encrypted Backup Systeem
- DPIA Template (reusable voor toekomstige features)

- Differential Privacy Analytics
- Formal Security Audit door third-party
- ISO 27701 Certificering (optioneel, maar sterk voor B2B/funding)

# 🔐 Geïntegreerde Privacy & Identity Architectuur

## Executive Summary

## 1. Strategische Positionering: Consistentie Analyse

### Kernbevindingen uit alle documenten

### 🎯 Conclusie

## 2. Authenticatie Architectuur: Definitieve Hiërarchie

### Geconsolideerde Beslisboom

### Technische Specificaties per Methode

#### 1️⃣ Passkeys / WebAuthn (FIDO2)

#### 2️⃣ Magic Links

#### 3️⃣ Wachtwoord + MFA

#### 4️⃣ Social Login: NIET IMPLEMENTEREN

## 3. Sign-up vs Sign-in: Unified Identity Flow

### Probleem in Huidige Implementatie

### 🆕 Aanbevolen Oplossing: Progressive Identity Discovery

### Implementatie Aanbevelingen

## 6. Data Model: Privacy-Conscious Design

### Minimale Dataset (MVP)

### Privacy-by-Design Principes Toegepast:

## 7. Roadmap: Geïntegreerde Fasering

### ✅ Fase 1: MVP - Foundation (Voltooid volgens Doc 3)

### 🔄 Fase 2: Security Hardening (Huidige focus)

### 🚀 Fase 3: UX Refinement & Governance (Q2 2025)

### 🔬 Fase 4: Research-Ready Architecture (Q3-Q4 2025)

## 8. Kritieke Verschillen & Aanbevelingen

### 🔴 Conflict: Social Login Vermelden

### 🟡 Onduidelijkheid: Huidige Encryptie Status

### 🟢 Consistentie: Compliance Frameworks

## 9. Technische Debt & Quick Wins

### Snelle Verbeteringen (< 1 week werk)

### Middelgroot (1-2 maanden)

### Langetermijn (Fase 4)

## 10. Testplan: Privacy & Security Validation

### Unit Tests (Technisch)

Definitieve Analyse, Vergelijking & Aanbevelingen

Deze analyse consolideert drie documentatiebronnen tot één strategisch implementatieplan. Alle bronnen convergeren naar dezelfde kernwaarden: privacy-first architectuur, passkeys als authenticatiestandaard, en dataminimalisatie als fundament. Het project bevindt zich in transitie van Fase 2 naar Fase 3, met een compliance-score van 93% en een heldere roadmap naar productierijpheid.

Alle bronnen wijzen naar één coherente visie. Geen conflicterende aanbevelingen gedetecteerd.

Documenten suggereren separate flows, maar moderne best practice is één unified experience.

javascript

Library-keuzes:

Key Management:
javascript
Recovery scenario:

| Household Data (gevoelig | encrypted): |
| --- | --- |
| Transacties (gevoelig | encrypted): |

Compliance status: 93% ✅

Prioriteit 1 - Auth Upgrade:

| Key | Value |
| --- | --- |
| Prioriteit 2 | Data Protection: |
| 3. Client | side encryptie implementeren |

| Key | Value |
| --- | --- |
| Deliverable | Veilige authenticatie en encrypted data storage |
| Tijdslijn | 2-3 maanden |

Prioriteit 1 - Progressive Profiling:
5. Unified sign-up/sign-in flow (zie sectie 3)
6. Contextual data collection

Prioriteit 2 - Compliance Formalisering:
7. DPIA documentatie opstellen
8. Privacy policy generator (gebruiksvriendelijke versie)
9. Consent management dashboard

| Key | Value |
| --- | --- |
| Prioriteit 3 | Personalisatie (uit Doc 3): |
| 10. Conditionele rendering van kinderen | chips |
| 11. Transactie | overzicht met Edit/Delete |
| Deliverable | Production-ready app met volledige GDPR compliance |
| Tijdslijn | 3 maanden |

Alleen als onderzoeksfunctie gewenst:

| Key | Value |
| --- | --- |
| Deliverable | Onderzoek mogelijk zonder privacy-compromis |
| Tijdslijn | 6 maanden (optioneel) |

Definitief besluit: NIET implementeren, zelfs niet optioneel. Redenen:

Uitzondering: Als marktonderzoek expliciet aantoont dat dit dealbreaker is voor doelgroep, dan:

Vraag: Is data momenteel encrypted-at-rest?
Uit documenten:

Aanbeveling:

Alle documenten noemen ISO 27701 en NIST Privacy Framework → Sterk fundament.
Aanbeveling:

json

javascript

| Key | Value |
| --- | --- |
| Document versie | 1.0 |
| Datum | 7 december 2024 |
| Status | Definitief implementatieplan |
| Volgende review | Q1 2025 na Fase 2 voltooiing |

---

**Claude:**

| Aspect | Document 1 | Document 2 | Document 3 | Status |
| --- | --- | --- | --- | --- |
| Privacy-First UVP | ✅ Expliciet benoemd | ✅ Centraal principe | ✅ Gedefinieerd als kern-UVP | Volledig aligned |
| Geen bankkoppeling | ✅ Risico-eliminatie | ⚠️ Impliciet | ✅ Expliciet onderdeel UVP | Consistent |
| Passkeys als primair | ✅ Gouden standaard | ✅ Hoogste score (5/5) | ✅ Geselecteerd als primair | Unaniem |
| Social Login vermijden | ✅ Bewust vermeden | ⚠️ Hoge privacy-impact | ❌ Niet genoemd | Consensus bereikt |
| Compliance frameworks | ✅ GDPR, ISO 27001/27701, NIST | ✅ GDPR, ISO 27701, NIST, OWASP | ✅ ISO 27701:2025, NIST 1.1 | Volledig gedekt |

---

**Claude:**

```
┌─────────────────────────────────────┐
│   User wil inloggen/registreren     │
└──────────────┬──────────────────────┘
               │
        ┌──────▼──────┐
        │ Passkey      │  ← PRIMAIR (UX: 5/5, Security: 5/5, Privacy: Laag)
        │ beschikbaar? │
        └──┬────────┬──┘
           │ Ja     │ Nee
           │        │
           ▼        ▼
     ┌─────────┐  ┌─────────────┐
     │ Biometric│  │ Magic Link  │  ← FALLBACK (UX: 4/5, Security: 3/5)
     │ Unlock   │  │ versturen   │
     └─────────┘  └──────┬──────┘
                         │ Fallback
                         ▼
                  ┌──────────────┐
                  │ Wachtwoord + │  ← LEGACY (UX: 3/5, Security: 4/5)
                  │ MFA (TOTP)   │     Alleen voor MVP-compatibiliteit
                  └──────────────┘
```

```
┌─────────────────────────────────────┐
│   User wil inloggen/registreren     │
└──────────────┬──────────────────────┘
               │
        ┌──────▼──────┐
        │ Passkey      │  ← PRIMAIR (UX: 5/5, Security: 5/5, Privacy: Laag)
        │ beschikbaar? │
        └──┬────────┬──┘
           │ Ja     │ Nee
           │        │
           ▼        ▼
     ┌─────────┐  ┌─────────────┐
     │ Biometric│  │ Magic Link  │  ← FALLBACK (UX: 4/5, Security: 3/5)
     │ Unlock   │  │ versturen   │
     └─────────┘  └──────┬──────┘
                         │ Fallback
                         ▼
                  ┌──────────────┐
                  │ Wachtwoord + │  ← LEGACY (UX: 3/5, Security: 4/5)
                  │ MFA (TOTP)   │     Alleen voor MVP-compatibiliteit
                  └──────────────┘
```

---

**Claude:**

```js
// Pseudo-code voor unified flow
async function handleAuthAttempt(identifier) {
  const user = await checkUserExists(identifier); // Email/phone check
  
  if (user.exists) {
    // SIGN-IN flow
    if (user.hasPasskey) {
      return initiateWebAuthn(user.id);
    } else {
      return showPasswordForm(identifier);
    }
  } else {
    // SIGN-UP flow
    return initiateRegistration(identifier, {
      suggestPasskey: true,
      progressiveProfile: true // Alleen essentials vragen
    });
  }
}
```

### UX Implementatie
**Eén knop voor beide flows:**
```
┌─────────────────────────────────────┐
│  📧 E-mailadres                     │
│  ┌───────────────────────────────┐ │
│  │ user@example.com              │ │
│  └───────────────────────────────┘ │
│                                     │
│  [ Ga verder ]  ← Detecteert auto  │
│                    of signup/signin │
└─────────────────────────────────────┘
```

### Progressive Profiling (Sign-up)
**Fase 1 - Alleen essentials:**
- Email (identificatie)
- Passkey registratie (of wachtwoord als fallback)

**Fase 2 - Op natuurlijke momenten:**
- Gezinssamenstelling → Bij eerste gebruik budgetverdeling
- Inkomsten/lasten → Wanneer dashboard insight vraagt

**Voordeel:** Lagere signup-friction, hogere conversie

---

## 4. Privacy Governance: Geconsolideerd Framework

### Compliance Matrix (Alle Bronnen)

| **Framework** | **Document 1** | **Document 2** | **Document 3** | **Implementatie Status** |
|---------------|---------------|---------------|---------------|------------------------|
| **GDPR/AVG** | ✅ Genoemd | ✅ Kern-principe | ✅ Impliciet | 🟢 Basis compliant |
| **ISO 27001** | ✅ Expliciet | ❌ | ❌ | 🟡 Nog te implementeren |
| **ISO 27701:2025** | ✅ Update genoemd | ✅ Privacy Management | ✅ Versie 2025 | 🟢 Target framework |
| **NIST Privacy Framework** | ✅ V1.1 | ✅ Risicogebaseerd | ✅ Protect/Govern | 🟢 Aligned |
| **OWASP ASVS** | ✅ Secure coding | ✅ Auth richtlijnen | ❌ | 🟡 Toepassen in code review |
| **ENISA Guidelines** | ✅ Data Protection Engineering | ❌ | ❌ | 🟡 Referentie voor PETs |

### DPIA Trigger Points (Nieuw uit analyse)
Een **Data Protection Impact Assessment** is verplicht bij:
1. **Introductie analytics** voor armoedeonderzoek (Document 1 & 3)
2. **Data-aggregatie** voor trendanalyse (Document 2)
3. **Nieuwe datavelden** buiten huidige minimale set

**Aanbeveling:** Plan DPIA **vóór** implementatie van Fase 4 (Research Architecture)

---

## 5. Zero-Knowledge Architectuur: Technische Diepduik

### Huidige Status vs Target State

**Huidige implementatie (uit Document 3):**
- ✅ Geen bankkoppeling
- ✅ Lokale transactie-invoer
- ⚠️ Encryptie-status onduidelijk

**Target architectuur (uit alle documenten):**
```
┌─────────────────────────────────────────────┐
│          USER DEVICE (Client-side)          │
│  ┌───────────────────────────────────────┐  │
│  │ 1. User Data (plaintext)              │  │
│  │    - Transacties, budget, gezinsdata  │  │
│  └──────────────┬────────────────────────┘  │
│                 │ Encrypted with             │
│                 ▼ Device Key (biometric lock)│
│  ┌───────────────────────────────────────┐  │
│  │ 2. Encrypted Blob (AES-256-GCM)      │  │
│  └──────────────┬────────────────────────┘  │
└─────────────────┼──────────────────────────┘
                  │ Stored on
                  ▼
┌─────────────────────────────────────────────┐
│          SERVER (Backend)                   │
│  ┌───────────────────────────────────────┐  │
│  │ 3. Encrypted Data (server kan niet    │  │
│  │    decrypten zonder device key)       │  │
│  └───────────────────────────────────────┘  │
│  ┌───────────────────────────────────────┐  │
│  │ 4. Metadata (niet-gevoelig)           │  │
│  │    - User ID, created_at, sync_status │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

```js
// Pseudo-code voor unified flow
async function handleAuthAttempt(identifier) {
  const user = await checkUserExists(identifier); // Email/phone check
  
  if (user.exists) {
    // SIGN-IN flow
    if (user.hasPasskey) {
      return initiateWebAuthn(user.id);
    } else {
      return showPasswordForm(identifier);
    }
  } else {
    // SIGN-UP flow
    return initiateRegistration(identifier, {
      suggestPasskey: true,
      progressiveProfile: true // Alleen essentials vragen
    });
  }
}
```

### UX Implementatie
**Eén knop voor beide flows:**
```
┌─────────────────────────────────────┐
│  📧 E-mailadres                     │
│  ┌───────────────────────────────┐ │
│  │ user@example.com              │ │
│  └───────────────────────────────┘ │
│                                     │
│  [ Ga verder ]  ← Detecteert auto  │
│                    of signup/signin │
└─────────────────────────────────────┘
```

### Progressive Profiling (Sign-up)
**Fase 1 - Alleen essentials:**
- Email (identificatie)
- Passkey registratie (of wachtwoord als fallback)

**Fase 2 - Op natuurlijke momenten:**
- Gezinssamenstelling → Bij eerste gebruik budgetverdeling
- Inkomsten/lasten → Wanneer dashboard insight vraagt

**Voordeel:** Lagere signup-friction, hogere conversie

---

## 4. Privacy Governance: Geconsolideerd Framework

### Compliance Matrix (Alle Bronnen)

| **Framework** | **Document 1** | **Document 2** | **Document 3** | **Implementatie Status** |
|---------------|---------------|---------------|---------------|------------------------|
| **GDPR/AVG** | ✅ Genoemd | ✅ Kern-principe | ✅ Impliciet | 🟢 Basis compliant |
| **ISO 27001** | ✅ Expliciet | ❌ | ❌ | 🟡 Nog te implementeren |
| **ISO 27701:2025** | ✅ Update genoemd | ✅ Privacy Management | ✅ Versie 2025 | 🟢 Target framework |
| **NIST Privacy Framework** | ✅ V1.1 | ✅ Risicogebaseerd | ✅ Protect/Govern | 🟢 Aligned |
| **OWASP ASVS** | ✅ Secure coding | ✅ Auth richtlijnen | ❌ | 🟡 Toepassen in code review |
| **ENISA Guidelines** | ✅ Data Protection Engineering | ❌ | ❌ | 🟡 Referentie voor PETs |

### DPIA Trigger Points (Nieuw uit analyse)
Een **Data Protection Impact Assessment** is verplicht bij:
1. **Introductie analytics** voor armoedeonderzoek (Document 1 & 3)
2. **Data-aggregatie** voor trendanalyse (Document 2)
3. **Nieuwe datavelden** buiten huidige minimale set

**Aanbeveling:** Plan DPIA **vóór** implementatie van Fase 4 (Research Architecture)

---

## 5. Zero-Knowledge Architectuur: Technische Diepduik

### Huidige Status vs Target State

**Huidige implementatie (uit Document 3):**
- ✅ Geen bankkoppeling
- ✅ Lokale transactie-invoer
- ⚠️ Encryptie-status onduidelijk

**Target architectuur (uit alle documenten):**
```
┌─────────────────────────────────────────────┐
│          USER DEVICE (Client-side)          │
│  ┌───────────────────────────────────────┐  │
│  │ 1. User Data (plaintext)              │  │
│  │    - Transacties, budget, gezinsdata  │  │
│  └──────────────┬────────────────────────┘  │
│                 │ Encrypted with             │
│                 ▼ Device Key (biometric lock)│
│  ┌───────────────────────────────────────┐  │
│  │ 2. Encrypted Blob (AES-256-GCM)      │  │
│  └──────────────┬────────────────────────┘  │
└─────────────────┼──────────────────────────┘
                  │ Stored on
                  ▼
┌─────────────────────────────────────────────┐
│          SERVER (Backend)                   │
│  ┌───────────────────────────────────────┐  │
│  │ 3. Encrypted Data (server kan niet    │  │
│  │    decrypten zonder device key)       │  │
│  └───────────────────────────────────────┘  │
│  ┌───────────────────────────────────────┐  │
│  │ 4. Metadata (niet-gevoelig)           │  │
│  │    - User ID, created_at, sync_status │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

javascript

---

**Claude:**

javascript

---

**Claude:**

```js
// Pseudo-code voor unified flow
async function handleAuthAttempt(identifier) {
  const user = await checkUserExists(identifier); // Email/phone check
  
  if (user.exists) {
    // SIGN-IN flow
    if (user.hasPasskey) {
      return initiateWebAuthn(user.id);
    } else {
      return showPasswordForm(identifier);
    }
  } else {
    // SIGN-UP flow
    return initiateRegistration(identifier, {
      suggestPasskey: true,
      progressiveProfile: true // Alleen essentials vragen
    });
  }
}
```

### UX Implementatie
**Eén knop voor beide flows:**
```
┌─────────────────────────────────────┐
│  📧 E-mailadres                     │
│  ┌───────────────────────────────┐ │
│  │ user@example.com              │ │
│  └───────────────────────────────┘ │
│                                     │
│  [ Ga verder ]  ← Detecteert auto  │
│                    of signup/signin │
└─────────────────────────────────────┘
```

### Progressive Profiling (Sign-up)
**Fase 1 - Alleen essentials:**
- Email (identificatie)
- Passkey registratie (of wachtwoord als fallback)

**Fase 2 - Op natuurlijke momenten:**
- Gezinssamenstelling → Bij eerste gebruik budgetverdeling
- Inkomsten/lasten → Wanneer dashboard insight vraagt

**Voordeel:** Lagere signup-friction, hogere conversie

---

## 4. Privacy Governance: Geconsolideerd Framework

### Compliance Matrix (Alle Bronnen)

| **Framework** | **Document 1** | **Document 2** | **Document 3** | **Implementatie Status** |
|---------------|---------------|---------------|---------------|------------------------|
| **GDPR/AVG** | ✅ Genoemd | ✅ Kern-principe | ✅ Impliciet | 🟢 Basis compliant |
| **ISO 27001** | ✅ Expliciet | ❌ | ❌ | 🟡 Nog te implementeren |
| **ISO 27701:2025** | ✅ Update genoemd | ✅ Privacy Management | ✅ Versie 2025 | 🟢 Target framework |
| **NIST Privacy Framework** | ✅ V1.1 | ✅ Risicogebaseerd | ✅ Protect/Govern | 🟢 Aligned |
| **OWASP ASVS** | ✅ Secure coding | ✅ Auth richtlijnen | ❌ | 🟡 Toepassen in code review |
| **ENISA Guidelines** | ✅ Data Protection Engineering | ❌ | ❌ | 🟡 Referentie voor PETs |

### DPIA Trigger Points (Nieuw uit analyse)
Een **Data Protection Impact Assessment** is verplicht bij:
1. **Introductie analytics** voor armoedeonderzoek (Document 1 & 3)
2. **Data-aggregatie** voor trendanalyse (Document 2)
3. **Nieuwe datavelden** buiten huidige minimale set

**Aanbeveling:** Plan DPIA **vóór** implementatie van Fase 4 (Research Architecture)

---

## 5. Zero-Knowledge Architectuur: Technische Diepduik

### Huidige Status vs Target State

**Huidige implementatie (uit Document 3):**
- ✅ Geen bankkoppeling
- ✅ Lokale transactie-invoer
- ⚠️ Encryptie-status onduidelijk

**Target architectuur (uit alle documenten):**
```
┌─────────────────────────────────────────────┐
│          USER DEVICE (Client-side)          │
│  ┌───────────────────────────────────────┐  │
│  │ 1. User Data (plaintext)              │  │
│  │    - Transacties, budget, gezinsdata  │  │
│  └──────────────┬────────────────────────┘  │
│                 │ Encrypted with             │
│                 ▼ Device Key (biometric lock)│
│  ┌───────────────────────────────────────┐  │
│  │ 2. Encrypted Blob (AES-256-GCM)      │  │
│  └──────────────┬────────────────────────┘  │
└─────────────────┼──────────────────────────┘
                  │ Stored on
                  ▼
┌─────────────────────────────────────────────┐
│          SERVER (Backend)                   │
│  ┌───────────────────────────────────────┐  │
│  │ 3. Encrypted Data (server kan niet    │  │
│  │    decrypten zonder device key)       │  │
│  └───────────────────────────────────────┘  │
│  ┌───────────────────────────────────────┐  │
│  │ 4. Metadata (niet-gevoelig)           │  │
│  │    - User ID, created_at, sync_status │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

```js
// Pseudo-code voor unified flow
async function handleAuthAttempt(identifier) {
  const user = await checkUserExists(identifier); // Email/phone check
  
  if (user.exists) {
    // SIGN-IN flow
    if (user.hasPasskey) {
      return initiateWebAuthn(user.id);
    } else {
      return showPasswordForm(identifier);
    }
  } else {
    // SIGN-UP flow
    return initiateRegistration(identifier, {
      suggestPasskey: true,
      progressiveProfile: true // Alleen essentials vragen
    });
  }
}
```

### UX Implementatie
**Eén knop voor beide flows:**
```
┌─────────────────────────────────────┐
│  📧 E-mailadres                     │
│  ┌───────────────────────────────┐ │
│  │ user@example.com              │ │
│  └───────────────────────────────┘ │
│                                     │
│  [ Ga verder ]  ← Detecteert auto  │
│                    of signup/signin │
└─────────────────────────────────────┘
```

### Progressive Profiling (Sign-up)
**Fase 1 - Alleen essentials:**
- Email (identificatie)
- Passkey registratie (of wachtwoord als fallback)

**Fase 2 - Op natuurlijke momenten:**
- Gezinssamenstelling → Bij eerste gebruik budgetverdeling
- Inkomsten/lasten → Wanneer dashboard insight vraagt

**Voordeel:** Lagere signup-friction, hogere conversie

---

## 4. Privacy Governance: Geconsolideerd Framework

### Compliance Matrix (Alle Bronnen)

| **Framework** | **Document 1** | **Document 2** | **Document 3** | **Implementatie Status** |
|---------------|---------------|---------------|---------------|------------------------|
| **GDPR/AVG** | ✅ Genoemd | ✅ Kern-principe | ✅ Impliciet | 🟢 Basis compliant |
| **ISO 27001** | ✅ Expliciet | ❌ | ❌ | 🟡 Nog te implementeren |
| **ISO 27701:2025** | ✅ Update genoemd | ✅ Privacy Management | ✅ Versie 2025 | 🟢 Target framework |
| **NIST Privacy Framework** | ✅ V1.1 | ✅ Risicogebaseerd | ✅ Protect/Govern | 🟢 Aligned |
| **OWASP ASVS** | ✅ Secure coding | ✅ Auth richtlijnen | ❌ | 🟡 Toepassen in code review |
| **ENISA Guidelines** | ✅ Data Protection Engineering | ❌ | ❌ | 🟡 Referentie voor PETs |

### DPIA Trigger Points (Nieuw uit analyse)
Een **Data Protection Impact Assessment** is verplicht bij:
1. **Introductie analytics** voor armoedeonderzoek (Document 1 & 3)
2. **Data-aggregatie** voor trendanalyse (Document 2)
3. **Nieuwe datavelden** buiten huidige minimale set

**Aanbeveling:** Plan DPIA **vóór** implementatie van Fase 4 (Research Architecture)

---

## 5. Zero-Knowledge Architectuur: Technische Diepduik

### Huidige Status vs Target State

**Huidige implementatie (uit Document 3):**
- ✅ Geen bankkoppeling
- ✅ Lokale transactie-invoer
- ⚠️ Encryptie-status onduidelijk

**Target architectuur (uit alle documenten):**
```
┌─────────────────────────────────────────────┐
│          USER DEVICE (Client-side)          │
│  ┌───────────────────────────────────────┐  │
│  │ 1. User Data (plaintext)              │  │
│  │    - Transacties, budget, gezinsdata  │  │
│  └──────────────┬────────────────────────┘  │
│                 │ Encrypted with             │
│                 ▼ Device Key (biometric lock)│
│  ┌───────────────────────────────────────┐  │
│  │ 2. Encrypted Blob (AES-256-GCM)      │  │
│  └──────────────┬────────────────────────┘  │
└─────────────────┼──────────────────────────┘
                  │ Stored on
                  ▼
┌─────────────────────────────────────────────┐
│          SERVER (Backend)                   │
│  ┌───────────────────────────────────────┐  │
│  │ 3. Encrypted Data (server kan niet    │  │
│  │    decrypten zonder device key)       │  │
│  └───────────────────────────────────────┘  │
│  ┌───────────────────────────────────────┐  │
│  │ 4. Metadata (niet-gevoelig)           │  │
│  │    - User ID, created_at, sync_status │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

---

**Claude:**

```
// Pseudo-code voor key derivation
const deviceKey = await deriveKeyFromBiometric({
  userID: user.id,
  biometricData: faceID_or_fingerprint,
  salt: stored_device_salt
});

const encryptedData = await encryptWithKey(userData, deviceKey);
```

```js
// Pseudo-code voor key derivation
const deviceKey = await deriveKeyFromBiometric({
  userID: user.id,
  biometricData: faceID_or_fingerprint,
  salt: stored_device_salt
});

const encryptedData = await encryptWithKey(userData, deviceKey);
```

javascript

---

**Claude:**

```
// Pseudo-code voor key derivation
const deviceKey = await deriveKeyFromBiometric({
  userID: user.id,
  biometricData: faceID_or_fingerprint,
  salt: stored_device_salt
});

const encryptedData = await encryptWithKey(userData, deviceKey);
```

```js
// Pseudo-code voor key derivation
const deviceKey = await deriveKeyFromBiometric({
  userID: user.id,
  biometricData: faceID_or_fingerprint,
  salt: stored_device_salt
});

const encryptedData = await encryptWithKey(userData, deviceKey);
```

---

**Claude:**

```json
{
  "user_id": "uuid",
  "email_hash": "sha256(email)", // Voor duplicate check
  "created_at": "timestamp",
  "last_login": "timestamp"
}
```

```js
{
  "user_id": "uuid",
  "email_hash": "sha256(email)", // Voor duplicate check
  "created_at": "timestamp",
  "last_login": "timestamp"
}
```

json

---

**Claude:**

json

---

**Claude:**

```json
{
  "user_id": "uuid",
  "email_hash": "sha256(email)", // Voor duplicate check
  "created_at": "timestamp",
  "last_login": "timestamp"
}
```

```js
{
  "user_id": "uuid",
  "email_hash": "sha256(email)", // Voor duplicate check
  "created_at": "timestamp",
  "last_login": "timestamp"
}
```

---

**Claude:**

```json
{
  "adults_count": 2,
  "children": [
    {"age_bracket": "0-5", "name_encrypted": "..."}, // Naam alleen lokaal opgeslagen
    {"age_bracket": "6-12", "name_encrypted": "..."}
  ],
  "income_sources": [
    {"type": "salary", "frequency": "monthly", "amount_encrypted": "..."}
  ]
}
```

```js
{
  "adults_count": 2,
  "children": [
    {"age_bracket": "0-5", "name_encrypted": "..."}, // Naam alleen lokaal opgeslagen
    {"age_bracket": "6-12", "name_encrypted": "..."}
  ],
  "income_sources": [
    {"type": "salary", "frequency": "monthly", "amount_encrypted": "..."}
  ]
}
```

json

---

**Claude:**

```json
{
  "adults_count": 2,
  "children": [
    {"age_bracket": "0-5", "name_encrypted": "..."}, // Naam alleen lokaal opgeslagen
    {"age_bracket": "6-12", "name_encrypted": "..."}
  ],
  "income_sources": [
    {"type": "salary", "frequency": "monthly", "amount_encrypted": "..."}
  ]
}
```

```js
{
  "adults_count": 2,
  "children": [
    {"age_bracket": "0-5", "name_encrypted": "..."}, // Naam alleen lokaal opgeslagen
    {"age_bracket": "6-12", "name_encrypted": "..."}
  ],
  "income_sources": [
    {"type": "salary", "frequency": "monthly", "amount_encrypted": "..."}
  ]
}
```

---

**Claude:**

```json
{
  "transaction_id": "uuid",
  "date": "2024-12-07",
  "category_id": "groceries", // Niet-gevoelig
  "amount_encrypted": "...",
  "notes_encrypted": "..." // Optioneel
}
```

```js
{
  "transaction_id": "uuid",
  "date": "2024-12-07",
  "category_id": "groceries", // Niet-gevoelig
  "amount_encrypted": "...",
  "notes_encrypted": "..." // Optioneel
}
```

json

---

**Claude:**

```json
{
  "transaction_id": "uuid",
  "date": "2024-12-07",
  "category_id": "groceries", // Niet-gevoelig
  "amount_encrypted": "...",
  "notes_encrypted": "..." // Optioneel
}
```

```js
{
  "transaction_id": "uuid",
  "date": "2024-12-07",
  "category_id": "groceries", // Niet-gevoelig
  "amount_encrypted": "...",
  "notes_encrypted": "..." // Optioneel
}
```

---

**Claude:**

| Document | Standpunt | Aanbeveling |
| --- | --- | --- |
| Document 1 | ❌ Bewust vermijden | ✅ Volgen |
| Document 2 | ⚠️ Hoge privacy-impact, maar "optioneel" suggereert beschikbaarheid | ❌ Te risicovol |
| Document 3 | 🤷 Niet genoemd | - |

---

**Claude:**

```json
{
       "user_id_hash": "sha256(...)",
       "action": "transaction_created",
       "timestamp": "2024-12-07T10:30:00Z",
       "ip_subnet": "192.168.1.0/24" // Laatste octet verwijderd
     }
```

```js
{
       "user_id_hash": "sha256(...)",
       "action": "transaction_created",
       "timestamp": "2024-12-07T10:30:00Z",
       "ip_subnet": "192.168.1.0/24" // Laatste octet verwijderd
     }
```

json

---

**Claude:**

```json
{
       "user_id_hash": "sha256(...)",
       "action": "transaction_created",
       "timestamp": "2024-12-07T10:30:00Z",
       "ip_subnet": "192.168.1.0/24" // Laatste octet verwijderd
     }
```

```js
{
       "user_id_hash": "sha256(...)",
       "action": "transaction_created",
       "timestamp": "2024-12-07T10:30:00Z",
       "ip_subnet": "192.168.1.0/24" // Laatste octet verwijderd
     }
```

---

**Claude:**

```
describe('Encryption', () => {
  test('Data onleesbaar zonder device key', async () => {
    const plaintext = { amount: 50, category: 'groceries' };
    const encrypted = await encrypt(plaintext, deviceKey);
    
    // Zonder key → moet failure geven
    await expect(decrypt(encrypted, wrongKey)).rejects.toThrow();
  });
  
  test('Passkey registratie genereert unieke credentials', async () => {
    const cred1 = await createPasskey(user1);
    const cred2 = await createPasskey(user1); // Tweede device
    
    expect(cred1.id).not.toBe(cred2.id);
  });
});
```

### Integration Tests (Flow)
1. **Unified Auth Flow:**
   - Nieuwe gebruiker → Sign-up → Passkey prompt → Success
   - Bestaande gebruiker → Email herkend → Passkey challenge → Login
   
2. **Recovery Flow:**
   - Device verloren → Magic link → Nieuwe passkey registratie
   
3. **Data Persistence:**
   - Transactie opslaan → Logout → Login op nieuw device → Data zichtbaar (maar encrypted in DB)

### Manual Security Tests (Pentesting)
- SQL injection pogingen op transactie-endpoints
- XSS via notitievelden
- CSRF op state-changing actions
- Session fixation attacks
- Brute force wachtwoord pogingen (rate limiting check)

### Compliance Audit Checklist
- [ ] Privacy policy bevat alle GDPR verplichte elementen
- [ ] Consent is opt-in, niet pre-checked
- [ ] Data export werkt binnen 30 dagen (GDPR art. 20)
- [ ] Account verwijdering werkt binnen 30 dagen (GDPR art. 17)
- [ ] Breach notification procedure gedocumenteerd (72u GDPR art. 33)
- [ ] DPIA uitgevoerd voor high-risk processing

---

## 11. Aanbevolen Tech Stack (Aanvulling op Documenten)

### Authentication
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Passkeys | `@simplewebauthn/browser` + `@simplewebauthn/server` | Best-in-class WebAuthn impl |
| Magic Links | `nodemailer` + custom JWT | Full control, geen vendor lock-in |
| MFA (TOTP) | `otplib` | Open standard, offline-capable |

### Encryption
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Web | `SubtleCrypto API` (native) | Zero dependencies, browser-native |
| Mobile iOS | `CryptoKit` + Secure Enclave | Hardware-backed security |
| Mobile Android | `Jetpack Security` | Google-maintained, best practices |

### Privacy-Enhancing Technologies (Fase 4)
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Differential Privacy | `diffprivlib` (Python) | IBM-backed, production-ready |
| Secure Aggregation | `TensorFlow Federated` | Proven in production (Google) |

### Infrastructure
| **Component** | **Service** | **Privacy Rationale** |
|--------------|-----------|---------------------|
| Hosting | **Hetzner** of **OVH** (EU) | GDPR-compliant, EU data residency |
| Database | **PostgreSQL** + `pgcrypto` | Open-source, encryption-at-rest native |
| Email | **Postmark** of **Mailgun EU** | Transactional focus, GDPR-compliant |
| Monitoring | **Plausible Analytics** | Privacy-friendly alternative to Google Analytics |

**Anti-pattern:** Vermijd AWS US-regio's of Cloudflare Analytics (data doorgifte VS)

---

## 12. Definitieve Aanbevelingen (Prioriteiten)

### 🔥 Kritiek (Start vandaag)
1. **Audit huidige encryptie status** → Indien plaintext, urgent fixen
2. **Implementeer rate limiting** op auth endpoints (prevent brute force)
3. **Token expiry check** → Max 1 uur voor access tokens

### ⚡ Hoog (Volgende sprint)
4. **Passkey MVP implementatie** (WebAuthn basic flow)
5. **Privacy policy opstellen** (GDPR-template gebruiken)
6. **Magic link recovery** (fallback voor passkeys)

### 📊 Medium (Q1 2025)
7. **Unified sign-up/sign-in flow** (zie sectie 3)
8. **DPIA template** en eerste uitvoering
9. **External security audit** (budget: €5-15k voor SME pentesting)

### 🔮 Strategisch (Q2-Q4 2025)
10. **ISO 27701 certificering** voorbereiden (indien B2B/funding relevant)
11. **Differential Privacy analytics** (alleen voor onderzoeksdoeleinde)
12. **Multi-device sync** met end-to-end encryptie

---

## 13. Risico Matrix

| **Risico** | **Impact** | **Kans** | **Mitigatie** | **Owner** |
|-----------|-----------|---------|--------------|----------|
| Data breach door weak encryption | 🔴 Zeer hoog | 🟡 Middel | Client-side encryption implementeren (Fase 2) | CTO |
| Passkey adoption te laag | 🟡 Middel | 🟢 Laag | Magic link als fallback + educatie in onboarding | Product |
| GDPR non-compliance bij launch | 🔴 Hoog | 🟡 Middel | Privacy policy + DPIA vóór launch | Legal |
| Social login verzoek van stakeholders | 🟡 Middel | 🟢 Laag | Data-driven argument voorbereiden (zie sectie 8) | Product |
| Key recovery failure (user verliest device) | 🟠 Hoog | 🟡 Middel | Multi-recovery opties: magic link + recovery codes | DevOps |

---

## 14. Slot: Van Strategie naar Executie

### ✅ Wat is Crystal Clear
- **Passkeys = primaire auth** (unaniem in alle docs)
- **Privacy-First = non-negotiable** (strategische kern)
- **Geen social login** (past niet bij branding)
- **Compliance frameworks** (ISO 27701 + NIST als fundering)

### ⚠️ Wat Onmiddellijke Aandacht Vereist
1. Encryptie-status huidige data → **Audit this week**
2. Rate limiting auth endpoints → **Implement ASAP**
3. Privacy policy definitieve versie → **Legal review Q1 2025**

### 🚀 Volgende Concrete Stappen

**Deze week:**
- [ ] Tech lead voert encryptie-audit uit
- [ ] Product owner prioriteert Fase 2 backlog items
- [ ] Founder beslist: certificering wel/niet (ISO 27701)

**Volgende sprint (2 weken):**
- [ ] Passkey proof-of-concept (1 developer, 40u)
- [ ] Privacy policy eerste draft (Legal consult 4u)
- [ ] Security audit offerte aanvragen (3 aanbieders)

**Q1 2025 Milestone:**
- [ ] Passkeys live in productie
- [ ] GDPR-compliant privacy stack
- [ ] Externe security audit afgerond
- [ ] Klaar voor limited public beta

---

## 📎 Bijlagen

### A. Referentie Links
- **WebAuthn Demo:** https://webauthn.io
- **GDPR Checklist:** https://gdpr.eu/checklist/
- **NIST Privacy Framework:** https://www.nist.gov/privacy-framework
- **OWASP ASVS:** https://owasp.org/www-project-application-security-verification-standard/

### B. Template: DPIA Kickoff Vragen
1. Welke nieuwe data verzamelen we?
2. Voor welk expliciet doel?
3. Kunnen we dit doel bereiken met minder data?
4. Hoe lang bewaren we dit?
5. Wie heeft toegang (intern/extern)?
6. Wat zijn de risico's voor betrokkenen?
7. Welke technische maatregelen nemen we?
8. Is er een Data Processing Agreement (DPA) nodig?

### C. Voorbeeld Recovery Code UI
```
╔════════════════════════════════════════╗
║  🔐 Bewaar deze codes op veilige plek  ║
║                                        ║
║  ABCD-EFGH-IJKL-MNOP                  ║
║  QRST-UVWX-YZAB-CDEF                  ║
║  GHIJ-KLMN-OPQR-STUV                  ║
║                                        ║
║  ✅ Gedownload                        ║
║  📧 Per email                         ║
║  🖨️ Print                             ║
╚════════════════════════════════════════╝
```

```js
describe('Encryption', () => {
  test('Data onleesbaar zonder device key', async () => {
    const plaintext = { amount: 50, category: 'groceries' };
    const encrypted = await encrypt(plaintext, deviceKey);
    
    // Zonder key → moet failure geven
    await expect(decrypt(encrypted, wrongKey)).rejects.toThrow();
  });
  
  test('Passkey registratie genereert unieke credentials', async () => {
    const cred1 = await createPasskey(user1);
    const cred2 = await createPasskey(user1); // Tweede device
    
    expect(cred1.id).not.toBe(cred2.id);
  });
});
```

### Integration Tests (Flow)
1. **Unified Auth Flow:**
   - Nieuwe gebruiker → Sign-up → Passkey prompt → Success
   - Bestaande gebruiker → Email herkend → Passkey challenge → Login
   
2. **Recovery Flow:**
   - Device verloren → Magic link → Nieuwe passkey registratie
   
3. **Data Persistence:**
   - Transactie opslaan → Logout → Login op nieuw device → Data zichtbaar (maar encrypted in DB)

### Manual Security Tests (Pentesting)
- SQL injection pogingen op transactie-endpoints
- XSS via notitievelden
- CSRF op state-changing actions
- Session fixation attacks
- Brute force wachtwoord pogingen (rate limiting check)

### Compliance Audit Checklist
- [ ] Privacy policy bevat alle GDPR verplichte elementen
- [ ] Consent is opt-in, niet pre-checked
- [ ] Data export werkt binnen 30 dagen (GDPR art. 20)
- [ ] Account verwijdering werkt binnen 30 dagen (GDPR art. 17)
- [ ] Breach notification procedure gedocumenteerd (72u GDPR art. 33)
- [ ] DPIA uitgevoerd voor high-risk processing

---

## 11. Aanbevolen Tech Stack (Aanvulling op Documenten)

### Authentication
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Passkeys | `@simplewebauthn/browser` + `@simplewebauthn/server` | Best-in-class WebAuthn impl |
| Magic Links | `nodemailer` + custom JWT | Full control, geen vendor lock-in |
| MFA (TOTP) | `otplib` | Open standard, offline-capable |

### Encryption
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Web | `SubtleCrypto API` (native) | Zero dependencies, browser-native |
| Mobile iOS | `CryptoKit` + Secure Enclave | Hardware-backed security |
| Mobile Android | `Jetpack Security` | Google-maintained, best practices |

### Privacy-Enhancing Technologies (Fase 4)
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Differential Privacy | `diffprivlib` (Python) | IBM-backed, production-ready |
| Secure Aggregation | `TensorFlow Federated` | Proven in production (Google) |

### Infrastructure
| **Component** | **Service** | **Privacy Rationale** |
|--------------|-----------|---------------------|
| Hosting | **Hetzner** of **OVH** (EU) | GDPR-compliant, EU data residency |
| Database | **PostgreSQL** + `pgcrypto` | Open-source, encryption-at-rest native |
| Email | **Postmark** of **Mailgun EU** | Transactional focus, GDPR-compliant |
| Monitoring | **Plausible Analytics** | Privacy-friendly alternative to Google Analytics |

**Anti-pattern:** Vermijd AWS US-regio's of Cloudflare Analytics (data doorgifte VS)

---

## 12. Definitieve Aanbevelingen (Prioriteiten)

### 🔥 Kritiek (Start vandaag)
1. **Audit huidige encryptie status** → Indien plaintext, urgent fixen
2. **Implementeer rate limiting** op auth endpoints (prevent brute force)
3. **Token expiry check** → Max 1 uur voor access tokens

### ⚡ Hoog (Volgende sprint)
4. **Passkey MVP implementatie** (WebAuthn basic flow)
5. **Privacy policy opstellen** (GDPR-template gebruiken)
6. **Magic link recovery** (fallback voor passkeys)

### 📊 Medium (Q1 2025)
7. **Unified sign-up/sign-in flow** (zie sectie 3)
8. **DPIA template** en eerste uitvoering
9. **External security audit** (budget: €5-15k voor SME pentesting)

### 🔮 Strategisch (Q2-Q4 2025)
10. **ISO 27701 certificering** voorbereiden (indien B2B/funding relevant)
11. **Differential Privacy analytics** (alleen voor onderzoeksdoeleinde)
12. **Multi-device sync** met end-to-end encryptie

---

## 13. Risico Matrix

| **Risico** | **Impact** | **Kans** | **Mitigatie** | **Owner** |
|-----------|-----------|---------|--------------|----------|
| Data breach door weak encryption | 🔴 Zeer hoog | 🟡 Middel | Client-side encryption implementeren (Fase 2) | CTO |
| Passkey adoption te laag | 🟡 Middel | 🟢 Laag | Magic link als fallback + educatie in onboarding | Product |
| GDPR non-compliance bij launch | 🔴 Hoog | 🟡 Middel | Privacy policy + DPIA vóór launch | Legal |
| Social login verzoek van stakeholders | 🟡 Middel | 🟢 Laag | Data-driven argument voorbereiden (zie sectie 8) | Product |
| Key recovery failure (user verliest device) | 🟠 Hoog | 🟡 Middel | Multi-recovery opties: magic link + recovery codes | DevOps |

---

## 14. Slot: Van Strategie naar Executie

### ✅ Wat is Crystal Clear
- **Passkeys = primaire auth** (unaniem in alle docs)
- **Privacy-First = non-negotiable** (strategische kern)
- **Geen social login** (past niet bij branding)
- **Compliance frameworks** (ISO 27701 + NIST als fundering)

### ⚠️ Wat Onmiddellijke Aandacht Vereist
1. Encryptie-status huidige data → **Audit this week**
2. Rate limiting auth endpoints → **Implement ASAP**
3. Privacy policy definitieve versie → **Legal review Q1 2025**

### 🚀 Volgende Concrete Stappen

**Deze week:**
- [ ] Tech lead voert encryptie-audit uit
- [ ] Product owner prioriteert Fase 2 backlog items
- [ ] Founder beslist: certificering wel/niet (ISO 27701)

**Volgende sprint (2 weken):**
- [ ] Passkey proof-of-concept (1 developer, 40u)
- [ ] Privacy policy eerste draft (Legal consult 4u)
- [ ] Security audit offerte aanvragen (3 aanbieders)

**Q1 2025 Milestone:**
- [ ] Passkeys live in productie
- [ ] GDPR-compliant privacy stack
- [ ] Externe security audit afgerond
- [ ] Klaar voor limited public beta

---

## 📎 Bijlagen

### A. Referentie Links
- **WebAuthn Demo:** https://webauthn.io
- **GDPR Checklist:** https://gdpr.eu/checklist/
- **NIST Privacy Framework:** https://www.nist.gov/privacy-framework
- **OWASP ASVS:** https://owasp.org/www-project-application-security-verification-standard/

### B. Template: DPIA Kickoff Vragen
1. Welke nieuwe data verzamelen we?
2. Voor welk expliciet doel?
3. Kunnen we dit doel bereiken met minder data?
4. Hoe lang bewaren we dit?
5. Wie heeft toegang (intern/extern)?
6. Wat zijn de risico's voor betrokkenen?
7. Welke technische maatregelen nemen we?
8. Is er een Data Processing Agreement (DPA) nodig?

### C. Voorbeeld Recovery Code UI
```
╔════════════════════════════════════════╗
║  🔐 Bewaar deze codes op veilige plek  ║
║                                        ║
║  ABCD-EFGH-IJKL-MNOP                  ║
║  QRST-UVWX-YZAB-CDEF                  ║
║  GHIJ-KLMN-OPQR-STUV                  ║
║                                        ║
║  ✅ Gedownload                        ║
║  📧 Per email                         ║
║  🖨️ Print                             ║
╚════════════════════════════════════════╝
```

javascript

---

**Claude:**

```
describe('Encryption', () => {
  test('Data onleesbaar zonder device key', async () => {
    const plaintext = { amount: 50, category: 'groceries' };
    const encrypted = await encrypt(plaintext, deviceKey);
    
    // Zonder key → moet failure geven
    await expect(decrypt(encrypted, wrongKey)).rejects.toThrow();
  });
  
  test('Passkey registratie genereert unieke credentials', async () => {
    const cred1 = await createPasskey(user1);
    const cred2 = await createPasskey(user1); // Tweede device
    
    expect(cred1.id).not.toBe(cred2.id);
  });
});
```

### Integration Tests (Flow)
1. **Unified Auth Flow:**
   - Nieuwe gebruiker → Sign-up → Passkey prompt → Success
   - Bestaande gebruiker → Email herkend → Passkey challenge → Login
   
2. **Recovery Flow:**
   - Device verloren → Magic link → Nieuwe passkey registratie
   
3. **Data Persistence:**
   - Transactie opslaan → Logout → Login op nieuw device → Data zichtbaar (maar encrypted in DB)

### Manual Security Tests (Pentesting)
- SQL injection pogingen op transactie-endpoints
- XSS via notitievelden
- CSRF op state-changing actions
- Session fixation attacks
- Brute force wachtwoord pogingen (rate limiting check)

### Compliance Audit Checklist
- [ ] Privacy policy bevat alle GDPR verplichte elementen
- [ ] Consent is opt-in, niet pre-checked
- [ ] Data export werkt binnen 30 dagen (GDPR art. 20)
- [ ] Account verwijdering werkt binnen 30 dagen (GDPR art. 17)
- [ ] Breach notification procedure gedocumenteerd (72u GDPR art. 33)
- [ ] DPIA uitgevoerd voor high-risk processing

---

## 11. Aanbevolen Tech Stack (Aanvulling op Documenten)

### Authentication
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Passkeys | `@simplewebauthn/browser` + `@simplewebauthn/server` | Best-in-class WebAuthn impl |
| Magic Links | `nodemailer` + custom JWT | Full control, geen vendor lock-in |
| MFA (TOTP) | `otplib` | Open standard, offline-capable |

### Encryption
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Web | `SubtleCrypto API` (native) | Zero dependencies, browser-native |
| Mobile iOS | `CryptoKit` + Secure Enclave | Hardware-backed security |
| Mobile Android | `Jetpack Security` | Google-maintained, best practices |

### Privacy-Enhancing Technologies (Fase 4)
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Differential Privacy | `diffprivlib` (Python) | IBM-backed, production-ready |
| Secure Aggregation | `TensorFlow Federated` | Proven in production (Google) |

### Infrastructure
| **Component** | **Service** | **Privacy Rationale** |
|--------------|-----------|---------------------|
| Hosting | **Hetzner** of **OVH** (EU) | GDPR-compliant, EU data residency |
| Database | **PostgreSQL** + `pgcrypto` | Open-source, encryption-at-rest native |
| Email | **Postmark** of **Mailgun EU** | Transactional focus, GDPR-compliant |
| Monitoring | **Plausible Analytics** | Privacy-friendly alternative to Google Analytics |

**Anti-pattern:** Vermijd AWS US-regio's of Cloudflare Analytics (data doorgifte VS)

---

## 12. Definitieve Aanbevelingen (Prioriteiten)

### 🔥 Kritiek (Start vandaag)
1. **Audit huidige encryptie status** → Indien plaintext, urgent fixen
2. **Implementeer rate limiting** op auth endpoints (prevent brute force)
3. **Token expiry check** → Max 1 uur voor access tokens

### ⚡ Hoog (Volgende sprint)
4. **Passkey MVP implementatie** (WebAuthn basic flow)
5. **Privacy policy opstellen** (GDPR-template gebruiken)
6. **Magic link recovery** (fallback voor passkeys)

### 📊 Medium (Q1 2025)
7. **Unified sign-up/sign-in flow** (zie sectie 3)
8. **DPIA template** en eerste uitvoering
9. **External security audit** (budget: €5-15k voor SME pentesting)

### 🔮 Strategisch (Q2-Q4 2025)
10. **ISO 27701 certificering** voorbereiden (indien B2B/funding relevant)
11. **Differential Privacy analytics** (alleen voor onderzoeksdoeleinde)
12. **Multi-device sync** met end-to-end encryptie

---

## 13. Risico Matrix

| **Risico** | **Impact** | **Kans** | **Mitigatie** | **Owner** |
|-----------|-----------|---------|--------------|----------|
| Data breach door weak encryption | 🔴 Zeer hoog | 🟡 Middel | Client-side encryption implementeren (Fase 2) | CTO |
| Passkey adoption te laag | 🟡 Middel | 🟢 Laag | Magic link als fallback + educatie in onboarding | Product |
| GDPR non-compliance bij launch | 🔴 Hoog | 🟡 Middel | Privacy policy + DPIA vóór launch | Legal |
| Social login verzoek van stakeholders | 🟡 Middel | 🟢 Laag | Data-driven argument voorbereiden (zie sectie 8) | Product |
| Key recovery failure (user verliest device) | 🟠 Hoog | 🟡 Middel | Multi-recovery opties: magic link + recovery codes | DevOps |

---

## 14. Slot: Van Strategie naar Executie

### ✅ Wat is Crystal Clear
- **Passkeys = primaire auth** (unaniem in alle docs)
- **Privacy-First = non-negotiable** (strategische kern)
- **Geen social login** (past niet bij branding)
- **Compliance frameworks** (ISO 27701 + NIST als fundering)

### ⚠️ Wat Onmiddellijke Aandacht Vereist
1. Encryptie-status huidige data → **Audit this week**
2. Rate limiting auth endpoints → **Implement ASAP**
3. Privacy policy definitieve versie → **Legal review Q1 2025**

### 🚀 Volgende Concrete Stappen

**Deze week:**
- [ ] Tech lead voert encryptie-audit uit
- [ ] Product owner prioriteert Fase 2 backlog items
- [ ] Founder beslist: certificering wel/niet (ISO 27701)

**Volgende sprint (2 weken):**
- [ ] Passkey proof-of-concept (1 developer, 40u)
- [ ] Privacy policy eerste draft (Legal consult 4u)
- [ ] Security audit offerte aanvragen (3 aanbieders)

**Q1 2025 Milestone:**
- [ ] Passkeys live in productie
- [ ] GDPR-compliant privacy stack
- [ ] Externe security audit afgerond
- [ ] Klaar voor limited public beta

---

## 📎 Bijlagen

### A. Referentie Links
- **WebAuthn Demo:** https://webauthn.io
- **GDPR Checklist:** https://gdpr.eu/checklist/
- **NIST Privacy Framework:** https://www.nist.gov/privacy-framework
- **OWASP ASVS:** https://owasp.org/www-project-application-security-verification-standard/

### B. Template: DPIA Kickoff Vragen
1. Welke nieuwe data verzamelen we?
2. Voor welk expliciet doel?
3. Kunnen we dit doel bereiken met minder data?
4. Hoe lang bewaren we dit?
5. Wie heeft toegang (intern/extern)?
6. Wat zijn de risico's voor betrokkenen?
7. Welke technische maatregelen nemen we?
8. Is er een Data Processing Agreement (DPA) nodig?

### C. Voorbeeld Recovery Code UI
```
╔════════════════════════════════════════╗
║  🔐 Bewaar deze codes op veilige plek  ║
║                                        ║
║  ABCD-EFGH-IJKL-MNOP                  ║
║  QRST-UVWX-YZAB-CDEF                  ║
║  GHIJ-KLMN-OPQR-STUV                  ║
║                                        ║
║  ✅ Gedownload                        ║
║  📧 Per email                         ║
║  🖨️ Print                             ║
╚════════════════════════════════════════╝
```

```js
describe('Encryption', () => {
  test('Data onleesbaar zonder device key', async () => {
    const plaintext = { amount: 50, category: 'groceries' };
    const encrypted = await encrypt(plaintext, deviceKey);
    
    // Zonder key → moet failure geven
    await expect(decrypt(encrypted, wrongKey)).rejects.toThrow();
  });
  
  test('Passkey registratie genereert unieke credentials', async () => {
    const cred1 = await createPasskey(user1);
    const cred2 = await createPasskey(user1); // Tweede device
    
    expect(cred1.id).not.toBe(cred2.id);
  });
});
```

### Integration Tests (Flow)
1. **Unified Auth Flow:**
   - Nieuwe gebruiker → Sign-up → Passkey prompt → Success
   - Bestaande gebruiker → Email herkend → Passkey challenge → Login
   
2. **Recovery Flow:**
   - Device verloren → Magic link → Nieuwe passkey registratie
   
3. **Data Persistence:**
   - Transactie opslaan → Logout → Login op nieuw device → Data zichtbaar (maar encrypted in DB)

### Manual Security Tests (Pentesting)
- SQL injection pogingen op transactie-endpoints
- XSS via notitievelden
- CSRF op state-changing actions
- Session fixation attacks
- Brute force wachtwoord pogingen (rate limiting check)

### Compliance Audit Checklist
- [ ] Privacy policy bevat alle GDPR verplichte elementen
- [ ] Consent is opt-in, niet pre-checked
- [ ] Data export werkt binnen 30 dagen (GDPR art. 20)
- [ ] Account verwijdering werkt binnen 30 dagen (GDPR art. 17)
- [ ] Breach notification procedure gedocumenteerd (72u GDPR art. 33)
- [ ] DPIA uitgevoerd voor high-risk processing

---

## 11. Aanbevolen Tech Stack (Aanvulling op Documenten)

### Authentication
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Passkeys | `@simplewebauthn/browser` + `@simplewebauthn/server` | Best-in-class WebAuthn impl |
| Magic Links | `nodemailer` + custom JWT | Full control, geen vendor lock-in |
| MFA (TOTP) | `otplib` | Open standard, offline-capable |

### Encryption
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Web | `SubtleCrypto API` (native) | Zero dependencies, browser-native |
| Mobile iOS | `CryptoKit` + Secure Enclave | Hardware-backed security |
| Mobile Android | `Jetpack Security` | Google-maintained, best practices |

### Privacy-Enhancing Technologies (Fase 4)
| **Component** | **Library/Service** | **Rationale** |
|--------------|-------------------|--------------|
| Differential Privacy | `diffprivlib` (Python) | IBM-backed, production-ready |
| Secure Aggregation | `TensorFlow Federated` | Proven in production (Google) |

### Infrastructure
| **Component** | **Service** | **Privacy Rationale** |
|--------------|-----------|---------------------|
| Hosting | **Hetzner** of **OVH** (EU) | GDPR-compliant, EU data residency |
| Database | **PostgreSQL** + `pgcrypto` | Open-source, encryption-at-rest native |
| Email | **Postmark** of **Mailgun EU** | Transactional focus, GDPR-compliant |
| Monitoring | **Plausible Analytics** | Privacy-friendly alternative to Google Analytics |

**Anti-pattern:** Vermijd AWS US-regio's of Cloudflare Analytics (data doorgifte VS)

---

## 12. Definitieve Aanbevelingen (Prioriteiten)

### 🔥 Kritiek (Start vandaag)
1. **Audit huidige encryptie status** → Indien plaintext, urgent fixen
2. **Implementeer rate limiting** op auth endpoints (prevent brute force)
3. **Token expiry check** → Max 1 uur voor access tokens

### ⚡ Hoog (Volgende sprint)
4. **Passkey MVP implementatie** (WebAuthn basic flow)
5. **Privacy policy opstellen** (GDPR-template gebruiken)
6. **Magic link recovery** (fallback voor passkeys)

### 📊 Medium (Q1 2025)
7. **Unified sign-up/sign-in flow** (zie sectie 3)
8. **DPIA template** en eerste uitvoering
9. **External security audit** (budget: €5-15k voor SME pentesting)

### 🔮 Strategisch (Q2-Q4 2025)
10. **ISO 27701 certificering** voorbereiden (indien B2B/funding relevant)
11. **Differential Privacy analytics** (alleen voor onderzoeksdoeleinde)
12. **Multi-device sync** met end-to-end encryptie

---

## 13. Risico Matrix

| **Risico** | **Impact** | **Kans** | **Mitigatie** | **Owner** |
|-----------|-----------|---------|--------------|----------|
| Data breach door weak encryption | 🔴 Zeer hoog | 🟡 Middel | Client-side encryption implementeren (Fase 2) | CTO |
| Passkey adoption te laag | 🟡 Middel | 🟢 Laag | Magic link als fallback + educatie in onboarding | Product |
| GDPR non-compliance bij launch | 🔴 Hoog | 🟡 Middel | Privacy policy + DPIA vóór launch | Legal |
| Social login verzoek van stakeholders | 🟡 Middel | 🟢 Laag | Data-driven argument voorbereiden (zie sectie 8) | Product |
| Key recovery failure (user verliest device) | 🟠 Hoog | 🟡 Middel | Multi-recovery opties: magic link + recovery codes | DevOps |

---

## 14. Slot: Van Strategie naar Executie

### ✅ Wat is Crystal Clear
- **Passkeys = primaire auth** (unaniem in alle docs)
- **Privacy-First = non-negotiable** (strategische kern)
- **Geen social login** (past niet bij branding)
- **Compliance frameworks** (ISO 27701 + NIST als fundering)

### ⚠️ Wat Onmiddellijke Aandacht Vereist
1. Encryptie-status huidige data → **Audit this week**
2. Rate limiting auth endpoints → **Implement ASAP**
3. Privacy policy definitieve versie → **Legal review Q1 2025**

### 🚀 Volgende Concrete Stappen

**Deze week:**
- [ ] Tech lead voert encryptie-audit uit
- [ ] Product owner prioriteert Fase 2 backlog items
- [ ] Founder beslist: certificering wel/niet (ISO 27701)

**Volgende sprint (2 weken):**
- [ ] Passkey proof-of-concept (1 developer, 40u)
- [ ] Privacy policy eerste draft (Legal consult 4u)
- [ ] Security audit offerte aanvragen (3 aanbieders)

**Q1 2025 Milestone:**
- [ ] Passkeys live in productie
- [ ] GDPR-compliant privacy stack
- [ ] Externe security audit afgerond
- [ ] Klaar voor limited public beta

---

## 📎 Bijlagen

### A. Referentie Links
- **WebAuthn Demo:** https://webauthn.io
- **GDPR Checklist:** https://gdpr.eu/checklist/
- **NIST Privacy Framework:** https://www.nist.gov/privacy-framework
- **OWASP ASVS:** https://owasp.org/www-project-application-security-verification-standard/

### B. Template: DPIA Kickoff Vragen
1. Welke nieuwe data verzamelen we?
2. Voor welk expliciet doel?
3. Kunnen we dit doel bereiken met minder data?
4. Hoe lang bewaren we dit?
5. Wie heeft toegang (intern/extern)?
6. Wat zijn de risico's voor betrokkenen?
7. Welke technische maatregelen nemen we?
8. Is er een Data Processing Agreement (DPA) nodig?

### C. Voorbeeld Recovery Code UI
```
╔════════════════════════════════════════╗
║  🔐 Bewaar deze codes op veilige plek  ║
║                                        ║
║  ABCD-EFGH-IJKL-MNOP                  ║
║  QRST-UVWX-YZAB-CDEF                  ║
║  GHIJ-KLMN-OPQR-STUV                  ║
║                                        ║
║  ✅ Gedownload                        ║
║  📧 Per email                         ║
║  🖨️ Print                             ║
╚════════════════════════════════════════╝
```

---

**Claude:**

wat is de mappen structuur van de app?8 dec 2025

---

**Claude:**

wat is de mappen structuur van de app?

---

**Claude:**

8 dec 2025

---

**Claude:**

```sql
budget-app/
├── android/                 # Native Android code
├── ios/                     # Native iOS code
├── src/
│   ├── app/                 # Screen routes (voor React Navigation of Expo Router)
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   └── passkey-setup.tsx
│   │   ├── onboarding/      # Setup flow (C1, C4, C7, C10)
│   │   │   ├── household.tsx      # C1: Gezinssamenstelling
│   │   │   ├── details.tsx        # C4: Details
│   │   │   ├── income.tsx         # C7: Vaste inkomsten
│   │   │   └── expenses.tsx       # C10: Vaste lasten
│   │   ├── dashboard/
│   │   │   └── index.tsx
│   │   ├── transactions/
│   │   │   ├── daily-input.tsx    # "Noot van Manasse" logica
│   │   │   └── overview.tsx       # Edit/Delete functionaliteit
│   │   └── settings/
│   │       ├── privacy.tsx
│   │       └── profile.tsx
│   │
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Base components (buttons, inputs, cards)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── SaveConfirmation.tsx  # Voor "Opslaan" bevestiging
│   │   ├── forms/
│   │   │   ├── TransactionForm.tsx
│   │   │   └── HouseholdForm.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── NavigationGuard.tsx   # Voor unsaved changes warning
│   │
│   ├── features/            # Feature-specific logic & components
│   │   ├── auth/
│   │   │   ├── hooks/
│   │   │   │   ├── usePasskey.ts
│   │   │   │   ├── useMagicLink.ts
│   │   │   │   └── useBiometric.ts
│   │   │   ├── components/
│   │   │   │   └── PasskeyPrompt.tsx
│   │   │   └── services/
│   │   │       ├── webauthn.service.ts
│   │   │       └── auth.service.ts
│   │   │
│   │   ├── encryption/       # 🔐 Zero-Knowledge crypto
│   │   │   ├── crypto.service.ts      # AES-256-GCM
│   │   │   ├── keychain.service.ts    # iOS/Android keychain
│   │   │   └── types.ts
│   │   │
│   │   ├── transactions/
│   │   │   ├── hooks/
│   │   │   │   ├── useTransactions.ts
│   │   │   │   └── useCategories.ts
│   │   │   ├── components/
│   │   │   │   └── CategoryChips.tsx  # Conditionele rendering (kinderen)
│   │   │   └── services/
│   │   │       └── transaction.service.ts
│   │   │
│   │   └── budget/
│   │       ├── hooks/
│   │       │   └── useBudgetCalculation.ts
│   │       └── components/
│   │           └── BudgetOverview.tsx
│   │
│   ├── lib/                 # Core utilities (shared across features)
│   │   ├── api/
│   │   │   ├── client.ts           # Axios/Fetch wrapper
│   │   │   ├── endpoints.ts
│   │   │   └── interceptors.ts
│   │   ├── storage/
│   │   │   ├── secure-storage.ts   # Encrypted storage wrapper
│   │   │   └── migrations.ts       # Data model versioning
│   │   ├── validation/
│   │   │   ├── schemas.ts          # Zod/Yup schemas
│   │   │   └── validators.ts
│   │   └── i18n/
│   │       ├── index.ts
│   │       └── translations/
│   │           ├── nl.json
│   │           └── en.json
│   │
│   ├── types/               # TypeScript interfaces
│   │   ├── user.types.ts
│   │   ├── transaction.types.ts
│   │   ├── household.types.ts
│   │   └── auth.types.ts
│   │
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── fonts.ts
│   │   ├── screens.ts       # Screen names voor navigation
│   │   └── config.ts        # App config (niet-gevoelig)
│   │
│   ├── hooks/               # Global custom hooks
│   │   ├── useAppState.ts
│   │   ├── useSecureNavigate.ts  # Navigation met unsaved check
│   │   └── useOfflineSync.ts
│   │
│   ├── store/               # State management (Redux/Zustand)
│   │   ├── slices/
│   │   │   ├── auth.slice.ts
│   │   │   ├── household.slice.ts
│   │   │   └── transactions.slice.ts
│   │   ├── store.ts
│   │   └── hooks.ts         # Typed hooks (useAppDispatch, useAppSelector)
│   │
│   ├── utils/
│   │   ├── date.utils.ts
│   │   ├── currency.utils.ts
│   │   ├── logger.ts        # Privacy-compliant logging (geen PII)
│   │   └── error-handler.ts
│   │
│   └── assets/
│       ├── fonts/
│       ├── images/
│       │   ├── icons/
│       │   └── illustrations/
│       └── animations/       # Lottie files
│
├── __tests__/               # Tests (mirrors src/ structure)
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example             # Template (NOOIT echte keys committen)
├── .gitignore
├── app.json                 # Expo config
├── package.json
├── tsconfig.json
└── README.md
```

```sql
budget-app/
├── android/                 # Native Android code
├── ios/                     # Native iOS code
├── src/
│   ├── app/                 # Screen routes (voor React Navigation of Expo Router)
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   └── passkey-setup.tsx
│   │   ├── onboarding/      # Setup flow (C1, C4, C7, C10)
│   │   │   ├── household.tsx      # C1: Gezinssamenstelling
│   │   │   ├── details.tsx        # C4: Details
│   │   │   ├── income.tsx         # C7: Vaste inkomsten
│   │   │   └── expenses.tsx       # C10: Vaste lasten
│   │   ├── dashboard/
│   │   │   └── index.tsx
│   │   ├── transactions/
│   │   │   ├── daily-input.tsx    # "Noot van Manasse" logica
│   │   │   └── overview.tsx       # Edit/Delete functionaliteit
│   │   └── settings/
│   │       ├── privacy.tsx
│   │       └── profile.tsx
│   │
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Base components (buttons, inputs, cards)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── SaveConfirmation.tsx  # Voor "Opslaan" bevestiging
│   │   ├── forms/
│   │   │   ├── TransactionForm.tsx
│   │   │   └── HouseholdForm.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── NavigationGuard.tsx   # Voor unsaved changes warning
│   │
│   ├── features/            # Feature-specific logic & components
│   │   ├── auth/
│   │   │   ├── hooks/
│   │   │   │   ├── usePasskey.ts
│   │   │   │   ├── useMagicLink.ts
│   │   │   │   └── useBiometric.ts
│   │   │   ├── components/
│   │   │   │   └── PasskeyPrompt.tsx
│   │   │   └── services/
│   │   │       ├── webauthn.service.ts
│   │   │       └── auth.service.ts
│   │   │
│   │   ├── encryption/       # 🔐 Zero-Knowledge crypto
│   │   │   ├── crypto.service.ts      # AES-256-GCM
│   │   │   ├── keychain.service.ts    # iOS/Android keychain
│   │   │   └── types.ts
│   │   │
│   │   ├── transactions/
│   │   │   ├── hooks/
│   │   │   │   ├── useTransactions.ts
│   │   │   │   └── useCategories.ts
│   │   │   ├── components/
│   │   │   │   └── CategoryChips.tsx  # Conditionele rendering (kinderen)
│   │   │   └── services/
│   │   │       └── transaction.service.ts
│   │   │
│   │   └── budget/
│   │       ├── hooks/
│   │       │   └── useBudgetCalculation.ts
│   │       └── components/
│   │           └── BudgetOverview.tsx
│   │
│   ├── lib/                 # Core utilities (shared across features)
│   │   ├── api/
│   │   │   ├── client.ts           # Axios/Fetch wrapper
│   │   │   ├── endpoints.ts
│   │   │   └── interceptors.ts
│   │   ├── storage/
│   │   │   ├── secure-storage.ts   # Encrypted storage wrapper
│   │   │   └── migrations.ts       # Data model versioning
│   │   ├── validation/
│   │   │   ├── schemas.ts          # Zod/Yup schemas
│   │   │   └── validators.ts
│   │   └── i18n/
│   │       ├── index.ts
│   │       └── translations/
│   │           ├── nl.json
│   │           └── en.json
│   │
│   ├── types/               # TypeScript interfaces
│   │   ├── user.types.ts
│   │   ├── transaction.types.ts
│   │   ├── household.types.ts
│   │   └── auth.types.ts
│   │
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── fonts.ts
│   │   ├── screens.ts       # Screen names voor navigation
│   │   └── config.ts        # App config (niet-gevoelig)
│   │
│   ├── hooks/               # Global custom hooks
│   │   ├── useAppState.ts
│   │   ├── useSecureNavigate.ts  # Navigation met unsaved check
│   │   └── useOfflineSync.ts
│   │
│   ├── store/               # State management (Redux/Zustand)
│   │   ├── slices/
│   │   │   ├── auth.slice.ts
│   │   │   ├── household.slice.ts
│   │   │   └── transactions.slice.ts
│   │   ├── store.ts
│   │   └── hooks.ts         # Typed hooks (useAppDispatch, useAppSelector)
│   │
│   ├── utils/
│   │   ├── date.utils.ts
│   │   ├── currency.utils.ts
│   │   ├── logger.ts        # Privacy-compliant logging (geen PII)
│   │   └── error-handler.ts
│   │
│   └── assets/
│       ├── fonts/
│       ├── images/
│       │   ├── icons/
│       │   └── illustrations/
│       └── animations/       # Lottie files
│
├── __tests__/               # Tests (mirrors src/ structure)
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example             # Template (NOOIT echte keys committen)
├── .gitignore
├── app.json                 # Expo config
├── package.json
├── tsconfig.json
└── README.md
```

```
features/encryption/
```

```
src/
├── features/encryption/          # 🔐 KRITIEK
│   ├── crypto.service.ts         # AES-256-GCM implementatie
│   ├── keychain.service.ts       # iOS/Android keychain
│   └── __tests__/
│       └── crypto.test.ts        # Unit tests voor encryptie
│
├── features/auth/
│   ├── services/
│   │   ├── webauthn.service.ts   # Passkey implementatie
│   │   ├── magic-link.service.ts
│   │   └── token.service.ts      # JWT handling (max 1u expiry)
│   └── __tests__/
│
└── lib/storage/
    ├── secure-storage.ts          # Encrypted AsyncStorage wrapper
    └── migrations.ts              # Voor schema updates zonder data loss
```

```
src/
├── features/encryption/          # 🔐 KRITIEK
│   ├── crypto.service.ts         # AES-256-GCM implementatie
│   ├── keychain.service.ts       # iOS/Android keychain
│   └── __tests__/
│       └── crypto.test.ts        # Unit tests voor encryptie
│
├── features/auth/
│   ├── services/
│   │   ├── webauthn.service.ts   # Passkey implementatie
│   │   ├── magic-link.service.ts
│   │   └── token.service.ts      # JWT handling (max 1u expiry)
│   └── __tests__/
│
└── lib/storage/
    ├── secure-storage.ts          # Encrypted AsyncStorage wrapper
    └── migrations.ts              # Voor schema updates zonder data loss
```

```
crypto.service.ts
```

```
webauthn.service.ts
```

```
.env.example
```

- ✅ Sneller te implementeren (minder boilerplate)
- ✅ Makkelijker te navigeren voor kleine teams
- ✅ Privacy-kritische code is geïsoleerd ()
- ✅ Past bij "Noot van Manasse" logica (eenvoudige component structuur)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dmedium.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddev.to&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddev.to&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Drobinwieruch.de&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dobytes.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dreboot.studio&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddev.to&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgithub.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dwaldo.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dreactjs.org&w=32&q=75)

## Optie A: Privacy-First App Structuur (Aanbevolen)

## Optie B: Feature-Based Structuur (Schaalbaar voor groter team)

## 🎯 Mijn Aanbeveling voor Jouw Situatie

### Start met Optie A, want:

### Privacy-Specifieke Folders (Critial!)

## 📋 Volgende Stappen

| Key | Value |
| --- | --- |
| React Native app folder structure best practices 202410 resultsReact Native folder structure | Mediummedium.comUltimate Folder Structure For Your React Native Project - DEV Communitydev.toHow to Organize Your Components in React Native: Folder Structure and Project Organization - DEV Communitydev.toReact Folder Structure in 5 Steps [2025]robinwieruch.deProject Structure \| React Native / Expo Starterobytes.com4 folder structures to organize your React & React Native project - rebootreboot.studioThe Folder Structure of a React Native App - DEV Communitydev.toGitHub - sury4karmakar/ReactNative-ProjectStructure: 🔸 Best Folder Structure For Every React Native Project ... 🔸 In This Repo We Are Demonstrate How To Structure And Manage Your React Native Project ...github.comReact Native project structure: a best practices guidewaldo.comFile Structure – Reactreactjs.orgIk zie dat je vraagt naar de mappenstructuur van jouw app, maar die informatie staat niet in de documenten die je hebt gedeeld. De documenten bevatten strategische analyses over privacy, authenticatie en compliance, maar geen technische details over de huidige mappenstructuur. |
| Laten we dit aanpakken | ik geef je twee opties gebaseerd op moderne best practices voor een privacy-first budgetapp: |

Gebaseerd op jouw requirements (passkeys, encryptie, geen social login, dataminimalisatie):

Feature-Based App StructureCode # Feature-Based App Structuur (Alternatief)

```
budget-app/
├── src/
│   ├── modules/              # Zelfstandige feature modules
│   │   │
│   │   ├── auth/             # 🔐 Authenticatie module
│   │   │   ├── screens/
│   │   │   │   ├── LoginScr

Gebaseerd op de documentatie (93% compliance, Fase 2→3 transitie):

Ongeacht welke structuur je kiest, deze folders zijn non-negotiable:

Wil je dat ik:
A. De huidige status audit (controleren welke structuur je nu hebt)?
B. Een migratie-plan maken van huidige → Optie A?
C. Specifieke bestanden genereren (bijv. , )?
D. Een .gitignore en  maken met privacy best practices?
Kies A, B, C of D — of meerdere!

---

**Claude:**

React Native app folder structure best practices 2024

---

**Claude:**

10 results

---

**Claude:**

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dmedium.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddev.to&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddev.to&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Drobinwieruch.de&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dobytes.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dreboot.studio&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddev.to&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgithub.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dwaldo.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dreactjs.org&w=32&q=75)

React Native folder structure | Mediummedium.comUltimate Folder Structure For Your React Native Project - DEV Communitydev.toHow to Organize Your Components in React Native: Folder Structure and Project Organization - DEV Communitydev.toReact Folder Structure in 5 Steps [2025]robinwieruch.deProject Structure | React Native / Expo Starterobytes.com4 folder structures to organize your React & React Native project - rebootreboot.studioThe Folder Structure of a React Native App - DEV Communitydev.toGitHub - sury4karmakar/ReactNative-ProjectStructure: 🔸 Best Folder Structure For Every React Native Project ... 🔸 In This Repo We Are Demonstrate How To Structure And Manage Your React Native Project ...github.comReact Native project structure: a best practices guidewaldo.comFile Structure – Reactreactjs.org

---

**Claude:**

```sql
budget-app/
├── android/                 # Native Android code
├── ios/                     # Native iOS code
├── src/
│   ├── app/                 # Screen routes (voor React Navigation of Expo Router)
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   └── passkey-setup.tsx
│   │   ├── onboarding/      # Setup flow (C1, C4, C7, C10)
│   │   │   ├── household.tsx      # C1: Gezinssamenstelling
│   │   │   ├── details.tsx        # C4: Details
│   │   │   ├── income.tsx         # C7: Vaste inkomsten
│   │   │   └── expenses.tsx       # C10: Vaste lasten
│   │   ├── dashboard/
│   │   │   └── index.tsx
│   │   ├── transactions/
│   │   │   ├── daily-input.tsx    # "Noot van Manasse" logica
│   │   │   └── overview.tsx       # Edit/Delete functionaliteit
│   │   └── settings/
│   │       ├── privacy.tsx
│   │       └── profile.tsx
│   │
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Base components (buttons, inputs, cards)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── SaveConfirmation.tsx  # Voor "Opslaan" bevestiging
│   │   ├── forms/
│   │   │   ├── TransactionForm.tsx
│   │   │   └── HouseholdForm.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── NavigationGuard.tsx   # Voor unsaved changes warning
│   │
│   ├── features/            # Feature-specific logic & components
│   │   ├── auth/
│   │   │   ├── hooks/
│   │   │   │   ├── usePasskey.ts
│   │   │   │   ├── useMagicLink.ts
│   │   │   │   └── useBiometric.ts
│   │   │   ├── components/
│   │   │   │   └── PasskeyPrompt.tsx
│   │   │   └── services/
│   │   │       ├── webauthn.service.ts
│   │   │       └── auth.service.ts
│   │   │
│   │   ├── encryption/       # 🔐 Zero-Knowledge crypto
│   │   │   ├── crypto.service.ts      # AES-256-GCM
│   │   │   ├── keychain.service.ts    # iOS/Android keychain
│   │   │   └── types.ts
│   │   │
│   │   ├── transactions/
│   │   │   ├── hooks/
│   │   │   │   ├── useTransactions.ts
│   │   │   │   └── useCategories.ts
│   │   │   ├── components/
│   │   │   │   └── CategoryChips.tsx  # Conditionele rendering (kinderen)
│   │   │   └── services/
│   │   │       └── transaction.service.ts
│   │   │
│   │   └── budget/
│   │       ├── hooks/
│   │       │   └── useBudgetCalculation.ts
│   │       └── components/
│   │           └── BudgetOverview.tsx
│   │
│   ├── lib/                 # Core utilities (shared across features)
│   │   ├── api/
│   │   │   ├── client.ts           # Axios/Fetch wrapper
│   │   │   ├── endpoints.ts
│   │   │   └── interceptors.ts
│   │   ├── storage/
│   │   │   ├── secure-storage.ts   # Encrypted storage wrapper
│   │   │   └── migrations.ts       # Data model versioning
│   │   ├── validation/
│   │   │   ├── schemas.ts          # Zod/Yup schemas
│   │   │   └── validators.ts
│   │   └── i18n/
│   │       ├── index.ts
│   │       └── translations/
│   │           ├── nl.json
│   │           └── en.json
│   │
│   ├── types/               # TypeScript interfaces
│   │   ├── user.types.ts
│   │   ├── transaction.types.ts
│   │   ├── household.types.ts
│   │   └── auth.types.ts
│   │
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── fonts.ts
│   │   ├── screens.ts       # Screen names voor navigation
│   │   └── config.ts        # App config (niet-gevoelig)
│   │
│   ├── hooks/               # Global custom hooks
│   │   ├── useAppState.ts
│   │   ├── useSecureNavigate.ts  # Navigation met unsaved check
│   │   └── useOfflineSync.ts
│   │
│   ├── store/               # State management (Redux/Zustand)
│   │   ├── slices/
│   │   │   ├── auth.slice.ts
│   │   │   ├── household.slice.ts
│   │   │   └── transactions.slice.ts
│   │   ├── store.ts
│   │   └── hooks.ts         # Typed hooks (useAppDispatch, useAppSelector)
│   │
│   ├── utils/
│   │   ├── date.utils.ts
│   │   ├── currency.utils.ts
│   │   ├── logger.ts        # Privacy-compliant logging (geen PII)
│   │   └── error-handler.ts
│   │
│   └── assets/
│       ├── fonts/
│       ├── images/
│       │   ├── icons/
│       │   └── illustrations/
│       └── animations/       # Lottie files
│
├── __tests__/               # Tests (mirrors src/ structure)
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example             # Template (NOOIT echte keys committen)
├── .gitignore
├── app.json                 # Expo config
├── package.json
├── tsconfig.json
└── README.md
```

```sql
budget-app/
├── android/                 # Native Android code
├── ios/                     # Native iOS code
├── src/
│   ├── app/                 # Screen routes (voor React Navigation of Expo Router)
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   └── passkey-setup.tsx
│   │   ├── onboarding/      # Setup flow (C1, C4, C7, C10)
│   │   │   ├── household.tsx      # C1: Gezinssamenstelling
│   │   │   ├── details.tsx        # C4: Details
│   │   │   ├── income.tsx         # C7: Vaste inkomsten
│   │   │   └── expenses.tsx       # C10: Vaste lasten
│   │   ├── dashboard/
│   │   │   └── index.tsx
│   │   ├── transactions/
│   │   │   ├── daily-input.tsx    # "Noot van Manasse" logica
│   │   │   └── overview.tsx       # Edit/Delete functionaliteit
│   │   └── settings/
│   │       ├── privacy.tsx
│   │       └── profile.tsx
│   │
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Base components (buttons, inputs, cards)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── SaveConfirmation.tsx  # Voor "Opslaan" bevestiging
│   │   ├── forms/
│   │   │   ├── TransactionForm.tsx
│   │   │   └── HouseholdForm.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── NavigationGuard.tsx   # Voor unsaved changes warning
│   │
│   ├── features/            # Feature-specific logic & components
│   │   ├── auth/
│   │   │   ├── hooks/
│   │   │   │   ├── usePasskey.ts
│   │   │   │   ├── useMagicLink.ts
│   │   │   │   └── useBiometric.ts
│   │   │   ├── components/
│   │   │   │   └── PasskeyPrompt.tsx
│   │   │   └── services/
│   │   │       ├── webauthn.service.ts
│   │   │       └── auth.service.ts
│   │   │
│   │   ├── encryption/       # 🔐 Zero-Knowledge crypto
│   │   │   ├── crypto.service.ts      # AES-256-GCM
│   │   │   ├── keychain.service.ts    # iOS/Android keychain
│   │   │   └── types.ts
│   │   │
│   │   ├── transactions/
│   │   │   ├── hooks/
│   │   │   │   ├── useTransactions.ts
│   │   │   │   └── useCategories.ts
│   │   │   ├── components/
│   │   │   │   └── CategoryChips.tsx  # Conditionele rendering (kinderen)
│   │   │   └── services/
│   │   │       └── transaction.service.ts
│   │   │
│   │   └── budget/
│   │       ├── hooks/
│   │       │   └── useBudgetCalculation.ts
│   │       └── components/
│   │           └── BudgetOverview.tsx
│   │
│   ├── lib/                 # Core utilities (shared across features)
│   │   ├── api/
│   │   │   ├── client.ts           # Axios/Fetch wrapper
│   │   │   ├── endpoints.ts
│   │   │   └── interceptors.ts
│   │   ├── storage/
│   │   │   ├── secure-storage.ts   # Encrypted storage wrapper
│   │   │   └── migrations.ts       # Data model versioning
│   │   ├── validation/
│   │   │   ├── schemas.ts          # Zod/Yup schemas
│   │   │   └── validators.ts
│   │   └── i18n/
│   │       ├── index.ts
│   │       └── translations/
│   │           ├── nl.json
│   │           └── en.json
│   │
│   ├── types/               # TypeScript interfaces
│   │   ├── user.types.ts
│   │   ├── transaction.types.ts
│   │   ├── household.types.ts
│   │   └── auth.types.ts
│   │
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── fonts.ts
│   │   ├── screens.ts       # Screen names voor navigation
│   │   └── config.ts        # App config (niet-gevoelig)
│   │
│   ├── hooks/               # Global custom hooks
│   │   ├── useAppState.ts
│   │   ├── useSecureNavigate.ts  # Navigation met unsaved check
│   │   └── useOfflineSync.ts
│   │
│   ├── store/               # State management (Redux/Zustand)
│   │   ├── slices/
│   │   │   ├── auth.slice.ts
│   │   │   ├── household.slice.ts
│   │   │   └── transactions.slice.ts
│   │   ├── store.ts
│   │   └── hooks.ts         # Typed hooks (useAppDispatch, useAppSelector)
│   │
│   ├── utils/
│   │   ├── date.utils.ts
│   │   ├── currency.utils.ts
│   │   ├── logger.ts        # Privacy-compliant logging (geen PII)
│   │   └── error-handler.ts
│   │
│   └── assets/
│       ├── fonts/
│       ├── images/
│       │   ├── icons/
│       │   └── illustrations/
│       └── animations/       # Lottie files
│
├── __tests__/               # Tests (mirrors src/ structure)
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example             # Template (NOOIT echte keys committen)
├── .gitignore
├── app.json                 # Expo config
├── package.json
├── tsconfig.json
└── README.md
```

## Optie A: Privacy-First App Structuur (Aanbevolen)

## Optie B: Feature-Based Structuur (Schaalbaar voor groter team)

Ik zie dat je vraagt naar de mappenstructuur van jouw app, maar die informatie staat niet in de documenten die je hebt gedeeld. De documenten bevatten strategische analyses over privacy, authenticatie en compliance, maar geen technische details over de huidige mappenstructuur.
Laten we dit aanpakken: ik geef je twee opties gebaseerd op moderne best practices voor een privacy-first budgetapp:

Gebaseerd op jouw requirements (passkeys, encryptie, geen social login, dataminimalisatie):

---

**Claude:**

```sql
budget-app/
├── android/                 # Native Android code
├── ios/                     # Native iOS code
├── src/
│   ├── app/                 # Screen routes (voor React Navigation of Expo Router)
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   └── passkey-setup.tsx
│   │   ├── onboarding/      # Setup flow (C1, C4, C7, C10)
│   │   │   ├── household.tsx      # C1: Gezinssamenstelling
│   │   │   ├── details.tsx        # C4: Details
│   │   │   ├── income.tsx         # C7: Vaste inkomsten
│   │   │   └── expenses.tsx       # C10: Vaste lasten
│   │   ├── dashboard/
│   │   │   └── index.tsx
│   │   ├── transactions/
│   │   │   ├── daily-input.tsx    # "Noot van Manasse" logica
│   │   │   └── overview.tsx       # Edit/Delete functionaliteit
│   │   └── settings/
│   │       ├── privacy.tsx
│   │       └── profile.tsx
│   │
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Base components (buttons, inputs, cards)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── SaveConfirmation.tsx  # Voor "Opslaan" bevestiging
│   │   ├── forms/
│   │   │   ├── TransactionForm.tsx
│   │   │   └── HouseholdForm.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── NavigationGuard.tsx   # Voor unsaved changes warning
│   │
│   ├── features/            # Feature-specific logic & components
│   │   ├── auth/
│   │   │   ├── hooks/
│   │   │   │   ├── usePasskey.ts
│   │   │   │   ├── useMagicLink.ts
│   │   │   │   └── useBiometric.ts
│   │   │   ├── components/
│   │   │   │   └── PasskeyPrompt.tsx
│   │   │   └── services/
│   │   │       ├── webauthn.service.ts
│   │   │       └── auth.service.ts
│   │   │
│   │   ├── encryption/       # 🔐 Zero-Knowledge crypto
│   │   │   ├── crypto.service.ts      # AES-256-GCM
│   │   │   ├── keychain.service.ts    # iOS/Android keychain
│   │   │   └── types.ts
│   │   │
│   │   ├── transactions/
│   │   │   ├── hooks/
│   │   │   │   ├── useTransactions.ts
│   │   │   │   └── useCategories.ts
│   │   │   ├── components/
│   │   │   │   └── CategoryChips.tsx  # Conditionele rendering (kinderen)
│   │   │   └── services/
│   │   │       └── transaction.service.ts
│   │   │
│   │   └── budget/
│   │       ├── hooks/
│   │       │   └── useBudgetCalculation.ts
│   │       └── components/
│   │           └── BudgetOverview.tsx
│   │
│   ├── lib/                 # Core utilities (shared across features)
│   │   ├── api/
│   │   │   ├── client.ts           # Axios/Fetch wrapper
│   │   │   ├── endpoints.ts
│   │   │   └── interceptors.ts
│   │   ├── storage/
│   │   │   ├── secure-storage.ts   # Encrypted storage wrapper
│   │   │   └── migrations.ts       # Data model versioning
│   │   ├── validation/
│   │   │   ├── schemas.ts          # Zod/Yup schemas
│   │   │   └── validators.ts
│   │   └── i18n/
│   │       ├── index.ts
│   │       └── translations/
│   │           ├── nl.json
│   │           └── en.json
│   │
│   ├── types/               # TypeScript interfaces
│   │   ├── user.types.ts
│   │   ├── transaction.types.ts
│   │   ├── household.types.ts
│   │   └── auth.types.ts
│   │
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── fonts.ts
│   │   ├── screens.ts       # Screen names voor navigation
│   │   └── config.ts        # App config (niet-gevoelig)
│   │
│   ├── hooks/               # Global custom hooks
│   │   ├── useAppState.ts
│   │   ├── useSecureNavigate.ts  # Navigation met unsaved check
│   │   └── useOfflineSync.ts
│   │
│   ├── store/               # State management (Redux/Zustand)
│   │   ├── slices/
│   │   │   ├── auth.slice.ts
│   │   │   ├── household.slice.ts
│   │   │   └── transactions.slice.ts
│   │   ├── store.ts
│   │   └── hooks.ts         # Typed hooks (useAppDispatch, useAppSelector)
│   │
│   ├── utils/
│   │   ├── date.utils.ts
│   │   ├── currency.utils.ts
│   │   ├── logger.ts        # Privacy-compliant logging (geen PII)
│   │   └── error-handler.ts
│   │
│   └── assets/
│       ├── fonts/
│       ├── images/
│       │   ├── icons/
│       │   └── illustrations/
│       └── animations/       # Lottie files
│
├── __tests__/               # Tests (mirrors src/ structure)
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example             # Template (NOOIT echte keys committen)
├── .gitignore
├── app.json                 # Expo config
├── package.json
├── tsconfig.json
└── README.md
```

```sql
budget-app/
├── android/                 # Native Android code
├── ios/                     # Native iOS code
├── src/
│   ├── app/                 # Screen routes (voor React Navigation of Expo Router)
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   └── passkey-setup.tsx
│   │   ├── onboarding/      # Setup flow (C1, C4, C7, C10)
│   │   │   ├── household.tsx      # C1: Gezinssamenstelling
│   │   │   ├── details.tsx        # C4: Details
│   │   │   ├── income.tsx         # C7: Vaste inkomsten
│   │   │   └── expenses.tsx       # C10: Vaste lasten
│   │   ├── dashboard/
│   │   │   └── index.tsx
│   │   ├── transactions/
│   │   │   ├── daily-input.tsx    # "Noot van Manasse" logica
│   │   │   └── overview.tsx       # Edit/Delete functionaliteit
│   │   └── settings/
│   │       ├── privacy.tsx
│   │       └── profile.tsx
│   │
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Base components (buttons, inputs, cards)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── SaveConfirmation.tsx  # Voor "Opslaan" bevestiging
│   │   ├── forms/
│   │   │   ├── TransactionForm.tsx
│   │   │   └── HouseholdForm.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── NavigationGuard.tsx   # Voor unsaved changes warning
│   │
│   ├── features/            # Feature-specific logic & components
│   │   ├── auth/
│   │   │   ├── hooks/
│   │   │   │   ├── usePasskey.ts
│   │   │   │   ├── useMagicLink.ts
│   │   │   │   └── useBiometric.ts
│   │   │   ├── components/
│   │   │   │   └── PasskeyPrompt.tsx
│   │   │   └── services/
│   │   │       ├── webauthn.service.ts
│   │   │       └── auth.service.ts
│   │   │
│   │   ├── encryption/       # 🔐 Zero-Knowledge crypto
│   │   │   ├── crypto.service.ts      # AES-256-GCM
│   │   │   ├── keychain.service.ts    # iOS/Android keychain
│   │   │   └── types.ts
│   │   │
│   │   ├── transactions/
│   │   │   ├── hooks/
│   │   │   │   ├── useTransactions.ts
│   │   │   │   └── useCategories.ts
│   │   │   ├── components/
│   │   │   │   └── CategoryChips.tsx  # Conditionele rendering (kinderen)
│   │   │   └── services/
│   │   │       └── transaction.service.ts
│   │   │
│   │   └── budget/
│   │       ├── hooks/
│   │       │   └── useBudgetCalculation.ts
│   │       └── components/
│   │           └── BudgetOverview.tsx
│   │
│   ├── lib/                 # Core utilities (shared across features)
│   │   ├── api/
│   │   │   ├── client.ts           # Axios/Fetch wrapper
│   │   │   ├── endpoints.ts
│   │   │   └── interceptors.ts
│   │   ├── storage/
│   │   │   ├── secure-storage.ts   # Encrypted storage wrapper
│   │   │   └── migrations.ts       # Data model versioning
│   │   ├── validation/
│   │   │   ├── schemas.ts          # Zod/Yup schemas
│   │   │   └── validators.ts
│   │   └── i18n/
│   │       ├── index.ts
│   │       └── translations/
│   │           ├── nl.json
│   │           └── en.json
│   │
│   ├── types/               # TypeScript interfaces
│   │   ├── user.types.ts
│   │   ├── transaction.types.ts
│   │   ├── household.types.ts
│   │   └── auth.types.ts
│   │
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── fonts.ts
│   │   ├── screens.ts       # Screen names voor navigation
│   │   └── config.ts        # App config (niet-gevoelig)
│   │
│   ├── hooks/               # Global custom hooks
│   │   ├── useAppState.ts
│   │   ├── useSecureNavigate.ts  # Navigation met unsaved check
│   │   └── useOfflineSync.ts
│   │
│   ├── store/               # State management (Redux/Zustand)
│   │   ├── slices/
│   │   │   ├── auth.slice.ts
│   │   │   ├── household.slice.ts
│   │   │   └── transactions.slice.ts
│   │   ├── store.ts
│   │   └── hooks.ts         # Typed hooks (useAppDispatch, useAppSelector)
│   │
│   ├── utils/
│   │   ├── date.utils.ts
│   │   ├── currency.utils.ts
│   │   ├── logger.ts        # Privacy-compliant logging (geen PII)
│   │   └── error-handler.ts
│   │
│   └── assets/
│       ├── fonts/
│       ├── images/
│       │   ├── icons/
│       │   └── illustrations/
│       └── animations/       # Lottie files
│
├── __tests__/               # Tests (mirrors src/ structure)
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example             # Template (NOOIT echte keys committen)
├── .gitignore
├── app.json                 # Expo config
├── package.json
├── tsconfig.json
└── README.md
```

---

**Claude:**

Feature-Based App StructureCode # Feature-Based App Structuur (Alternatief)

```
budget-app/
├── src/
│   ├── modules/              # Zelfstandige feature modules
│   │   │
│   │   ├── auth/             # 🔐 Authenticatie module
│   │   │   ├── screens/
│   │   │   │   ├── LoginScr

---

**Claude:**

Feature-Based App StructureCode

---

**Claude:**

Feature-Based App Structure

---

**Claude:**

# Feature-Based App Structuur (Alternatief)

```
budget-app/
├── src/
│   ├── modules/              # Zelfstandige feature modules
│   │   │
│   │   ├── auth/             # 🔐 Authenticatie module
│   │   │   ├── screens/
│   │   │   │   ├── LoginScr

---

**Claude:**

```
features/encryption/
```

```
src/
├── features/encryption/          # 🔐 KRITIEK
│   ├── crypto.service.ts         # AES-256-GCM implementatie
│   ├── keychain.service.ts       # iOS/Android keychain
│   └── __tests__/
│       └── crypto.test.ts        # Unit tests voor encryptie
│
├── features/auth/
│   ├── services/
│   │   ├── webauthn.service.ts   # Passkey implementatie
│   │   ├── magic-link.service.ts
│   │   └── token.service.ts      # JWT handling (max 1u expiry)
│   └── __tests__/
│
└── lib/storage/
    ├── secure-storage.ts          # Encrypted AsyncStorage wrapper
    └── migrations.ts              # Voor schema updates zonder data loss
```

```
src/
├── features/encryption/          # 🔐 KRITIEK
│   ├── crypto.service.ts         # AES-256-GCM implementatie
│   ├── keychain.service.ts       # iOS/Android keychain
│   └── __tests__/
│       └── crypto.test.ts        # Unit tests voor encryptie
│
├── features/auth/
│   ├── services/
│   │   ├── webauthn.service.ts   # Passkey implementatie
│   │   ├── magic-link.service.ts
│   │   └── token.service.ts      # JWT handling (max 1u expiry)
│   └── __tests__/
│
└── lib/storage/
    ├── secure-storage.ts          # Encrypted AsyncStorage wrapper
    └── migrations.ts              # Voor schema updates zonder data loss
```

```
crypto.service.ts
```

```
webauthn.service.ts
```

```
.env.example
```

- ✅ Sneller te implementeren (minder boilerplate)
- ✅ Makkelijker te navigeren voor kleine teams
- ✅ Privacy-kritische code is geïsoleerd ()
- ✅ Past bij "Noot van Manasse" logica (eenvoudige component structuur)

## 🎯 Mijn Aanbeveling voor Jouw Situatie

### Start met Optie A, want:

### Privacy-Specifieke Folders (Critial!)

## 📋 Volgende Stappen

Gebaseerd op de documentatie (93% compliance, Fase 2→3 transitie):

Ongeacht welke structuur je kiest, deze folders zijn non-negotiable:

Wil je dat ik:
A. De huidige status audit (controleren welke structuur je nu hebt)?
B. Een migratie-plan maken van huidige → Optie A?
C. Specifieke bestanden genereren (bijv. , )?
D. Een .gitignore en  maken met privacy best practices?
Kies A, B, C of D — of meerdere!

---

**Claude:**

```
src/
├── features/encryption/          # 🔐 KRITIEK
│   ├── crypto.service.ts         # AES-256-GCM implementatie
│   ├── keychain.service.ts       # iOS/Android keychain
│   └── __tests__/
│       └── crypto.test.ts        # Unit tests voor encryptie
│
├── features/auth/
│   ├── services/
│   │   ├── webauthn.service.ts   # Passkey implementatie
│   │   ├── magic-link.service.ts
│   │   └── token.service.ts      # JWT handling (max 1u expiry)
│   └── __tests__/
│
└── lib/storage/
    ├── secure-storage.ts          # Encrypted AsyncStorage wrapper
    └── migrations.ts              # Voor schema updates zonder data loss
```

```
src/
├── features/encryption/          # 🔐 KRITIEK
│   ├── crypto.service.ts         # AES-256-GCM implementatie
│   ├── keychain.service.ts       # iOS/Android keychain
│   └── __tests__/
│       └── crypto.test.ts        # Unit tests voor encryptie
│
├── features/auth/
│   ├── services/
│   │   ├── webauthn.service.ts   # Passkey implementatie
│   │   ├── magic-link.service.ts
│   │   └── token.service.ts      # JWT handling (max 1u expiry)
│   └── __tests__/
│
└── lib/storage/
    ├── secure-storage.ts          # Encrypted AsyncStorage wrapper
    └── migrations.ts              # Voor schema updates zonder data loss
```

---

**Claude:**

Sonnet 4.5Claude is AI and can make mistakes. Please double-check cited sources.

---

**Claude:**

Sonnet 4.5

---

**Claude:**

Claude is AI and can make mistakes. Please double-check cited sources.

---

**Claude:**

Export (MD)Export (JSON)✅ Lazy-load klaar (0 blokken)

---

**Claude:**

✅ Lazy-load klaar (0 blokken)
