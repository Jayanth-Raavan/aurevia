export type Capability = {
  id: string;
  title: string;
  statement: string;
  description: string;
  services: string[];
};

export const capabilities: Capability[] = [
  {
    id: "01",
    title: "Strategy & Transformation",
    statement: "Choosing what matters.",
    description: "Make consequential choices with a view of the whole system, from where to compete to how change actually happens.",
    services: ["Growth strategy", "Operating models", "Transformation programs", "Market entry", "Portfolio strategy"],
  },
  {
    id: "02",
    title: "Digital & Technology",
    statement: "Technology with direction.",
    description: "Connect digital investment to the outcomes it needs to create, and build the conditions to sustain it.",
    services: ["Digital strategy", "Enterprise modernization", "AI readiness", "Data strategy", "Cloud transformation", "Customer experience"],
  },
  {
    id: "03",
    title: "Operations",
    statement: "Make complex systems move.",
    description: "Design the processes, decisions and connections that help an organization perform as one.",
    services: ["Process transformation", "Operating efficiency", "Supply-chain strategy", "Service transformation", "Performance management"],
  },
  {
    id: "04",
    title: "Risk & Resilience",
    statement: "Ready before it matters.",
    description: "Anticipate disruption, strengthen critical systems and create more options for the moments that count.",
    services: ["Enterprise risk", "Cyber strategy", "Operational resilience", "Regulatory transformation", "Business continuity"],
  },
  {
    id: "05",
    title: "Finance & Performance",
    statement: "Performance into momentum.",
    description: "Give leaders a clearer picture of value and the ability to act on it with discipline.",
    services: ["Financial transformation", "Performance strategy", "Cost optimization", "Capital allocation", "Growth planning"],
  },
];
