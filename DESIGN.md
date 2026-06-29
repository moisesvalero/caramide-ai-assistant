---
name: Clinical Precision
colors:
  surface: '#fbf9f9'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#4c4546'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f0'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#bc0100'
  on-secondary: '#ffffff'
  secondary-container: '#eb0000'
  on-secondary-container: '#fffbff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1b1b'
  on-tertiary-container: '#848484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#ffdad4'
  secondary-fixed-dim: '#ffb4a8'
  on-secondary-fixed: '#410000'
  on-secondary-fixed-variant: '#930100'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1b1b1b'
  on-tertiary-fixed-variant: '#474747'
  background: '#fbf9f9'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '300'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
    letterSpacing: 0.02em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
spacing:
  base: 8px
  section-padding-desktop: 80px
  section-padding-mobile: 40px
  gutter: 24px
  margin-safe: 32px
---

## Brand & Style

This design system embodies a **Clinical Minimalist** aesthetic, tailored for high-end cosmeceuticals where science meets luxury. The visual identity is anchored in precision, sterility, and premium quality. It targets a discerning audience looking for professional-grade skincare results within a sophisticated, editorial-inspired interface.

The brand personality is authoritative, transparent, and high-tech. The UI utilizes expansive white space to evoke the feeling of a clean laboratory, while sharp typography and a surgical use of red provide the "active ingredient" focal points. The goal is to instill absolute confidence in the product's efficacy through a restrained, high-contrast visual language.

## Colors

The palette is strictly functional and high-contrast, designed to highlight product photography and critical clinical information.

- **Primary (Deep Black):** Used for typography, structural borders, and hero backgrounds to establish authority and depth.
- **Secondary (Vibrant Red):** Reserved strictly for "Action" and "Urgency." It represents the active science and is used for primary calls to action, badges, and status indicators.
- **Neutral (Slate Gray):** A range of grays used for secondary information, meta-data, and subtle dividers to maintain a clean hierarchy without the harshness of pure black.
- **Background (Crisp White):** The primary canvas, ensuring the interface feels airy, hygienic, and premium.

## Typography

The typography system uses **Manrope** for its balanced, modern, and technical geometric qualities. It strikes the perfect chord between a friendly pharmaceutical manual and a high-fashion magazine.

- **Display & Headlines:** Use lighter weights for large display text to emphasize elegance, and medium weights for standard headlines to ensure clear section signaling.
- **Body:** Standardized at 16px for optimal legibility, utilizing a generous line height to maintain the airy feel of the brand.
- **Labels:** **IBM Plex Sans** is introduced for technical labels and small metadata to provide a subtle "industrial/scientific" contrast to the more fluid Manrope. Always use uppercase for category labels and badges.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy on desktop to maintain an editorial, controlled composition, transitioning to a fluid model on mobile devices.

- **Grid:** A 12-column system for desktop (1200px max-width) with 24px gutters. Content should feel intentionally placed, often utilizing offset columns to create a sophisticated, non-symmetrical rhythm.
- **Rhythm:** Vertical spacing is aggressive. Large 80px gaps between major sections emphasize the premium "space" of the brand.
- **Safe Areas:** Maintain a minimum 32px side margin on mobile to ensure content never feels crowded against the edge of the glass.

## Elevation & Depth

To maintain the medical-grade aesthetic, this design system avoids traditional drop shadows. Depth is achieved through **Tonal Layering** and **High-Contrast Outlines**.

- **Flat Stack:** Elements are placed on the same Z-plane, separated by thin (1px) solid black or light gray borders.
- **Interaction Depth:** Instead of shadows, use "recessed" states for inputs and "inverted" states for buttons (White text on Black background) to indicate interactivity.
- **Image Depth:** Depth is primarily introduced via product photography featuring natural reflections and shadows, rather than UI-generated effects.

## Shapes

The shape language is **Strictly Square**.

In keeping with the clinical and architectural nature of the brand, a 0px border radius is applied to all primary components including buttons, inputs, and card containers. This sharp-edged approach conveys precision and uncompromising standards.

Circular shapes are reserved exclusively for icon backgrounds or specific decorative "stamp" elements (e.g., dermatologically tested seals) to provide a singular point of organic contrast.

## Components

- **Buttons:** Primary buttons are solid black with white text or solid red for high-conversion points. Use a secondary "Ghost" style with a 1px black border and no fill for secondary actions. Always use uppercase text.
- **Input Fields:** Minimalist design with a 1px bottom border only. Labels sit above the line in the `label-caps` style. On focus, the border-bottom thickens to 2px black.
- **Cards:** Product cards should have no background or shadow—only a thin gray divider or ample white space to separate them. The product image is the hero.
- **Chips/Badges:** Small, rectangular badges with a solid red background and white text used for "New" or "Pro" indicators.
- **Lists:** Product ingredient lists or benefit lists should use thin horizontal dividers (hairlines) to separate items, maintaining a clean, tabular look.
- **Navigation:** A clean top-tier text-only navigation. Use a thin black bar at the very top of the site for utility links (Account, Cart, Region) to frame the page.
