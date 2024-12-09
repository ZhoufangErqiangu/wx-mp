export interface ParamsToStringParam {
  lowerCase?: boolean;
}

export type Params = Record<string, string | number | boolean | null>;

/**
 * Parse the object to query string without encoding based on the ascii key order
 */
export function paramsToString(data: Params, param: ParamsToStringParam = {}) {
  // avoid undefined value
  const keys = Object.keys(data)
    .filter((key) => data[key] !== undefined)
    .sort();

  // build a new params
  const res: Params = {};
  for (const key of keys) {
    const tempKey = param.lowerCase ? key.toLowerCase() : key;
    res[tempKey] = data[key];
  }

  // build string
  const strList: string[] = [];
  for (const key in res) {
    strList.push(`${key}=${res[key]}`);
  }
  return strList.join("&");
}
