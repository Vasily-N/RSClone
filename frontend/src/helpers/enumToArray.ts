type Enum = { [key: string]: number | string };
type EnumElem<E extends Enum> = E extends { [key: string]: infer ET | string } ? ET : never;

function enumToArray<E extends Enum>(enumObject:E):EnumElem<E>[] {
  return Object.keys(enumObject)
    .filter((key) => Number.isNaN(Number(key)))
    .map((key) => enumObject[key] as EnumElem<E>);
}

export default enumToArray;
