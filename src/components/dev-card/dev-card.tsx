"use client";

import { motion } from "framer-motion";
import Atropos from "atropos/react";
import {
  FaStar,
  FaCodeBranch,
  FaCode,
  FaMapMarkerAlt,
  FaUsers,
  FaClock,
  FaCalendar,
} from "react-icons/fa";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import styles from "./devcard.module.css";
import "atropos/css";

interface GitHubStats {
  name: string;
  username: string;
  avatar: string;
  location?: string;
  followers: number;
  repositories: number;
  rating: number;
  mostUsedLanguage: string;
  mostActiveDay: string;
  mostActiveHour: string;
  contributionsByDay: Record<string, number>;
  contributionsByHour: Record<number, number>;
  pullRequestsMerged: number;
  issuesOpen: number;
  issuesClosed: number;
}

export default function DevCard({ stats }: { stats: GitHubStats }) {
  const contributionsByDayData = Object.entries(stats.contributionsByDay).map(
    ([day, count]) => ({
      name: day.slice(0, 3),
      value: count,
    })
  );

  return (
    <div className={styles.container}>
      <Atropos
        className={styles.atroposWrapper}
        highlight={false}
        shadow={false}
      >
        <motion.div
          className={styles.card}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.header}>
            <img
              src={stats.avatar}
              alt={stats.name}
              width={80}
              height={80}
              className={styles.avatar}
            />
            <div className={styles.info}>
              <h2 className={styles.name}>{stats.name}</h2>
              <p className={styles.username}>@{stats.username}</p>
              {stats.location && (
                <p className={styles.location}>
                  <FaMapMarkerAlt /> {stats.location}
                </p>
              )}
            </div>
            <div className={styles.rating}>
              <FaStar />
              <span>{stats.rating}</span>
            </div>
          </div>

          <div className={styles.mainStats}>
            <div className={styles.stat}>
              <FaUsers />
              <span>Followers</span>
              <strong>{stats.followers}</strong>
            </div>
            <div className={styles.stat}>
              <FaCodeBranch />
              <span>Repos</span>
              <strong>{stats.repositories}</strong>
            </div>
            <div className={styles.stat}>
              <FaCode />
              <span>Language</span>
              <strong>{stats.mostUsedLanguage}</strong>
            </div>
          </div>

          <div className={styles.activityStats}>
            <div className={styles.activityTime}>
              <div className={styles.activityItem}>
                <FaCalendar />
                <span>Most Active: {stats.mostActiveDay}</span>
              </div>
              <div className={styles.activityItem}>
                <FaClock />
                <span>Peak Hour: {stats.mostActiveHour}:00</span>
              </div>
            </div>
          </div>

          <div className={styles.chartContainer}>
            <h3>Weekly Activity</h3>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={contributionsByDayData}>
                <XAxis dataKey="name" />
                <Tooltip />
                <Bar dataKey="value" fill="#60A5FA" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.contributions}>
            <div className={styles.contributionItem}>
              <span>PRs Merged</span>
              <strong>{stats.pullRequestsMerged}</strong>
            </div>
            <div className={styles.contributionItem}>
              <span>Issues Open</span>
              <strong>{stats.issuesOpen}</strong>
            </div>
            <div className={styles.contributionItem}>
              <span>Issues Closed</span>
              <strong>{stats.issuesClosed}</strong>
            </div>
          </div>
        </motion.div>
      </Atropos>
    </div>
  );
}
