import { combine, take, foreach, partition } from "each-once/async";

const s = async function* () {
  let count=0
  while (true) {
    yield count++;
  }
};

foreach(
  (x: number[][]) => console.log(x),
  combine(
    take<number[]>(1000),
    partition<number>(7),
    partition<number[]>(7)
  )
)(s()).then(()=>{
  void 1;
});

