type RenameMapping<T> = {
  from: keyof T;
  to: PropertyKey;
};

type RenamedObject<
  T,
  Mappings extends readonly RenameMapping<T>[],
> = Omit<T, Mappings[number]["from"]> & {
  [Mapping in Mappings[number] as Mapping["to"]]: T[Mapping["from"]];
};

/** Copies an object and simultaneously renames selected own properties. */
export const renameKeys = <
  T extends object,
  const Mappings extends readonly RenameMapping<T>[],
>(
  object: T,
  mappings: Mappings
): RenamedObject<T, Mappings> => {
  const renamed = { ...object } as Record<PropertyKey, unknown>;
  const existing = mappings
    .filter(({ from }) =>
      Object.prototype.hasOwnProperty.call(object, from)
    )
    .map(({ from, to }) => ({ from, to, value: Reflect.get(object, from) }));

  for (const { from } of existing) Reflect.deleteProperty(renamed, from);
  for (const { to, value } of existing) Reflect.set(renamed, to, value);

  return renamed as RenamedObject<T, Mappings>;
};
