import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePagination } from "../usePagination";

describe("usePagination", () => {
  it("starts on page 1", () => {
    const { result } = renderHook(() => usePagination(50, 10));
    expect(result.current.page).toBe(1);
    expect(result.current.totalPages).toBe(5);
  });

  it("nextPage increments page", () => {
    const { result } = renderHook(() => usePagination(50, 10));
    act(() => result.current.nextPage());
    expect(result.current.page).toBe(2);
  });

  it("prevPage does not go below 1", () => {
    const { result } = renderHook(() => usePagination(50, 10));
    act(() => result.current.prevPage());
    expect(result.current.page).toBe(1);
  });

  it("goToPage clamps to valid range", () => {
    const { result } = renderHook(() => usePagination(50, 10));
    act(() => result.current.goToPage(99));
    expect(result.current.page).toBe(5);
    act(() => result.current.goToPage(0));
    expect(result.current.page).toBe(1);
  });

  it("returns correct slice offsets", () => {
    const { result } = renderHook(() => usePagination(50, 10));
    act(() => result.current.goToPage(3));
    expect(result.current.from).toBe(20);
    expect(result.current.to).toBe(30);
  });
});
