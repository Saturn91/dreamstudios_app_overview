export default async function handler(req, res) {
  const { appid } = req.query;
  try {
    const response = await fetch(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appid}`);
    const data = await response.json();
    res.status(200).json({ player_count: data?.response?.player_count ?? null });
  } catch (e) {
    res.status(500).json({ player_count: null, error: 'Failed to fetch from Steam API' });
  }
} 