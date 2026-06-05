import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "../shared/components/PageHeader";
import { ConfirmModal } from "../shared/components/ConfirmModal";
import { BlogTable } from "./components/BlogTable";
import { useBlogStore } from "./useBlogStore";
import { useDebounce } from "../shared/hooks/useDebounce";
import { usePagination } from "../shared/hooks/usePagination";
import { MOCK_CATEGORIES } from "../mock/data";

export default function BlogListPage() {
  const navigate = useNavigate();
  const { posts, isLoading, filters, fetchPosts, setFilters, deletePost } = useBlogStore();

  const [searchInput, setSearchInput] = useState(filters.search);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch, setFilters]);

  useEffect(() => {
    fetchPosts();
  }, [filters, fetchPosts]);

  const { page, totalPages, from, to, nextPage, prevPage, goToPage } = usePagination(
    posts.length,
    10
  );

  useEffect(() => {
    goToPage(1);
  }, [filters, goToPage]);

  const paginatedPosts = posts.slice(from, to);

  const handleDelete = async () => {
    if (!deleteId) return;
    await deletePost(deleteId);
    await fetchPosts();
    setDeleteId(null);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Blog Posts"
        description="Manage your blog content"
        action={
          <Button onClick={() => navigate("/admin/blog/create")}>
            <PlusCircle className="mr-2 h-4 w-4" /> New Post
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <label htmlFor="blog-search" className="sr-only">Search posts</label>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="blog-search"
            className="pl-9"
            placeholder="Search posts..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <Select
          value={filters.status || "all"}
          onValueChange={(v) => setFilters({ status: v === "all" ? "" : v })}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.category || "all"}
          onValueChange={(v) => setFilters({ category: v === "all" ? "" : v })}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {MOCK_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <BlogTable posts={paginatedPosts} isLoading={isLoading} onDelete={setDeleteId} />

      {/* Pagination */}
      {posts.length > 10 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {from + 1}–{to} of {posts.length}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={prevPage} disabled={page === 1}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={nextPage} disabled={page === totalPages}>
              Next
            </Button>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteId}
        title="Delete post?"
        description="This action cannot be undone. The post will be permanently deleted."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
