export function convertObjectToQueryString(params) {
  const queryString = Object.keys(params)
    .map((key) => {
      if (typeof params[key] === 'object' && params[key] !== null) {
        // Handle nested objects (e.g., query object)
        return convertObjectToQueryString(params[key]);
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
    })
    .join('&');

  return queryString;
}
  //