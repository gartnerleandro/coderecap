"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DevCard from "@/components/dev-card/dev-card";
import styles from "./page.module.css";

export default function Card() {
  const [githubStats, setGithubStats] = useState(null);

  useEffect(() => {
    fetch("/api/github")
      .then((res) => res.json())
      .then((data) => {
        console.log({ data });
        setGithubStats(data);
      })
      .catch(console.error);
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        {githubStats ? (
          <DevCard stats={githubStats} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.loading}
          >
            Cargando...
          </motion.div>
        )}
      </div>
    </main>
  );
}
