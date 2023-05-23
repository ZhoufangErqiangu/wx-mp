export interface ParamsToStringParam {
  lowerCase?: boolean;
}

type Params = Record<string, string | number | boolean | null>;

/**
 * Parse the object to query string without encoding based on the ascii key order
 */
export function paramsToString(data: Params, param: ParamsToStringParam = {}) {
  const keys = Object.keys(data)
    .filter((key) => data[key] !== undefined)
    .sort();
  const res: Params = {};
  keys.forEach((key) => {
    const tempKey = param.lowerCase ? key.toLowerCase() : key;
    res[tempKey] = data[key];
  });
  const strList: string[] = [];
  for (const key in res) {
    strList.push(`${key}=${res[key]}`);
  }
  return strList.join("&");
}
