# esnext-syntax-check
A tool for checking esnext syntax

```bash
$ npm install -S esnext-syntax-check
```

## Usage

```js
const { checkEsnextSyntax } = require('esnext-syntax-check');
const source = 'function* gen(){}';

const result = checkEsnextSyntax(source); 
// => { 'generator function': 1 }

// with custom visitors, the visitors should return a string describing the syntax
const result2 = checkEsnextSyntax('export default 123; function* gen(){}', { ExportDefaultDeclaration: (path) => 'export default declaration' });
// => { 'custom: export default declaration': 1, 'export statement': 1, 'generator function': 1 }

```
