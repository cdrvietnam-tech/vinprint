export const BLOG_PAGE_SIZE = 12;

export function paginateBlogPosts<T>(items: T[], page: number, pageSize = BLOG_PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Number.isInteger(page) && page > 0 ? page : 1;
  const start = (safePage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    pageSize,
    totalItems: items.length,
    totalPages,
  };
}

