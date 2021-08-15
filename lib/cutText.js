export default function cutText(str, type) {
  let strMax = 200;
  if (type === 'textProcessing') {
    strMax = 100;
  }
  if (str.length > strMax) str = str.substring(0, strMax) + '...';
  return str;
}
