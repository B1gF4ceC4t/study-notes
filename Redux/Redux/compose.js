export default function compose(...fncs) {
  if (fncs.length === 0) return arg => arg;

  if (fncs.length === 1) return fncs[0];

  return fncs.reduce((a, b) => (...args) => a(b(...args)));
}
