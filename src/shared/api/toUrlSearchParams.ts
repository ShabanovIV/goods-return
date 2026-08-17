export const toUrlSearchParams = <TParams extends Record<string, unknown>>(
  filter: TParams,
): URLSearchParams => {
  const params = new URLSearchParams();

  Object.entries(filter).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      if (value.length === 0) {
        params.append(`${key}[]`, '');
      } else {
        value.forEach((item) => params.append(key, item.toString()));
      }
    } else if (value instanceof Date) {
      params.append(key, value.toISOString());
    } else if (typeof value === 'object') {
      params.append(key, JSON.stringify(value));
    } else {
      params.append(key, value.toString());
    }
  });
  return params;
};
