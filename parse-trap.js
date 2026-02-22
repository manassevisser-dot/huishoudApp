const JSONparse = JSON.parse;
JSON.parse = (s) => {
  if (s.includes('jest.config') || s.includes('tsconfig')) {
    console.error('⚠️ JSON.parse called with:\n', s.slice(0,200));
    throw new Error('INTENTIONAL STOP');
  }
  return JSONparse(s);
};
