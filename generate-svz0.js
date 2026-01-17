#!/usr/bin/env node

/**
 * generate-svz0.js
 * Converteert een .ts/.tsx bestand naar een Gate 0 JSON artefact voor Quinn.
 * 
 * Gebruik: node generate-svz0.js <input_file> [artifact_suffix]
 */

const fs = require('fs');
const crypto = require('crypto');
const readline = require('readline');
const path = require('path');

// 1. Argumenten uitlezen
const args = process.argv.slice(2);
if (args.length < 1) {
  console.error("❌ Gebruik: node generate-svz0.js <input_bestand> [artifact_suffix]");
  console.error("   Voorbeeld: node generate-svz0.js src/App.tsx APP-V1");
  process.exit(1);
}

const inputFile = args[0];
const suffix = args[1] || "MANUAL";

if (!fs.existsSync(inputFile)) {
  console.error(`❌ Bestand niet gevonden: ${inputFile}`);
  process.exit(1);
}

// 2. Setup Interface voor PII vraag
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  try {
    // 3. Bestand inlezen
    console.log(`📂 Lezen van: ${inputFile}`);
    const content = fs.readFileSync(inputFile, 'utf8');

    // 4. Hash genereren (SHA256) - Cruciaal voor Crypto Binding
    const hash = crypto.createHash('sha256').update(content).digest('hex');

    // 5. PII Vraag
    const piiAnswer = await new Promise(resolve => {
      rl.question('🔍 Bevat dit bestand PII (Privacy Gevoelige Data)? (j/N): ', answer => {
        resolve(answer.trim().toLowerCase());
      });
    });

    const isPII = piiAnswer === 'j' || piiAnswer === 'y' || piiAnswer === 'ja';
    const piiAttestation = isPII ? "JA - SANITIZATION REQUIRED" : "NEE - CLEAN";

    if (isPII) {
      console.warn("⚠️  WAARSCHUWING: Markeer dit als PII. Zorg voor sanitization.");
    }

    const runtimeAnswer = await new Promise(resolve => {
      rl.question('🖥️  Runtime omgeving? (browser/node): ', answer => {
        resolve(answer.trim().toLowerCase());
      });
    });
    
    const runtime = runtimeAnswer === 'browser' ? 'BROWSER_TAMPERMONKEY' : 'NODE_TERMINAL';

    // 6. Genereer IDs
    const artifactId = `SVZ-0-${suffix}`;
    // Een unieke Token ID genereren op basis van tijd en hash
    const tokenId = `TOKEN-ID-MANASSE-SVZ0-${hash.substring(0, 8).toUpperCase()}`;

    // 7. Bouw het JSON Object (Gen4 Protocol Compliant)
    const payload = {
      Producing_Role: "CEO Manasse",
      Artifact_ID: artifactId,
      Status: "PENDING",
      Token_ID: tokenId,
      Runtime_Environment: runtime,
      
      // Metadata voor integriteit
      SHA256_Hash: hash,
      Source_Commit: "MANUAL_CLI_INPUT",
      PII_Attestation: piiAttestation,
      File_Name: path.basename(inputFile),
      
      // De inhoud zelf (veilig ge-escaped door JSON.stringify)
      Raw_Content: content
    };

    // 8. Schrijf naar bestand
    const outputFile = `${artifactId}.json`;
    fs.writeFileSync(outputFile, JSON.stringify(payload, null, 2));

    console.log("\n✅ SUCCES!");
    console.log(`📦 Artefact: ${outputFile}`);
    console.log(`🔑 Hash:     ${hash}`);
    console.log(`🎫 Token:    ${tokenId}`);
    console.log("\n📋 Je kunt de inhoud van dit bestand nu kopiëren naar de Quinn Cockpit.");

  } catch (error) {
    console.error("🚨 Fout:", error.message);
  } finally {
    rl.close();
  }
}

main()