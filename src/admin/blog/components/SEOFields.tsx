import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type SEO = {
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
};

type SEOErrors = {
  metaTitle?: { message?: string };
  metaDescription?: { message?: string };
};

type Props = {
  value: SEO;
  onChange: (seo: SEO) => void;
  errors?: SEOErrors;
};

export function SEOFields({ value, onChange, errors }: Props) {
  const update = (key: keyof SEO, val: string) =>
    onChange({ ...value, [key]: val });

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold">SEO</h4>

      <div className="space-y-1">
        <Label htmlFor="seo-meta-title" className="text-xs">Meta Title</Label>
        <Input
          id="seo-meta-title"
          placeholder="Page title for search engines"
          value={value.metaTitle}
          onChange={(e) => update("metaTitle", e.target.value)}
          className={cn(errors?.metaTitle && "border-destructive focus-visible:ring-destructive")}
        />
        <div className="flex justify-between">
          {errors?.metaTitle
            ? <p className="text-xs text-destructive">{errors.metaTitle.message}</p>
            : <span />
          }
          <p className={cn("text-xs", value.metaTitle.length > 60 ? "text-destructive" : "text-muted-foreground")}>
            {value.metaTitle.length}/60
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="seo-meta-description" className="text-xs">Meta Description</Label>
        <Textarea
          id="seo-meta-description"
          placeholder="Short description for search results"
          value={value.metaDescription}
          onChange={(e) => update("metaDescription", e.target.value)}
          rows={3}
          className={cn(errors?.metaDescription && "border-destructive focus-visible:ring-destructive")}
        />
        <div className="flex justify-between">
          {errors?.metaDescription
            ? <p className="text-xs text-destructive">{errors.metaDescription.message}</p>
            : <span />
          }
          <p className={cn("text-xs", value.metaDescription.length > 160 ? "text-destructive" : "text-muted-foreground")}>
            {value.metaDescription.length}/160
          </p>
        </div>
      </div>
    </div>
  );
}
