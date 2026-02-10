export interface Flashcard {
  id: string;
  category: "Prompting" | "Models" | "RAG" | "Evaluation" | "UX/UI" | "Frontend" | "Product" | "Shipping";
  term: string;
  definition: string;
  example?: string;
}


export const flashcards: Flashcard[] = [
  // Prompting
  {
    id: "prompt-001",
    category: "Prompting",
    term: "Prompt Template",
    definition: "A reusable prompt pattern that frames user intent, context, and desired output shape to improve model responses.",
    example: "Use a template: 'You are an expert X. Given input {input}, produce a concise summary with steps.'"
  },
  {
    id: "prompt-002",
    category: "Prompting",
    term: "Chain-of-Thought Prompting",
    definition: "Encouraging the model to 'think aloud' by prompting step-by-step reasoning, improving multi-step problem performance.",
    example: "Ask the model to list steps before answering arithmetic or logic questions."
  },
  {
    id: "prompt-003",
    category: "Prompting",
    term: "Few-shot Prompting",
    definition: "Providing a few example input/output pairs in the prompt to bias the model toward a desired format or style.",
    example: "Include 3 example Q&A pairs to show desired output structure."
  },
  {
    id: "prompt-004",
    category: "Prompting",
    term: "Role Prompting",
    definition: "Assigning the model a role (e.g., 'You are an expert designer') to shape tone and expertise in responses.",
    example: "Start with 'You are a senior product designer' to get design-oriented answers."
  },

  // Models
  {
    id: "model-001",
    category: "Models",
    term: "Temperature",
    definition: "A sampling parameter that controls randomness: lower values make outputs deterministic, higher values increase creativity.",
    example: "Temperature 0.0 → deterministic; 0.8 → more varied outputs."
  },
  {
    id: "model-002",
    category: "Models",
    term: "Context Window",
    definition: "The amount of input (tokens) a model can attend to; larger windows allow longer conversations or more context for RAG.",
    example: "Use a model with a larger window to enable multi-document retrieval without truncation."
  },
  {
    id: "model-003",
    category: "Models",
    term: "Fine-tuning",
    definition: "Training a model on task-specific data to improve performance on a narrow domain or style.",
    example: "Fine-tune on labeled customer support replies to improve response accuracy."
  },
  {
    id: "model-004",
    category: "Models",
    term: "Parameter-efficient Tuning (LoRA)",
    definition: "Techniques like LoRA that adapt large models with a small number of additional parameters to save cost and training time.",
    example: "Use LoRA layers to adapt a base model to a specialized domain without full fine-tuning."
  },

  // RAG
  {
    id: "rag-001",
    category: "RAG",
    term: "Vector Store",
    definition: "A database of embeddings that enables efficient similarity search for retrieval-augmented generation (RAG).",
    example: "Embed docs and query with cosine similarity to find relevant chunks for the model."
  },
  {
    id: "rag-002",
    category: "RAG",
    term: "Chunking",
    definition: "Splitting source documents into retrievable chunks that balance semantic coherence with size limits for embedding.",
    example: "Chunk by sections or paragraphs and include overlap for context continuity."
  },
  {
    id: "rag-003",
    category: "RAG",
    term: "Retrieval Strategy",
    definition: "Choosing how to retrieve candidate contexts (top-k, hybrid, or reranking) to balance recall and precision for generation.",
    example: "Combine sparse token matching with embedding similarity to improve recall."
  },
  {
    id: "rag-004",
    category: "RAG",
    term: "Hallucination Mitigation",
    definition: "Strategies (source attribution, conservative prompting, grounding) to reduce unsupported model assertions.",
    example: "Attach retrieved docs and ask the model to cite sources for factual claims."
  },

  // Evaluation
  {
    id: "eval-001",
    category: "Evaluation",
    term: "Human Evaluation",
    definition: "Using human raters to score outputs on relevance, correctness, and safety—still the gold standard for many tasks.",
    example: "Collect Likert-scale ratings on helpfulness and factuality for model outputs."
  },
  {
    id: "eval-002",
    category: "Evaluation",
    term: "Automated Metrics",
    definition: "Programmatic measures (BLEU, ROUGE, embedding similarity) provide quick signals but can be gamed and are task-specific.",
    example: "Use embedding-based similarity for semantic match rather than literal token overlap."
  },
  {
    id: "eval-003",
    category: "Evaluation",
    term: "A/B Testing Outputs",
    definition: "Running experiments with different prompt variants or model params to measure user preference or task success.",
    example: "Compare two prompt variants in production for CTR and task completion rate."
  },
  {
    id: "eval-004",
    category: "Evaluation",
    term: "Quality Rubrics",
    definition: "Structured checklists and scoring guidelines for consistent human evaluation of model outputs.",
    example: "Use a rubric that scores relevance, correctness, and clarity on a 1–5 scale."
  },

  // UX/UI
  {
    id: "ux-001",
    category: "UX/UI",
    term: "Prompt UX",
    definition: "Designing user-facing prompt interfaces that guide users to provide high-quality intent and context for models.",
    example: "Progressive reveal of prompt scaffolding helps new users provide useful context without cognitive overload."
  },
  {
    id: "ux-002",
    category: "UX/UI",
    term: "Progressive Disclosure",
    definition: "Show only necessary input fields initially and reveal advanced options as users need them to reduce friction.",
    example: "Hide expert-only model tuning options behind an 'Advanced' toggle."
  },
  {
    id: "ux-003",
    category: "UX/UI",
    term: "Microcopy for Prompts",
    definition: "Small, contextual text that clarifies intent or shows examples to help users craft better prompts.",
    example: "Add a short example placeholder next to input fields showing ideal input format."
  },
  {
    id: "ux-004",
    category: "UX/UI",
    term: "Error States for LLMs",
    definition: "Designing clear, helpful messages for model failures (rate limits, hallucination, empty results) that guide recovery.",
    example: "Offer a 'try again' with simplified context when a response is incoherent."
  },

  // Frontend
  {
    id: "front-001",
    category: "Frontend",
    term: "Hydration",
    definition: "Process of attaching client-side JavaScript to server-rendered HTML to enable interactivity with minimal initial payload.",
    example: "Use partial hydration for large pages to reduce JS while keeping key interactions interactive."
  },
  {
    id: "front-002",
    category: "Frontend",
    term: "SSR vs CSR",
    definition: "Server-Side Rendering (SSR) generates HTML on server for fast first paint; Client-Side Rendering (CSR) relies on the client to render UI.",
    example: "SSR helps SEO and perceived speed; CSR can be more dynamic once hydrated."
  },
  {
    id: "front-003",
    category: "Frontend",
    term: "Client-side Caching",
    definition: "Caching recent retrieval results or embeddings on the client to reduce latency and duplicate requests.",
    example: "Cache retrieved context for the duration of a session to avoid re-fetching embeddings."
  },
  {
    id: "front-004",
    category: "Frontend",
    term: "Optimistic UI",
    definition: "Update the UI immediately on user action while the network call is pending, with rollback on failure.",
    example: "Show the expected model response immediately and reconcile when the final output arrives."
  },

  // Product
  {
    id: "prod-001",
    category: "Product",
    term: "MVP vs MLP",
    definition: "MVP (Minimum Viable Product) focuses on minimal functionality; MLP (Minimum Lovable Product) aims for usability and delight.",
    example: "Ship an MLP for consumer-facing features to improve adoption."
  },
  {
    id: "prod-002",
    category: "Product",
    term: "Metrics",
    definition: "Key product metrics (e.g., DAU, retention, task success) that indicate feature impact and health.",
    example: "Track task completion rate for a prompt UX to measure effectiveness."
  },
  {
    id: "prod-003",
    category: "Product",
    term: "Roadmap Prioritization",
    definition: "Balancing impact, effort, and strategic alignment to prioritize which features to build first.",
    example: "Use ICE (Impact, Confidence, Effort) scoring to rank initiatives."
  },
  {
    id: "prod-004",
    category: "Product",
    term: "OKRs",
    definition: "Objectives and Key Results to align team goals with measurable outcomes.",
    example: "Set a key result to improve prompt completion accuracy from 80% to 90%."
  },

  // Shipping
  {
    id: "ship-001",
    category: "Shipping",
    term: "Canary Deployment",
    definition: "Gradually rolling out changes to a subset of users to monitor for regressions before full release.",
    example: "Release to 5% of users and monitor errors and user feedback."
  },
  {
    id: "ship-002",
    category: "Shipping",
    term: "Monitoring & Observability",
    definition: "Instrumenting systems to capture logs, metrics, and traces to detect issues and measure performance.",
    example: "Set up dashboards for latency, error rate, and model-quality alerts."
  },
  {
    id: "ship-003",
    category: "Shipping",
    term: "Feature Flags",
    definition: "Gate features to subsets of users so changes can be rolled out gradually and tested in production.",
    example: "Enable new prompt UI for 10% of users before a full rollout."
  },
  {
    id: "ship-004",
    category: "Shipping",
    term: "Rollback Strategies",
    definition: "Planning safe rollbacks and quick mitigations for model or feature regressions in production.",
    example: "Keep a stable model endpoint and switch traffic back on error detection."
  }
];

