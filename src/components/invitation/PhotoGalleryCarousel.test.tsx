import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PhotoGalleryCarousel, type GalleryPhoto } from "./PhotoGalleryCarousel";

const photos: GalleryPhoto[] = [
  { src: "/galeria/diana-1.jpg", alt: "Diana no jardim" },
  { src: "/galeria/diana-2.jpg", alt: "Diana de princesa" },
  { src: "/galeria/diana-3.jpg", alt: "Diana brincando" },
  { src: "/galeria/diana-4.jpg", alt: "Diana com coroa" },
];

afterEach(() => {
  cleanup();
});

describe("PhotoGalleryCarousel", () => {
  it("US1: renders the featured photo and thumbnails", () => {
    render(<PhotoGalleryCarousel photos={photos} />);

    const featured = screen.getByAltText("Diana no jardim");
    expect(featured).toBeInTheDocument();
    expect(featured.tagName).toBe("IMG");

    const thumbnails = screen.getAllByRole("tab");
    expect(thumbnails.length).toBe(photos.length);
  });

  it("US1: displays the placeholder when the featured image fails to load", () => {
    render(<PhotoGalleryCarousel photos={photos} />);

    const featured = screen.getByAltText("Diana no jardim");
    act(() => {
      fireEvent.error(featured);
    });

    expect(
      screen.getByText(/Não foi possível carregar a foto/i),
    ).toBeInTheDocument();
  });

  it("US2: clicking a thumbnail changes the featured photo and marks it active", () => {
    render(<PhotoGalleryCarousel photos={photos} />);

    const tabs = screen.getAllByRole("tab");
    act(() => {
      fireEvent.click(tabs[2]);
    });

    expect(screen.getByAltText("Diana brincando")).toBeInTheDocument();
    expect(tabs[2]).toHaveAttribute("aria-current", "true");
    expect(tabs[0]).not.toHaveAttribute("aria-current");
  });

  it("US3: renders all photos as accessible buttons", () => {
    render(<PhotoGalleryCarousel photos={photos} />);

    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBe(photos.length);
    tabs.forEach((tab, index) => {
      expect(tab).toHaveAttribute("aria-label", expect.stringContaining(photos[index].alt));
    });
  });

  it("renders nothing but a placeholder area when no photos are provided", () => {
    render(<PhotoGalleryCarousel photos={[]} />);

    expect(screen.getByText(/Nenhuma foto disponível/i)).toBeInTheDocument();
  });

  it("does not render thumbnails with only one photo", () => {
    render(
      <PhotoGalleryCarousel photos={[{ src: "/galeria/diana-1.jpg", alt: "Diana" }]} />,
    );

    expect(screen.getByAltText("Diana")).toBeInTheDocument();
    expect(screen.queryAllByRole("tab")).toHaveLength(0);
  });
});
