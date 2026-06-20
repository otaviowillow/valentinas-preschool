/* ===========================================================================
   CENTRAL IMAGE REGISTRY
   ---------------------------------------------------------------------------
   Every image on the site is defined here, once. Components reference images
   by key (e.g. <Img name="hero" />), so swapping in real photos later is a
   ONE-LINE change per slot — no hunting through pages.

   HOW TO REPLACE A PLACEHOLDER WITH A REAL PHOTO (later):
     1. Drop the photo in `src/assets/` (e.g. src/assets/hero.jpg).
     2. At the top of this file:  import hero from '../assets/hero.jpg';
     3. Set `src: hero` on that image's entry below.
   The `src` field always wins over the `pexels` placeholder.

   PLACEHOLDERS (temporary, until real photos arrive):
     • Scenes  -> hand-picked, vetted Pexels photos (real kids/classroom, SAFE)
     • Portraits -> randomuser.me (consistent headshots)
   Each Pexels ID below was individually checked. Photos are free to use
   (Pexels license). They WILL be replaced by Valentina's own photos.
   =========================================================================== */

export interface SiteImage {
  /** Real, SEO-ready alt text for the final photo. */
  alt: string;
  /** Describes the intended real photo (for whoever swaps it in). */
  keywords?: string;
  /** Vetted Pexels photo ID used for the temporary placeholder. */
  pexels?: number;
  /** A fixed URL or imported asset. When set, this wins over `pexels`. */
  src?: string;
}

export const images = {
  // All Pexels IDs below were individually verified from search descriptions:
  //   5211446 group of happy students in a modern classroom (Max Fischer)
  //   5211431 kids sitting inside a classroom (Max Fischer)
  //   5212345 teacher engaging students in a classroom (Max Fischer)
  //   5212338 teacher and students in a classroom (Max Fischer)
  //   5593692 kids preparing food on the table (cooking)
  //   3806957 mother and young kids baking in a kitchen
  //   18990251 girl and boy gardening with toy tools outdoors
  hero: {
    alt: 'Children learning and playing together at Valentina’s Preschool in Culver City',
    keywords: 'happy children in a bright classroom',
    pexels: 5211446,
  },

  // Instagram grid (home, fold 4)
  igGarden: { alt: 'Children gardening outdoors with little tools', keywords: 'kids gardening', pexels: 18990251 },
  igPaint: { alt: 'Children making art together', keywords: 'child painting', pexels: 5211431 },
  igYoga: { alt: 'Children being active and learning together', keywords: 'kids movement / yoga', pexels: 5212345 },
  igCooking: { alt: 'A cooking project: measuring and mixing', keywords: 'kids cooking', pexels: 5593692 },
  igCircle: { alt: 'Circle time learning together', keywords: 'kids circle time', pexels: 5212338 },
  igArt: { alt: 'A child with a hands-on baking project', keywords: 'child creative project', pexels: 3806957 },
  igOutdoor: { alt: 'Outdoor play and exploration', keywords: 'children playing outside', pexels: 18990251 },
  igReading: { alt: 'A learning moment in the classroom', keywords: 'child reading', pexels: 5211446 },

  // Spoke pages
  philosophyObserve: {
    alt: 'A teacher engaging with children at their level',
    keywords: 'teacher with children',
    pexels: 5212338,
  },
  emotional: {
    alt: 'Children learning to share and cooperate with gentle guidance',
    keywords: 'children cooperating',
    pexels: 5212345,
  },
  bilingual: {
    alt: 'Children singing and learning together during circle time',
    keywords: 'kids singing / circle time',
    pexels: 5211446,
  },
  programToddler: {
    alt: 'Young children at play and discovery',
    keywords: 'toddlers playing',
    pexels: 3806957,
  },
  programPreschool: {
    alt: 'Preschoolers learning together, ages 3 to 5 years',
    keywords: 'preschoolers in classroom',
    pexels: 5211431,
  },

  // Educator portraits (randomuser.me — swap for real staff photos)
  eduValentina: {
    alt: 'Valentina Gloginic, Founder & Director of Valentina’s Preschool',
    src: '/valentina.jpg',
  },
  eduAshley: {
    alt: 'Ashley A., Teacher at Valentina’s Preschool',
    src: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  eduMila: {
    alt: 'Milagros B. (“Mila”), Teacher’s Assistant at Valentina’s Preschool',
    src: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  eduSlavica: {
    alt: 'Slavica P., Art Teacher at Valentina’s Preschool',
    src: 'https://randomuser.me/api/portraits/women/52.jpg',
  },
} satisfies Record<string, SiteImage>;

export type ImageKey = keyof typeof images;

/** Build the image URL at a requested pixel size (placeholder or real). */
export function imageSrc(key: ImageKey, w: number, h: number): string {
  const img = images[key];
  if (img.src) return img.src;
  if (img.pexels) {
    return `https://images.pexels.com/photos/${img.pexels}/pexels-photo-${img.pexels}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;
  }
  // Last-resort safe fallback.
  return `https://picsum.photos/seed/${key}/${w}/${h}`;
}
