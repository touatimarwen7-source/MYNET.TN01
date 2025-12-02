/**
 * Query Optimization Guide - Prevent N+1 Queries
 *
 * Pattern Examples:
 */

// ❌ BAD - N+1 Query Pattern
const badExample = `
const tenders = await db.query('SELECT * FROM tenders');
for (const tender of tenders.rows) {
  const offers = await db.query('SELECT * FROM offers WHERE tender_id = $1', [tender.id]);
  // This runs a query for EACH tender!
}
`;

// ✅ GOOD - JOIN Pattern
const goodExample = `
const result = await db.query(\`
  SELECT t.*, o.* 
  FROM tenders t
  LEFT JOIN offers o ON t.id = o.tender_id
  WHERE t.id = $1
\`, [tenderId]);
`;

// ✅ GOOD - Batch Pattern
const batchExample = `
const tenderIds = tenders.map(t => t.id);
const offers = await db.query(\`
  SELECT * FROM offers 
  WHERE tender_id = ANY($1::int[])
\`, [tenderIds]);
`;

// ✅ GOOD - Aggregation Pattern
const aggregationExample = `
const result = await db.query(\`
  SELECT t.*, COUNT(o.id) as offer_count
  FROM tenders t
  LEFT JOIN offers o ON t.id = o.tender_id
  GROUP BY t.id
\`);
`;

module.exports = {
  badExample,
  goodExample,
  batchExample,
  aggregationExample,
};
