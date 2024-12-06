"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import isValidProp from "@emotion/is-prop-valid";

const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  {
    ssr: false,
  }
);

const MotionConfig = dynamic(
  () => import("framer-motion").then((mod) => mod.MotionConfig),
  {
    ssr: false,
  }
);

import SignIn from "@/components/sign-in/sign-in";
import DevCard from "@/components/dev-card/dev-card";
import CodeBackground from "@/components/background/code-background";

import styles from "./page.module.css";

const exampleStats = {
  name: "Jane Developer",
  username: "techdev",
  avatar: "https://avatars.githubusercontent.com/u/1234567",
  bio: "Full Stack Developer | Open Source Enthusiast",
  location: "Tech Valley",
  followers: 342,
  repositories: 48,
  rating: 4.8,
  mostUsedLanguage: "TypeScript",
  mostActiveDay: "miércoles",
  mostActiveHour: "15",
  contributionsByDay: {
    lunes: 12,
    martes: 15,
    miércoles: 25,
    jueves: 18,
    viernes: 20,
    sábado: 8,
    domingo: 5,
  },
  contributionsByHour: {
    "9": 10,
    "10": 15,
    "11": 20,
    "12": 15,
    "13": 12,
    "14": 18,
    "15": 25,
    "16": 20,
    "17": 15,
  },
  pullRequestsMerged: 128,
  issuesOpen: 5,
  issuesClosed: 83,
};

export default function Home() {
  const [theme] = useState<"dark" | "light">("dark");

  return (
    <MotionConfig isValidProp={isValidProp}>
      <main className={`${styles.main} ${styles[theme]}`}>
        <CodeBackground />

        <div className={styles.content}>
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={styles.hero}
          >
            <h1 className={styles.title}>
              Crea tu propia <br />
              <span className={styles.gradient}>tarjeta de desarrollador</span>
            </h1>

            <p className={styles.description}>
              Muestra tus estadísticas de GitHub con estilo y compártelas con el
              mundo
            </p>

            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={styles.cta}
            >
              <SignIn />
            </MotionDiv>
          </MotionDiv>

          <DevCard stats={exampleStats} withMenu={false} />
        </div>
      </main>
    </MotionConfig>
  );
}
