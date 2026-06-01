import { describe, it, expect, vi, beforeEach } from "vitest";
import { useUserStore } from "../useUserStore";
import { MOCK_USERS } from "../../mock/data";

vi.mock("../../mock/api", () => ({
  userApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    getPosts: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateStatus: vi.fn(),
    delete: vi.fn(),
    resetPassword: vi.fn(),
  },
}));

import { userApi } from "../../mock/api";
const mockUserApi = userApi as unknown as {
  getAll: ReturnType<typeof vi.fn>;
  getById: ReturnType<typeof vi.fn>;
  getPosts: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  updateStatus: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  resetPassword: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  vi.clearAllMocks();
  useUserStore.setState({
    users: [],
    selectedUser: null,
    userPosts: [],
    isLoading: false,
    isActionLoading: false,
  });
});

describe("useUserStore", () => {
  it("fetchUsers loads users from API", async () => {
    mockUserApi.getAll.mockResolvedValueOnce(MOCK_USERS);
    await useUserStore.getState().fetchUsers();
    expect(useUserStore.getState().users.length).toBe(MOCK_USERS.length);
  });

  it("fetchUser sets selectedUser", async () => {
    mockUserApi.getById.mockResolvedValueOnce(MOCK_USERS[0]);
    await useUserStore.getState().fetchUser("1");
    expect(useUserStore.getState().selectedUser?.id).toBe("1");
  });

  it("fetchUserPosts sets userPosts", async () => {
    mockUserApi.getPosts.mockResolvedValueOnce([]);
    await useUserStore.getState().fetchUserPosts("1");
    expect(Array.isArray(useUserStore.getState().userPosts)).toBe(true);
  });

  it("createUser calls userApi.create and refetches", async () => {
    const payload = { name: "New", email: "new@test.com", role: "staff" as const };
    mockUserApi.create.mockResolvedValueOnce({ ...MOCK_USERS[0], id: "3" });
    mockUserApi.getAll.mockResolvedValueOnce(MOCK_USERS);
    await useUserStore.getState().createUser(payload);
    expect(mockUserApi.create).toHaveBeenCalledWith(payload);
  });

  it("updateUser patches user in list", async () => {
    useUserStore.setState({ users: MOCK_USERS });
    const updated = { ...MOCK_USERS[0], name: "Updated Name" };
    mockUserApi.update.mockResolvedValueOnce(updated);
    await useUserStore.getState().updateUser("1", { name: "Updated Name", email: MOCK_USERS[0].email, role: MOCK_USERS[0].role });
    expect(useUserStore.getState().users[0].name).toBe("Updated Name");
  });

  it("toggleUserStatus updates active field", async () => {
    useUserStore.setState({ users: MOCK_USERS });
    mockUserApi.updateStatus.mockResolvedValueOnce(undefined);
    await useUserStore.getState().toggleUserStatus("1", false);
    expect(useUserStore.getState().users[0].active).toBe(false);
  });

  it("deleteUser removes user from list", async () => {
    useUserStore.setState({ users: MOCK_USERS });
    mockUserApi.delete.mockResolvedValueOnce(undefined);
    await useUserStore.getState().deleteUser("1");
    expect(useUserStore.getState().users.find((u) => u.id === "1")).toBeUndefined();
  });

  it("resetUserPassword calls userApi.resetPassword", async () => {
    mockUserApi.resetPassword.mockResolvedValueOnce(undefined);
    await useUserStore.getState().resetUserPassword("1");
    expect(mockUserApi.resetPassword).toHaveBeenCalledWith("1");
  });
});
