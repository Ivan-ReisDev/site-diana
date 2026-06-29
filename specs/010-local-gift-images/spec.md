# Feature Specification: Local Gift Suggestion Images

**Feature Branch**: `010-local-gift-images`

**Created**: 2026-06-29

**Status**: Draft

**Input**: User description: "coloquei as fotos das sugestões aqui /public/galeria/brinquedos então substitua as sugestões pelas minhas imagens, e remova os antigos que temos"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Guests see the host's own gift photos (Priority: P1)

A guest visiting the invitation page scrolls to the "Sugestões de Presente" section and sees each gift suggestion illustrated with the host's own curated photographs instead of generic stock images. The pictures feel personal and consistent with the rest of the invitation.

**Why this priority**: This is the entire purpose of the request. The host wants the gift section to reflect images they personally chose and placed in the project, replacing impersonal external stock photos.

**Independent Test**: Open the invitation page, scroll to the gift suggestions section, and confirm every visible card shows one of the host-provided images and none show the previous stock photos.

**Acceptance Scenarios**:

1. **Given** a guest is on the invitation page, **When** they reach the gift suggestions section, **Then** each gift card displays a host-provided image that matches the gift category label.
2. **Given** the gift suggestions section is rendered, **When** a guest inspects any card, **Then** no previously used external stock image is shown anywhere in the section.
3. **Given** a guest opens the page on a slow connection, **When** the images load, **Then** they appear correctly cropped within each card without distortion or layout shift.

---

### User Story 2 - Each suggestion stays meaningful and consistent (Priority: P2)

The host reviews the gift section and finds that every remaining suggestion has both a clear title and an image that genuinely represents that category, with no card left without a picture and no category shown that the host no longer wants to suggest.

**Why this priority**: Replacing images is only valuable if the resulting section is coherent — every category shown must have a matching image, and categories without a provided image should not appear with a broken or missing picture.

**Independent Test**: Review the gift section and confirm the number of categories shown equals the number of host-provided images, each pairing being topically correct.

**Acceptance Scenarios**:

1. **Given** the host provided a fixed set of images, **When** the section renders, **Then** the number of gift categories shown equals the number of provided images.
2. **Given** a category no longer has a corresponding host image, **When** the section renders, **Then** that category is not displayed.
3. **Given** each displayed category, **When** a guest reads its title and looks at its image, **Then** the title and image clearly refer to the same kind of gift.

---

### Edge Cases

- What happens when a provided image file fails to load? The card MUST degrade gracefully (e.g., a neutral placeholder consistent with the section's styling) rather than showing a broken-image icon.
- How does the section handle an image filename that contains spaces or accents/typos (e.g., the sensory-toys file)? The reference MUST resolve to the actual file as stored, or the file MUST be normalized so it resolves reliably.
- What happens to the previous stock-image references after replacement? They MUST be fully removed so no external request is made for them.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The gift suggestions section MUST display each gift category using an image sourced from the host-provided collection located in the project's public gift gallery folder.
- **FR-002**: The system MUST remove all previously used external stock image references from the gift suggestions section.
- **FR-003**: Each gift category that remains visible MUST be paired with a host-provided image whose subject matches the category label.
- **FR-004**: Gift categories that have no corresponding host-provided image MUST NOT be displayed in the section.
- **FR-005**: The accompanying suggestion text (gift idea lists and titles) for each retained category MUST be preserved.
- **FR-006**: Host-provided images MUST be referenced from within the project (locally served), not loaded from an external image host.
- **FR-007**: Each image MUST render with meaningful alternative text describing the gift category for accessibility.
- **FR-008**: Images MUST be displayed within the existing card layout (consistent aspect ratio and cropping) without causing layout shift or distortion.

### Key Entities *(include if feature involves data)*

- **Gift Category**: A suggested type of gift shown on the invitation. Key attributes: title/label, illustrative image, list of concrete gift ideas.
- **Gift Image**: A host-provided photograph stored in the project's public gift gallery folder, associated with exactly one gift category.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of gift cards shown in the section display a host-provided image; 0% display a previous external stock image.
- **SC-002**: The number of gift categories displayed equals the number of host-provided images (currently 8).
- **SC-003**: Every displayed category's image subject correctly matches its title, as confirmed by visual review.
- **SC-004**: No external network request is made to fetch a gift suggestion image when the section loads.
- **SC-005**: The section renders correctly on mobile and desktop with no broken images and no visible layout shift.

## Assumptions

- The host's images live in `public/galeria/brinquedos/` and are the authoritative, complete set of gift images: `brinquedos.jpeg`, `ursinho.jpeg`, `livros.jpeg`, `instrumentos-musicais.jpeg`, `brinquedos-educativos.jpeg`, `vestidinhos-roupas.jpeg`, `briquedos sensoriais.jpeg`, `sapatinhos.jpeg` (8 images total).
- Each provided image maps to one existing gift category by topic: interactive/general toys, plush (teddy), books, musical instruments, educational toys, clothing/dresses, sensory toys, and shoes.
- Because only 8 images were provided, the 3 categories without a matching image — "Brinquedos de encaixe ou montar", "Brinquedos de puxar ou empurrar", and the redundant second musical category — are removed from the section (reducing from 11 categories to 8). This is the intended meaning of "remova os antigos que temos".
- The textual gift-idea lists already written for the retained categories remain valuable and are kept as-is.
- No change is requested to the section's heading, copy, or overall visual styling beyond the image source.
