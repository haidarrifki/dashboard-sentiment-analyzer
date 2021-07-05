export default function getPagination(page, size) {
  page = parseInt(page);
  size = parseInt(size);
  const limit = size ? +size : 10;
  const offset = page ? limit * (page - 1) : 0;
  return { limit, offset };
}
