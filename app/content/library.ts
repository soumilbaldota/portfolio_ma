// ─────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for all portfolio facts.
//
// Mirrors ~/Desktop/resume/resume_gen/content/library.yml (LaTeX stripped to
// plain text) plus a few personal claims kept from the original site that are
// true but not in the résumé library (Mars Rover SLAM, Dean's Scholarship,
// ISP security work). Every section component reads from here so the site can
// never drift out of sync with the résumé again.
// ─────────────────────────────────────────────────────────────────────────

export const profile = {
  name: "Soumil Baldota",
  tagline: "Systems & kernel engineer",
  blurb:
    "I build software that lives close to the metal, kernels, eBPF, and the edge.",
  location: "New York City, NY",
  email: "ssb2234@columbia.edu",
  phone: "+1 (646) 326-8135",
  phoneHref: "+16463268135",
  linkedin: "https://linkedin.com/in/soumilbaldota",
  github: "https://github.com/soumilbaldota",
  calendar:
    "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2ja62H_eo2qU6_blBj5v2elCGFaQvYaJiD-JZZVbBYfZrskFWBECqqj6KcL7iokPUZsLx7_BlG?gv=true",
  seeking: "Summer 2026 internships",
};

export type Education = {
  school: string;
  location: string;
  degree: string;
  gpa: string;
  dates: string;
  note?: string;
};

export const education: Education[] = [
  {
    school: "Columbia University",
    location: "New York City, NY",
    degree: "M.S. in Computer Science",
    gpa: "3.7 / 4.0",
    dates: "Aug 2025 – Dec 2026",
    note: "Operating Systems Research @ Software Systems Lab",
  },
  {
    school: "SRM Institute of Science and Technology",
    location: "India",
    degree: "B.Tech, CS & Big Data Analytics",
    gpa: "9.56 / 10 (3.84 / 4.0)",
    dates: "Aug 2020 – May 2024",
    note: "Dean's Scholarship for academic excellence",
  },
];

export type Experience = {
  id: string;
  company: string;
  location: string;
  role: string;
  dates: string;
  // which scene sprite opens this role
  sprite: string;
  // short one-liner for the shell / cards
  summary: string;
  bullets: string[];
  tech: string[];
};

// Reverse-chronological by start date (canonical résumé order).
export const experience: Experience[] = [
  {
    id: "cloudflare",
    company: "Cloudflare",
    location: "Austin, TX",
    role: "Software Engineering Intern · Performance Team",
    dates: "May 2026 – Aug 2026",
    sprite: "cloudflare",
    summary:
      "Per-cgroup network accounting in Rust + eBPF for the edge, on track to sit in the path of all Cloudflare traffic (~103B req/day).",
    bullets: [
      "Built per-cgroup network (RX/TX) accounting for the MAPS edge platform as a split privileged/unprivileged eBPF datapath, with a single shared network_accounting crate as the wire contract so the two binaries' map layouts can't silently diverge. Merged to main and running in maps_collector, the per-service usage layer rolling out across Cloudflare's core edge, already serving real production traffic pre-GA and on track to sit in the path of all Cloudflare traffic (~103B requests/day).",
      "Wrote the kernel datapath as a cgroup_skb eBPF program in C using CO-RE against stable kernel UAPI (no vmlinux.h, bpftool, or BTF blob), parsing IPv4/IPv6 headers to attribute bytes and packets across all 256 L4 protocols into PERCPU_ARRAY counters on the per-packet hot path at ~50 ns per packet, each CPU increments its own row with plain adds, so the path takes no locks or atomics.",
      "Built netacctd, the privileged supervisor (CAP_BPF / CAP_NET_ADMIN): it attaches a dedicated per-cgroup program instance with that cgroup's slot baked into .rodata at load time, pins counter/index maps and links to bpffs, and chown/chmods the pins so an unprivileged reader can open them. Added a daemon mode watching cgroup2 via a fanotify mark to auto-reattach cgroups recreated by service restarts.",
      "Wrote the unprivileged reader inside maps_collector (a tokio task on a dedicated blocking thread) that opens the bpffs-pinned maps zero-copy by path, resolves each cgroup's inode to its slot, sums the per-CPU rows, diffs against the previous poll, and exports per-interval deltas as Prometheus counters.",
      "Led migration of the MAPS monorepo's build from Cargo/Make to fully hermetic Bazel (pinned Rust/Go/LLVM/protoc toolchains) with per-arch amd64/arm64 .deb packages, cross-compilation (incl. macOS host → Linux target), and a shared remote cache across CI runners, cutting CI build times from ~8 minutes to under 1 minute.",
      "Built a hermetic QEMU microVM integration test that boots maps_collector and exercises the real maps_client → UDS → collector → gRPC scrape pipeline end-to-end, selecting the accelerator per host (HVF on macOS, KVM/TCG on Linux/CI).",
      "Added Prometheus metrics and Grafana dashboards, and shipped an initial production release via Cloudflare's internal Release Manager, with config managed by SaltStack and Terraform.",
    ],
    tech: [
      "Rust",
      "eBPF",
      "C",
      "Linux kernel",
      "cgroups",
      "Bazel",
      "QEMU",
      "Prometheus",
      "Grafana",
      "Terraform",
      "SaltStack",
    ],
  },
  {
    id: "columbia",
    company: "Columbia University",
    location: "New York City, NY",
    role: "Graduate Student Researcher · Software Systems Lab",
    dates: "Jan 2026 – Present",
    sprite: "tux",
    summary:
      "Fast container forking in a custom Linux kernel + Kata Containers; extending it to ARM CCA confidential-compute Realms.",
    bullets: [
      "Built container forking mechanisms inside a custom Linux kernel and Kata Containers by adding a multi-threaded fork syscall that replicates file descriptors, stack, and heap memory using copy-on-write; measured fork latency with custom eBPF hooks.",
      "Currently building Realm forking for ARM CCA (Confidential Compute Architecture) atop a custom RMM (Realm Management Monitor) stack, extending the fork mechanism to confidential-compute Realms.",
    ],
    tech: [
      "Linux kernel",
      "Kata Containers",
      "eBPF",
      "ARM CCA",
      "CoW memory",
      "C",
    ],
  },
  {
    id: "maximl",
    company: "Maximl Labs",
    location: "Bengaluru, India",
    role: "Software Engineer (Intern → Full-time)",
    dates: "Jun 2023 – Jul 2025",
    sprite: "oilplant",
    summary:
      "Backend + infra for an industrial-plant SaaS: a job-processing library across 90% of services, multi-tenancy, and big latency wins.",
    bullets: [
      "Built a BullMQ-based job-processing library adopted across 90% of microservices, processing 1M+ jobs/week at 99.9% success; reduced job-related bugs by 70%.",
      "Implemented multi-tenancy via PostgreSQL Row-Level Security policies, enforcing tenant data isolation at the database layer and eliminating cross-tenant data leaks.",
      "Optimized PostgreSQL schemas, indexes, and query plans, 3× faster query execution and p99 API latency from 450 ms to 150 ms.",
      "Enabled dynamic background-worker scaling with Helm charts and custom ConfigMaps, running jobs round-robin to eliminate starvation, cut job latency by 50% with zero-downtime scaling.",
      "Drove TDD adoption and built GitLab CI/CD pipelines (linting, coverage gates, DB schema checks, ArgoCD-based AKS deploys), raising test coverage from 40% to 90% and cutting production failures 70%.",
      "Improved observability with Datadog and ELK, reducing mean incident resolution from 2 hours to 30 minutes across 10+ microservices.",
      "Built Medusa, a production FastAPI media service backed by PostgreSQL, fronted by a custom HTTP client adding resumable downloads and automatic retries with backoff, with TypeScript and Python client SDKs.",
      "Reverse-engineered the Oracle Primavera P6 and MS Project binary/XML formats to automate schedule syncing, cutting manual syncing time by 90% for enterprise clients.",
      "Delivered GRC-compliant deployments into customer-controlled environments, including a Reliance-managed VPC on Azure.",
    ],
    tech: [
      "TypeScript",
      "NestJS",
      "Node.js",
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "BullMQ",
      "Kubernetes",
      "Helm",
      "ArgoCD",
      "Azure",
      "Datadog",
    ],
  },
  {
    id: "samsung",
    company: "Samsung Research (PRISM)",
    location: "Bengaluru, India",
    role: "Machine Learning Intern",
    dates: "Nov 2022 – Jun 2023",
    sprite: "samsung",
    summary:
      "Multi-modal document classification for mobile devices, 95% accuracy with real-time inference.",
    bullets: [
      "Built multi-modal document classification models (LSTM, RNN, BERT, RoBERTa) in PyTorch for mobile devices on a 120,000+ sample dataset; achieved 95% accuracy with real-time inference.",
      "Scraped and augmented text samples across diverse domains using BERT to generate a high-quality training set.",
    ],
    tech: ["Python", "PyTorch", "BERT", "RoBERTa", "LSTM", "Hugging Face"],
  },
  {
    id: "cern",
    company: "CERN · Google Summer of Code",
    location: "Remote",
    role: "Open Source Contributor",
    dates: "Jun 2022 – Sep 2022",
    sprite: "cern",
    summary:
      "Code-generation bridge between AidaSoft/podio and Julia for high-energy-physics data pipelines.",
    bullets: [
      "Developed a code-generation interface between AidaSoft/podio and Julia via YAML and Jinja2 templates for high-energy-physics data pipelines.",
      "Benchmarked Julia against C++ for performance parity; owned the Julia-bindings workstream under CERN maintainer mentorship with weekly design reviews.",
    ],
    tech: ["Julia", "C++", "Python", "Jinja2", "YAML"],
  },
];

export type Project = {
  id: string;
  title: string;
  group: string;
  desc: string;
  tech: string[];
  href?: string;
};

export const projectGroups = [
  "Kernel & Systems",
  "ML & AI",
  "Quant & Finance",
  "Data & Analytics",
] as const;

export const projects: Project[] = [
  // ── Kernel & Systems ──
  {
    id: "linux_scheduler",
    title: "Linux Process Scheduler",
    group: "Kernel & Systems",
    desc: "Custom weighted round-robin scheduling class with load balancing and idle-CPU task stealing; benchmarked with eBPF against CFS, 20% throughput gain, 30% fewer context switches on CPU-bound workloads.",
    tech: ["C", "Linux kernel", "eBPF"],
  },
  {
    id: "superfork",
    title: "Superfork · Container Forking",
    group: "Kernel & Systems",
    desc: "Multi-threaded fork syscall in a custom Linux kernel that replicates FDs, stack, and heap via copy-on-write for fast container cloning in Kata Containers; fork latency measured with custom eBPF hooks.",
    tech: ["C", "Linux kernel", "Kata Containers", "CoW"],
    href: "https://github.com/soumilbaldota/linux/tree/6.18-superfork-qemu/kernel/superfork",
  },
  {
    id: "shared_kernel_user_mem",
    title: "Shared Kernel–User Memory",
    group: "Kernel & Systems",
    desc: "Syscalls letting an inspector observe a live shadow page table of any target process; kernel writes reflected instantly in userspace via shared physical pages (no copy_to_user), synchronized with MMU-notifier callbacks.",
    tech: ["C", "Linux kernel", "Virtual memory"],
  },
  {
    id: "vfs_fs",
    title: "Linux VFS Filesystem",
    group: "Kernel & Systems",
    desc: "Kernel module implementing a disk-backed VFS filesystem with mmap, fsync, and concurrent multi-process access via the iomap APIs.",
    tech: ["C", "Linux kernel", "VFS", "iomap"],
  },
  {
    id: "state_tracer",
    title: "Precise Kernel State Tracer",
    group: "Kernel & Systems",
    desc: "Syscalls tracing process state transitions into a ring buffer with precise separation of TASK_RUNNABLE and TASK_RUNNING; blocking-read userspace interface.",
    tech: ["C", "Linux kernel"],
  },
  {
    id: "dns_resolver",
    title: "Recursive DNS Resolver",
    group: "Kernel & Systems",
    desc: "Recursive DNS server in C with A/AAAA/CNAME/MX support and TTL-aware LRU caching over UDP.",
    tech: ["C", "DNS", "UDP"],
  },
  {
    id: "arbitrage_bot",
    title: "Prediction-Market Arbitrage Bot",
    group: "Kernel & Systems",
    desc: "Low-latency Rust trading bot connecting to the Kalshi and Polymarket websocket APIs to arbitrage weather-outcome prediction markets.",
    tech: ["Rust", "WebSockets"],
  },
  // ── ML & AI ──
  {
    id: "simamba",
    title: "Simamba (Simpson's-rule Mamba3)",
    group: "ML & AI",
    desc: "Replaced the zero-order-hold/Euler discretization in the Mamba3 selective state-space recurrence with a Simpson's-rule integrator for better continuous-time SSM accuracy, implemented as a fused Triton kernel to keep training throughput competitive with the parallel scan.",
    tech: ["Python", "Triton", "PyTorch", "SSMs"],
  },
  {
    id: "cuda_nn",
    title: "CUDA Perceptron & CNN (HPML)",
    group: "ML & AI",
    desc: "Perceptron and CNN from scratch in raw CUDA (custom forward/backward kernels, no framework autodiff); applied memory coalescing and cache-aware access patterns to optimize global memory.",
    tech: ["CUDA", "C++", "GPU"],
  },
  {
    id: "plant_seedling",
    title: "Plant Seedling Classification",
    group: "ML & AI",
    desc: "CNN image classifier distinguishing 12 plant-seedling species, addressing class imbalance and background clutter; published as ICRTDA-157.",
    tech: ["Python", "PyTorch", "CNN"],
  },
  // ── Quant & Finance ──
  {
    id: "fixed_income",
    title: "Fixed-Income Analytics Library",
    group: "Quant & Finance",
    desc: "Python library for OIS curve bootstrapping, bond/swap/FRA pricing, and DV01/key-rate sensitivities; Black-76 swaption pricing, SABR calibration, and a Hull-White model for Bermudan swaptions.",
    tech: ["Python", "SABR", "Hull-White"],
  },
  {
    id: "mortgage_prepayment",
    title: "Mortgage Prepayment Risk",
    group: "Quant & Finance",
    desc: "XGBoost model on the Freddie Mac loan-level dataset predicting prepayment probability across 1M+ records, AUC 0.78 for valuation and risk-assessment.",
    tech: ["Python", "XGBoost"],
  },
  {
    id: "credit_risk_pd",
    title: "Credit-Risk PD Model",
    group: "Quant & Finance",
    desc: "XGBoost probability-of-default model on public loan-level data, with a Shapley-value framework decomposing forecast gaps across PD/EAD/LGD and dashboards for portfolio risk and stress scenarios.",
    tech: ["Python", "XGBoost", "SHAP"],
  },
  {
    id: "give_me_credit",
    title: "Explainable Federated Risk Model",
    group: "Quant & Finance",
    desc: "Financial-distress prediction with SHAP and Owen-value decomposition, simulating cross-silo federated learning (U.S. states as silos) on FINRA data to preserve privacy while holding accuracy.",
    tech: ["Python", "SHAP", "Federated learning"],
  },
  {
    id: "financial_resilience",
    title: "Financial Resilience Simulation",
    group: "Quant & Finance",
    desc: "Agent-based simulation modeling the impact of income shocks on household mortgage defaults, evaluating financial-assistance products for product strategy.",
    tech: ["Python", "Agent-based modeling"],
  },
  // ── Data & Analytics ──
  {
    id: "big_data_sentiment",
    title: "Big-Data Sentiment Pipeline",
    group: "Data & Analytics",
    desc: "Spark/PySpark ETL on an AWS EC2 cluster for word-count and sentiment over a 9GB+ Yelp corpus, loading features into Hive with a Tableau dashboard of sentiment and geographic trends.",
    tech: ["Spark", "PySpark", "Hive", "AWS", "Tableau"],
  },
  {
    id: "pyspark_segmentation",
    title: "Customer Segmentation & Pricing",
    group: "Data & Analytics",
    desc: "Processed 10M+ transaction records in PySpark, engineered behavioral features, applied K-Means + PCA for personas, and built a price-elasticity model with an interactive Tableau dashboard.",
    tech: ["PySpark", "K-Means", "PCA", "Tableau"],
  },
];

export type SkillGroup = { label: string; items: string[] };

export const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: ["C", "C++17", "Rust", "Python", "Go", "Java", "TypeScript", "Julia"],
  },
  {
    label: "Systems & Kernel",
    items: [
      "Linux kernel",
      "eBPF / XDP",
      "cgroups",
      "fanotify",
      "virtual memory",
      "Kata Containers",
      "ARM CCA (Realms)",
      "CoW memory",
      "CUDA",
    ],
  },
  {
    label: "Build & CI/CD",
    items: ["Bazel (hermetic / remote cache)", "GitLab CI", "ArgoCD", "Terraform", "SaltStack"],
  },
  {
    label: "Backend & APIs",
    items: ["FastAPI", "NestJS", "Node.js", "REST APIs", "client SDKs", "BullMQ"],
  },
  {
    label: "Infra & Data",
    items: ["Kubernetes", "Helm", "Docker", "KVM / QEMU", "Azure / AKS", "PostgreSQL (RLS)", "Redis", "Kafka"],
  },
  {
    label: "ML",
    items: ["PyTorch", "BERT / RoBERTa", "CNNs", "XGBoost", "K-Means / PCA", "SHAP / Owen values", "federated learning"],
  },
  {
    label: "Observability",
    items: ["Prometheus", "Grafana", "Datadog", "ELK", "Signoz", "perf", "iperf3", "bpftool"],
  },
];

// Personal claims kept from the original site (true, not in the résumé library).
export const marsRover = {
  id: "rover",
  title: "Rudra Mars Rover Team",
  summary:
    "Led SLAM development for a competition Mars rover under real-world constraints where reliability, performance, and rapid debugging were critical.",
  detail:
    "As part of the Rudra Mars Rover Team, I led the development of SLAM algorithms for autonomous navigation on rough terrain, the kind of hard-real-world engineering (sensor noise, tight compute, no room for flaky code) that pulled me toward systems work.",
  tech: ["SLAM", "Robotics", "C++", "Python"],
};

// Per-chapter logo + concise, scannable highlight bullets (denser than the
// full résumé bullets above). `logo` is an image path, or null → monogram badge.
export type ChapterExtra = {
  logo: string | null;
  mono?: string;
  monoColor?: string;
  highlights: string[];
};

export const chapterExtras: Record<string, ChapterExtra> = {
  srm: {
    logo: "/logos/srm.svg",
    mono: "SRM",
    monoColor: "#ffd15c",
    highlights: [
      "B.Tech in CS & Big Data Analytics",
      "Dean's Scholarship · First Class with Distinction",
      "Published ICRTDA-157 (plant-seedling CNN)",
    ],
  },
  rover: {
    logo: "/logos/rudra.png",
    mono: "R",
    monoColor: "#e0653b",
    highlights: [
      "Autonomous navigation + localization on rough terrain",
      "Real-time perception under sensor noise + tight compute",
      "Built for reliability where flaky code isn't an option",
    ],
  },
  cern: {
    logo: "/logos/cern.png",
    highlights: [
      "podio → Julia code-generation for HEP data pipelines",
      "Jinja2 / YAML template-driven bindings",
      "Benchmarked Julia vs C++ for performance parity",
    ],
  },
  samsung: {
    logo: "/logos/samsung.svg",
    highlights: [
      "LSTM / RNN / BERT / RoBERTa classifier in PyTorch",
      "Trained on scraped + BERT-augmented text across domains",
    ],
  },
  maximl: {
    logo: "/logos/maximl.png",
    highlights: [
      "Postgres row-level multi-tenancy — zero cross-tenant data leaks",
      "Query + index tuning: p99 API latency 450ms → 150ms",
      "GitLab CI/CD + ArgoCD; test coverage 40% → 90%",
    ],
  },
  columbia: {
    logo: "/logos/columbia.png",
    mono: "Co",
    monoColor: "#7ab8ff",
    highlights: [
      "Multi-threaded fork syscall replicating memory + FDs via CoW",
      "Fork latency measured with custom eBPF hooks",
      "Extending forking to ARM CCA confidential-compute Realms",
    ],
  },
  cloudflare: {
    logo: "/logos/cloudflare.svg",
    highlights: [
      "Hot-path eBPF program with lock-free per-CPU counters",
      "Merged to production; rolling toward all Cloudflare traffic",
      "Split privileged/unprivileged design, shared wire-contract crate",
      "Migrated build to hermetic Bazel + remote cache, CI 8m → <1m",
    ],
  },
};

// Logo strip shown in the hero ("the journey, in one line").
export const heroLogos = [
  { src: "/logos/cloudflare.svg", label: "Cloudflare" },
  { src: "/logos/columbia.png", label: "Columbia" },
  { src: "/logos/maximl.png", label: "Maximl" },
  { src: "/logos/samsung.svg", label: "Samsung" },
  { src: "/logos/cern.png", label: "CERN" },
];

export const about = {
  tldr: [
    "I'm an M.S. CS student at Columbia focused on systems, operating systems, and scalable infrastructure. I like working close to the metal, understanding how kernels behave, how networks fail, and how systems get faster and more reliable.",
    "I've worked across research, industry, and open source: from SLAM on a Mars-rover team, to scientific computing at CERN (Google Summer of Code), to shipping backend infra at Maximl, to per-cgroup eBPF accounting on Cloudflare's edge.",
    `Currently looking for ${profile.seeking}, reach out!`,
  ],
  story: [
    "I've been drawn to computing since childhood, not just using technology but understanding how it works inside. I spent a lot of time taking hardware apart and experimenting with operating systems, which pushed me toward systems-level thinking early.",
    "That curiosity shaped my path. I finished my undergrad in CS with a 9.56/10 GPA and a Dean's Scholarship for academic excellence, gravitating toward Operating Systems, Design & Analysis of Algorithms, and Digital Image Processing.",
    "My interest in applied systems grew through hands-on work. On the Rudra Mars Rover Team I led SLAM development under real-world constraints where reliability and performance mattered. Along the way, exploring cybersecurity, including finding vulnerabilities in ISP networks, shaped how I think about robustness and security.",
    "At Columbia I've done some of the most demanding coursework in the program (Operating Systems, Computer Networks, NLP) and research in the Software Systems Lab on kernel container forking. The through-line: build software that's efficient, secure, and reliable, and keep getting closer to the metal.",
  ],
  goals: [
    "Strengthen fundamentals in systems, competitive programming, and system design",
    "Contribute meaningful research and open-source work",
    "Build software that's efficient, secure, and reliable",
    "Get fitter",
  ],
};
