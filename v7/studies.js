/* Case study content.
   CostGraph and Luotain are the copy from the Figma file; Lönar and KernUI
   are lifted from their case studies on shatermt.com; Yote's intro is its
   own site copy. Nothing here is invented. */

export const STUDIES = {
  costgraph: {
    name: 'CostGraph.ai',
    site: 'costgraph.ai',
    siteUrl: 'https://costgraph.ai',
    year: '2026',
    sections: [
      { label: 'Intro', blocks: [
        { p: 'I joined Costgraph in 2025, and since then we’ve gone on to build a cloud cost optimisation platform built for DevOps engineers and platform teams managing infrastructure at scale.' },
        { p: 'As the sole product designer on the project, I worked closely with engineering to design the product from the ground up, shaping everything from the UX strategy and design system to interactive prototypes powered by real infrastructure data.' },
        { p: 'The project focused heavily on helping teams understand where cloud waste exists and what actions they should take next, instead of overwhelming them with dashboards and metrics.' },
      ]},
      { label: 'My role', blocks: [
        { p: 'On CostGraph, I responsible for the entire product experience from zero.' },
        { ul: [
          'Product strategy and UX direction',
          'User research synthesis',
          'Information architecture',
          'Design systems',
          'High-fidelity UI design',
          'Interactive prototyping',
          'Design-engineering collaboration',
        ]},
        { p: 'I also worked directly with real backend exports and infrastructure datasets instead of placeholder content.' },
      ]},
      { label: 'Process', blocks: [
        { p: 'The process behind CostGraph was very much iterative and research-driven.' },
        { p: 'We started with competitive research and user interviews to better understand how DevOps and platform teams currently manage cloud infrastructure, where existing tools fall short, and what information actually matters during day-to-day operations. Those conversations helped validate ideas early and shaped a lot of the product direction.' },
        { p: 'From there, we moved quickly into exploration and prototyping. Instead of jumping straight into polished UI, we used tools like Claude and v0 to rapidly test concepts, layouts, interaction flows, and infrastructure visualisation ideas. This made it easier to experiment with different approaches before committing to final designs.' },
        { p: 'Once ideas felt strong enough, I built interactive prototypes that could be tested and iterated on collaboratively with engineering and users. These prototypes helped us validate workflows, recommendation systems, and navigation structures early before refining everything further in Figma.' },
        { p: 'The final phase focused on polishing the experience, tightening hierarchy, refining interactions, improving consistency through the design system, and preparing flows for user testing and implementation.' },
      ]},
      { label: 'Design system', blocks: [
        { p: 'I built the CostGraph design system from scratch to support a dense, technical product environment while keeping the interface readable and consistent.' },
        { p: 'The visual language was intentionally restrained, using semantic colour systems to communicate operational states like warnings, inefficiencies, and healthy resources.' },
        { p: 'I also established the full token system, component library, spacing rules, table patterns, recommendation cards, and interaction states used across the platform.' },
      ]},
      { label: 'GraphAI', blocks: [
        { p: 'GraphAI is CostGraph’s persistent AI layer integrated directly into the product experience.' },
        { p: 'Instead of creating a separate AI page, I designed GraphAI as an ambient assistant that stays accessible throughout the platform. The prompts adapt based on the current context, helping users explore infrastructure insights, recommendations, and anomalies without leaving their workflow.' },
        { p: 'The goal was to make AI feel integrated into operations rather than disconnected from them.' },
      ]},
      { label: 'Lessons', blocks: [
        { p: 'CostGraph taught me a lot about designing for technical users and complex systems.' },
        { p: 'One of the biggest lessons was that clarity matters more than volume. Infrastructure teams already have access to endless data, the real challenge is helping them understand what actually needs attention.' },
        { p: 'The project also reinforced the value of working closely with engineering early in the process. Because I was designing directly against backend schemas and real infrastructure behaviour, the product decisions became much more grounded and implementation-friendly.' },
      ]},
    ],
  },

  luotain: {
    name: 'Luotain',
    site: 'luotain.app',
    siteUrl: 'https://luotain.app',
    year: '2026',
    sections: [
      { label: 'Intro', blocks: [
        { p: 'If I had a nickel for every one of my projects that starts with an L, I’d have two nickels. Which isn’t a lot, but it’s weird that it happened twice.' },
        { p: 'Anyway, short links and qr code sites are treated as internet waste, you’ve 100% used on of these types of sites at least once and I’m very sure you don’t remember what it was called.' },
        { p: 'Of course you have the “bitly”s but we’re not talking about those guys right now lol.' },
        { p: 'Anyway, it’s called Luotain which is a Finnish noun meaning "probe" or "detector". I know I know, really cool name, thanks thanks.' },
      ]},
      { label: 'My role', blocks: [
        { p: 'I worked on this end to end which was a lot but to list it all out;' },
        { ul: [
          'Product strategy and UX direction',
          'Front end and back end engineering',
          'Social media accounts management and creating designs',
          'User research synthesis',
          'Information architecture',
          'Design systems',
          'High-fidelity UI design',
          'Interactive prototyping',
          'Design-engineering',
        ]},
      ]},
      { label: 'Problem', blocks: [
        { p: 'You know those QR codes on restaurant tables. A place near me printed a few hundred of them for a new menu, then moved the menu to a different URL a month later, and every single card was dead. The code still scanned fine. It just went nowhere.' },
      ]},
      { label: 'Solution', blocks: [
        { p: 'So that’s what I built. Every link gets a code, the code has its own scan data, and you can change the destination whenever you want. Print it once, point it wherever.' },
      ]},
      { label: 'You can just use it', blocks: [
        { p: 'The homepage isn’t a screenshot of the app, it’s the app. Paste a link in, get a real short link back. Flip to the QR tab and you get a real code you can restyle and download. No signup, nothing.' },
        { p: 'I did that because explaining this product in a paragraph never worked. Ten seconds of using it does the job instantly, so I stopped writing copy and just put the thing on the page.' },
        { p: 'The bit I’m actually pleased with is that the links follow you. If you make one on the homepage and then sign up in the same browser, it’s already sitting in your account when you land, clicks and everything. Getting that wrong would have been rough. You try the product, you like it, you sign up, and the thing you just made is gone.' },
      ]},
      { label: 'Making a link and making a code are the same screen', blocks: [
        { p: 'There’s a toggle up top, Short link or QR code. It looks like it switches modes but it doesn’t. Both do exactly the same thing, the toggle just decides where you end up afterwards.' },
        { p: 'I had it the other way at first, where the fields changed depending on what you picked, and it felt like two different tools sharing a screen. Nothing moves now.' },
        { p: 'The QR side does one extra thing. Most of the time a code is for something you already made, like a sticker for a menu you linked last week, so there’s a picker for your existing links sitting right there.' },
      ]},
      { label: 'The designer', blocks: [
        { p: 'Colours, patterns, your logo in the middle. The corner squares get their own colour separately, which is the bit most people want, because you can brand those without touching the rest and breaking the scan.' },
        { p: 'Tap the code and it opens bigger and tilts toward your cursor. It lags behind the pointer slightly rather than following it exactly, and honestly that lag is the whole effect. When I had it tracking perfectly it felt twitchy and cheap.' },
        { p: 'Downloads are PNG or SVG, and the PNG comes out at 1024 with a white background. Transparency sounds like the nicer option right up until somebody drops the code onto a dark card, it inverts, and no phone can read it.' },
      ]},
      { label: 'Which one worked', blocks: [
        { p: 'Four hundred clicks doesn’t tell you anything. What you want to know is which of your five placements got them. So nothing is summed, it’s all split by source, country and device.' },
        { p: 'The nice side effect is this works in places you can’t put a script. Someone else’s newsletter, a printed flyer, a DM. Analytics tags only work on pages you own, and a link works anywhere.' },
      ]},
      { label: 'Comparing links side by side', blocks: [
        { p: 'This one’s my favourite and it’s easy to miss. On the clicks chart you can tap two or three links and it splits them out instead of showing you the total.' },
        { p: 'That’s the whole point of the product really. If you’ve put the same thing on a flyer and in a newsletter, the number you want isn’t 400 clicks, it’s 240 from the flyer and 160 from the newsletter. Summing them throws away the only interesting part.' },
        { p: 'The rows animate to their new positions when the order changes rather than jumping, which took longer than the comparison itself. When you toggle a filter and the ranking shifts, rows sliding to where they belong reads as the data updating. Rows teleporting reads as a bug.' },
      ]},
      { label: 'Bringing people in', blocks: [
        { p: 'You can invite people, and there are three roles. Owner, admin, member. Members can make links and read analytics, admins can also touch domains and billing, and there’s one owner who can delete the whole workspace.' },
        { p: 'The bit I put effort into is the invite form. Most products make you invite one person, wait, then do it again. This one is a list you can keep adding rows to, each with its own email and role, because you’re usually onboarding a team rather than a person.' },
        { p: 'Pressing enter on the last row adds another one, so you can invite five people without touching the mouse. Pending invites sit in the same list as actual members with their role showing, and you can cancel one if you got the email wrong.' },
      ]},
      { label: 'Custom domains', blocks: [
        { p: 'This screen is boring and I’m weirdly proud of it. It has to teach DNS to someone who’s never touched DNS, and get it right, because the record you need depends on the shape of your domain. go.yourbrand.com takes one kind, yourbrand.link takes another, and DNS flat out won’t let you use the first kind at a root domain. So the page works out which you gave it and only shows you that one.' },
        { p: 'It checks in the background while you’re waiting and stops when you switch tabs. And when it fails it tells you what went wrong instead of just going red.' },
      ]},
    ],
  },

  yote: {
    name: 'Yote',
    site: 'yote.shatermt.com',
    siteUrl: 'https://yote.shatermt.com/',
    year: '2026',
    sections: [
      { label: 'Intro', blocks: [
        { p: 'Input components for React. Every state designed, every transition tuned, every edge case handled. Install it and the field already feels right.' },
        { p: 'Zero dependencies, 24KB, TypeScript throughout, with one prop vocabulary shared by every field so the API stops surprising you halfway through a form.' },
      ]},
      { label: 'My role', blocks: [
        { p: 'Designed and built solo, from the component API through to the documentation site.' },
        { ul: [
          'Component and API design',
          'Front end engineering',
          'Design systems',
          'Documentation and site',
        ]},
      ]},
    ],
  },

  lonar: {
    name: 'Lönar',
    site: 'uselonar.app',
    siteUrl: 'https://www.shatermt.com/work/lonar',
    year: '2026',
    sections: [
      { label: 'Intro', blocks: [
        { p: 'Most invoice tools make you choose between simplicity and control. The simple ones do not track anything. The powerful ones bury you in onboarding before you have sent a single invoice.' },
        { p: 'I wanted to open a platform, create an invoice, send it, and track the payment. All in one place, with no setup friction. That was the whole idea.' },
      ]},
      { label: 'Solution', blocks: [
        { p: 'You land on the platform and the invoice generator is the first thing you see. Client details can be saved so you are not re-entering the same information every time. From there, the invoice goes directly to the client by email.' },
        { p: 'That is where creation ends. Then there is the dashboard. Total earnings, broken down across all time and the last 30, 60, and 90 days. Number of clients, number of invoices. It gives the platform a memory beyond the last thing you sent.' },
        { p: 'Invoices are also grouped by client, so you can see everything attached to one person at once. Most of the features came from conversations exactly like that.' },
        { p: 'Payment tracking works by status. Full payments are not on the platform yet, so for now the flow relies on the client confirming via email.' },
      ]},
      { label: 'Process', blocks: [
        { p: 'Questionnaires came first. The responses confirmed what I suspected: people were stitching together multiple tools to do something that should take one.' },
        { p: 'From that I built a user flow, pressure-tested it with potential users, and made corrections before touching the UI. A few assumptions did not survive that.' },
        { p: 'The invoice generator shipped before the full platform. That meant by the time I was deep in high-fidelity design, there were already real users sending real invoices.' },
        { p: 'The final phase covered APIs, the pro plan, account management, and download and export.' },
      ]},
      { label: 'Lessons', blocks: [
        { p: 'Shipping the generator before the full platform was the right call. It meant real feedback arrived early, when the cost of changing things was still low.' },
        { p: 'It also pushed me further into the engineering side. Owning a product end to end means the line between design and implementation gets blurry fast.' },
      ]},
    ],
  },

  kernui: {
    name: 'KernUI',
    site: 'kernui.framer.website',
    siteUrl: 'https://kernui.framer.website/',
    year: '2025',
    sections: [
      { label: 'Intro', blocks: [
        { p: 'Most design systems get abandoned. Not because teams do not want one, but because they are too brittle, too generic, or too expensive to maintain.' },
        { p: 'I designed KernUI as a production-ready UI kit for product teams: over 3,000 components, built-in light and dark theming, 1,600+ icons, and a token system that actually scales. It is trusted by more than 1,200 designers and developers.' },
      ]},
      { label: 'Problem', blocks: [
        { p: 'Teams waste hours rebuilding the same buttons, form fields, and navigation patterns from scratch. The problem is not effort, it is repetition. Every new project resets the work.' },
        { p: 'Existing UI kits either go too generic, where every interface looks the same, or too rigid, where you cannot adapt them to a real product.' },
        { p: 'KernUI was built to close that gap. Flexible enough to fit a brand. Structured enough to hand off cleanly.' },
      ]},
      { label: 'Design system', blocks: [
        { p: 'The foundation is a token system. Colours, spacing, typography, and radius values are all defined as variables, not hard-coded. Swapping a theme from light to dark does not require touching individual components.' },
        { p: 'Components are built in layers. Atoms compose into molecules, which compose into templates. The same state logic applies across every component.' },
        { p: 'The icon library sits at 1,600+ and is organised by category. Every icon has a consistent 24px grid, two weight variants, and is exported as both SVG and component.' },
      ]},
      { label: 'Lessons', blocks: [
        { p: 'The freemium model was deliberate. Giving the palette and icons away for free meant people could evaluate the system before committing.' },
        { p: 'Documentation is half the product. A component without clear usage guidance gets misused or ignored. The time spent writing docs paid back in fewer support questions.' },
        { p: 'A design system is never finished. The ones that get abandoned are the ones that try to be complete before launching. KernUI shipped incomplete and improved in the open.' },
      ]},
    ],
  },
};
