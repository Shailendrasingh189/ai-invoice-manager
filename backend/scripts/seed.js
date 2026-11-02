const { pool } = require("../src/config/db");
const { SCHEMA_SQL } = require("../src/config/schema");
const User = require("../src/models/User");
const Settings = require("../src/models/Settings");
const { computeTotals } = require("../src/utils/invoice");

const DEMO = {
  email: "shailendrasingh@gmail.com",
  password: "Test@1234",
  name: "Shailendra Singh",
};

const NUM_CLIENTS = 20;
const NUM_INVOICES = 84;
const NUM_EXPENSES = 49;
const SPREAD_DAYS = 330;

const COMPANY_NAMES = [
  "TechNova Solutions",
  "Riva Groups",
  "Bright Media",
  "NextGen Technologies",
  "Digital Hub",
  "Apex Software",
  "CloudWorks India",
  "BlueSky Innovations",
  "PixelCraft Studio",
  "UrbanTech Solutions",
  "CodeBridge Systems",
  "Prime Digital",
  "Visionary Labs",
  "SmartEdge Technologies",
  "Alpha Web Studio",
  "Nexus IT Services",
  "Creative Spark",
  "GrowthPoint Media",
  "Infinite Solutions",
  "Vertex Digital",
];

const CITIES = [
  "Indore",
  "Bhopal",
  "Mumbai",
  "Delhi",
  "Pune",
  "Bengaluru",
  "Hyderabad",
  "Jaipur",
  "Ahmedabad",
  "Chennai",
  "Surat",
  "Lucknow",
  "Chandigarh",
  "Nagpur",
  "Kolkata",
];

const STREETS = [
  "MG Road",
  "Station Road",
  "Ring Road",
  "Civil Lines",
  "Park Street",
  "Market Road",
  "Nehru Nagar Main Road",
  "Gandhi Road",
  "Airport Road",
  "Palasia Main Road",
  "Vijay Nagar Main Road",
  "AB Road",
  "Khandwa Road",
  "Rajendra Nagar Road",
  "Sapna Sangeeta Road",
  "Race Course Road",
  "University Road",
  "Jawahar Marg",
  "Shivaji Nagar Road",
  "New Market Road",
  "Industrial Area Road",
  "Malviya Nagar Road",
  "Tilak Nagar Main Road",
  "Lalbagh Road",
  "Patel Nagar Road",
  "College Road",
  "Temple Road",
  "Lake View Road",
  "Ashok Nagar Main Road",
  "Green Park Road",
];

const CATALOG = [
  [
    "Website Development",
    "Design and development of responsive, SEO-friendly business websites with modern layouts and optimized performance.",
    15000,
    "project",
  ],
  [
    "Frontend Development",
    "Development of interactive and responsive user interfaces using HTML, CSS, JavaScript, and React.",
    1200,
    "hour",
  ],
  [
    "Backend Development",
    "Development of secure REST APIs, server-side business logic, authentication, and database integration using Node.js.",
    1500,
    "hour",
  ],
  [
    "UI UX Design",
    "Creation of user-friendly interface designs, wireframes, interactive prototypes, and optimized user experiences.",
    8000,
    "project",
  ],
  [
    "Logo Design",
    "Professional custom logo design with brand-focused concepts, color variations, and high-resolution deliverables.",
    2500,
    "design",
  ],
  [
    "SEO Optimization",
    "Website search engine optimization including keyword research, on-page SEO, meta tags, and performance improvements.",
    5000,
    "month",
  ],
  [
    "Social Media Marketing",
    "Monthly social media management, content planning, promotional campaigns, and audience engagement optimization.",
    7000,
    "month",
  ],
  [
    "Mobile App Development",
    "Development of Android and iOS mobile applications with responsive interfaces, API integration, and database connectivity.",
    35000,
    "project",
  ],
  [
    "Cloud Setup",
    "Cloud infrastructure configuration, application deployment, server setup, storage management, and security configuration.",
    12000,
    "project",
  ],
  [
    "API Integration",
    "Integration of third-party REST APIs, payment gateways, authentication services, and external business applications.",
    4500,
    "service",
  ],
  [
    "Database Design",
    "Database schema planning, relational table design, indexing, query optimization, and PostgreSQL implementation.",
    6500,
    "project",
  ],
  [
    "Website Maintenance",
    "Monthly website updates, bug fixes, security monitoring, backups, and performance optimization.",
    3000,
    "month",
  ],
  [
    "Business Consulting",
    "Professional business consultation covering digital strategy, workflow improvement, automation, and technology planning.",
    2000,
    "hour",
  ],
  [
    "Graphic Design",
    "Creative design of social media graphics, marketing banners, brochures, advertisements, and promotional materials.",
    1800,
    "design",
  ],
  [
    "Security Audit",
    "Security assessment of websites and applications including vulnerability checks, authentication review, and security recommendations.",
    9500,
    "project",
  ],
];

const EXPENSE_VENDORS = [
  ["Adobe", "Software", 30, 98],
  ["Microsoft 365", "Software", 500, 2500],
  ["Google Workspace", "Software", 150, 1500],
  ["Canva Pro", "Software", 300, 1200],
  ["GitHub", "Software", 400, 2000],
  ["Notion", "Software", 300, 1500],
  ["Figma", "Software", 500, 3000],
  ["OpenAI", "Software", 500, 5000],

  ["AWS", "Cloud Hosting", 1000, 15000],
  ["Google Cloud", "Cloud Hosting", 1000, 12000],
  ["Microsoft Azure", "Cloud Hosting", 1500, 18000],
  ["DigitalOcean", "Cloud Hosting", 500, 6000],
  ["Hostinger", "Web Hosting", 500, 4000],
  ["GoDaddy", "Domain & Hosting", 800, 5000],

  ["Google Ads", "Marketing", 2000, 25000],
  ["Meta Ads", "Marketing", 1000, 20000],
  ["LinkedIn Ads", "Marketing", 3000, 30000],
  ["Mailchimp", "Marketing", 500, 5000],

  ["Amazon Business", "Office Supplies", 500, 10000],
  ["Flipkart", "Office Supplies", 500, 8000],
  ["Local Stationery Shop", "Office Supplies", 100, 2500],
  ["HP", "Office Equipment", 2000, 25000],
  ["Dell", "Office Equipment", 5000, 50000],

  ["Airtel", "Internet", 500, 2500],
  ["Jio Fiber", "Internet", 500, 2000],
  ["ACT Fibernet", "Internet", 700, 2500],

  ["Office Rent", "Rent", 8000, 40000],
  ["Coworking Space", "Rent", 3000, 15000],
  ["Electricity Board", "Utilities", 1000, 8000],
  ["Water Supply", "Utilities", 200, 1500],

  ["Uber", "Travel", 100, 2500],
  ["Ola", "Travel", 100, 2000],
  ["Indian Railways", "Travel", 300, 5000],
  ["IndiGo", "Travel", 2500, 15000],

  ["Swiggy", "Food", 150, 1500],
  ["Zomato", "Food", 150, 2000],
  ["Domino's", "Food", 300, 1500],

  ["Print Shop", "Printing", 100, 3000],
  ["Courier Service", "Shipping", 100, 1500],
  ["India Post", "Shipping", 50, 1000],

  ["CA Services", "Professional Fees", 2000, 10000],
  ["Legal Consultant", "Professional Fees", 3000, 20000],
  ["Freelancer", "Contractor", 2000, 30000],
  ["Employee Training", "Training", 1000, 12000],
];

const rand = (n) => Math.floor(Math.random() * n);
const pick = (arr) => arr[rand(arr.length)];
const round2 = (n) => Math.round(n * 100) / 100;
const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 16);

function isoDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function addDays(iso, days) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function phone() {
  const first = 6 + rand(4);
  const remaining = String(rand(1_000_000_000)).padStart(9, "0");
  return `91${first}${remaining}`;
}

async function run() {
  console.log(`\nSeeding demo data for ${DEMO.email}...\n`);
  await pool.query(SCHEMA_SQL);

  const passwordHash = await User.hashPassword(DEMO.password);
  let user = await User.findByEmail(DEMO.email);
  if (user) {
    await pool.query(
      `UPDATE users SET name=$2, password_hash=$3, updated_at=now() WHERE id=$1`,
      [user.id, DEMO.name, passwordHash],
    );
    console.log(`User ready: ${DEMO.email} (existing)`);
  } else {
    user = await User.create({
      name: DEMO.name,
      email: DEMO.email,
      passwordHash,
    });
    console.log(`User ready: ${DEMO.email} (created)`);
  }
  const uid = user.id;

  await Settings.ensure(uid);
  await Settings.update(uid, {
    company_name: "Chen Studio",
    address: "410 Townsend St, Indore, MP 455201",
    email: DEMO.email,
    phone: "+91 9755839451",
    currency: "INR",
    tax_rate: 8.5,
    invoice_prefix: "INV-",
  });

  await pool.query(`DELETE FROM payments WHERE user_id=$1`, [uid]);
  await pool.query(`DELETE FROM expenses WHERE user_id=$1`, [uid]);
  await pool.query(`DELETE FROM catalog_items WHERE user_id=$1`, [uid]);
  await pool.query(`DELETE FROM invoices WHERE user_id=$1`, [uid]);
  await pool.query(`DELETE FROM clients WHERE user_id=$1`, [uid]);

  const clientIds = [];
  for (let i = 0; i < NUM_CLIENTS; i++) {
    const name = COMPANY_NAMES[i % COMPANY_NAMES.length];
    const company = name.replace(
      / (Group|Studios|Co\.?|Partners|Labs|Ventures|Interactive|Traders)$/i,
      "",
    );
    const { rows } = await pool.query(
      `INSERT INTO clients (user_id, name, email, company, phone, address)
        VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
      [
        uid,
        name,
        `billing@${slug(name)}.com`,
        company,
        phone(),
        `${100 + rand(900)} ${pick(STREETS)}, ${pick(CITIES)}, India`,
      ],
    );
    clientIds.push(rows[0].id);
  }
  console.log(`Created ${clientIds.length} clients`);

  for (const [ name, description, rate, unit ] of CATALOG) {
    await pool.query(
      `INSERT INTO catalog_items (user_id, name, description, rate, unit) 
        VALUES ($1,$2,$3,$4,$5)`,
      [uid, name, description, rate, unit],
    );
  }
  console.log(`Created ${CATALOG.length} catalog items`);

  const today = new Date();
  let seq = 1;
  let paidCount = 0;

  for (let i = 0; i < NUM_INVOICES; i++) {
    const issueDaysAgo = rand(SPREAD_DAYS);
    const issue = isoDaysAgo(issueDaysAgo);
    const due = addDays(issue, [15, 30, 30, 45][rand(4)]);
    const dueInFuture = new Date(due) >= today;

    const lineCount = 1 + rand(4);
    const items = [];
    for (let j = 0; j < lineCount; j++) {
      const [ name, description, rate, unit ] = pick(CATALOG);
      const qty = unit === "hour" ? pick([8, 12, 16, 20, 24, 32, 40]) : 1;
      items.push({ description, quantity: qty, rate });
    }

    const taxRate = Math.random() < 0.7 ? 8.5 : 0;
    const discount = Math.random() < 0.15 ? [50, 100, 150, 200][rand(4)] : 0;
    const totals = computeTotals(items, taxRate, discount);

    const roll = Math.random();
    let status;
    if (roll < 0.6) status = "paid";
    else if (roll < 0.85) status = "sent";
    else status = "draft";

    let paidAt = null;
    if (status === "paid") {
      const paidDaysAgo = Math.max(
        0,
        issueDaysAgo - rand(Math.min(35, issueDaysAgo + 1)),
      );
      paidAt = isoDaysAgo(paidDaysAgo);
      paidCount++;
    }

    const number = `INV-${String(seq).padStart(4, "0")}`;
    seq++;

    const { rows } = await pool.query(
      `INSERT INTO invoices 
        (user_id, client_id, invoice_number, status, issue_date, due_date, currency, tax_rate, discount, subtotal, tax_amount, total, notes,terms, paid_at)
        VALUES ($1, $2, $3, $4, $5, $6,'INR', $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id`,
      [
        uid,
        pick(clientIds),
        number,
        status,
        issue,
        due,
        taxRate,
        totals.discount,
        totals.subtotal,
        totals.taxAmount,
        totals.total,
        "Thank you for your business.",
        "Payment due within 30 days.",
        paidAt,
      ],
    );
    const invId = rows[0].id;

    let pos = 0;
    for (const it of totals.items) {
      await pool.query(
        `INSERT INTO invoice_items (invoice_id, description, quantity, rate, amount, position)
          VALUES ($1, $2, $3, $4, $5, $6)`,
        [invId, it.description, it.quantity, it.rate, it.amount, pos++],
      );
    }

    if (status === "paid") {
      await pool.query(
        `INSERT INTO payments (user_id, invoice_id, amount, method, paid_on, notes)
        VALUES ($1, $2, $3, $4, $5, '')`,
        [
          uid,
          invId,
          totals.total,
          pick(["Bank transfer", "Credit card", "Check", "Paytm"]),
          paidAt,
        ],
      );
    }
  }

  await pool.query(
    `UPDATE company_settings SET next_seq=$2 WHERE user_id= $1`,
    [uid, seq],
  );
  console.log(
    `Created ${NUM_INVOICES} invoices (${paidCount} paid + payments)`,
  );

  for (let i = 0; i < NUM_EXPENSES; i++) {
    const [vendor, category, min, max] = pick(EXPENSE_VENDORS);
    const amount = round2(min + Math.random() * (max - min));
    await pool.query(
      `INSERT INTO expenses (user_id, vendor, category, expense_date, amount, notes)
      VALUES ($1,$2,$3,$4,$5, '')`,
      [uid, vendor, category, isoDaysAgo(rand(SPREAD_DAYS)), amount],
    );
  }
  console.log(`Created ${NUM_EXPENSES} expenses`);

  console.log("\n Seed complete.");
  console.log(" Login:   " + DEMO.email);
  console.log(" Password:  " + DEMO.password + "\n");
}

run()
  .catch((err) => {
    console.error("\n Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
