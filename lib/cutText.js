export default function cutText(str) {
  if (str.length > 200) str = str.substring(0, 200) + '...';
  return str;
}
