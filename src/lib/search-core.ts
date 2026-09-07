export type SearchPost = {
  title: string;
  description: string;
  category: string;
  tags: string[];
  body: string;
  date: string;
  path: string;
};

export function normalizeSearchText(value: unknown) {
  return String(value ?? "").normalize("NFKC").toLocaleLowerCase().replace(/\s+/g, " ").trim();
}

export function tokenizeSearchQuery(query: string) {
  const normalized = normalizeSearchText(query);
  if (!normalized) return [];
  const terms: string[] = [];
  for (const match of normalized.matchAll(/"([^"]+)"|(\S+)/g)) {
    const term = (match[1] || match[2]).trim();
    if (term && !terms.includes(term)) terms.push(term);
  }
  return terms;
}

function matchCount(text: string, term: string) {
  let count = 0;
  let position = 0;
  while (count < 8 && (position = text.indexOf(term, position)) !== -1) {
    count += 1;
    position += Math.max(term.length, 1);
  }
  return count;
}

function scorePost(post: SearchPost, terms: string[], normalizedQuery: string) {
  const fields = {
    title: normalizeSearchText(post.title),
    description: normalizeSearchText(post.description),
    category: normalizeSearchText(post.category),
    tags: normalizeSearchText(post.tags.join(" ")),
    body: normalizeSearchText(post.body)
  };
  let score = 0;
  for (const term of terms) {
    const matches = {
      title: matchCount(fields.title, term), description: matchCount(fields.description, term),
      category: matchCount(fields.category, term), tags: matchCount(fields.tags, term), body: matchCount(fields.body, term)
    };
    if (!Object.values(matches).some(Boolean)) return -1;
    score += matches.title * 32 + matches.tags * 18 + matches.category * 14 + matches.description * 9 + matches.body * 2;
    if (fields.title.startsWith(term)) score += 12;
  }
  if (fields.title === normalizedQuery) score += 80;
  else if (fields.title.includes(normalizedQuery)) score += 36;
  if (fields.description.includes(normalizedQuery)) score += 14;
  if (fields.body.includes(normalizedQuery)) score += 5;
  return score;
}

export function searchPosts(posts: SearchPost[], query: string) {
  const terms = tokenizeSearchQuery(query);
  if (!terms.length) return [];
  const normalizedQuery = normalizeSearchText(query);
  return posts.map((post, order) => ({ post, order, score: scorePost(post, terms, normalizedQuery) }))
    .filter((result) => result.score >= 0)
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map((result) => result.post);
}

function findExcerptAnchor(source: string, terms: string[]) {
  const normalized = normalizeSearchText(source);
  let bestPosition = -1;
  let bestNearbyTerms = -1;
  for (const term of terms) {
    let position = normalized.indexOf(term);
    while (position !== -1) {
      const start = Math.max(0, position - 70);
      const end = position + 110;
      const nearbyTerms = terms.filter((candidate) => {
        const candidatePosition = normalized.indexOf(candidate, start);
        return candidatePosition !== -1 && candidatePosition <= end;
      }).length;
      if (nearbyTerms > bestNearbyTerms || (nearbyTerms === bestNearbyTerms && (bestPosition === -1 || position < bestPosition))) {
        bestPosition = position;
        bestNearbyTerms = nearbyTerms;
      }
      position = normalized.indexOf(term, position + Math.max(term.length, 1));
    }
  }
  return bestPosition;
}

export function createSearchExcerpt(post: SearchPost, terms: string[], maxLength = 150) {
  const bodyAnchor = findExcerptAnchor(post.body, terms);
  const fromBody = bodyAnchor >= 0;
  const source = fromBody ? post.body : post.description;
  const anchor = fromBody ? bodyAnchor : Math.max(findExcerptAnchor(source, terms), 0);
  if (!source) return { text: "", fromBody: false };
  if (source.length <= maxLength) return { text: source, fromBody };
  let start = Math.max(0, anchor - Math.floor(maxLength * .38));
  let end = Math.min(source.length, start + maxLength);
  start = Math.max(0, end - maxLength);
  const text = source.slice(start, end).trim();
  return { text: `${start > 0 ? "…" : ""}${text}${end < source.length ? "…" : ""}`, fromBody };
}
