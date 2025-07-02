export default async function handler(req, res) {
  const { appid } = req.query;
  try {
    const response = await fetch(`https://store.steampowered.com/appreviews/${appid}?json=1&filter=all&language=all&purchase_type=all`);
    const data = await response.json();
    res.status(200).json({
      review_count: data?.query_summary?.total_reviews ?? null,
      review_summary: data?.query_summary?.review_score_desc ?? null
    });
  } catch (e) {
    res.status(500).json({ review_count: null, review_summary: null, error: 'Failed to fetch from Steam Storefront API' });
  }
} 