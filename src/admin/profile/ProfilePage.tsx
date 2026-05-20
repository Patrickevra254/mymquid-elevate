import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "../shared/components/PageHeader";
import { useAuthStore } from "../auth/useAuthStore";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
});

type FormValues = z.infer<typeof schema>;

export default function ProfilePage() {
  const { user } = useAuthStore();

  const initials = user?.name
    ? user.name.trim().split(" ").filter(Boolean).map((n) => n[0]).join("").toUpperCase() || "A"
    : "A";

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name ?? "", email: user?.email ?? "" },
  });

  const onSubmit = () => {
    toast.success("Profile updated. (Mock — no backend yet)");
  };

  return (
    <div className="space-y-6 max-w-lg">
      <PageHeader title="Profile" description="Manage your account details" />

      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-primary text-primary-foreground text-xl">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{user?.name}</p>
          <p className="text-sm text-muted-foreground capitalize">
            {user?.role.replace("_", " ")}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="profile-name">Full Name</Label>
          <Input id="profile-name" {...register("name")} />
          {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="profile-email">Email</Label>
          <Input id="profile-email" type="email" {...register("email")} />
          {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
        </div>
        <Button type="submit" disabled={!isDirty}>Save Changes</Button>
      </form>
    </div>
  );
}
