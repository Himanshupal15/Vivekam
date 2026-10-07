import { TeachingRecord, VERIFIED_TEACHINGS } from '../data/teachings';

const normalizeWords = (value: string): string[] =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

function containsWordSequence(source: string[], phrase: string[]): boolean {
  if (phrase.length === 0 || phrase.length > source.length) return false;

  for (let start = 0; start <= source.length - phrase.length; start += 1) {
    if (phrase.every((word, index) => source[start + index] === word)) return true;
  }
  return false;
}

export function findTeachingQuoteMatch(
  input: string,
  teachings: TeachingRecord[] = VERIFIED_TEACHINGS
): TeachingRecord | undefined {
  const query = normalizeWords(input);
  if (query.length === 0) return undefined;

  return teachings.find((teaching) => {
    const quote = normalizeWords(teaching.teaching);
    const isExactQuote = query.length === quote.length && containsWordSequence(quote, query);
    if (isExactQuote) return true;

    // Require a substantial, contiguous quote excerpt; titles and tags are not quotes.
    const excerpt = query.length < quote.length ? query : quote;
    const source = query.length < quote.length ? quote : query;
    return excerpt.length >= 4 && excerpt.join(' ').length >= 20 && containsWordSequence(source, excerpt);
  });
}
