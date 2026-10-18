/* Lakes Region AI: the catalog. Every swappable thing on the page lives here.

   HOW TO SWAP (plain steps)
   1. A photo: put the full-size file in the images folder, then type its name after
      file: under "photos" below. Leave file: "" and the page shows a labelled empty slot.
   2. Offer words or prices: replace the words inside the quotes. Nothing else changes.
   3. The Halloween special: edit the words under "promo". Change on: true to on: false
      to turn it off early. It also hides itself after the end date.
   Save the file and refresh the page. */

window.LRAI = {
  booking: "https://calendly.com/matt-matthewalighieri/lakes-region-ai-chat",
  bookingLabel: "Book a Free 20-Minute Chat",
  email: "info@lakesregionai.com",
  phone: "", /* future LRAI line; leave empty until it exists */

  photos: {
    /* The big lake photo behind the hero and the seasonal band. Empty until your own shot is ready
       (shot list #1). The placeholder is kept, unpublished, in LRAi/Originals/fall-reflection.jpg. */
    "backdrop": { file: "", alt: "A hillside of peak fall maples in red, orange and gold above a dark evergreen shoreline, mirrored in still lake water", caption: "" },
    "owl":      { file: "images/owl-mark.jpg", alt: "", caption: "" },
    /* Matt's portrait: 4:5, at a laptop or a local counter. Not shot yet. */
    "matt":     { file: "", alt: "Matt Alighieri", caption: "" },

    /* Town photos for a later section, not shown on the page yet. Add your own shots here.
       The unlicensed placeholders are kept, unpublished, in LRAi/Originals/towns. */
    "laconia":   { file: "", alt: "Old brick mill and smokestack reflected in the river in downtown Laconia", caption: "Laconia" },
    "meredith":  { file: "", alt: "Meredith village from above in fall color, white church steeples and the waterfront on Lake Winnipesaukee", caption: "Meredith" },
    "alton":     { file: "", alt: "The bandstand on Alton Bay with a wooden runabout passing and fall color on the hills", caption: "Alton" },
    "wolfeboro": { file: "", alt: "The red Victorian train station in Wolfeboro under a blue sky", caption: "Wolfeboro" }
  },

  /* "What we set up": six cards. price is the big number; sub is the small line under it.
     Fine print (travel, payment split, texting approval) lives only on terms.html. */
  wins: [
    {
      title: "Every call gets handled.",
      body: "Miss a call and the caller gets a friendly text right away, in your words. You get the lead by text and call back when you can.",
      flow: ["Call comes in", "Text goes out", "Details to you"],
      icon: "phone",
      name: "Missed-Call Text-Back",
      price: "Quick Win",
      sub: "$1,000 remote or $1,500 on-site."
    },
    {
      title: "Every quote gets a follow-up.",
      body: "Each estimate you send gets a polite follow-up in your words until the customer says yes or no. You stop having to remember.",
      flow: ["Quote sent", "Polite follow-up", "Yes or no to you"],
      icon: "doc",
      name: "Estimate Follow-Up",
      price: "Quick Win",
      sub: "$1,000 remote or $1,500 on-site."
    },
    {
      title: "Happy customers leave reviews.",
      body: "At the right moment, customers get a short request by text or email, with an easy opt-out. You approve the message before it ever goes out.",
      flow: ["Job finished", "Request sent", "A new review"],
      icon: "star",
      name: "Review Booster",
      price: "Quick Win",
      sub: "$1,000 remote or $1,500 on-site."
    },
    {
      title: "Fewer no-shows.",
      body: "Customers get a friendly reminder before their appointment, reservation or service date, and can confirm or reschedule by text. Empty chairs and wasted trips get rarer.",
      flow: ["Booking made", "Reminder the day before", "Confirmed or rescheduled"],
      icon: "calendar",
      name: "Appointment Reminders",
      price: "Quick Win",
      sub: "$1,000 remote or $1,500 on-site."
    },
    {
      title: "Your website answers the same ten questions.",
      body: "Hours, parking, pricing, slips, menus, pets. An assistant on your site answers from your own information, day or night, and hands anything tricky to you.",
      flow: ["Visitor asks", "Answer from your info", "Tricky ones to you"],
      icon: "chat",
      name: "Website FAQ Assistant",
      price: "Quick Win",
      sub: "$1,000 remote or $1,500 on-site."
    },
    {
      title: "Three jobs, connected.",
      body: "For bigger weeks: your calls, quotes and reviews working together. We map the job, build it, test it with you and train your team.",
      flow: ["Map the jobs", "Build and test", "Train your team"],
      icon: "build",
      name: "AI Operations Package",
      price: "$4,500",
      sub: "Three connected automations in 30 days.",
      featured: true
    }
  ],

  /* Prices, read top to bottom. promoFlag shows the launch flag while the promo runs. */
  ladder: [
    { step: "Start here", items: [
      { name: "20-Minute Chat", price: "Free", line: "We'll tell you straight what we'd fix first, by phone or video. If AI isn't the answer, we'll say so." }
    ]},
    { step: "Get a plan", items: [
      { name: "AI Readiness Check", price: "$750", promoFlag: true, line: "A written plan: the jobs eating your week, what to automate first, and what it's worth. Credited toward any project." }
    ]},
    { step: "Quick wins", items: [
      { name: "Remote Quick Win", price: "$1,000", line: "One automation, set up over video. Live in 14 days." },
      { name: "On-site Quick Win", price: "$1,500", line: "One automation, set up in person at your shop. Live in 14 days." }
    ], note: "Pick one: Missed-Call Text-Back, Estimate Follow-Up, Review Booster, Appointment Reminders or Website FAQ Assistant. Fine print is on the Pricing terms page.", noteLink: "terms.html" },
    { step: "The full setup", items: [
      { name: "AI Operations Package", price: "$4,500", line: "Three connected automations in 30 days, so your calls, quotes and reviews work together. Founding rate of $3,500 for the first five clients." }
    ]},
    { step: "Keep it running", items: [
      { name: "Care plan", price: "$750 a month", line: "We run it, fix it, and answer when something breaks. Three-month minimum, then month to month." }
    ]}
  ],

  /* The launch banner in the hero (the whole banner links to the application form),
     and the flag on the Readiness Check. */
  promo: {
    on: true,
    tag: "Launch partners",
    line: "We're choosing three Lakes Region businesses to launch with. Each one gets the AI Readiness Check free, and we stay with you the whole way.",
    note: "Apply by October 31",
    flag: "Free for 3 launch partners",
    link: "apply.html",
    ends: "2026-10-31T23:59:59-04:00",
    photo: "owl"
  },

  /* Forms: the launch application (apply.html) and the contact form (contact.html).
     formAction: paste the form service's address here (Formspree, Basin, etc.) to receive
     answers directly. Leave it "" and the form opens a ready-to-send email to emailTo instead. */
  forms: {
    apply:   { formAction: "", emailTo: "info@lakesregionai.com", subject: "Launch application: {business}" },
    contact: { formAction: "", emailTo: "info@lakesregionai.com", subject: "Website message from {name}" }
  }
};
