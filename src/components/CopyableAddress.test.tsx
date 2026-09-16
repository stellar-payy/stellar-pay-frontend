import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { CopyableAddress } from "./CopyableAddress";

describe("CopyableAddress", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("copies the address to the clipboard when clicked", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<CopyableAddress address="GABC123" />);
    fireEvent.click(screen.getByRole("button"));

    expect(writeText).toHaveBeenCalledWith("GABC123");
    await screen.findByText("Copied");
  });
});
