import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useApi from "../useApi";
import { handleApiError } from "../../utils/apiErrorHandler";

// Mock apiErrorHandler
vi.mock("../../utils/apiErrorHandler", () => ({
  handleApiError: vi.fn(),
}));

describe("useApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with correct default values", () => {
    const apiFunction = vi.fn();

    const { result } = renderHook(() => useApi(apiFunction));

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.loaded).toBe(false);
  });

  it("should load data on mount when loadOnMount is true", async () => {
    const mockData = { id: 1, name: "Test" };
    const apiFunction = vi.fn().mockResolvedValue(mockData);

    const { result, waitForNextUpdate } = renderHook(() =>
      useApi(apiFunction, { loadOnMount: true })
    );

    // Initial state
    expect(result.current.loading).toBe(true);

    // Wait for update
    await waitForNextUpdate();

    // Updated state
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.loaded).toBe(true);
    expect(apiFunction).toHaveBeenCalledTimes(1);
  });

  it("should execute API function and update state", async () => {
    const mockData = { id: 1, name: "Test" };
    const apiFunction = vi.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => useApi(apiFunction));

    // Initial state
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();

    // Execute API function
    let returnedData;
    await act(async () => {
      returnedData = await result.current.execute();
    });

    // Check returned data
    expect(returnedData).toEqual(mockData);

    // Updated state
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.loaded).toBe(true);
    expect(apiFunction).toHaveBeenCalledTimes(1);
  });

  it("should pass arguments to API function", async () => {
    const apiFunction = vi.fn().mockResolvedValue({ result: "success" });

    const { result } = renderHook(() => useApi(apiFunction));

    // Execute API function with arguments
    await act(async () => {
      await result.current.execute("arg1", { key: "value" });
    });

    // Check arguments
    expect(apiFunction).toHaveBeenCalledWith("arg1", { key: "value" });
  });

  it("should handle API errors", async () => {
    const error = new Error("API Error");
    const apiFunction = vi.fn().mockRejectedValue(error);

    const { result } = renderHook(() => useApi(apiFunction));

    // Execute API function
    await act(async () => {
      try {
        await result.current.execute();
      } catch (e) {
        // Ignore error
      }
    });

    // Updated state
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeDefined();
    expect(handleApiError).toHaveBeenCalledWith(error, expect.any(Object));
  });

  it("should call onSuccess callback on success", async () => {
    const mockData = { id: 1, name: "Test" };
    const apiFunction = vi.fn().mockResolvedValue(mockData);
    const onSuccess = vi.fn();

    const { result } = renderHook(() => useApi(apiFunction, { onSuccess }));

    // Execute API function
    await act(async () => {
      await result.current.execute();
    });

    // Check callback
    expect(onSuccess).toHaveBeenCalledWith(mockData);
  });

  it("should call onError callback on error", async () => {
    const error = new Error("API Error");
    const apiFunction = vi.fn().mockRejectedValue(error);
    const onError = vi.fn();

    const { result } = renderHook(() => useApi(apiFunction, { onError }));

    // Execute API function
    await act(async () => {
      try {
        await result.current.execute();
      } catch (e) {
        // Ignore error
      }
    });

    // Check callback
    expect(onError).toHaveBeenCalled();
  });

  it("should reset state", async () => {
    const mockData = { id: 1, name: "Test" };
    const apiFunction = vi.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => useApi(apiFunction));

    // Execute API function
    await act(async () => {
      await result.current.execute();
    });

    // Updated state
    expect(result.current.data).toEqual(mockData);
    expect(result.current.loaded).toBe(true);

    // Reset state
    act(() => {
      result.current.reset();
    });

    // Check reset state
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.loaded).toBe(false);
  });

  it("should reload when dependencies change", async () => {
    const mockData1 = { id: 1, name: "Test 1" };
    const mockData2 = { id: 2, name: "Test 2" };
    const apiFunction = vi
      .fn()
      .mockResolvedValueOnce(mockData1)
      .mockResolvedValueOnce(mockData2);

    const { result, rerender } = renderHook(
      ({ dependency }) =>
        useApi(apiFunction, { loadOnMount: true, dependencies: [dependency] }),
      { initialProps: { dependency: "initial" } }
    );

    // Wait for initial load
    await waitForNextUpdate();

    // Check initial data
    expect(result.current.data).toEqual(mockData1);
    expect(apiFunction).toHaveBeenCalledTimes(1);

    // Change dependency
    rerender({ dependency: "changed" });

    // Wait for reload
    await waitForNextUpdate();

    // Check updated data
    expect(result.current.data).toEqual(mockData2);
    expect(apiFunction).toHaveBeenCalledTimes(2);
  });
});
