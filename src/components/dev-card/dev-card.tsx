"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Atropos from "atropos/react";
import {
  FaStar,
  FaCodeBranch,
  FaCode,
  FaMapMarkerAlt,
  FaUsers,
  FaClock,
  FaCalendar,
  FaEllipsisV,
  FaDownload,
  FaShare,
  FaPalette,
} from "react-icons/fa";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import * as htmlToImage from "html-to-image";

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
  const [showMenu, setShowMenu] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const contributionsByDayData = Object.entries(stats.contributionsByDay).map(
    ([day, count]) => ({
      name: day.slice(0, 3),
      value: count,
    })
  );

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      setIsDownloading(true);
      setShowMenu(false);

      // Ocultar temporalmente el menú para la captura
      const menuElement = cardRef.current.querySelector(
        `.${styles.menuContainer}`
      );
      if (menuElement instanceof HTMLElement) {
        menuElement.style.display = "none";
      }

      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        style: {
          transform: "scale(1)", // Resetear transformaciones para la captura
        },
      });

      // Restaurar el menú
      if (menuElement instanceof HTMLElement) {
        menuElement.style.display = "";
      }

      // Crear enlace de descarga
      const link = document.createElement("a");
      link.download = `${stats.username}-devcard.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error al generar la imagen:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;

    try {
      setShowMenu(false);
      const dataUrl = await htmlToImage.toPng(cardRef.current);

      // Convertir dataURL a Blob
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "devcard.png", { type: "image/png" });

      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: "Mi DevCard",
          text: "Mira mi tarjeta de desarrollador",
        });
      } else {
        // Fallback para navegadores que no soportan Web Share API
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
      }
    } catch (error) {
      console.error("Error al compartir:", error);
    }
  };

  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    setShowMenu(false);
  };

  return (
    <div className={styles.container}>
      <Atropos
        className={styles.atroposWrapper}
        highlight={false}
        shadow={false}
      >
        <motion.div
          ref={cardRef}
          className={`${styles.card} ${styles[theme]}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.menuContainer}>
            <button
              className={styles.menuButton}
              onClick={() => setShowMenu(!showMenu)}
              disabled={isDownloading}
            >
              <FaEllipsisV />
            </button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  className={styles.menu}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <button
                    className={styles.menuItem}
                    onClick={handleDownload}
                    disabled={isDownloading}
                  >
                    <FaDownload />{" "}
                    {isDownloading ? "Descargando..." : "Descargar"}
                  </button>
                  <button className={styles.menuItem} onClick={handleShare}>
                    <FaShare /> Compartir
                  </button>
                  <button className={styles.menuItem} onClick={toggleTheme}>
                    <FaPalette /> Cambiar tema
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
