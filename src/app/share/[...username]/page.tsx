"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DevCard from "@/components/dev-card/dev-card";
import DevCardSkeleton from "@/components/dev-card/dev-card-skeleton";
import CodeBackground from "@/components/background/code-background";

import styles from "./page.module.css";

export default function SharedCard() {
  const [githubStats, setGithubStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const username = params.username as string;

  useEffect(() => {
    if (username) {
      fetch(`/api/shared?username=${username}`)
        .then((res) => res.json())
        .then((data) => {
          setGithubStats(data);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);

          return new Error(error);
        });
    }
  }, [username]);

  return (
    <main className={styles.main}>
      <CodeBackground />
      <div>
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
