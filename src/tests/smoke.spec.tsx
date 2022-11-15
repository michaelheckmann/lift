import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

const Hello = ({ text }) => <Text>{text}</Text>;

describe("Truth", () => {
  it("is true", () => {
    expect(true).toEqual(true);
  });
});

describe("Hello", () => {
  it("renders the correct message", () => {
    const text = "Hello, World!";
    render(<Hello text={text} />);
    // screen.debug();
    expect(screen.getByText(text)).toBeVisible();
  });
});
