/**
 * Helping Hands Auto Care: the single source of truth for every factual claim
 * on the site.
 *
 * 1. If a fact is not in this file, it does not go on the website.
 * 2. Change it here and it changes everywhere. Never hard-code a phone number,
 *    price or claim into a page.
 * 3. Anything marked TODO(helpinghands) is unconfirmed or conflicting. Check
 *    with Chris before launch. Do not invent replacements.
 *
 * Sources: the Helping Hands Facebook page (scraped 2026-09-28, see
 * raw-assets/facebook/SCRAPE-NOTES.md), including Chris's printed brochure and
 * his "Learn It. Fix It." training flyer, both posted there.
 */

export const company = {
  name: 'Helping Hands Auto Care',
  shortName: 'Helping Hands',
  // Printed on the logo.
  tagline: 'Auto care to your door',
  // Facebook bio.
  bio: 'Auto repair service that comes to you',
  shortDescription:
    'Mobile mechanic based in Enfield, NH. Brakes, oil changes, diagnostics, batteries and tune-ups done at your home or work across Enfield, Canaan, Lebanon and the Upper Valley. $75 an hour labor.',
  owner: 'Chris Stiles',
  ownerFirst: 'Chris',
  url: 'https://www.helpinghandsautocare.com', // TODO(helpinghands): confirm domain
  phone: '(603) 293-6495',
  phoneRaw: '+16032936495',
  email: 'chrisauto23@gmail.com',
  facebook: 'https://www.facebook.com/people/Helping-Hands/61550514432575/',
  tiktok: 'https://www.tiktok.com/@helpinghandsmobilemech',
  tiktokHandle: '@helpinghandsmobilemech',
  // Mailing address only. There is no shop to visit: he comes to you.
  mailing: 'PO Box 685, Enfield, NH 03748',
  city: 'Enfield',
  state: 'NH',
  region: 'the Upper Valley',
  // Enfield town centre. Used for schema only.
  geo: { lat: 43.6406, lng: -72.1437 },
  laborRate: 75,
  laborRateLabel: '$75 an hour labor',
};

export const cta = {
  primary: 'Call or text Chris',
  quote: 'Request a visit',
  call: `Call ${company.phone}`,
  text: `Text ${company.phone}`,
};

/** Facebook recommendations, as of the scrape date. */
export const reviews = {
  count: 50,
  recommendPct: 100,
  source: 'Facebook',
  asOf: '2026-09-28',
  // Quotes are copied exactly from public Facebook recommendations.
  // TODO(helpinghands): get Chris's OK to feature named reviewers.
  quotes: [
    {
      name: 'Michael Shumway',
      text: 'Very professional, super clean and truly cares about the customer',
    },
  ] as { name: string; text: string }[],
};

/**
 * TODO(helpinghands): hours conflict. Facebook says "Always open". The printed
 * brochure says the hours below. The brochure is used because it is specific;
 * confirm with Chris.
 */
export const hours = [
  { days: 'Monday to Friday', time: '4 to 7 PM', schemaDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '16:00', closes: '19:00' },
  { days: 'Saturday', time: '8 AM to 6 PM', schemaDays: ['Saturday'], opens: '08:00', closes: '18:00' },
  { days: 'Sunday', time: '8 AM to 6 PM', schemaDays: ['Sunday'], opens: '08:00', closes: '18:00' },
];
export const emergencyNote = 'Emergency service available'; // brochure

/** Facebook "Service area" list, in the order shown there. */
export const serviceArea = [
  { town: 'Enfield', state: 'NH', home: true },
  { town: 'Canaan', state: 'NH' },
  { town: 'Lebanon', state: 'NH' },
  { town: 'West Lebanon', state: 'NH' },
  { town: 'White River Junction', state: 'VT' },
  { town: 'Wilder', state: 'VT' },
  { town: 'Hartford', state: 'VT' },
];

export type Service = {
  slug: string;
  group: 'Maintenance' | 'Engine' | 'Brakes' | 'Tires' | 'Extras';
  name: string;
  short: string;
  items: string[];
  comingSoon?: boolean;
};

/**
 * Service list from Chris's brochure ("Our Services"), plus brake replacement,
 * which is most of the job photos on his page.
 */
export const services: Service[] = [
  {
    slug: 'brakes',
    group: 'Brakes',
    name: 'Brakes',
    short: 'Pads, rotors and calipers, swapped in your driveway.',
    items: ['Brake inspection', 'Pads and rotors', 'Calipers and hardware'],
  },
  {
    slug: 'oil',
    group: 'Maintenance',
    name: 'Oil and fluids',
    short: 'Oil and filter changes and fluid top offs at home or work.',
    items: ['Oil and filter change', 'Fluid replacement'],
  },
  {
    slug: 'diagnostics',
    group: 'Engine',
    name: 'Diagnostics',
    short: 'Check engine light on? Chris finds the cause before anything gets replaced.',
    items: ['Engine diagnostics', 'Check engine lights'],
  },
  {
    slug: 'tune-up',
    group: 'Engine',
    name: 'Tune ups',
    short: 'Tune up and performance check to keep it running right.',
    items: ['Tune up', 'Performance check'],
  },
  {
    slug: 'battery',
    group: 'Maintenance',
    name: 'Batteries',
    short: 'Battery testing, so a dead car is a quick fix instead of a tow.',
    items: ['Battery testing'],
  },
  {
    slug: 'tires',
    group: 'Tires',
    name: 'Tires and wheels',
    short: 'Tire changeovers are on the way.',
    items: ['Tire rotation', 'Balancing', 'Tire replacement'],
    comingSoon: true,
  },
];

/** "Why choose us?" from the brochure, in his words. */
export const whyUs = [
  'We come to you',
  'Emergency service available',
  'Genuine quality parts',
  'Fast turnaround time',
  'Fair pricing',
  'Customer satisfaction guaranteed',
];

/** "Our Maintenance Process" from the brochure. */
export const process = [
  { step: 'Inspect', text: 'Chris looks the vehicle over where it sits.' },
  { step: 'Diagnose', text: 'He finds the actual cause and tells you what it needs.' },
  { step: 'Service', text: 'The repair happens right there in your driveway or lot.' },
  { step: 'Test', text: 'Everything gets checked before the tools go away.' },
  { step: 'Deliver', text: 'You get your car back without ever leaving home.' },
];

/**
 * "Learn It. Fix It." one-on-one training, from his flyer.
 * TODO(helpinghands): the flyer lists a $75 one-hour session but also says
 * "2-hour minimum for all appointments". Confirm which applies.
 */
export const training = {
  name: 'Learn It. Fix It.',
  line: 'We teach. You learn. You save.',
  pitch:
    'One-on-one, hands-on lessons on your own vehicle. You bring the car and the parts. Chris brings the tools and the know-how, and you do the work.',
  prices: [
    { price: '$75', unit: '/hr', name: '1 hour learn and fix', note: 'One-on-one instruction while working on your vehicle' },
    { price: '$140', name: '2 hour session', note: 'Hands-on lesson plus repair guidance' },
    { price: '$200', name: '3 hour session', note: 'A more involved repair or maintenance lesson' },
    { price: '$275', name: 'Half day', note: '4 hours of in-depth, hands-on training' },
    { price: '$400 to $450', name: 'Full day', note: '6 to 7 hours, beginner to intermediate' },
  ],
  pack: { price: '$275', name: '4 session package', note: 'Four 1 hour sessions, paid up front' },
  minimum: '2 hour minimum for all appointments',
  topics: [
    'Oil changes',
    'Brake replacement',
    'Tire removal and installation',
    'Battery and charging system testing',
    'Diagnosing common problems',
    'Basic electrical troubleshooting',
    'Pre-trip vehicle inspections',
    'Using an OBD-II scanner',
    'Proper torque and fasteners',
    'Roadside emergency repairs',
    'Reading repair info',
    'Tools you need, and the ones you don’t',
  ],
};

/** From the brochure ("We don't just work on cars, we also help the community"). */
export const community = [
  {
    name: 'Back to School Drive',
    text: 'Backpacks and school supplies collected and handed out to local families. 2026 was the first year, and the plan is to make it a yearly thing.',
  },
  {
    name: 'Thanksgiving meal giveaway',
    text: 'A full Thanksgiving meal for a whole family, given away every year.',
  },
  {
    name: 'Christmas meal giveaway',
    text: 'A Christmas dinner for a whole family, too.',
  },
  {
    name: 'Off-season help',
    text: 'In the slow months Chris runs errands and lends a hand around town. No job too small.',
  },
];

export const faqs = [
  {
    q: 'Do you really come to me?',
    a: `Yes. There is no shop to drop off at. Chris drives to your home or workplace in ${serviceArea.map((t) => t.town).slice(0, 3).join(', ')} and the rest of his service area, and does the work where the car is parked.`,
  },
  {
    q: 'How much does it cost?',
    a: `Labor is $${company.laborRate} an hour, plus parts. Call or text with the year, make and model and what is going on, and Chris will tell you what to expect before he comes out.`,
  },
  {
    q: 'What towns do you cover?',
    a: `${serviceArea.map((t) => `${t.town}, ${t.state}`).join('; ')}. On the edge of that? Ask anyway.`,
  },
  {
    q: 'What can you fix in a driveway?',
    a: 'Most routine work: brakes, oil and fluids, batteries, diagnostics and tune ups. If a job really needs a lift, Chris will tell you straight.',
  },
  {
    q: 'When are you available?',
    a: `${hours.map((h) => `${h.days} ${h.time}`).join(', ')}. ${emergencyNote}.`,
  },
  {
    q: 'Can you teach me to do it myself?',
    a: `Yes. ${training.name} is one-on-one training on your own vehicle, from $75 an hour.`,
  },
];
