import { renderHook } from "@testing-library/react-native";
import { useAuth } from "src/utils/hooks/useAuth";

describe("useAuth", () => {
  it("returns a user", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user.email).toBe("test-user@test.com");
  });
});
