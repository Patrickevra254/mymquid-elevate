import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "./useAuthStore";
import { authApi } from "../mock/api";
import logo from "@/assets/mquid-logo.png";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "Must contain at least one number or special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function SetPasswordPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (!t) {
      toast.error("No invite token found. Please use the link from your email.");
      navigate("/admin/login", { replace: true });
      return;
    }
    setToken(t);
  }, [navigate]);

  const onSubmit = async (data: FormValues) => {
    if (!token) return;
    setSubmitting(true);
    try {
      const { user, token: accessToken } = await authApi.setPassword(token, data.password, data.confirmPassword);
      useAuthStore.setState({ user, token: accessToken, isAuthenticated: true });
      toast.success("Password set successfully! Welcome to Mquid.");
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      const status = (err as { response?: { status?: number; data?: { message?: string } } })?.response;
      const message = status?.data?.message ?? "";

      if (status?.status === 401) {
        toast.error("This invite link has expired or has already been used. Contact your admin.");
      } else if (message.toLowerCase().includes("already been set") || message.toLowerCase().includes("already active")) {
        toast.error("Account already active. Please use the login page instead.");
      } else if (message.toLowerCase().includes("do not match")) {
        toast.error("Passwords do not match. Please try again.");
      } else {
        toast.error("Something went wrong. Please try again or contact your admin.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <img src={logo} alt="Mquid" className="h-9 w-auto mx-auto mb-4" />
          <h1 className="text-xl font-semibold">Set your password</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create a password to activate your account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-destructive text-xs">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat your password"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-destructive text-xs">{errors.confirmPassword.message}</p>
            )}
          </div>

          <ul className="text-xs text-muted-foreground space-y-0.5 list-disc list-inside">
            <li>At least 8 characters</li>
            <li>At least one number or special character (!@#$%^&* etc.)</li>
          </ul>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Activate Account
          </Button>
        </form>
      </div>
    </div>
  );
}
