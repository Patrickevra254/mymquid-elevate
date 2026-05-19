import { useNavigate } from "react-router-dom";
import { PlusCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h3 className="font-semibold mb-4">Quick Actions</h3>
      <div className="space-y-2">
        <Button
          className="w-full justify-start"
          onClick={() => navigate("/admin/blog/create")}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> New Blog Post
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => window.open("/", "_blank")}
        >
          <ExternalLink className="mr-2 h-4 w-4" /> View Public Site
        </Button>
      </div>
    </div>
  );
}
