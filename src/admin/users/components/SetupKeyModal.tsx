import { useState } from "react";
import { Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  userName: string;
  setupKey: string;
  onClose: () => void;
};

export function SetupKeyModal({ open, userName, setupKey, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(setupKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User created successfully</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            Share this setup key with{" "}
            <span className="font-medium text-foreground">{userName}</span>.
            It will <span className="font-medium text-foreground">not</span> be shown again.
          </p>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Setup key</p>
            <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-4 py-3 font-mono text-sm break-all">
              {setupKey}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleCopy}
            >
              {copied ? (
                <><Check className="mr-2 h-4 w-4 text-green-600" /> Copied!</>
              ) : (
                <><Copy className="mr-2 h-4 w-4" /> Copy to clipboard</>
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            The invite email has also been sent.
          </p>
        </div>

        <Button className="w-full" onClick={onClose}>Done</Button>
      </DialogContent>
    </Dialog>
  );
}
