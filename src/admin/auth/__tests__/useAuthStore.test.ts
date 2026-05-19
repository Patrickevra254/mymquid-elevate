import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "../useAuthStore";

beforeEach(() => {
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
    await useAuthStore.getState().login("admin@mymquid.com", "mock-admin-dev-only");
    const { isAuthenticated, user, token, error } = useAuthStore.getState();
    expect(isAuthenticated).toBe(true);
    expect(user?.role).toBe("super_admin");
    expect(token).toBe("mock-jwt-admin");
    expect(error).toBeNull();
  });

  it("logs in with valid staff credentials", async () => {
    await useAuthStore.getState().login("staff@mymquid.com", "mock-staff-dev-only");
    const { user } = useAuthStore.getState();
    expect(user?.role).toBe("staff");
  });

  it("sets error for invalid credentials", async () => {
    await useAuthStore.getState().login("wrong@email.com", "bad");
    const { isAuthenticated, error } = useAuthStore.getState();
    expect(isAuthenticated).toBe(false);
    expect(error).toBe("Invalid email or password");
  });

  it("logout clears user and token", async () => {
    await useAuthStore.getState().login("admin@mymquid.com", "mock-admin-dev-only");
    useAuthStore.getState().logout();
    const { isAuthenticated, user, token } = useAuthStore.getState();
    expect(isAuthenticated).toBe(false);
    expect(user).toBeNull();
    expect(token).toBeNull();
  });

  it("clearError resets error to null", async () => {
    await useAuthStore.getState().login("wrong@email.com", "bad");
    useAuthStore.getState().clearError();
    expect(useAuthStore.getState().error).toBeNull();
  });
});
