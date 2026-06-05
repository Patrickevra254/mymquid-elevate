import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, Loader2, Save, Eye, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { blogApi, uploadApi } from "../mock/api";
import { useAuthStore } from "../auth/useAuthStore";
import type { BlogPost, BlogStatus } from "../types";

type FormValues = {
  title: string;
  slug: string;
  content: string;
  status: "draft" | "published" | "scheduled";
  category: string;
  tags: string[];
  scheduledAt?: string;
  featuredImage?: string;
  seo: { metaTitle: string; metaDescription: string; ogImage?: string };
};

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
  const [imageUploading, setImageUploading] = useState(false);
  const originalCreatedAt = useRef<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      status: "draft",
      category: "",
      tags: [],
      scheduledAt: "",
      featuredImage: "",
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
      setValue("featuredImage", post.featuredImage ?? "");
      const flat = post as unknown as Record<string, string>;
      const seo = post.seo ?? { metaTitle: flat.metaTitle ?? "", metaDescription: flat.metaDescription ?? "", ogImage: flat.ogImage ?? "" };
      setValue("seo.metaTitle", seo.metaTitle);
      setValue("seo.metaDescription", seo.metaDescription);
      originalCreatedAt.current = post.createdAt;
      setLoading(false);
    }).catch(() => {
      navigate("/admin/blog");
    });
  }, [id, isEdit, navigate, setValue]);

  const buildPost = (data: FormValues): BlogPost => ({
    id: id ?? "",
    ...data,
    status: data.status as BlogStatus,
    featuredImage: data.featuredImage || undefined,
    createdAt: originalCreatedAt.current ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: { id: user?.id ?? "1", name: user?.name ?? "Admin" },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const url = await uploadApi.upload(file, "blog-image");
      setValue("featuredImage", url);
    } catch {
      toast.error("Image upload failed.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSave = async (data: FormValues, overrideStatus?: BlogStatus) => {
    setSaving(true);
    try {
      const post = buildPost({ ...data, status: overrideStatus ?? data.status });
      const isNew = !id;
      await savePost(post);
      toast.success(
        overrideStatus === "published"
          ? "Post published successfully!"
          : isNew
          ? "Post created successfully!"
          : "Post updated successfully!"
      );
      navigate("/admin/blog");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save post.");
    } finally {
      setSaving(false);
    }
  };

  const onValidationError = () => {
    toast.error("Please fill in all required fields.");
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
            onClick={handleSubmit((data) => handleSave(data, "draft"), onValidationError)}
          >
            {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
            Save Draft
          </Button>
          <Button
            size="sm"
            disabled={saving}
            onClick={handleSubmit((data) => handleSave(data, "published"), onValidationError)}
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
            <Input
              id="post-title"
              placeholder="Post title..."
              {...register("title", { required: "Title is required" })}
              className={cn(errors.title && "border-destructive focus-visible:ring-destructive")}
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="post-slug">Slug</Label>
            <Input
              id="post-slug"
              placeholder="post-url-slug"
              {...register("slug", {
                required: "Slug is required",
                pattern: { value: /^[a-z0-9-]+$/, message: "Slug must be lowercase letters, numbers and hyphens only" },
                onChange: () => setSlugManuallyEdited(true),
              })}
              className={cn(errors.slug && "border-destructive focus-visible:ring-destructive")}
            />
            {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
            <p className="text-xs text-muted-foreground">
              URL: /blog/<strong>{watch("slug") || "your-post-slug"}</strong>
            </p>
          </div>

          <div className="space-y-1">
            <Label>Content</Label>
            <Controller
              name="content"
              control={control}
              rules={{
                validate: (v) => {
                  if (!v || v.trim() === "") return "Content is required";
                  try {
                    const doc = JSON.parse(v);
                    const hasText = (nodes: unknown[]): boolean =>
                      nodes?.some((n: unknown) => {
                        const node = n as Record<string, unknown>;
                        if (typeof node.text === "string" && node.text.trim().length > 0) return true;
                        if (Array.isArray(node.content)) return hasText(node.content);
                        return false;
                      });
                    return hasText(doc?.content ?? []) || "Content is required";
                  } catch {
                    return v.trim().length > 0 || "Content is required";
                  }
                },
              }}
              render={({ field }) => (
                <TiptapEditor value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">SEO</h4>

            <div className="space-y-1">
              <Label className="text-xs">Meta Title</Label>
              <Input
                placeholder="Page title for search engines"
                {...register("seo.metaTitle", {
                  required: "Meta title is required",
                  maxLength: { value: 60, message: "Meta title must be 60 characters or fewer" },
                })}
                className={cn(errors.seo?.metaTitle && "border-destructive focus-visible:ring-destructive")}
              />
              <div className="flex justify-between items-center">
                {errors.seo?.metaTitle
                  ? <p className="text-xs text-destructive">{errors.seo.metaTitle.message}</p>
                  : <span />}
                <p className={cn("text-xs", (watch("seo.metaTitle")?.length ?? 0) > 60 ? "text-destructive" : "text-muted-foreground")}>
                  {watch("seo.metaTitle")?.length ?? 0}/60
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Meta Description</Label>
              <Textarea
                placeholder="Short description for search results"
                rows={3}
                {...register("seo.metaDescription", {
                  required: "Meta description is required",
                  maxLength: { value: 160, message: "Meta description must be 160 characters or fewer" },
                })}
                className={cn(errors.seo?.metaDescription && "border-destructive focus-visible:ring-destructive")}
              />
              <div className="flex justify-between items-center">
                {errors.seo?.metaDescription
                  ? <p className="text-xs text-destructive">{errors.seo.metaDescription.message}</p>
                  : <span />}
                <p className={cn("text-xs", (watch("seo.metaDescription")?.length ?? 0) > 160 ? "text-destructive" : "text-muted-foreground")}>
                  {watch("seo.metaDescription")?.length ?? 0}/160
                </p>
              </div>
            </div>
          </div>
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

          <div className={cn("rounded-lg border p-4", errors.category && "border-destructive")}>
            <Controller
              name="category"
              control={control}
              rules={{ required: "Category is required" }}
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
            {errors.category && <p className="text-xs text-destructive mt-1">{errors.category.message}</p>}
          </div>

          <div className="rounded-lg border p-4 space-y-3">
            <p className="text-sm font-medium">Featured Image</p>
            {watch("featuredImage") ? (
              <div className="relative">
                <img
                  src={watch("featuredImage")}
                  alt="Featured"
                  className="w-full rounded-md object-cover aspect-video"
                />
                <button
                  type="button"
                  onClick={() => setValue("featuredImage", "")}
                  className="absolute top-2 right-2 rounded-full bg-background/80 p-1 hover:bg-background transition"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : imageUploading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading…
              </div>
            ) : (
              <label className="flex items-center gap-2 cursor-pointer rounded-md border border-dashed p-3 text-sm text-muted-foreground hover:bg-accent transition">
                <ImageIcon className="h-4 w-4" />
                Upload image
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageUpload}
                />
              </label>
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
