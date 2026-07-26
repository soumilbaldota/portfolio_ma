// Tech-stack logo rows per chapter. Icons live in /public/logos/tech (dark
// fill, shown on white chips → readable in light and dark mode). Anything
// without a brand icon falls back to a short monogram chip.
const ic = (slug: string) => `/logos/tech/${slug}.svg`;

export type Tech = { label: string; icon?: string; mono?: string };

const T = {
  rust: { label: "Rust", icon: ic("rust") },
  ebpf: { label: "eBPF", icon: ic("ebpf") },
  c: { label: "C", icon: ic("c") },
  cpp: { label: "C++", icon: ic("cplusplus") },
  linux: { label: "Linux", icon: ic("linux") },
  cgroups: { label: "cgroups", mono: "cg" },
  bazel: { label: "Bazel", icon: ic("bazel") },
  qemu: { label: "QEMU", icon: ic("qemu") },
  prometheus: { label: "Prometheus", icon: ic("prometheus") },
  grafana: { label: "Grafana", icon: ic("grafana") },
  terraform: { label: "Terraform", icon: ic("terraform") },
  salt: { label: "SaltStack", icon: "/logos/tech/salt.svg" },
  docker: { label: "Docker", icon: ic("docker") },
  kata: { label: "Kata Containers", icon: ic("kata") },
  arm: { label: "ARM CCA", icon: ic("arm") },
  pytorch: { label: "PyTorch", icon: ic("pytorch") },
  hf: { label: "Hugging Face", icon: ic("huggingface") },
  bert: { label: "BERT / RoBERTa", mono: "BERT" },
  julia: { label: "Julia", icon: ic("julia") },
  python: { label: "Python", icon: ic("python") },
  nest: { label: "NestJS", icon: ic("nestjs") },
  node: { label: "Node.js", icon: ic("nodedotjs") },
  fastapi: { label: "FastAPI", icon: ic("fastapi") },
  postgres: { label: "PostgreSQL", icon: ic("postgresql") },
  redis: { label: "Redis", icon: ic("redis") },
  bullmq: { label: "BullMQ", icon: ic("bullmq") },
  k8s: { label: "Kubernetes", icon: ic("kubernetes") },
  helm: { label: "Helm", icon: ic("helm") },
  argo: { label: "ArgoCD", icon: ic("argo") },
  azure: { label: "Azure", icon: ic("azure") },
  gitlab: { label: "GitLab", icon: ic("gitlab") },
  datadog: { label: "Datadog", icon: ic("datadog") },
  spark: { label: "Spark", icon: ic("apachespark") },
  cuda: { label: "CUDA", icon: ic("nvidia") },
  ros: { label: "ROS", mono: "ROS" },
} satisfies Record<string, Tech>;

export const stacks: Record<string, Tech[]> = {
  srm: [T.python, T.pytorch, T.cpp, T.c],
  rover: [T.cpp, T.python, T.ros, T.cuda],
  cern: [T.julia, T.cpp, T.python],
  samsung: [T.pytorch, T.python, T.hf, T.bert],
  maximl: [
    T.nest,
    T.node,
    T.fastapi,
    T.postgres,
    T.redis,
    T.k8s,
    T.helm,
    T.argo,
    T.azure,
    T.gitlab,
    T.datadog,
  ],
  columbia: [T.linux, T.kata, T.ebpf, T.arm, T.c, T.docker],
  cloudflare: [
    T.rust,
    T.ebpf,
    T.c,
    T.linux,
    T.cgroups,
    T.bazel,
    T.qemu,
    T.prometheus,
    T.grafana,
    T.terraform,
    T.salt,
    T.docker,
  ],
};

export function TechRow({ items }: { items: Tech[] }) {
  return (
    <div className="techrow" aria-label="Tech stack">
      {items.map((t) =>
        t.icon ? (
          <span className="tech" title={t.label} key={t.label}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={t.icon} alt={t.label} />
          </span>
        ) : (
          <span className="tech tech--mono" title={t.label} key={t.label}>
            {t.mono ?? t.label}
          </span>
        )
      )}
    </div>
  );
}
