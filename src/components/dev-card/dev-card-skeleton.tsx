"use client";

import { useState } from "react";
import Skeleton from "react-loading-skeleton";

import styles from "./devcard.module.css";

import "react-loading-skeleton/dist/skeleton.css";

export default function DevCardSkeleton() {
  const [theme] = useState<"dark" | "light">("dark");

  return (
    <div className={styles.container}>
      <div className={styles.atroposWrapper}>
        <div className={`${styles.card} ${styles[theme]}`}>
          <div className={styles.header}>
            <Skeleton circle width={80} height={80} />
            <div className={styles.info}>
              <Skeleton width={150} height={24} />
              <Skeleton width={120} height={20} />
              <Skeleton width={100} height={16} />
            </div>
          </div>

          <div className={`${styles.mainStats} ${styles.skeleton}`}>
            <Skeleton width="100%" height={60} />
            <Skeleton width="100%" height={60} />
            <Skeleton width="100%" height={60} />
          </div>

          <div className={styles.activityStats}>
            <Skeleton width="100%" height={40} />
          </div>

          <div className={`${styles.chartContainer} ${styles.skeleton}`}>
            <Skeleton width={120} height={24} />
            <Skeleton width="100%" height={120} />
          </div>

          <div className={styles.contributions}>
            <Skeleton width="100%" height={80} />
            <Skeleton width="100%" height={80} />
            <Skeleton width="100%" height={80} />
          </div>
        </div>
      </div>
    </div>
  );
}
