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
    alt: 'Children learning and playing together at Valentina’s Preschool in Culver City',
    keywords: 'happy children in a bright classroom',
    asset: classroomGroup,
  },

  // Instagram grid (home, fold 4)
  igGarden: { alt: 'Children gardening outdoors with little tools', keywords: 'kids gardening', asset: gardening },
  igPaint: { alt: 'Children making art together', keywords: 'child painting', asset: classroomPaint },
  igYoga: { alt: 'Children being active and learning together', keywords: 'kids movement / yoga', asset: classroomActive },
  igCooking: { alt: 'A cooking project: measuring and mixing', keywords: 'kids cooking', asset: cooking },
  igCircle: { alt: 'Circle time learning together', keywords: 'kids circle time', asset: classroomCircle },
  igArt: { alt: 'A child with a hands-on baking project', keywords: 'child creative project', asset: baking },
  igOutdoor: { alt: 'Outdoor play and exploration', keywords: 'children playing outside', asset: gardening },
  igReading: { alt: 'A learning moment in the classroom', keywords: 'child reading', asset: classroomGroup },

  // Spoke pages
  philosophyObserve: {
    alt: 'A teacher engaging with children at their level',
    keywords: 'teacher with children',
    asset: classroomCircle,
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
  programToddler: {
    alt: 'Young children at play and discovery',
    keywords: 'toddlers playing',
    asset: baking,
  },
  programPreschool: {
    alt: 'Preschoolers learning together, ages 3 to 5 years',
    keywords: 'preschoolers in classroom',
    asset: classroomPaint,
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
