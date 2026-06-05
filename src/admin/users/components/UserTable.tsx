import { useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SkeletonLoader } from "../../shared/components/SkeletonLoader";
import type { UserWithStats } from "../../types";

type Props = {
  users: UserWithStats[];
  isLoading: boolean;
  onEdit: (user: UserWithStats) => void;
  onResetPassword: (user: UserWithStats) => void;
  onToggleStatus: (user: UserWithStats) => void;
  onDelete: (user: UserWithStats) => void;
};

function RoleBadge({ role }: { role: string }) {
  return (
    <Badge
      variant="outline"
      className={
        role === "super_admin"
          ? "border-purple-500 text-purple-600"
          : "border-blue-500 text-blue-600"
      }
    >
      {role === "super_admin" ? "Super Admin" : "Staff"}
    </Badge>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <Badge
      variant="outline"
      className={
        active ? "border-green-500 text-green-600" : "border-gray-400 text-gray-500"
      }
    >
      {active ? "Active" : "Inactive"}
    </Badge>
  );
}

export function UserTable({
  users,
  isLoading,
  onEdit,
  onResetPassword,
  onToggleStatus,
  onDelete,
}: Props) {
  const navigate = useNavigate();

  if (isLoading) return <SkeletonLoader rows={5} />;

  if (users.length === 0) {
    return (
      <div className="rounded-lg border p-12 text-center text-muted-foreground">
        <p className="text-sm">No users found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th className="px-4 py-3 text-left font-medium">User</th>
            <th className="px-4 py-3 text-left font-medium">Role</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-right font-medium">Published</th>
            <th className="px-4 py-3 text-right font-medium">Drafts</th>
            <th className="px-4 py-3 text-right font-medium">Scheduled</th>
            <th className="px-4 py-3 text-left font-medium">Last Login</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-muted/20 cursor-pointer transition-colors"
              onClick={() => navigate(`/admin/users/${user.id}`)}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <RoleBadge role={user.role} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge active={user.active} />
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {user.stats.published}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {user.stats.drafts}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {user.stats.scheduled}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {format(new Date(user.lastLogin), "MMM d, yyyy")}
              </td>
              <td
                className="px-4 py-3"
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => navigate(`/admin/users/${user.id}`)}
                    >
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(user)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onResetPassword(user)}>
                      Reset Password
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onToggleStatus(user)}>
                      {user.active ? "Deactivate" : "Activate"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(user)}
                      className="text-destructive focus:text-destructive"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
