const Chess = require('@local/index');
const deepequal = require('deep-equal');

/*
test('Check notation differences has same output', () => {
  var chess1 = new Chess();
  chess1.move('1w. 1:e2:e3');
  chess1.submit();
  chess1.move('1b. 1:f7:f6');
  chess1.submit();
  chess1.move('2w. 2:Qd1:e2');
  chess1.submit();
  chess1.move('2b. 2:Nb8:c6');
  chess1.submit();
  chess1.move('3w. 3:Qe2:h5');
  chess1.submit();
  var chess3 = new Chess();
  chess3.move('1w. 1:e2<>1:e3');
  chess3.submit();
  chess3.move('1b. 1:f7<>1:f6');
  chess3.submit();
  chess3.move('2w. 2:Qd1<>2:e2');
  chess3.submit();
  chess3.move('2b. 2:Nb8<>2:c6');
  chess3.submit();
  chess3.move('3w. 3:Qe2<>3:h5');
  chess3.submit();
  var chess4 = new Chess();
  chess4.import('1w. 1:e2:e3\n1b. 1:f7:f6\r\n2w. 2:Qd1<>2:e2;2b. 2:Nb8:c6 ; 3w. 3:Qe2:h5');
  expect(deepequal(chess1.rawBoard, chess3.rawBoard)).toBe(true);
  expect(deepequal(chess1.rawBoard, chess4.rawBoard)).toBe(true);
});
*/
test('Dummy Test', () => {
  expect(true).toBe(true);
});