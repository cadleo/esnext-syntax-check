import * as parser from '@babel/parser';
import * as types from '@babel/types';
import traverse, { TraverseOptions, VisitNodeFunction } from '@babel/traverse';

type NodeType = types.Node['type']

type VisitFunction<Type> = VisitNodeFunction<types.Node, Extract<types.Node, { type: Type }>>;

type EsnextSyntaxDescription = string;

type Visitors = { [Type in NodeType]: (...arg: Parameters<VisitFunction<Type>>) => EsnextSyntaxDescription | void };

export function checkEsnextSyntax(source: string, visitorsReturnSyntaxDescription?: Visitors) {

  const ret: Record<string, number> = {};

  const setDesc = (desc: string) => {
    ret[desc] = (ret[desc] || 0) + 1;
  };

  const ast = parser.parse(source, { sourceType: 'module' });

  let visitors: TraverseOptions = {};

  if (visitorsReturnSyntaxDescription) {
    visitors = Object.keys(visitorsReturnSyntaxDescription).reduce((obj, key) => {
      const func = visitorsReturnSyntaxDescription[key as NodeType];
      obj[key] = function (...arg: Parameters<typeof func>) {
        // @ts-ignore
        const syntaxDesc = func(...arg);
        if (syntaxDesc) {
          setDesc(`custom: ${syntaxDesc}`);
        }
      };
      return obj;
    }, {} as Record<string, unknown>);
  }

  traverse(ast, {
    // Only visitors that have not been configured internally are allowed to be added
    ...visitors,
    ImportDeclaration(path) {
      setDesc('import statement');
    },

    Import(path) {
      setDesc('import()');
    },

    ExportDeclaration(path) {
      setDesc('export statement');
    },

    ArrowFunctionExpression(path) {
      setDesc('arrow function');
    },

    FunctionDeclaration(path) {
      if (path.node.generator) {
        setDesc('generator function');
      } else if (path.node.async) {
        setDesc('async function');
      }
    },

    FunctionExpression(path) {
      if (path.node.generator) {
        setDesc('generator function');
      } else if (path.node.async) {
        setDesc('async function');
      }
    },

    ObjectMethod(path) {
      if (path.node.generator) {
        setDesc('generator function');
      } else if (path.node.async) {
        setDesc('async function');
      }
    },

    ObjectProperty(path) {
      if (path.node.computed) {
        setDesc(`computed syntax like: { ['someKey']: 1 }`);
      }
      if (path.node.shorthand) {
        setDesc(`object property shorthand`);
      }
    },

    TaggedTemplateExpression(path) {
      setDesc(`TaggedTemplate: foo\`arg\``);
    },

    TemplateLiteral(path) {
      setDesc(`template string`);
    },

    Super(path) {
      setDesc(`'Super' keyword`);
    },

    Class(path) {
      setDesc(`class`);
    },

    ClassProperty(path) {
      setDesc(path.node.static ? 'class static property' : 'class property');
    },

    ClassMethod(path) {
      setDesc(path.node.static ? 'class static method' : 'class method');
    },

    ClassPrivateMethod(path) {
      setDesc(path.node.static ? 'class private static method' : 'class private method');
    },

    ClassPrivateProperty(path) {
      setDesc(path.node.static ? 'class private static property' : 'class private property');
    },

    ForOfStatement(path) {
      setDesc(path.node.await ? `for await of` : 'for of');
    },

    ObjectPattern(path) {
      setDesc(`destructuring like: const { b } = {};`);
    },

    ArrayPattern(path) {
      setDesc(`destructuring like: const [a] = []; function f ([c]) {}`);
    },

    RestElement(path) {
      setDesc(`rest syntax`);
    },

    SpreadElement(path) {
      setDesc(`spread syntax`);
    },

    VariableDeclaration(path) {
      if (path.node.kind === 'let' || path.node.kind === 'const') {
        setDesc('let or const');
      }
    },

    AssignmentPattern(path) {
      setDesc(`assignment like: const [a = 1] = []; const { b = 1 } = {}; function f (c = 1) {}`);
    },

    BinaryExpression(path) {
      if (path.node.operator === '**') {
        setDesc('power operator: **');
      }
    },

    LogicalExpression(path) {
      if (path.node.operator === '??') {
        setDesc('logical operator: ??');
      }
    },

    AwaitExpression(path) {
      setDesc('await expression');
    }

  });

  return ret;
}
