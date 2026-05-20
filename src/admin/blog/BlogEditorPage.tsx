import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TiptapEditor } from "./components/TiptapEditor";
import { SEOFields } from "./components/SEOFields";
import { CategoryTagInput } from "./components/CategoryTagInput";
import { SkeletonLoader } from "../shared/components/SkeletonLoader";
import { useBlogStore } from "./useBlogStore";
import { blogApi } from "../mock/api";
import { useAuthStore } from "../auth/useAuthStore";
import type { BlogPost, BlogStatus } from "../types";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["draft", "published", "scheduled"]),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()),
  scheduledAt: z.string().optional(),
  seo: z.object({
    metaTitle: z.string(),
    metaDescription: z.string(),
    ogImage: z.string().optional(),
  }),
});

type FormValues = z.infer<typeof schema>;

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function BlogEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const user = useAuthStore((s) => s.user);
  const { savePost } = useBlogStore();
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const originalCreatedAt = useRef<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      status: "draft",
      category: "",
      tags: [],
      scheduledAt: "",
      seo: { metaTitle: "", metaDescription: "" },
    },
  });

  const title = watch("title");
  const status = watch("status");

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManuallyEdited && title) {
      setValue("slug", slugify(title), { shouldDirty: false });
    }
  }, [title, slugManuallyEdited, setValue]);

  // Load existing post for edit mode
  useEffect(() => {
    if (!isEdit || !id) return;
    blogApi.getById(id).then((post) => {
      if (!post) { navigate("/admin/blog"); return; }
      setValue("title", post.title);
      setValue("slug", post.slug);
      setValue("content", post.content);
      setValue("status", post.status);
      setValue("category", post.category);
      setValue("tags", post.tags);
      setValue("scheduledAt", post.scheduledAt ?? "");
      setValue("seo", post.seo);
      originalCreatedAt.current = post.createdAt;
      setLoading(false);
    }).catch(() => {
      navigate("/admin/blog");
    });
  }, [id, isEdit, navigate, setValue]);

  const buildPost = (data: FormValues): BlogPost => ({
    id: id ?? String(Date.now()),
    ...data,
    status: data.status as BlogStatus,
    featuredImage: undefined,
    createdAt: originalCreatedAt.current ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: { id: user?.id ?? "1", name: user?.name ?? "Admin" },
  });

  const handleSave = async (data: FormValues, overrideStatus?: BlogStatus) => {
    setSaving(true);
    try {
      const post = buildPost({ ...data, status: overrideStatus ?? data.status });
      await savePost(post);
      navigate("/admin/blog");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <SkeletonLoader rows={8} />;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/blog"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={saving}
            onClick={() => id && navigate(`/admin/blog/preview/${id}`)}
          >
            <Eye className="mr-1.5 h-4 w-4" /> Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={saving}
            onClick={handleSubmit((data) => handleSave(data, "draft"))}
          >
            {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
            Save Draft
          </Button>
          <Button
            size="sm"
            disabled={saving}
            onClick={handleSubmit((data) => handleSave(data, "published"))}
          >
            {saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
            Publish
          </Button>
        </div>
      </div>

      <h1 className="text-xl font-bold">{isEdit ? "Edit Post" : "New Post"}</h1>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        {/* Left: main content */}
        <div className="space-y-4 lg:col-span-2">
          <div className="space-y-1">
            <Label htmlFor="post-title">Title</Label>
            <Input id="post-title" placeholder="Post title..." {...register("title")} />
            {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="post-slug">Slug</Label>
            <Input
              id="post-slug"
              placeholder="post-url-slug"
              {...register("slug", {
                onChange: () => {
                  setSlugManuallyEdited(true);
                },
              })}
            />
            {errors.slug && <p className="text-destructive text-xs">{errors.slug.message}</p>}
            <p className="text-xs text-muted-foreground">
              URL: /blog/<strong>{watch("slug") || "your-post-slug"}</strong>
            </p>
          </div>

          <div className="space-y-1">
            <Label>Content</Label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <TiptapEditor value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.content && <p className="text-destructive text-xs">{errors.content.message}</p>}
          </div>

          <Controller
            name="seo"
            control={control}
            render={({ field }) => (
              <SEOFields value={field.value} onChange={field.onChange} />
            )}
          />
        </div>

        {/* Right: settings sidebar */}
        <div className="space-y-4">
          <div className="rounded-lg border p-4 space-y-4">
            <div className="space-y-1">
              <Label htmlFor="post-status">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="post-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {status === "scheduled" && (
              <div className="space-y-1">
                <Label htmlFor="scheduled-at">Schedule Date & Time</Label>
                <Input id="scheduled-at" type="datetime-local" {...register("scheduledAt")} />
              </div>
            )}
          </div>

          <div className="rounded-lg border p-4">
            <Controller
              name="category"
              control={control}
              render={({ field: catField }) => (
                <Controller
                  name="tags"
                  control={control}
                  render={({ field: tagsField }) => (
                    <CategoryTagInput
                      category={catField.value}
                      tags={tagsField.value}
                      onCategoryChange={catField.onChange}
                      onTagsChange={tagsField.onChange}
                    />
                  )}
                />
              )}
            />
            {errors.category && (
              <p className="text-destructive text-xs mt-1">{errors.category.message}</p>
            )}
          </div>
        </div>
      </form>

      {/* Unsaved changes warning */}
      {isDirty && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-foreground text-background px-4 py-2 text-sm shadow-lg">
          You have unsaved changes
        </div>
      )}
    </div>
  );
}
