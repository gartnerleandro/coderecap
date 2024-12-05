"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DevCard from "@/components/dev-card/dev-card";
import DevCardSkeleton from "@/components/dev-card/dev-card-skeleton";
import styles from "./page.module.css";

export default function SharedCard() {
  const [githubStats, setGithubStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { username } = router.query;

  useEffect(() => {
    if (username) {
      fetch(`/api/shared?username=${username}`)
        .then((res) => res.json())
        .then((data) => {
          setGithubStats(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching shared data:", error);
          setLoading(false);
        });
    }
  }, [username]);

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        {loading ? (
          <DevCardSkeleton />
        ) : githubStats ? (
          <DevCard stats={githubStats} withMenu={false} />
        ) : (
          <p>Error al cargar los datos.</p>
        )}
      </div>
    </main>
  );
}
