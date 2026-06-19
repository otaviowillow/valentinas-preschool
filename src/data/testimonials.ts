// Verbatim parent reviews from the source site (see README.md §5, Source Site Audit).
// Attributed for credibility + Review schema.

export interface Testimonial {
  author: string;
  location: string;
  date: string; // ISO for schema
  dateDisplay: string;
  quote: string; // short pull-quote for cards
  full: string; // longer excerpt
}

export const testimonials: Testimonial[] = [
  {
    author: 'Meggy F.',
    location: 'Los Angeles, CA',
    date: '2023-07-21',
    dateDisplay: 'July 2023',
    quote:
      'A small, home-like and friendly place where everyone is welcome. No child gets left behind.',
    full: 'We have had a spectacular experience at Valentina’s preschool these past few years. While all my friends were picking corporate, cookie-cutter preschools, I chose Valentina’s — where the energy was comfortable and focused on nurturing an individual child with individual needs. The staff go out of their way to make sure every child feels special and loved. As a single mom, I really, really trust Valentina.',
  },
  {
    author: 'Hannah W.',
    location: 'Los Angeles, CA',
    date: '2022-08-23',
    dateDisplay: 'August 2022',
    quote:
      'We could not have been happier with the level of care, attention to detail, and love.',
    full: 'My 2-year-old son attended Valentina’s Pre-School and we could not have been happier with the level of care, attention to detail, and love from Valentina and her team. They are great at communicating with daily photos and the monthly newsletter. If we weren’t moving abroad, my son would have stayed at Valentina’s until he was 5.',
  },
  {
    author: 'Cindy A.',
    location: 'South Los Angeles, CA',
    date: '2022-08-30',
    dateDisplay: 'August 2022',
    quote:
      'My daughter learned so much — from ABCs and numbers to Spanish and yoga.',
    full: 'Valentina and her team are amazing people. My daughter started with them when she was 2 years old and learned so much — from ABCs and numbers to Spanish and yoga stretches. I am extremely thankful, as my daughter is now advanced at her new school. Choose Valentina’s preschool, they’re the best!',
  },
  {
    author: 'Diana D.',
    location: 'South Los Angeles, CA',
    date: '2022-06-18',
    dateDisplay: 'June 2022',
    quote:
      'In this more intimate setting our daughter has thrived — she knows more Spanish than we do!',
    full: 'Valentina and her team of caring educators follow excellent safety protocols. In this more intimate setting our daughter has thrived — she practices Spanish daily and now knows more than we do! The Friday backpack full of artwork, math, and tracing is a delight. The regular assessments set us up for a wonderful, breezy Pre-K application process.',
  },
  {
    author: 'R S.',
    location: 'Los Angeles, CA',
    date: '2020-12-23',
    dateDisplay: 'December 2020',
    quote:
      'It was our best decision to enroll. She also learned self-care and how to manage her emotions.',
    full: 'My daughter started at Valentina’s when she was 1.5 years old and went there for 2 years. It was our best decision to enroll. She got exposure to phonics, letters, numbers, gardening, yoga, dancing, music, creative play and painting. She also learned self-care and how to control her emotions. I will definitely recommend anyone to enroll their child.',
  },
  {
    author: 'Karina D.',
    location: 'Los Angeles, CA',
    date: '2017-09-07',
    dateDisplay: 'September 2017',
    quote:
      'I am amazed how much my son has progressed. There’s an art project every single day.',
    full: 'Valentina’s preschool is fantastic, without any exaggeration. Every day my son comes home with something new. They draw, cook, bake, learn letters and lots of Spanish words. There’s an art project every day — plus gardening, science experiments, and yoga several times a week. If children act out, they are always talked to with respect; Valentina kneels down to speak with them at their level. My children are happy and learn so much every day.',
  },
  {
    author: 'Paige M.',
    location: 'Culver City, CA',
    date: '2016-07-05',
    dateDisplay: 'July 2016',
    quote:
      'As a teacher myself, I appreciate the thematic units Valentina plans each week.',
    full: 'Valentina’s is absolutely incredible! My daughter thrived under their guidance. As a teacher myself, I appreciate the thematic units Valentina plans each week — my daughter particularly loved studying polar bears and making ice caps. The day is filled with gardening, painting, yoga, reading, cooking, and dress up. I highly recommend Valentina’s.',
  },
  {
    author: 'Elisha S.',
    location: 'Los Angeles, CA',
    date: '2015-10-02',
    dateDisplay: 'October 2015',
    quote: 'Daycare is her home away from home. She comes home happy every day.',
    full: 'My daughter has been going to Valentina’s for 2 years now — she loves it and so do I. Valentina is there with us first-time parents every step of the way, helping with potty training and behavior. Daycare is her home away from home. She comes home happy and with art projects every week. A really great environment for kids — highly recommended.',
  },
];

export const reviewStats = {
  ratingValue: 5,
  reviewCount: testimonials.length,
};
