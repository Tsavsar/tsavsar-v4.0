/* Scenario data for the Catch up prototype.
   Maya (head of product at Halden) has been in a workshop since 9:30 AM. It is 12:48 PM on a Wednesday.
   Items are listed in rank order: deadline first, then people blocked, then recency. */
window.DATA = {
  now: '12:48 PM',
  since: '9:30 AM',
  away: '3h 18m',
  tally: '2 meetings, 41 Slack messages, 18 emails and 6 GitHub updates',

  items: [
    {
      id: 'android',
      who: 'Priya Raman', av: 'priya', act: 'hourglass', actLabel: 'Waiting on you', initials: 'PR', hue: 'violet',
      level: 3,
      title: 'Approve the Android release',
      sub: 'Priya is holding the build until you confirm the permissions copy.',
      due: '1h 12m left', dueShort: '2:00 PM',
      dueLong: 'Due 2:00 PM, 1h 12m left',
      sources: ['meeting', 'slack', 'mail'],
      lead: 'The Android release is on the clock.',
      leadSingle: 'It is due at 2:00 PM.',
      why: 'Priya asked in standup and again in #onboarding-launch. Lena’s QA email says the build is ready, so two people are waiting on you.',
      kind: 'decision',
      channel: '#onboarding-launch',
      drafts: {
        approve: 'Copy looks good. Go ahead and cut the Android build.',
        changes: 'Close. The camera prompt needs to say why we ask, something like “to scan documents”. Can you add that before you cut the build?'
      },
      evidence: [
        {
          src: 'meeting', where: 'Launch standup', when: '10:14 AM', who: 'Priya Raman',
          quote: 'We can cut the Android build as soon as Maya signs off on the permissions copy. I’d like it out before two.',
          play: '14:32'
        },
        {
          src: 'slack', where: '#onboarding-launch', when: '11:14 AM', who: 'Priya Raman',
          quote: '@Maya still need a yes on the permissions screen copy. Build is ready to cut.'
        },
        {
          src: 'mail', where: 'Android 2.4.0 ready for sign-off', when: '12:20 PM', who: 'Lena Fischer',
          quote: 'QA passed on 14 devices. The camera permission prompt is the only open item.'
        }
      ],
      meeting: 'sync'
    },
    {
      id: 'deck',
      who: 'Tomas Weber', av: 'tomas', act: 'send', actLabel: 'Expecting your deck', initials: 'TW', hue: 'blue',
      level: 2,
      title: 'Send Tomas the revised pricing deck',
      sub: 'You told him you would by end of day.',
      due: 'By 5:00 PM', dueShort: '5:00 PM',
      dueLong: 'Due 5:00 PM, 4h 12m left',
      sources: ['meeting', 'mail'],
      lead: 'The pricing deck is due by end of day.',
      leadSingle: 'It is due by end of day.',
      why: 'You promised this in the pricing prep call. Tomas followed up by email at 11:52 and plans to read it tonight.',
      kind: 'commit',
      evidence: [
        {
          src: 'meeting', where: 'Pricing prep', when: '11:41 AM', who: 'You',
          quote: 'I’ll get the revised deck over to you by end of day, Tomas.',
          play: '10:48'
        },
        {
          src: 'mail', where: 'Pricing deck for Thursday', when: '11:52 AM', who: 'Tomas Weber',
          quote: 'Thanks for taking that. If it lands by five I can read it tonight before the review.'
        }
      ]
    },
    {
      id: 'state',
      who: 'Sam Alvarez', av: 'sam', act: 'question', actLabel: 'Asked you to choose', initials: 'SA', hue: 'green',
      level: 1,
      title: 'Pick the empty state for Saved docs',
      sub: 'Sam asked in #design-crit. Two of three replies favor B.',
      due: 'No deadline', dueShort: ' ',
      dueLong: 'No deadline, design is waiting',
      sources: ['slack', 'meeting'],
      lead: 'Design is waiting on one pick.',
      leadSingle: 'It has no deadline, but design is waiting.',
      why: 'Sam needs one choice before handing the screen to Priya’s team. Two of the three people who weighed in chose B.',
      kind: 'choice',
      meeting: 'sync',
      evidence: [
        {
          src: 'meeting', where: 'Design crit', when: '10:52 AM', who: 'Sam Alvarez',
          quote: 'We’ll park the empty state until Maya picks one.',
          play: '21:05'
        },
        {
          src: 'slack', where: '#design-crit', when: '12:03 PM', who: 'Sam Alvarez',
          quote: 'Need a call on empty state A (illustrated) or B (text only). I’m leaning B for Android.'
        },
        {
          src: 'slack', where: '#design-crit', when: '12:09 PM', who: 'Noor Haddad',
          quote: 'B. Illustrations feel heavy on small screens.'
        }
      ]
    }
  ],

  projects: [
    {
      id: 'onboarding',
      name: 'Onboarding v2 launch',
      status: 'ok', statusLabel: 'On track',
      line: 'iOS cleared QA. Android waits on your sign-off.',
      link: 'android',
      bullets: [
        { t: '12:30 PM', src: 'slack', text: 'Launch checklist is at 14 of 17 items.' },
        { t: '11:40 AM', src: 'mail', text: 'iOS 2.4.0 passed QA on 11 devices.' },
        { t: '10:14 AM', src: 'meeting', text: 'Android build is held until the permissions copy is approved.' }
      ]
    },
    {
      id: 'pricing',
      name: 'Pricing page refresh',
      status: 'slip', statusLabel: 'Slipped a day',
      line: 'Review moved to Thursday 10 AM. Tomas wants the new deck first.',
      link: 'deck',
      bullets: [
        { t: '11:52 AM', src: 'mail', text: 'Tomas wants annual pricing shown before monthly.' },
        { t: '11:35 AM', src: 'mail', text: 'Review moved from Wednesday 4 PM to Thursday 10 AM.' },
        { t: '11:20 AM', src: 'meeting', text: 'Three plan names cut down to two.' }
      ]
    },
    {
      id: 'planning',
      name: 'Q1 planning',
      status: 'watch', statusLabel: 'Worth a look Friday',
      line: 'Search relevance now sits on two roadmaps.',
      link: null,
      bullets: [
        { t: '11:05 AM', src: 'slack', text: 'Growth and Platform both claimed search relevance work.' },
        { t: '11:09 AM', src: 'slack', text: 'Ines will propose a split on Friday. Nothing needed from you yet.' }
      ]
    }
  ],

  wait: {
    count: 9,
    rule: 'Hidden because none of these ask anything of you, have a deadline today, or mention you.',
    rows: [
      { src: 'mail', text: 'Sign the vendor contract renewal', t: '11:26 AM', tag: 'Due Friday' },
      { src: 'meeting', text: 'Launch standup notes were published', t: '10:31 AM' },
      { src: 'slack', text: 'Weekly metrics posted in #growth', t: '9:58 AM' },
      { src: 'calendar', text: 'Product sync agenda was updated', t: '10:30 AM' },
      { src: 'github', text: 'Two pull requests merged into onboarding-v2', t: '11:48 AM' },
      { src: 'clickup', text: 'Three onboarding tasks moved to Done', t: '11:15 AM' },
      { src: 'mail', text: 'Four newsletters and two receipts', t: 'Since 9:30' }
    ],
    more: 2
  },

  meeting: {
    id: 'sync',
    title: 'Product sync',
    time: '1:15 PM',
    inMin: 27,
    people: [
      { n: 'Priya', full: 'Priya Raman' },
      { n: 'Tomas', full: 'Tomas Weber' },
      { n: 'Lena', full: 'Lena Fischer' },
      { n: 'Sam', full: 'Sam Alvarez' }
    ],
    going: [
      'Android is the only thing left before Thursday’s launch.',
      'The pricing review moved to Thursday 10 AM.',
      'Sam is blocked on the Saved docs empty state.'
    ]
  },

  ask: {
    prompts: [
      'What did Priya say about the Android build?',
      'Did I promise anyone anything today?',
      'Prep me for Product sync'
    ],
    answers: [
      {
        text: 'Priya said she can cut the Android build once you approve the permissions copy, and she wants it out before 2 PM. She repeated it in #onboarding-launch at 11:14. Lena confirmed QA passed on 14 devices at 12:20.',
        cites: [
          { src: 'meeting', label: 'Launch standup, 14:32' },
          { src: 'slack', label: '#onboarding-launch' },
          { src: 'mail', label: 'Lena’s email' }
        ],
        open: 'android'
      },
      {
        text: 'One thing. You told Tomas you would send the revised pricing deck by end of day, about eleven minutes into Pricing prep. It is still open.',
        cites: [{ src: 'meeting', label: 'Pricing prep, 10:48' }],
        open: 'deck'
      },
      {
        text: 'Expect Priya to ask about the Android sign-off first. The pricing review moved to Thursday 10 AM, and Sam is waiting on your empty-state pick. Two of those are still open.',
        cites: [
          { src: 'meeting', label: 'Launch standup' },
          { src: 'slack', label: '#design-crit' }
        ],
        open: 'prep'
      }
    ],
    fallback: 'I can only answer from the three examples in this prototype. Try one of the suggestions.'
  }
};
