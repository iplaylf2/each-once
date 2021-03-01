# each-once 

只需遍历一次集合。

[English](https://github.com/Iplaylf2/each-once/blob/main/README.md) | 中文
-

## 特性

- 简单易用。
- 使用基础的数据结构。
- 高效的。

## 安装

``` bash
npm install each-once
```

## 用例

``` typescript
import { combine, map, filter, take, reduce } from "each-once";

const tf = combine(
  map((x: number) => x * 2),
  filter((x: number) => x % 4 === 0),
  take<number>(10)
);

const transduce = reduce((r, x) => r + x, 0, tf);

const s = function* () {
  let x = 0;
  while (true) {
    yield x++;
  }
};

const result = transduce(s()); // transduce([0, 1, 2...])

console.log(result); // 180

```

## benchmark

map n 次和 reduce 一次的 benchmark 测试。 [from benchmark.ts](https://github.com/Iplaylf2/each-once/blob/main/debug/benchmark.ts)

array

| map 次数 \ ops/sec \  数组长度 | 100     | 1000  | 10000 | 100000 |
| ------------------------------ | ------- | ----- | ----- | ------ |
| 2                              | 1193319 | 28799 | 2688  | 195    |
| 3                              | 199984  | 22248 | 2166  | 155    |
| 4                              | 167229  | 17363 | 1685  | 126    |
| 5                              | 144092  | 14313 | 1356  | 96.84  |
  

each-once

| map 次数 \ ops/sec \  数组长度 | 100    | 1000  | 10000 | 100000 |
| ------------------------------ | ------ | ----- | ----- | ------ |
| 2                              | 524905 | 50661 | 5370  | 562    |
| 3                              | 373222 | 38385 | 4066  | 397    |
| 4                              | 284126 | 31329 | 3133  | 315    |
| 5                              | 233850 | 25214 | 2499  | 242    |
  

**each-once 效率更高！**

## [文档](https://github.com/Iplaylf2/each-once/blob/main/doc/document.cn.md)