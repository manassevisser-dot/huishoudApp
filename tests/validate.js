// tests/validate.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../scripts/gsa_harvester.user.js');
const code = fs.readFileSync(filePath, 'utf8');

console.log("🔍 Start analyse van:", filePath);

// Check 1: Bracket Matching
function checkBrackets(str) {
    const stack = [];
    const pairs = { '{': '}', '(': ')', '[': ']' };
    for (let char of str) {
        if (pairs[char]) stack.push(pairs[char]);
        else if (['}', ')', ']'].includes(char)) {
            if (stack.pop() !== char) return false;
        }
    }
    return stack.length === 0;
}

if (!checkBrackets(code)) {
    console.error("❌ FOUT: Bracket mismatch gevonden!");
    process.exit(1);
}

// Check 2: Syntax Check (Valideert of het geldige JS is)
try {
    // We simuleren de browser omgeving minimaal om syntax te checken
    new Function(code);
    console.log("✅ Syntax is valide.");
} catch (e) {
    console.error("❌ SYNTAX FOUT:", e.message);
    process.exit(1);
}

console.log("🚀 Script is veilig bevonden!");