"use client";

import { useEffect, useState } from "react";
import DevCard from "@/components/dev-card/dev-card";
import DevCardSkeleton from "@/components/dev-card/dev-card-skeleton";

export default function Card() {
  const [githubStats, setGithubStats] = useState(null);

  useEffect(() => {
    fetch("/api/github")
      .then((res) => res.json())
      .then((data) => {
        setGithubStats(data);
      })
      .catch(console.error);
  }, []);

  return (
    <main>
      <div>
        {githubStats ? <DevCard stats={githubStats} /> : <DevCardSkeleton />}
      </div>
    </main>
  );
}
