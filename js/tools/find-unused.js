#!/usr/bin/env node
// Simple unused function detector for JS and PHP (heuristic)
// Usage: node js/tools/find-unused.js [path]
const fs = require('fs');
const path = require('path');

const root = process.argv[2] || process.cwd();
const exts = ['.js', '.php'];

function walk(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    try {
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        if (file === 'node_modules' || file === '.git' || file === 'vendor' || file === 'uploads') continue;
        walk(full, filelist);
      } else if (stat.isFile() && exts.includes(path.extname(full))) {
        filelist.push(full);
      }
    } catch (e) {
      // ignore
    }
  }
  return filelist;
}

function findDefsAndUsages(files) {
  const defs = []; // {name,type,file,line}
  const contentCache = {};

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    contentCache[file] = content;
    const lines = content.split(/\r?\n/);

    if (file.endsWith('.js')) {
      // function declarations
      const funcDecl = /function\s+([A-Za-z_$][\w$]*)\s*\(/g;
      let m;
      while ((m = funcDecl.exec(content))) {
        defs.push({ name: m[1], type: 'js:function', file });
      }
      // export function
      const exportFunc = /export\s+function\s+([A-Za-z_$][\w$]*)\s*\(/g;
      while ((m = exportFunc.exec(content))) defs.push({ name: m[1], type: 'js:export', file });
      // const/let/var name = (...) =>
      const arrow = /(const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\(?[\w\s,={}]*\)?\s*=>/g;
      while ((m = arrow.exec(content))) defs.push({ name: m[2], type: 'js:arrow', file });
      // const name = function
      const fnExpr = /(const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*function\b/g;
      while ((m = fnExpr.exec(content))) defs.push({ name: m[2], type: 'js:expr', file });
    }

    if (file.endsWith('.php')) {
      // function name(
      const phpFunc = /function\s+([A-Za-z_][\w]*)\s*\(/g;
      let m;
      while ((m = phpFunc.exec(content))) {
        // naive filter: skip methods with visibility keywords before (public/private/protected/static)
        const idx = m.index;
        const before = content.slice(Math.max(0, idx - 50), idx);
        if (/\b(public|private|protected|static)\b/.test(before)) continue;
        defs.push({ name: m[1], type: 'php:function', file });
      }
    }
  }

  // compute usage counts
  const usages = {};
  for (const def of defs) usages[def.name] = usages[def.name] || { count: 0, refs: [] };

  for (const file of files) {
    const content = contentCache[file];
    for (const name of Object.keys(usages)) {
      // create safe regex for name usage
      // look for name( or name \n or name. or ->name for php method calls
      const re = new RegExp('\\b' + name.replace(/[$^\\.*+?()[\]{}|]/g,'\\$&') + '\\b', 'g');
      let m;
      while ((m = re.exec(content))) {
        usages[name].count++;
        usages[name].refs.push({ file, index: m.index });
      }
    }
  }

  // results: defs where usages.count <= 1 (only definition)
  const candidates = [];
  for (const def of defs) {
    const u = usages[def.name] || { count: 0 };
    // subtract the definition occurrence by checking if first ref is in same file near def
    let isUsedElsewhere = false;
    for (const ref of (u.refs || [])) {
      if (ref.file !== def.file) { isUsedElsewhere = true; break; }
      if (ref.file === def.file) {
        // if more than one occurrence in same file, could be used
        // we will check if there exists a ref index sufficiently different from def index
        // find def index in file
        const defIdx = contentCache[def.file].indexOf(def.name);
        if (u.refs.length > 1) { isUsedElsewhere = true; break; }
      }
    }
    if (!isUsedElsewhere) candidates.push({ name: def.name, file: def.file, type: def.type, usages: u.count });
  }

  return { defs, usages, candidates };
}

function main() {
  console.log('Scanning', root);
  const files = walk(root, []).filter(f => !f.includes('.vscode') && !f.includes('node_modules'));
  const { defs, usages, candidates } = findDefsAndUsages(files);

  console.log('\nFound definitions:', defs.length);
  console.log('Potential unused functions (heuristic):', candidates.length, '\n');
  for (const c of candidates) {
    console.log(`- ${c.name} (${c.type}) in ${path.relative(root, c.file)} — usages: ${c.usages}`);
  }
}

main();
