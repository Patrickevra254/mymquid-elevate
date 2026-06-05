import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UsersListPage from "../UsersListPage";
import { MOCK_USERS } from "../../mock/data";

vi.mock("../useUserStore", () => ({
  useUserStore: vi.fn(),
}));

import { useUserStore } from "../useUserStore";
const mockUseUserStore = useUserStore as unknown as ReturnType<typeof vi.fn>;

const defaultStore = {
  users: MOCK_USERS,
  isLoading: false,
  isActionLoading: false,
  fetchUsers: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  toggleUserStatus: vi.fn(),
  deleteUser: vi.fn(),
  resetUserPassword: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  mockUseUserStore.mockReturnValue(defaultStore);
});

describe("UsersListPage", () => {
  it("renders the page header and Add User button", () => {
    render(<MemoryRouter><UsersListPage /></MemoryRouter>);
    expect(screen.getByText("Manage Users")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add user/i })).toBeInTheDocument();
  });

  it("renders user rows from the store", () => {
    render(<MemoryRouter><UsersListPage /></MemoryRouter>);
    expect(screen.getByText(MOCK_USERS[0].name)).toBeInTheDocument();
    expect(screen.getByText(MOCK_USERS[1].name)).toBeInTheDocument();
  });

  it("shows loading skeleton when isLoading is true", () => {
    mockUseUserStore.mockReturnValue({ ...defaultStore, users: [], isLoading: true });
    render(<MemoryRouter><UsersListPage /></MemoryRouter>);
    expect(screen.queryByText(MOCK_USERS[0].name)).not.toBeInTheDocument();
  });
});
