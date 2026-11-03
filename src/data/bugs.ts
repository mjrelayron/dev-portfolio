// Bug Hunter snippets. Generic, textbook bugs — not claims about anyone's code.
// Each snippet has exactly one buggy line (`bug` is a 0-based line index).
export type BugLang = 'JavaScript' | 'React' | 'Python' | 'SQL';

export interface BugSnippet {
  id: string;
  lang: BugLang;
  title: string;
  /** what the code is supposed to do */
  goal: string;
  code: string[];
  bug: number;
  explanation: string;
  fix: string;
}

export const bugs: BugSnippet[] = [
  {
    id: 'off-by-one',
    lang: 'JavaScript',
    title: 'Sum the scores',
    goal: 'Return the total of every score in the array.',
    code: [
      'function sumScores(scores) {',
      '  let total = 0;',
      '  for (let i = 0; i <= scores.length; i++) {',
      '    total += scores[i];',
      '  }',
      '  return total;',
      '}',
    ],
    bug: 2,
    explanation: '`<=` runs one step past the end. `scores[scores.length]` is `undefined`, and `total + undefined` turns the whole sum into `NaN`.',
    fix: 'for (let i = 0; i < scores.length; i++) {',
  },
  {
    id: 'effect-deps',
    lang: 'React',
    title: 'Search as you type',
    goal: 'Fetch new results whenever the query prop changes.',
    code: [
      'function SearchResults({ query }) {',
      '  const [results, setResults] = useState([]);',
      '  useEffect(() => {',
      '    fetch(`/api/search?q=${query}`)',
      '      .then((res) => res.json())',
      '      .then(setResults);',
      '  }, []);',
      '  return <List items={results} />;',
      '}',
    ],
    bug: 6,
    explanation: 'An empty dependency array runs the effect only once, on mount. When `query` changes the component keeps showing results for the first query.',
    fix: '  }, [query]);',
  },
  {
    id: 'onclick-call',
    lang: 'React',
    title: 'Delete button',
    goal: 'Delete the item when the button is clicked.',
    code: [
      'function DeleteButton({ id, onDelete }) {',
      '  return (',
      '    <button type="button" onClick={onDelete(id)}>',
      '      Delete',
      '    </button>',
      '  );',
      '}',
    ],
    bug: 2,
    explanation: '`onDelete(id)` is called during render, so every item deletes itself as soon as it appears. `onClick` needs a function, not the result of calling one.',
    fix: '    <button type="button" onClick={() => onDelete(id)}>',
  },
  {
    id: 'foreach-async',
    lang: 'JavaScript',
    title: 'Save every user',
    goal: 'Save all users, then log once they are all stored.',
    code: [
      'async function saveAll(users) {',
      '  users.forEach(async (user) => {',
      '    await db.save(user);',
      '  });',
      "  console.log('All users saved');",
      '}',
    ],
    bug: 1,
    explanation: '`forEach` ignores the promises its callback returns, so `saveAll` logs (and resolves) before any save has finished — and errors go unhandled.',
    fix: '  await Promise.all(users.map((user) => db.save(user)));',
  },
  {
    id: 'mutable-default',
    lang: 'Python',
    title: 'Collect tags',
    goal: 'Return a new list containing just this tag when no list is passed.',
    code: ['def add_tag(tag, tags=[]):', '    tags.append(tag)', '    return tags', '', 'print(add_tag("a"))  # ["a"]', 'print(add_tag("b"))  # expected ["b"]'],
    bug: 0,
    explanation: 'Default arguments are evaluated once, when the function is defined. Every call shares the same list, so the second call returns `["a", "b"]`.',
    fix: 'def add_tag(tag, tags=None):  # then: tags = tags or []',
  },
  {
    id: 'null-equals',
    lang: 'SQL',
    title: 'Active users',
    goal: 'List users that have not been soft-deleted.',
    code: ['SELECT id, email', 'FROM users', 'WHERE deleted_at = NULL', 'ORDER BY created_at DESC;'],
    bug: 2,
    explanation: 'Comparing anything to NULL with `=` yields UNKNOWN, never TRUE — the query returns zero rows. NULL checks need `IS NULL`.',
    fix: 'WHERE deleted_at IS NULL',
  },
  {
    id: 'typeof-array',
    lang: 'JavaScript',
    title: 'Is it empty?',
    goal: 'Treat empty arrays as empty, otherwise fall back to truthiness.',
    code: ['function isEmpty(value) {', "  if (typeof value === 'array') {", '    return value.length === 0;', '  }', '  return !value;', '}'],
    bug: 1,
    explanation: "`typeof` never returns `'array'` — arrays are `'object'`. The branch is dead code, and `isEmpty([])` returns `false`.",
    fix: '  if (Array.isArray(value)) {',
  },
  {
    id: 'is-vs-equals',
    lang: 'Python',
    title: 'Discount codes',
    goal: 'Give 10% off when the customer enters SAVE10.',
    code: ['def get_discount(code):', '    if code is "SAVE10":', '        return 0.10', '    return 0'],
    bug: 1,
    explanation: '`is` checks identity, not equality. A string typed by a user is a different object from the literal, so the discount silently never applies.',
    fix: '    if code == "SAVE10":',
  },
  {
    id: 'where-aggregate',
    lang: 'SQL',
    title: 'Loyal customers',
    goal: 'Find customers with more than five orders.',
    code: ['SELECT customer_id, COUNT(*) AS orders', 'FROM orders', 'WHERE COUNT(*) > 5', 'GROUP BY customer_id;'],
    bug: 2,
    explanation: 'WHERE filters rows before grouping, so aggregates are not allowed there — this is an error. Filter groups with HAVING after GROUP BY.',
    fix: 'GROUP BY customer_id HAVING COUNT(*) > 5;',
  },
  {
    id: 'zero-render',
    lang: 'React',
    title: 'Unread badge',
    goal: 'Show a badge only when there are messages.',
    code: [
      'function Inbox({ messages }) {',
      '  return (',
      '    <div>',
      '      {messages.length && <Badge count={messages.length} />}',
      '      <MessageList items={messages} />',
      '    </div>',
      '  );',
      '}',
    ],
    bug: 3,
    explanation: 'With no messages, `messages.length && …` evaluates to `0` — and React renders the number 0 on screen. Use a real boolean.',
    fix: '      {messages.length > 0 && <Badge count={messages.length} />}',
  },
];
