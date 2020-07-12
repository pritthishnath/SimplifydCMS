export function toKebabCase(str) {
  return (
    str &&
    str
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
      )
      .map((x) => x.toLowerCase())
      .join("-")
  );
}

export function getCellData(obj, str) {
  const arr = str.split(".");
  if (obj === "undefined") return "";
  let data = obj[arr[0]];
  if (arr.length > 1) {
    for (let i = 1; i < arr.length; i++) {
      data = data[arr[i]];
    }
  }
  return data;
}
