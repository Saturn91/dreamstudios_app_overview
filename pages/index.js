import { useEffect, useState } from 'react';
import GAMES from '../games.config';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [playerCounts, setPlayerCounts] = useState({});
  const [reviewCounts, setReviewCounts] = useState({});
  const [reviewSummaries, setReviewSummaries] = useState({});

  useEffect(() => {
    GAMES.forEach(async (game) => {
      // Fetch current players
      try {
        const res = await fetch(`/api/current-players/${game.appid}`);
        const data = await res.json();
        setPlayerCounts((prev) => ({ ...prev, [game.appid]: data.player_count }));
      } catch {
        setPlayerCounts((prev) => ({ ...prev, [game.appid]: null }));
      }
      // Fetch review count and summary
      try {
        const res = await fetch(`/api/reviews/${game.appid}`);
        const data = await res.json();
        setReviewCounts((prev) => ({ ...prev, [game.appid]: data.review_count }));
        setReviewSummaries((prev) => ({ ...prev, [game.appid]: data.review_summary }));
      } catch {
        setReviewCounts((prev) => ({ ...prev, [game.appid]: null }));
        setReviewSummaries((prev) => ({ ...prev, [game.appid]: null }));
      }
    });
  }, []);

  // Sort games by review count (descending), treating undefined/null as 0
  const sortedGames = [...GAMES].sort((a, b) => {
    const aCount = reviewCounts[a.appid] ?? 0;
    const bCount = reviewCounts[b.appid] ?? 0;
    return bCount - aCount;
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Steam Game Overview</h1>
      <div className={styles.gamesContainer}>
        {sortedGames.map((game) => (
          <div className={styles.gameCard} key={game.appid}>
            <img
              className={styles.gameThumbnail}
              src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
              alt={game.title}
              width={184}
              height={69}
              loading="lazy"
            />
            <div className={styles.gameTitle}>{game.title}</div>
            <div className={styles.currentPlayers}>
              {playerCounts[game.appid] === undefined
                ? 'Loading current players...'
                : playerCounts[game.appid] === null
                ? 'Current players: N/A'
                : `Current players: ${playerCounts[game.appid]}`}
            </div>
            <div className={styles.reviewCount}>
              {reviewCounts[game.appid] === undefined
                ? 'Loading reviews...'
                : reviewCounts[game.appid] === null
                ? 'Reviews: N/A'
                : `Reviews: ${reviewCounts[game.appid]}`}
            </div>
            <div className={styles.reviewSummary}>
              {reviewSummaries[game.appid] === undefined
                ? 'Loading rating...'
                : reviewSummaries[game.appid] === null
                ? 'Rating: N/A'
                : `Rating: ${reviewSummaries[game.appid]}`}
            </div>
            <div className={styles.gameLinks}>
              <a href={game.storeUrl} target="_blank" rel="noopener noreferrer">Steam Store</a>
              <a href={game.steamdbUrl} target="_blank" rel="noopener noreferrer">SteamDB</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 