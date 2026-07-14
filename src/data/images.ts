/* ===========================================================================
   CENTRAL IMAGE REGISTRY
   ---------------------------------------------------------------------------
   Every image on the site is defined here, once. Components reference images
   by key (e.g. <Img name="hero" />), so swapping in real photos later is a
   ONE-LINE change per slot — no hunting through pages.

   All scene photos are now SELF-HOSTED in src/assets/photos/ and optimized at
   build time by Astro (astro:assets) into responsive WebP/AVIF. This keeps the
   site free of third-party image hosts (better LCP, caching, and privacy — no
   third-party cookies).

   HOW TO REPLACE A PLACEHOLDER WITH A REAL PHOTO (later):
     1. Drop the photo in `src/assets/photos/` (e.g. classroom-group.jpg).
     2. Import it at the top of this file.
     3. Set `asset:` on that image's entry below.
   For images that must stay in /public (served as-is), set `src:` instead.
   =========================================================================== */

import type { ImageMetadata } from 'astro';

import classroomGroup from '../assets/photos/classroom-group.jpg';
import classroomPaint from '../assets/photos/classroom-paint.jpg';
import classroomActive from '../assets/photos/classroom-active.jpg';
import classroomCircle from '../assets/photos/classroom-circle.jpg';
import cooking from '../assets/photos/cooking.jpg';
import baking from '../assets/photos/baking.jpg';
import gardening from '../assets/photos/gardening.jpg';
import heroBackground from '../assets/photos/hero-background.jpg';
import programPreschoolPhoto from '../assets/photos/program-preschool.jpg';
import igGallery1 from '../assets/photos/ig-gallery-1.jpg';
import igGallery2 from '../assets/photos/ig-gallery-2.jpg';
import valentina1 from '../assets/photos/valentina-1.png';
import igGallery4 from '../assets/photos/ig-gallery-4.jpg';
import igGallery5 from '../assets/photos/ig-gallery-5.jpg';
import igGallery6 from '../assets/photos/ig-gallery-6.jpg';
import philosophyInterior from '../assets/photos/philosophy-interior.jpg';
import enrichCooking from '../assets/photos/enrich-cooking.jpg';
import enrichGardening from '../assets/photos/enrich-gardening.jpg';
import enrichYoga from '../assets/photos/enrich-yoga.jpg';
import enrichMusic from '../assets/photos/enrich-music.jpg';
import enrichSpanishPhoto from '../assets/photos/enrich-spanish.jpg';
import enrichArtPhoto from '../assets/photos/enrich-art.jpg';
import eduAshleyPhoto from '../assets/photos/edu-ashley.jpg';
import eduMilaPhoto from '../assets/photos/edu-mila.jpg';
import eduSlavicaPhoto from '../assets/photos/edu-slavica.jpg';

export interface SiteImage {
  /** Real, SEO-ready alt text for the final photo. */
  alt: string;
  /** Describes the intended real photo (for whoever swaps it in). */
  keywords?: string;
  /** Local, build-optimized image (preferred). Wins over `src`. */
  asset?: ImageMetadata;
  /** A fixed URL or /public path used when no optimized asset exists. */
  src?: string;
}

export const images = {
  hero: {
    alt: 'Preschoolers and a teacher preparing food together in a bright classroom at Valentina’s Preschool',
    keywords: 'happy children in a bright classroom',
    asset: heroBackground,
  },

  // Instagram grid (home, fold 4)
  igCooking: {
    alt: 'A teacher and preschoolers preparing snacks together around a classroom table',
    keywords: 'kids cooking',
    asset: igGallery2,
  },
  igGarden: {
    alt: 'Three preschoolers working together to plant seeds in an outdoor planter with a hand trowel',
    keywords: 'kids gardening',
    asset: igGallery4,
  },
  igOutdoor: {
    alt: 'A teacher and children practicing yoga in child’s pose on mats in the outdoor play area',
    keywords: 'kids yoga outdoors',
    asset: igGallery5,
  },
  igCircle: {
    alt: 'A warm preschool playroom with a terracotta sofa, child-sized tables, and a red play kitchen on hardwood floors',
    keywords: 'preschool interior',
    asset: valentina1,
  },
  igYoga: {
    alt: 'A preschooler practicing knife skills by cutting carrots at a wooden table',
    keywords: 'kids cooking / fine motor',
    asset: igGallery1,
  },
  igArt: {
    alt: 'Preschoolers dancing with colorful scarves on the sunny outdoor playground',
    keywords: 'child creative project',
    asset: igGallery6,
  },
  igPaint: { alt: 'Children making art together', keywords: 'child painting', asset: classroomPaint },
  igReading: { alt: 'A learning moment in the classroom', keywords: 'child reading', asset: classroomGroup },

  // Spoke pages
  philosophyObserve: {
    alt: 'A bright, home-like preschool classroom with child-sized wooden furniture and learning materials on open shelves',
    keywords: 'teacher with children',
    asset: philosophyInterior,
  },
  emotional: {
    alt: 'Children learning to share and cooperate with gentle guidance',
    keywords: 'children cooperating',
    asset: classroomActive,
  },
  bilingual: {
    alt: 'Children singing and learning together during circle time',
    keywords: 'kids singing / circle time',
    asset: classroomGroup,
  },
  enrichment: {
    alt: 'A teacher and preschoolers preparing snacks together around a classroom table',
    keywords: 'kids enrichment activities',
    asset: igGallery2,
  },
  enrichMusic: {
    alt: 'Preschoolers waving colorful scarves during an outdoor music and dance activity',
    keywords: 'kids music and dance',
    asset: enrichMusic,
  },
  enrichYoga: {
    alt: 'An instructor leading preschoolers in tree pose during outdoor yoga',
    keywords: 'kids yoga',
    asset: enrichYoga,
  },
  enrichGardening: {
    alt: 'Children and a teacher planting seeds together in an outdoor planter',
    keywords: 'kids gardening',
    asset: enrichGardening,
  },
  enrichCooking: {
    alt: 'Two preschoolers practicing food prep by cutting carrots at a wooden table',
    keywords: 'kids cooking',
    asset: enrichCooking,
  },
  enrichSpanish: {
    alt: 'Colorful Spanish learning flashcards spread across a preschool wooden table',
    keywords: 'bilingual preschool / Spanish',
    asset: enrichSpanishPhoto,
  },
  enrichArt: {
    alt: 'Art supplies and children’s craft projects in the preschool art atelier',
    keywords: 'kids art and crafts',
    asset: enrichArtPhoto,
  },
  programToddler: {
    alt: 'Young children at play and discovery',
    keywords: 'toddlers playing',
    asset: baking,
  },
  programPreschool: {
    alt: 'Preschoolers moving and playing with colorful scarves on the outdoor playground',
    keywords: 'preschoolers in classroom',
    asset: programPreschoolPhoto,
  },

  // Educator portraits (placeholder headshots — swap for real staff photos)
  eduValentina: {
    alt: 'Valentina Gloginic, Founder & Director of Valentina’s Preschool',
    src: '/valentina.jpg',
  },
  eduAshley: {
    alt: 'Ashley A., Teacher at Valentina’s Preschool',
    asset: eduAshleyPhoto,
  },
  eduMila: {
    alt: 'Milagros B. (“Mila”), Teacher’s Assistant at Valentina’s Preschool',
    asset: eduMilaPhoto,
  },
  eduSlavica: {
    alt: 'Slavica P., Art Teacher at Valentina’s Preschool',
    asset: eduSlavicaPhoto,
  },
} satisfies Record<string, SiteImage>;

export type ImageKey = keyof typeof images;
