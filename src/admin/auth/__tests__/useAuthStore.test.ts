import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuthStore } from "../useAuthStore";

vi.mock("../../mock/api", () => ({
  authApi: {
    login: vi.fn(),
    logout: vi.fn(),
  },
}));

import { authApi } from "../../mock/api";
const mockAuthApi = authApi as { login: ReturnType<typeof vi.fn>; logout: ReturnType<typeof vi.fn> };

const MOCK_ADMIN = { id: "1", name: "Patrick Evra", email: "admin@mymquid.com", role: "super_admin" as const };
const MOCK_STAFF = { id: "2", name: "Jane Staff", email: "staff@mymquid.com", role: "staff" as const };

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  useAuthStore.setState({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });
});

describe("useAuthStore", () => {
  it("starts unauthenticated", () => {
    const { isAuthenticated, user } = useAuthStore.getState();
    expect(isAuthenticated).toBe(false);
    expect(user).toBeNull();
  });

  it("logs in with valid super admin credentials", async () => {
    mockAuthApi.login.mockResolvedValueOnce({ user: MOCK_ADMIN, token: "mock-jwt-admin" });
    await useAuthStore.getState().login("admin@mymquid.com", "password");
    const { isAuthenticated, user, token, error } = useAuthStore.getState();
    expect(isAuthenticated).toBe(true);
    expect(user?.role).toBe("super_admin");
    expect(token).toBe("mock-jwt-admin");
    expect(error).toBeNull();
  });

  it("logs in with valid staff credentials", async () => {
    mockAuthApi.login.mockResolvedValueOnce({ user: MOCK_STAFF, token: "mock-jwt-staff" });
    await useAuthStore.getState().login("staff@mymquid.com", "password");
    const { user } = useAuthStore.getState();
    expect(user?.role).toBe("staff");
  });

  it("sets error for invalid credentials", async () => {
    mockAuthApi.login.mockRejectedValueOnce(new Error("Invalid email or password"));
    await useAuthStore.getState().login("wrong@email.com", "bad");
    const { isAuthenticated, error } = useAuthStore.getState();
    expect(isAuthenticated).toBe(false);
    expect(error).toBe("Invalid email or password");
  });

  it("logout clears user and token", async () => {
    mockAuthApi.login.mockResolvedValueOnce({ user: MOCK_ADMIN, token: "mock-jwt-admin" });
    mockAuthApi.logout.mockResolvedValueOnce(undefined);
    await useAuthStore.getState().login("admin@mymquid.com", "password");
    await useAuthStore.getState().logout();
    const { isAuthenticated, user, token } = useAuthStore.getState();
    expect(isAuthenticated).toBe(false);
    expect(user).toBeNull();
    expect(token).toBeNull();
  });

  it("clearError resets error to null", async () => {
    mockAuthApi.login.mockRejectedValueOnce(new Error("Invalid email or password"));
    await useAuthStore.getState().login("wrong@email.com", "bad");
    useAuthStore.getState().clearError();
    expect(useAuthStore.getState().error).toBeNull();
  });
});
