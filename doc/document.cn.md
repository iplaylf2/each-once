# 文档

- [combine](#combine)
- [transform 方法](#transform-方法)
  - [map](#map)
  - [scan](#scan)
  - [filter](#filter)
  - [remove](#remove)
  - [take](#take)
  - [takeWhile](#takewhile)
  - [skip](#skip)
  - [skipWhile](#skipwhile)
  - [partition](#partition)
  - [partitionBy](#partitionby)
  - [flatten](#flatten)
  - [groupBy](#groupby)
    - [GroupByReduce](#groupbyreduce)
    - [用例](#用例)
- [reduce 方法](#reduce-方法)
  - [count](#count)
  - [include](#include)
  - [every](#every)
  - [some](#some)
  - [first](#first)
  - [last](#last)
  - [reduce](#reduce)
  - [foreach](#foreach)
  - [toArray](#toarray)
- [异步](#异步)

## combine

`combine` 将若干个 transform 方法组合成一个 transform 方法。

``` typescript
function combine(...tfs: TransduceFunction[]): TransduceFunction
```

## transform 方法

Collection\<A> => Collection\<B>

### map

``` typescript
function map<T, K>(f: Map<T, K>): TransduceFunction<T, K>
```

### scan

``` typescript
function scan<T, K>(f: Scan<T, K>, v: K): TransduceFunction<T, K>
```

### filter

``` typescript
function filter<T>(f: Predicate<T>): TransduceFunction<T, T>
```

### remove

``` typescript
function remove<T>(f: Predicate<T>): TransduceFunction<T, T>
```

### take

``` typescript
function take<T>(n: number): TransduceFunction<T, T>
```

### takeWhile

``` typescript
function takeWhile<T>(f: Predicate<T>): TransduceFunction<T, T>
```

### skip

``` typescript
function skip<T>(n: number): TransduceFunction<T, T>
```

### skipWhile

``` typescript
function skipWhile<T>(f: Predicate<T>): TransduceFunction<T, T>
```

### partition

``` typescript
function partition<T>(n: number): TransduceFunction<T, T[]>
```

### partitionBy

``` typescript
function partitionBy<T>(f: Map<T, any>): TransduceFunction<T, T[]>
```

### flatten

``` typescript
function flatten<T>(): TransduceFunction<T[], T>
```

### groupBy

``` typescript
function groupBy<T, Key, K>(f: Group<T, Key>, gr: GroupByReduce<T, Key, K>): TransduceFunction<T, K>
```

#### GroupByReduce

``` typescript
function groupByReduce<T, Key, K>(k: Key): TransduceHandler<T, K>
```

通过 `each-once/transduce` 使用 transduce handler 。

``` typescript
import * as Transduce from "each-once/transduce";
```

#### 用例

``` typescript
import { combine, groupBy, take, foreach } from "each-once";
import * as Transduce from "each-once/transduce";

const s = function* () {
  while (true) {
    yield Math.random() * 10;
  }
};

foreach(
  (x: number[]) => console.log(x),
  combine(
    take<number>(100),
    groupBy(
      (x: number) => Math.floor(x),
      (key) => Transduce.toArray(take<number>(10))
    )
  )
)(s());

```

## reduce 方法

Collection\<A> => B

### count

``` typescript
function count<T>(tf: TransduceFunction<T, any>): (iter: Iterable<T>) => number
```

### include

``` typescript
function include<T, K>(v: K, tf: TransduceFunction<T, K>): (iter: Iterable<T>) => boolean
```

### every

``` typescript
function every<T, K>(f: Predicate<K>, tf: TransduceFunction<T, K>): (iter: Iterable<T>) => boolean
```

### some

``` typescript
function some<T, K>(f: Predicate<K>, tf: TransduceFunction<T, K>): (iter: Iterable<T>) => boolean
```

### first

``` typescript
function first<T, K>(tf: TransduceFunction<T, K>): (iter: Iterable<T>) => K | void
```

### last

``` typescript
function last<T, K>(tf: TransduceFunction<T, K>): (iter: Iterable<T>) => K | void
```

### reduce

``` typescript
function reduce<T, K, R>(rf: ReduceFunction<K, R>, v: R, tf: TransduceFunction<T, K>): (iter: Iterable<T>) => R
```

### foreach

``` typescript
function foreach<T, K>(f: Action<K>, tf: TransduceFunction<T, K>): (iter: Iterable<T>) => void
```

### toArray

``` typescript
function toArray<T, K>(tf: TransduceFunction<T, K>): (iter: Iterable<T>) => K[]
```

## 异步

通过 `each-once/async` 和 `each-once/async/transduce` 使用异步的版本。