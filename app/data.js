/* Fictional demonstration data. All people, companies, addresses and
   amounts are invented for illustration. Times are relative to "now"
   so the demo always looks current. */
(function (root) {
  "use strict";
  // ago: minutes before now when the email arrived
  root.DEMO_EMAILS = [
    { ago: 18, from: "Peter Kariuki", email: "peter@kariukidental.example", org: "Kariuki Dental Clinic",
      subject: "Urgent: appointment reminders stopped sending",
      body: "Hi Naomi,\n\nSince yesterday evening our automated appointment reminders have stopped going out to patients. We have 23 appointments today and two patients have already missed theirs. Could you please look into this ASAP and let me know what went wrong?\n\nYou can reach me on 0722 410 118.\n\nThanks,\nPeter" },
    { ago: 52, from: "Wanjiru Kamau", email: "wanjiru@bloominteriors.example", org: "Bloom Interiors Ltd",
      subject: "Revised quote needed before tomorrow's board meeting",
      body: "Hi Naomi,\n\nOur board meets tomorrow at 10am and we need the revised quote for the office fit-out at our Westlands branch, including the extra meeting room. Could you also confirm the earliest delivery date?\n\nThe approved budget is KES 1,250,000.\n\nThanks,\nWanjiru" },
    { ago: 95, from: "Amina Hassan", email: "amina.hassan@coastlinehotels.example", org: "Coastline Hotels",
      subject: "Enquiry: automating booking enquiries for our Mombasa hotels",
      body: "Hello,\n\nI came across your services on LinkedIn. We run three boutique hotels in Mombasa and receive around 150 booking enquiries a week by email and WhatsApp. We're interested in automating replies and tracking follow-ups.\n\nHow much would a setup like this cost? Are you available for a call next Tuesday at 11am?\n\nBest regards,\nAmina Hassan\nOperations Manager, Coastline Hotels" },
    { ago: 140, from: "Grace Mutua", email: "grace@tumainifoundation.example", org: "Tumaini Foundation",
      subject: "Can we move Friday's planning meeting to Monday?",
      body: "Hi Naomi!\n\nSomething has come up on Friday. Could we move our Q1 planning meeting to Monday afternoon instead, maybe 2pm? Same Google Meet link is fine.\n\nLet me know what works.\n\nGrace" },
    { ago: 210, from: "Sarah Chen", email: "sarah.chen@horizonventures.example", org: "Horizon Ventures",
      subject: "Q4 investor update — please review",
      body: "Hi Naomi,\n\nPlease review the attached Q4 investor update deck and share your comments by Thursday. In particular, could you check the automation savings figures on slide 6 and confirm they match the tracker?\n\nMany thanks,\nSarah Chen\nHorizon Ventures, London" },
    { ago: 300, from: "Safari Supplies Accounts", email: "accounts@safarisupplies.example", org: "Safari Supplies Ltd",
      subject: "Invoice INV-2041 — payment due Friday",
      body: "Dear Customer,\n\nPlease find attached invoice INV-2041 for KES 48,500 for office stationery delivered on 12 November. Payment is due by Friday.\n\nKindly share the remittance advice once paid.\n\nRegards,\nAccounts Team\nSafari Supplies Ltd" },
    { ago: 380, from: "James Njoroge", email: "james@njorogeandpartners.example", org: "Njoroge & Partners",
      subject: "Re: Proposal for website maintenance",
      body: "Hi Naomi,\n\nThanks for the proposal you sent last week. I've reviewed it with my partner Ruth Achieng and we have two questions about the monthly support hours.\n\nCould you call me this week? Thursday afternoon works best.\n\nRegards,\nJames" },
    { ago: 1290, from: "Linda Wekesa", email: "linda@kilimanirealty.example", org: "Kilimani Realty",
      subject: "Meeting confirmation: Wednesday 9:30am",
      body: "Hi Naomi,\n\nConfirming our meeting on Wednesday at 9:30am at our Kilimani office (2nd floor, Argwings Kodhek Road) to walk through the viewing-request workflow.\n\nLooking forward to meeting you.\n\nLinda Wekesa\nKilimani Realty" },
    { ago: 1420, from: "KenyaDomains Registrar", email: "renewals@kenyadomains.example", org: "KenyaDomains",
      subject: "Final reminder: your domain expires in 3 days",
      body: "Hello,\n\nThis is a final reminder that the domain naomiautomation.co.ke expires in 3 days. Renew now to avoid your website and email going offline.\n\nRenewal fee: KES 1,200 per year.\n\nKenyaDomains Support" },
    { ago: 1500, from: "Brian Ouma", email: "brian@team.example", org: "",
      subject: "Weekly team update",
      body: "Hi all,\n\nFYI — quick update for the week: the Bloom Interiors workflow is live, the dental clinic reminders were tested on Monday, and I'll be on leave next Friday.\n\nNo action needed.\n\nBrian" },
    { ago: 1560, from: "Bloom Interiors Ltd", email: "finance@bloominteriors.example", org: "Bloom Interiors Ltd",
      subject: "Payment received — INV-1987",
      body: "Hello,\n\nThis is to confirm that payment of KES 30,000 for invoice INV-1987 has been received and processed. Thank you for your business.\n\nFinance Team\nBloom Interiors Ltd" },
    { ago: 2880, from: "Kevin Mwangi", email: "kevin@smedigital.example", org: "SME Digital Summit",
      subject: "Invitation: Nairobi SME Digital Summit on 4 December",
      body: "Dear Naomi,\n\nYou're invited to speak on a panel about practical AI for small businesses at the Nairobi SME Digital Summit on 4 December at 9am, at the KICC.\n\nPlease RSVP by 28 November.\n\nWarm regards,\nKevin Mwangi\nSME Digital Summit" },
    { ago: 2960, from: "David Otieno", email: "david@otienologistics.example", org: "Otieno Logistics",
      subject: "Enquiry: help with invoice follow-ups",
      body: "Hello Naomi,\n\nI run a small logistics company with 12 staff. We spend hours every week chasing customer invoices and receipts by email. Do you offer support for this, and what would it cost?\n\nThanks,\nDavid" },
    { ago: 3100, from: "Tech Weekly", email: "newsletter@techweekly.example", org: "Tech Weekly",
      subject: "This week in productivity tools",
      body: "Your weekly roundup of productivity tips, app updates and tutorials. Plus: 20% off annual plans this week only.\n\nView in browser · Unsubscribe" }
  ];

  // Extra emails used by "Simulate new email"
  root.DEMO_INCOMING = [
    { from: "Faith Njeri", email: "faith@greenleafacademy.example", org: "Greenleaf Academy",
      subject: "Parents' enquiries are overwhelming our office",
      body: "Hello Naomi,\n\nWe're a private school in Karen and our admissions office receives over 80 parent emails a day during intake. Do you offer automation that could sort and answer common questions? Could we meet on Friday at 10am?\n\nBest,\nFaith Njeri\nAdmissions, Greenleaf Academy" },
    { from: "Samuel Kiptoo", email: "samuel@riftvalleyagri.example", org: "Rift Valley Agri Ltd",
      subject: "Contract draft — need your comments by Monday",
      body: "Hi Naomi,\n\nPlease review the attached service agreement draft and send your comments by Monday. We'd like to sign before the end of the month.\n\nRegards,\nSamuel" },
    { from: "Mercy Akinyi", email: "mercy@akinyistudio.example", org: "Akinyi Studio",
      subject: "Problem with the enquiry form automation",
      body: "Hi Naomi, the enquiry form on our website has not sent anything to our Google Sheet since this morning. Clients are filling it in but nothing is arriving. Can you please check today? Thanks, Mercy" },
    { from: "Lucy Wambui", email: "lucy@wambuiconsulting.example", org: "Wambui Consulting",
      subject: "Quick catch-up next week?",
      body: "Hi Naomi,\n\nAre you free for a 30-minute catch-up next Wednesday at 3pm? I'd like to discuss adding calendar automation to our setup.\n\nCheers,\nLucy" },
    { from: "Abdi Yusuf", email: "abdi@northstarlogistics.example", org: "Northstar Logistics",
      subject: "Overdue: invoice NS-7781",
      body: "Dear Naomi,\n\nOur records show invoice NS-7781 for KES 15,000 is now overdue. Kindly settle it by 26 November or let us know if there is an issue.\n\nRegards,\nAbdi Yusuf\nAccounts, Northstar Logistics" },
    { from: "Dr. Achieng Omondi", email: "achieng@lakesidemedical.example", org: "Lakeside Medical Centre",
      subject: "Can you automate our patient follow-up emails?",
      body: "Hello Naomi,\n\nWe are a small clinic in Kisumu. After each visit our front desk manually emails patients with care instructions and a follow-up date. We'd like this automated. Do you work with clinics, and what would a setup like this cost?\n\nRegards,\nDr. Achieng Omondi" },
    { from: "Patrick Mutua", email: "patrick@mutuaarchitects.example", org: "Mutua Architects",
      subject: "Urgent: site visit moved to tomorrow 8am",
      body: "Hi Naomi,\n\nThe client has moved the site visit to tomorrow at 8am in Karen. Please update the calendar and send the revised schedule to the whole team before 6pm today.\n\nThanks,\nPatrick" },
    { from: "Grace Mutua", email: "grace@tumainifoundation.example", org: "Tumaini Foundation",
      subject: "Thank you for today's session",
      body: "Hi Naomi,\n\nThank you for today's training session — the team found it really useful. No action needed, just wanted to say thanks!\n\nGrace" },
    { from: "Halima Noor", email: "halima@noorevents.example", org: "Noor Events",
      subject: "Quote for automating RSVP tracking",
      body: "Hello,\n\nWe organise corporate events in Nairobi and track RSVPs in Google Sheets by hand. Could you send a quote for automating RSVP replies and reminders? Our next event is on 12 December.\n\nKind regards,\nHalima Noor" },
    { from: "Safaricom Business", email: "billing@business.example", org: "Business Billing",
      subject: "Your monthly statement is ready",
      body: "Dear customer, your monthly statement for account 7781 is now available. Amount due: KES 4,350 by 30 November. View it in the self-care portal." },
    { from: "Kevin Mwangi", email: "kevin@smedigital.example", org: "SME Digital Summit",
      subject: "Reminder: please RSVP for the summit panel",
      body: "Hi Naomi,\n\nJust a friendly reminder to confirm whether you can join the AI panel at the Nairobi SME Digital Summit. Could you let me know by Friday?\n\nThanks,\nKevin" },
    { from: "Productivity Weekly", email: "hello@productivityweekly.example", org: "Productivity Weekly",
      subject: "5 tips to reclaim your Mondays",
      body: "This week's newsletter: five simple habits to start your week calmly. View in browser. Unsubscribe anytime." }
  ];

  // Ready-made examples for the "Analyse an email" page
  root.DEMO_EXAMPLES = [
    { label: "Client deadline", from: "Joyce Mutiso", email: "joyce@example.com", subject: "Need the updated report by Friday",
      body: "Hi,\n\nCould you please send me the updated sales report by Friday 5pm? The directors want to review it on Monday morning. Also, kindly include the figures for October.\n\nThanks,\nJoyce" },
    { label: "Meeting request", from: "Omar Farah", email: "omar@example.com", subject: "Coffee meeting next week?",
      body: "Hello Naomi,\n\nWould you be available to meet next Tuesday at 11am at Java House, Upper Hill? I'd like to talk about automating our customer follow-ups.\n\nBest,\nOmar" },
    { label: "Complaint", from: "Esther Chebet", email: "esther@example.com", subject: "Very disappointed with the delay",
      body: "Hi,\n\nOur order #45821 was supposed to arrive on Monday and it still hasn't been delivered. This is the second delay this month and it is affecting our clients. Please let me know today when it will arrive.\n\nEsther" },
    { label: "Sales enquiry", from: "Tom Becker", email: "tom@example.com", subject: "Do you work with agencies in Kampala?",
      body: "Hi there,\n\nI run a 15-person marketing agency in Kampala. We were referred to you by a client. Do you offer email and task automation for agencies, and how much does it usually cost? We'd like to start in December.\n\nThanks,\nTom Becker" },
    { label: "Invoice", from: "Billing Team", email: "billing@example.com", subject: "Invoice INV-3302 due 30 November",
      body: "Dear customer,\n\nInvoice INV-3302 for USD 420 is due on 30 November. Kindly make payment via bank transfer and share proof of payment.\n\nBilling Team" }
  ];

  // Pre-existing calendar events (dayOffset from today)
  root.DEMO_EVENTS = [
    { day: 0, time: "15:00", title: "Weekly pipeline review", kind: "internal" },
    { day: 1, time: "10:00", title: "Team check-in", kind: "internal" },
    { day: 2, time: "13:00", title: "Lunch with Horizon Ventures", kind: "external" },
    { day: 3, time: "11:00", title: "Make.com scenario build — Akinyi Studio", kind: "work" },
    { day: 4, time: "16:00", title: "Invoice run", kind: "internal" },
    { day: 6, time: "09:30", title: "Supplier call — Safari Supplies", kind: "external" }
  ];

  // Things you are waiting on (follow-ups you started)
  root.DEMO_FOLLOWUPS = [
    { contact: "Mary Achieng", org: "Achieng Travel", topic: "The automation proposal sent on Monday", sentAgo: 4, due: 0 },
    { contact: "Joseph Odhiambo", org: "Odhiambo Motors", topic: "Your signed service agreement", sentAgo: 6, due: -1 },
    { contact: "Ruth Atieno", org: "Atieno Bakers", topic: "Access to your Google Workspace account for setup", sentAgo: 2, due: 2 }
  ];

  root.DEMO_DONE_TASKS = [
    { text: "Send onboarding guide to Bloom Interiors", daysAgo: 1 },
    { text: "Test reminder workflow for Kariuki Dental", daysAgo: 2 },
    { text: "Share invoice INV-1987 with Bloom Interiors", daysAgo: 3 },
    { text: "Update Make.com scenario documentation", daysAgo: 1 },
    { text: "Prepare discovery call notes — Otieno Logistics", daysAgo: 0 }
  ];
})(window);
