const POST_IMAGES: Record<string, string> = {
  "how-to-start-programming-2026": "/images/blog/start-programming.webp",
  "will-ai-take-jobs-bangladesh": "/images/blog/ai-jobs.webp",
  "first-client-freelancing": "/images/blog/first-client.webp",
  "why-learn-git": "/images/blog/git-collaboration.webp",
};

export function postImage(slug: string): string {
  return POST_IMAGES[slug] ?? "";
}
