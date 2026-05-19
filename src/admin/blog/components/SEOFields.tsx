import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type SEO = {
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
};

type Props = {
  value: SEO;
  onChange: (seo: SEO) => void;
};

export function SEOFields({ value, onChange }: Props) {
  const update = (key: keyof SEO, val: string) =>
    onChange({ ...value, [key]: val });

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold">SEO</h4>

      <div className="space-y-1">
        <Label className="text-xs">Meta Title</Label>
        <Input
          placeholder="Page title for search engines"
          value={value.metaTitle}
          onChange={(e) => update("metaTitle", e.target.value)}
        />
        <p className="text-xs text-muted-foreground">{value.metaTitle.length}/60</p>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Meta Description</Label>
        <Textarea
          placeholder="Short description for search results"
          value={value.metaDescription}
          onChange={(e) => update("metaDescription", e.target.value)}
          rows={3}
        />
        <p className="text-xs text-muted-foreground">{value.metaDescription.length}/160</p>
      </div>
    </div>
  );
}
