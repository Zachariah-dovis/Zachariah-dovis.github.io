const posts = [
  {
    title: "Does Everyday Logical Reasoning Operate Over Formal Logic After Implicature Processing",
    date: "April 4, 2026",
    edited: "May 13, 2026",
    tag: "Essay",
    topic: "Reasoning",
    excerpt: "A research note on whether everyday reasoning diverges from formal logic because of pragmatic implicatures, using the Linda problem as a test case.",
    url: "https://zoryzhang.notion.site/Does-Everyday-Logical-Reasoning-Operate-Over-Formal-Logic-After-Implicature-Processing-3389e9579bec808d9adbf1e558b66e3b?pvs=21"
  },
  {
    title: "What Kinds of Correlation Can Be Equal to Causation?",
    date: "March 15, 2026",
    edited: "March 29, 2026",
    tag: "Essay",
    topic: "Causality",
    excerpt: "A proposal on second-order correlation learning and how children may encode object-level and feature-level co-occurrence differently.",
    url: "https://zoryzhang.notion.site/What-Kinds-of-Correlation-Can-Be-Equal-to-Causation-3249e9579bec800283e2da3c314a4f28?pvs=21"
  },
  {
    title: "Revision of Attributed False-Belief in Great Apes and Infants",
    date: "December 13, 2025",
    edited: "March 24, 2026",
    tag: "Essay",
    topic: "Cognitive development",
    excerpt: "A research proposal comparing great apes and 18-month-olds on whether they can revise attributed false beliefs when given new evidence.",
    url: "https://zoryzhang.notion.site/Revision-of-Attributed-False-Belief-in-Great-Apes-and-Infants-2c89e9579bec80669684ca42be4862b5?pvs=21"
  },
  {
    title: "Cultural Relativism is the Wrong Metaethical Theory",
    date: "December 10, 2024",
    edited: "December 15, 2024",
    tag: "Essay",
    topic: "Philosophy",
    excerpt: "A philosophy essay on cultural relativism as a metaethical theory and why it may fail as an account of moral truth.",
    url: "https://zoryzhang.notion.site/Cultural-Relativism-is-the-Wrong-Metaethical-Theory-1589e9579bec8033b61ddfc5f921607f?pvs=21"
  },
  {
    title: "The Effect of ADHD on Disfluency: a Case Study",
    date: "December 2, 2024",
    edited: "December 11, 2024",
    tag: "Tech Report",
    topic: "Language",
    excerpt: "A case study comparing spontaneous speech disfluencies under medication and no-medication conditions, with transcript coding and analysis.",
    url: "https://zoryzhang.notion.site/The-Effect-of-ADHD-on-Disfluency-a-Case-Study-1509e9579bec80178dced547fc93324a?pvs=21"
  },
  {
    title: "The Cause of the Universe Need not be Personal",
    date: "November 10, 2024",
    edited: "November 10, 2024",
    tag: "Essay",
    topic: "Philosophy",
    excerpt: "An argument challenging the claim that the cause of the universe, if it exists, must be personal in the sense required by the Kalam cosmological argument.",
    url: "https://zoryzhang.notion.site/The-Cause-of-the-Universe-Need-not-be-Personal-13a9e9579bec802280becc9b97527ab6?pvs=21"
  },
  {
    title: "The Brain is not the Mind",
    date: "October 12, 2024",
    edited: "February 1, 2025",
    tag: "Essay",
    topic: "Mind",
    excerpt: "A philosophical essay on the relation between brain and mind, preserved from the original blog index.",
    url: "https://zoryzhang.notion.site/The-Brain-is-not-the-Mind-11d9e9579bec803bbc07f354e47db55e?pvs=21"
  },
  {
    title: "Computational Aspects of Cobweb: a Human-like Category Learning Algorithm",
    date: "May 30, 2024",
    edited: "December 10, 2024",
    tag: "Tech Report",
    topic: "Learning algorithms",
    excerpt: "A technical reading note on Cobweb, category utility, category representation, and why incremental human-like category learning matters.",
    url: "https://zoryzhang.notion.site/Computational-Aspects-of-Cobweb-a-Human-like-Category-Learning-Algorithm-7d4a78c295e446869a78c10cae18edc0?pvs=21"
  },
  {
    title: "My 2023 in Academia",
    date: "December 31, 2023",
    edited: "December 10, 2024",
    tag: "Blog",
    topic: "Reflection",
    excerpt: "A reflective note on the path into AI2Reason, reasoning, machine-assisted proof, and academic exploration in 2023.",
    url: "https://zoryzhang.notion.site/My-2023-in-Academia-40d0affa534643338355c65a5596ce0f?pvs=21"
  },
  {
    title: "What We Talk About When We Talk About AI2Reason (2/n)",
    date: "December 18, 2023",
    edited: "January 14, 2024",
    tag: "Pitch",
    topic: "AI2Reason",
    excerpt: "A presentation-style update on the long-term vision of AI2Reason: what it is, why it matters, why it is hard, and what comes next.",
    url: "https://zoryzhang.notion.site/What-We-Talk-About-When-We-Talk-About-AI2Reason-2-n-97d5a9276298432991017b6d6e24d0ae?pvs=21"
  },
  {
    title: "Humans are Unconsciously Illogical",
    date: "December 9, 2023",
    edited: "January 1, 2024",
    tag: "Essay",
    topic: "Reasoning",
    excerpt: "A cognitive science essay arguing that humans are sometimes unaware of whether their cognitive products align with classical first-order logic.",
    url: "https://zoryzhang.notion.site/Humans-are-Unconsciously-Illogical-4fdbad16b3c74ddeb25e8832432b0e41?pvs=21"
  },
  {
    title: "Collaboration",
    date: "December 2, 2023",
    edited: "December 10, 2024",
    tag: "Blog",
    topic: "Research practice",
    excerpt: "Default collaboration principles, authorship expectations, task ownership, and reflections on interdisciplinary collaboration.",
    url: "https://zoryzhang.notion.site/Collaboration-bb7cba671f7a4ed2945256e7900c79fd?pvs=21"
  },
  {
    title: "What We Talk About When We Talk About AI2Reason (1/n)",
    date: "August 2, 2023",
    edited: "January 1, 2024",
    tag: "Pitch",
    topic: "AI2Reason",
    excerpt: "An early statement of AI2Reason: why reasoning matters for intelligence and why machine learning may still play a role in reasoning machines.",
    url: "https://zoryzhang.notion.site/What-We-Talk-About-When-We-Talk-About-AI2Reason-1-n-4f63949d8adb4a7e90d8caa9612ce903?pvs=21"
  },
  {
    title: "SubgraphGNNs All at Once",
    date: "March 19, 2023",
    edited: "February 7, 2026",
    tag: "Tech Report",
    topic: "Graph neural networks",
    excerpt: "A technical note on SubgraphGNNs, their design space, expressiveness hierarchy, and applications.",
    url: "https://zoryzhang.notion.site/SubgraphGNNs-All-at-Once-3941a69b496b462d99a2ee0917414981?pvs=21"
  }
];

const grid = document.querySelector("#blogGrid");
const searchInput = document.querySelector("#searchInput");
const filterButtons = [...document.querySelectorAll(".filter")];
const emptyState = document.querySelector("#emptyState");
const year = document.querySelector("#year");
let activeFilter = "all";

year.textContent = new Date().getFullYear();

function renderPosts() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = posts.filter((post) => {
    const haystack = `${post.title} ${post.tag} ${post.topic} ${post.excerpt}`.toLowerCase();
    const matchesSearch = !query || haystack.includes(query);
    const matchesFilter = activeFilter === "all" || post.tag === activeFilter;
    return matchesSearch && matchesFilter;
  });

  grid.innerHTML = filtered
    .map((post) => `
      <article class="post-card">
        <div class="post-meta">
          <span class="tag">${post.tag}</span>
          <span>${post.date}</span>
          <span>·</span>
          <span>${post.topic}</span>
        </div>
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
        <a class="post-link" href="${post.url}" target="_blank" rel="noopener">Read original</a>
      </article>
    `)
    .join("");

  emptyState.hidden = filtered.length !== 0;
}

searchInput.addEventListener("input", renderPosts);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((btn) => btn.classList.toggle("active", btn === button));
    renderPosts();
  });
});

renderPosts();
