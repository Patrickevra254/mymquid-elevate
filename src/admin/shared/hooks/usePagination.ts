import { useState } from "react";

export function usePagination(totalItems: number, pageSize: number) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const goToPage = (p: number) => setPage(Math.min(totalPages, Math.max(1, p)));
  const nextPage = () => goToPage(page + 1);
  const prevPage = () => goToPage(page - 1);

  const from = (page - 1) * pageSize;
  const to = Math.min(from + pageSize, totalItems);

  return { page, totalPages, from, to, goToPage, nextPage, prevPage };
}
