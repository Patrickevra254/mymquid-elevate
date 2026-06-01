import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Edit, Mail, ShieldOff, Shield, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmModal } from "../shared/components/ConfirmModal";
import { SkeletonLoader } from "../shared/components/SkeletonLoader";
import { BlogStatusBadge } from "../blog/components/BlogStatusBadge";
import { UserStatCards } from "./components/UserStatCards";
import { AddUserModal } from "./components/AddUserModal";
import { useUserStore } from "./useUserStore";
import type { CreateUserPayload, UpdateUserPayload } from "../types";

type ConfirmAction = "delete" | "toggle" | "reset";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedUser,
    userPosts,
    isLoading,
    isActionLoading,
    fetchUser,
    fetchUserPosts,
    updateUser,
    toggleUserStatus,
    deleteUser,
    resetUserPassword,
  } = useUserStore();

  const [showEditModal, setShowEditModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

  useEffect(() => {
    if (!id) { navigate("/admin/users"); return; }
    void Promise.all([fetchUser(id), fetchUserPosts(id)]);
  }, [id, fetchUser, fetchUserPosts, navigate]);

  if (isLoading || !selectedUser) {
    return (
      <div className="space-y-6">
        <div className="h-5 w-24 bg-muted rounded animate-pulse" />
        <div className="rounded-lg border p-6 h-24 bg-muted animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
        <SkeletonLoader rows={5} />
      </div>
    );
  }

  const user = selectedUser;

  const handleEditSubmit = async (data: CreateUserPayload | UpdateUserPayload) => {
    await updateUser(user.id, data as UpdateUserPayload);
    setShowEditModal(false);
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    if (confirmAction === "delete") {
      await deleteUser(user.id);
      navigate("/admin/users");
    } else if (confirmAction === "toggle") {
      await toggleUserStatus(user.id, !user.active);
    } else if (confirmAction === "reset") {
      await resetUserPassword(user.id);
    }
    setConfirmAction(null);
  };

  const confirmTitle = () => {
    if (confirmAction === "delete") return "Delete user?";
    if (confirmAction === "toggle")
      return user.active ? "Deactivate user?" : "Activate user?";
    return "Reset password?";
  };

  const confirmDescription = () => {
    if (confirmAction === "delete")
      return `This will permanently delete ${user.name}. This action cannot be undone.`;
    if (confirmAction === "toggle")
      return user.active
        ? `${user.name} will lose access to the admin panel.`
        : `${user.name} will regain access to the admin panel.`;
    return `A password reset email will be sent to ${user.email}.`;
  };

  const confirmLabel = () => {
    if (confirmAction === "delete") return "Delete";
    if (confirmAction === "toggle") return user.active ? "Deactivate" : "Activate";
    return "Send Reset Email";
  };

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        to="/admin/users"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All Users
      </Link>

      {/* Header */}
      <div className="rounded-lg border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-xl font-semibold text-primary shrink-0">
            {user.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-semibold">{user.name}</h1>
              <Badge
                variant="outline"
                className={
                  user.role === "super_admin"
                    ? "border-purple-500 text-purple-600"
                    : "border-blue-500 text-blue-600"
                }
              >
                {user.role === "super_admin" ? "Super Admin" : "Staff"}
              </Badge>
              <Badge
                variant="outline"
                className={
                  user.active
                    ? "border-green-500 text-green-600"
                    : "border-gray-400 text-gray-500"
                }
              >
                {user.active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmAction("reset")}
          >
            <Mail className="mr-2 h-4 w-4" /> Reset Password
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmAction("toggle")}
          >
            {user.active ? (
              <><ShieldOff className="mr-2 h-4 w-4" /> Deactivate</>
            ) : (
              <><Shield className="mr-2 h-4 w-4" /> Activate</>
            )}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setConfirmAction("delete")}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      {/* Stats */}
      <UserStatCards user={user} />

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="posts">Blog Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="rounded-lg border p-6 grid sm:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Full Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Role</p>
              <p className="font-medium">
                {user.role === "super_admin" ? "Super Admin" : "Staff"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Status</p>
              <p className="font-medium">{user.active ? "Active" : "Inactive"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Member Since</p>
              <p className="font-medium">
                {format(new Date(user.createdAt), "MMMM d, yyyy")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Last Login</p>
              <p className="font-medium">
                {format(new Date(user.lastLogin), "MMMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </div>

          <div className="rounded-lg border p-6">
            <h3 className="text-sm font-medium mb-4">Recent Activity</h3>
            {userPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No posts yet.</p>
            ) : (
              <div className="space-y-3">
                {userPosts.slice(0, 5).map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="font-medium truncate max-w-xs">{post.title}</span>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <BlogStatusBadge status={post.status} />
                      <span className="text-muted-foreground text-xs">
                        {format(new Date(post.updatedAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="posts" className="pt-4">
          {userPosts.length === 0 ? (
            <div className="rounded-lg border p-12 text-center text-sm text-muted-foreground">
              This user has no posts yet.
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Title</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Category</th>
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {userPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">{post.title}</td>
                      <td className="px-4 py-3">
                        <BlogStatusBadge status={post.status} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {post.category}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {format(new Date(post.updatedAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/admin/blog/edit/${post.id}`}>Edit</Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <a
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View
                            </a>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AddUserModal
        open={showEditModal}
        user={user}
        isLoading={isActionLoading}
        onSubmit={handleEditSubmit}
        onClose={() => setShowEditModal(false)}
      />

      <ConfirmModal
        open={!!confirmAction}
        title={confirmTitle()}
        description={confirmDescription()}
        confirmLabel={confirmLabel()}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
