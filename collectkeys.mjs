
// tools/collect-keys.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const SRC_DIR = path.join(projectRoot, 'src');

const exts = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);

function* walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    if (e.name === 'node_modules' || e.name === 'dist' || e.name === 'build' || e.name === 'coverage') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      yield* walk(full);
    } else if (exts.has(path.extname(e.name))) {
      yield full;
    }
  }
}

const identifiers = new Set();
const objectKeys = new Set();
const memberAccessKeys = new Set();

function add(val, set) {
  if (typeof val === 'string' && val.trim()) set.add(val.trim());
}

function parse(code, filename) {
  return parser.parse(code, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'typescript',
      'decorators-legacy',
      'classProperties',
      'classPrivateProperties',
      'classPrivateMethods',
      'dynamicImport',
      'topLevelAwait',
      'importAttributes',
    ],
    errorRecovery: true,
  });
}

function collectFromFile(file) {
  const code = fs.readFileSync(file, 'utf8');
  let ast;
  try {
    ast = parse(code, file);
  } catch (e) {
    console.warn(`Parse error in ${file}: ${e.message}`);
    return;
  }

  traverse(ast, {
    Identifier(path) {
      // Sluit private names in class fields uit; Babel exposeert die niet als Identifier
      add(path.node.name, identifiers);
    },

    // Object literal keys: { a: 1 }, { "b": 2 }, { [c]: 3 }
    ObjectProperty(path) {
      const { key, computed } = path.node;
      if (!computed) {
        if (key.type === 'Identifier') add(key.name, objectKeys);
        if (key.type === 'StringLiteral') add(key.value, objectKeys);
        if (key.type === 'NumericLiteral') add(String(key.value), objectKeys);
      } else {
        // computed: try simple string literal
        if (key.type === 'StringLiteral') add(key.value, objectKeys);
      }
    },

    // { get foo() {}, set bar(v) {} }
    ObjectMethod(path) {
      const { key, computed } = path.node;
      if (!computed) {
        if (key.type === 'Identifier') add(key.name, objectKeys);
        if (key.type === 'StringLiteral') add(key.value, objectKeys);
        if (key.type === 'NumericLiteral') add(String(key.value), objectKeys);
      } else if (key.type === 'StringLiteral') {
        add(key.value, objectKeys);
      }
    },

    // Member access: obj.prop  / obj['prop']
    MemberExpression(path) {
      const { property, computed } = path.node;
      if (!computed) {
        if (property.type === 'Identifier') add(property.name, memberAccessKeys);
      } else {
        if (property.type === 'StringLiteral') add(property.value, memberAccessKeys);
        if (property.type === 'NumericLiteral') add(String(property.value), memberAccessKeys);
        // Optioneel: eenvoudige TemplateLiteral zonder exprs
        if (property.type === 'TemplateLiteral' && property.expressions.length === 0) {
          const raw = property.quasis.map(q => q.value.cooked ?? q.value.raw).join('');
          add(raw, memberAccessKeys);
        }
      }
    },

    // Optional chaining: obj?.prop  / obj?.['prop']
    OptionalMemberExpression(path) {
      const { property, computed } = path.node;
      if (!computed) {
        if (property.type === 'Identifier') add(property.name, memberAccessKeys);
      } else {
        if (property.type === 'StringLiteral') add(property.value, memberAccessKeys);
        if (property.type === 'NumericLiteral') add(String(property.value), memberAccessKeys);
      }
    },
  });
}

for (const file of walk(SRC_DIR)) {
  collectFromFile(file);
}

const all = new Set([...identifiers, ...objectKeys, ...memberAccessKeys]);

const outDir = path.join(projectRoot, '.keys');
fs.mkdirSync(outDir, { recursive: true });

function dump(name, set) {
  const arr = Array.from(set).sort((a, b) => a.localeCompare(b));
  fs.writeFileSync(path.join(outDir, `${name}.txt`), arr.join('\n') + '\n', 'utf8');
}

dump('identifiers', identifiers);
dump('object-keys', objectKeys);
dump('member-access', memberAccessKeys);
dump('all', all);

console.log('✅ Keys verzameld in ./.keys/{identifiers,object-keys,member-access,all}.txt');
