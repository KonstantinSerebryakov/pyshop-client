export async function fullJoinArrays<T extends string | number, K, P>(
  left: [T, K][],
  right: [T, P][]
): Promise<[T, (K | undefined)?, (P | undefined)?][]> {
  const tempArray: [T, K?, P?][] = left.map((pair) => [pair[0], pair[1]]);

  return new Promise((resolve, reject) => {
    function processArrayAsync(index = 0) {
      const limit = Math.min(index + 20, right.length);
      while (index < limit) {
        const pair = right[index];
        const key = pair[0];
        if (key) {
          const value = pair[1];
          const storedPair = tempArray.find((option) => option[0] === key);
          if (storedPair) storedPair[2] = value;
          else tempArray.push([key, , value]);
        }
        index++;
      }
      if (index < right.length) {
        setTimeout(() => {
          processArrayAsync(index);
        }, 0);
      } else {
        resolve(tempArray);
      }
    }
    processArrayAsync();
  });
}

export async function fullJoinArraysFilterEmpty<
  T extends string | number,
  K,
  P
>(left: [T, K][], right: [T, P][]): Promise<[T, K, P][]> {
  const tempArray = await fullJoinArrays(left, right);
  return tempArray.filter((row) => {
    return row[1] && row[1] !== ' ' && row[2] && row[2] !== ' ';
  }) as [T, K, P][];
}
