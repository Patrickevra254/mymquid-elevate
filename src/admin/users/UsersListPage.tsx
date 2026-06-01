import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "../shared/components/PageHeader";
import { ConfirmModal } from "../shared/components/ConfirmModal";
import { UserTable } from "./components/UserTable";
import { AddUserModal } from "./components/AddUserModal";
import { useUserStore } from "./useUserStore";
import type { UserWithStats, CreateUserPayload, UpdateUserPayload } from "../types";

type ConfirmAction = {
  type: "delete" | "toggle" | "reset";
  user: UserWithStats;
};

export default function UsersListPage() {
  const {
    users,
    isLoading,
    isActionLoading,
    fetchUsers,
    createUser,
    updateUser,
    toggleUserStatus,
    deleteUser,
    resetUserPassword,
  } = useUserStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editUser, setEditUser] = useState<UserWithStats | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddSubmit = async (data: CreateUserPayload | UpdateUserPayload) => {
    await createUser(data as CreateUserPayload);
    setShowAddModal(false);
  };

  const handleEditSubmit = async (data: CreateUserPayload | UpdateUserPayload) => {
    if (!editUser) return;
    await updateUser(editUser.id, data as UpdateUserPayload);
    setEditUser(null);
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    const { type, user } = confirmAction;
    if (type === "delete") await deleteUser(user.id);
    if (type === "toggle") await toggleUserStatus(user.id, !user.active);
    if (type === "reset") await resetUserPassword(user.id);
    setConfirmAction(null);
  };

  const confirmTitle = () => {
    if (!confirmAction) return "";
    if (confirmAction.type === "delete") return "Delete user?";
    if (confirmAction.type === "toggle")
      return confirmAction.user.active ? "Deactivate user?" : "Activate user?";
    return "Reset password?";
  };

  const confirmDescription = () => {
    if (!confirmAction) return "";
    if (confirmAction.type === "delete")
      return `This will permanently delete ${confirmAction.user.name}. This action cannot be undone.`;
    if (confirmAction.type === "toggle")
      return confirmAction.user.active
        ? `${confirmAction.user.name} will lose access to the admin panel.`
        : `${confirmAction.user.name} will regain access to the admin panel.`;
    return `A password reset email will be sent to ${confirmAction.user.email}.`;
  };

  const confirmLabel = () => {
    if (!confirmAction) return "Confirm";
    if (confirmAction.type === "delete") return "Delete";
    if (confirmAction.type === "toggle")
      return confirmAction.user.active ? "Deactivate" : "Activate";
    return "Send Reset Email";
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Manage Users"
        description="All staff and admin accounts"
        action={
          <Button onClick={() => setShowAddModal(true)}>
            <UserPlus className="mr-2 h-4 w-4" /> Add User
          </Button>
        }
      />

      <UserTable
        users={users}
        isLoading={isLoading}
        onEdit={(user) => setEditUser(user)}
        onResetPassword={(user) => setConfirmAction({ type: "reset", user })}
        onToggleStatus={(user) => setConfirmAction({ type: "toggle", user })}
        onDelete={(user) => setConfirmAction({ type: "delete", user })}
      />

      <AddUserModal
        open={showAddModal}
        isLoading={isActionLoading}
        onSubmit={handleAddSubmit}
        onClose={() => setShowAddModal(false)}
      />

      <AddUserModal
        open={!!editUser}
        user={editUser}
        isLoading={isActionLoading}
        onSubmit={handleEditSubmit}
        onClose={() => setEditUser(null)}
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
