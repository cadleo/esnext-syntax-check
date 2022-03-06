import someDefault from 'somemodule'
import { something } from 'somemodule'
import * as somemodule from 'somemodule'
import './somePath';

import('./somePath');

export * from 'somemodule'
export default 'some string';
export const exp = 123;
export let exps = 321;

export function* gen(...arg) {
  let a = 13;
  const b = 123;
  const c = {
    [a]: a,
    a,
    b() { },
    'c'() { },
    d: () => { },
    e: `${b}23213`,
    func: 'world',
    * find() {
      return super.func;
    },
    [exp]: function* ff() { }
  };

  const args = [...arg];

  const [f, g = 'sss', ...arr] = args;
  const { d, e, h = '321', a: i, ...object } = c;
  const [j, k] = 'hello';

  function qqq([x, y = 3]) {

  }
  qqq`123${a}`;

  function qqq({ x, y = 3 }) {

  }

  for (let i of args) {
  }

  class cls {
    static #a = 123;
    p1() {

    }

    #p2 = 123

  }

  class clss extends cls {
    static sta = () => {}
    p1() {
      super.p1();
    }

  }

  const clsVar = class {
  };

  10 ** 6;

  0 ?? 6;

  async function process(array) {
    for await (let i of array) {
      qqq(i);
    }

    for (let i of array) {
      // await expression
      await qqq(i);
    }
  }
}
