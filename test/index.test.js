const fs = require('fs');
const path = require('path');
const { checkEsnextSyntax } = require('../lib/index.js');

const source = fs.readFileSync(path.resolve(__dirname, './source.js'), 'utf8');

test('esnext syntax check', () => {
  expect(checkEsnextSyntax(source)).toEqual({
    'import statement': 4,
    'import()': 1,
    'export statement': 5,
    'let or const': 13,
    'generator function': 3,
    'rest syntax': 3,
    "computed syntax like: { ['someKey']: 1 }": 2,
    'object property shorthand': 6,
    'arrow function': 2,
    'template string': 2,
    "'Super' keyword": 2,
    'spread syntax': 1,
    'destructuring like: const [a] = []; function f ([c]) {}': 3,
    'assignment like: const [a = 1] = []; const { b = 1 } = {}; function f (c = 1) {}': 4,
    'destructuring like: const { b } = {};': 2,
    'TaggedTemplate: foo`arg`': 1,
    'for of': 2,
    class: 3,
    'class private static property': 1,
    'class method': 2,
    'class private property': 1,
    'class static property': 1,
    'power operator: **': 1,
    'logical operator: ??': 1,
    'async function': 1,
    'for await of': 1,
    'await expression': 1
  });
});

test('esnext syntax check with custom visitors', () => {
  expect(checkEsnextSyntax(source, { ExportDefaultDeclaration: (path) => 'export default declaration' })).toEqual({
    'import statement': 4,
    'import()': 1,
    'export statement': 5,
    'let or const': 13,
    'generator function': 3,
    'rest syntax': 3,
    "computed syntax like: { ['someKey']: 1 }": 2,
    'object property shorthand': 6,
    'arrow function': 2,
    'template string': 2,
    "'Super' keyword": 2,
    'spread syntax': 1,
    'destructuring like: const [a] = []; function f ([c]) {}': 3,
    'assignment like: const [a = 1] = []; const { b = 1 } = {}; function f (c = 1) {}': 4,
    'destructuring like: const { b } = {};': 2,
    'TaggedTemplate: foo`arg`': 1,
    'for of': 2,
    class: 3,
    'class private static property': 1,
    'class method': 2,
    'class private property': 1,
    'class static property': 1,
    'power operator: **': 1,
    'logical operator: ??': 1,
    'async function': 1,
    'for await of': 1,
    'await expression': 1,
    // custom visitors result
    'custom: export default declaration': 1
  });
});
