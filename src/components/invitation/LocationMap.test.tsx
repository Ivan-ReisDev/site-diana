import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LocationMap, type Venue } from "./LocationMap";

const venue: Venue = {
  name: "Casa de Festas Turma da Kali",
  address: "Est. Padre Roser, 765 - Vila da Penha, Rio de Janeiro",
};

const venueWithCoords: Venue = {
  name: "Casa de Festas Turma da Kali",
  address: "Est. Padre Roser, 765 - Vila da Penha, Rio de Janeiro",
  coords: "-22.846,-43.301",
};

const mapEmbedPrefix = "https://maps.google.com/maps?q=";
const mapEmbedSuffix = "&output=embed";
const directionsPrefix = "https://www.google.com/maps/dir/?api=1&destination=";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("LocationMap — US1", () => {
  it("C1: o nome do local fica legível como rótulo acessível do mapa (title do iframe)", () => {
    render(<LocationMap venue={venue} />);

    // O endereço por extenso vive no grid "Informações do convite real"
    // (seção pai); aqui o local é identificado pelo title acessível do iframe.
    expect(
      screen.getByTitle(/Mapa: Casa de Festas Turma da Kali/),
    ).toBeInTheDocument();
  });

  it("C2/C3: existe <iframe> com title descritivo, src de embed e loading=lazy", () => {
    render(<LocationMap venue={venue} />);

    const iframe = screen.getByTitle(/Mapa: Casa de Festas Turma da Kali/);
    expect(iframe).toBeInTheDocument();
    expect(iframe.tagName).toBe("IFRAME");

    const expectedSrc = `${mapEmbedPrefix}${encodeURIComponent(venue.address)}${mapEmbedSuffix}`;
    expect(iframe).toHaveAttribute("src", expectedSrc);
    expect(iframe).toHaveAttribute("loading", "lazy");
  });
});

describe("LocationMap — US2", () => {
  it("C4/C5: existe link 'Como chegar' com href de direções e sem parâmetro origin", () => {
    render(<LocationMap venue={venue} />);

    const link = screen.getByRole("link", { name: /Como chegar/i });
    expect(link).toBeInTheDocument();

    const expectedHref = `${directionsPrefix}${encodeURIComponent(venue.address)}`;
    expect(link).toHaveAttribute("href", expectedHref);
    expect(link.getAttribute("href") ?? "").not.toMatch(/[?&]origin=/);
  });

  it("C6: o link tem target='_blank' e rel contendo 'noopener' e 'noreferrer'", () => {
    render(<LocationMap venue={venue} />);

    const link = screen.getByRole("link", { name: /Como chegar/i });
    expect(link).toHaveAttribute("target", "_blank");
    const rel = link.getAttribute("rel") ?? "";
    expect(rel).toMatch(/noopener/);
    expect(rel).toMatch(/noreferrer/);
  });

  it("C7/C8: o src do mapa e o href da rota derivam do mesmo target; não chama navigator.geolocation", () => {
    const getCurrentPositionSpy = vi.fn();

    type NavWithGeo = Navigator & {
      geolocation?: { getCurrentPosition: typeof getCurrentPositionSpy };
    };
    const nav = navigator as NavWithGeo;
    const hadGeolocation = "geolocation" in nav && nav.geolocation !== undefined;
    const originalGeolocation = nav.geolocation;

    Object.defineProperty(nav, "geolocation", {
      configurable: true,
      writable: true,
      value: { getCurrentPosition: getCurrentPositionSpy },
    });

    try {
      render(<LocationMap venue={venue} />);

      const iframe = screen.getByTitle(/Mapa: Casa de Festas Turma da Kali/);
      const link = screen.getByRole("link", { name: /Como chegar/i });

      const target = encodeURIComponent(venue.address);
      expect(iframe.getAttribute("src")).toContain(target);
      expect(link.getAttribute("href")).toContain(target);

      expect(getCurrentPositionSpy).not.toHaveBeenCalled();
    } finally {
      Object.defineProperty(nav, "geolocation", {
        configurable: true,
        writable: true,
        value: hadGeolocation ? originalGeolocation : undefined,
      });
    }
  });
});

describe("LocationMap — US3", () => {
  it("C9: o href da rota usa o formato universal (compatível cross-platform)", () => {
    render(<LocationMap venue={venue} />);

    const link = screen.getByRole("link", { name: /Como chegar/i });
    const href = link.getAttribute("href") ?? "";
    expect(href.startsWith(directionsPrefix)).toBe(true);
  });
});

describe("LocationMap — coerência de coords", () => {
  it("usa coords quando fornecidas, em ambos mapa e rota", () => {
    render(<LocationMap venue={venueWithCoords} />);

    const iframe = screen.getByTitle(/Mapa: Casa de Festas Turma da Kali/);
    const link = screen.getByRole("link", { name: /Como chegar/i });

    const target = encodeURIComponent(venueWithCoords.coords!);
    expect(iframe.getAttribute("src")).toContain(target);
    expect(link.getAttribute("href")).toContain(target);
  });
});