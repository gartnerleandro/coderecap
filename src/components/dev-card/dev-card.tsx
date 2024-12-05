/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
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
  FaCopy,
  FaCheck,
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
  FaTimes,
} from "react-icons/fa";
import { FaThreads } from "react-icons/fa6";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import * as htmlToImage from "html-to-image";

const MotionArticle = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.article),
  { ssr: false }
);

const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

const AnimatePresence = dynamic(
  () => import("framer-motion").then((mod) => mod.AnimatePresence),
  { ssr: false }
);

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

export default function DevCard({
  stats,
  withMenu = true,
}: {
  stats: GitHubStats;
  withMenu?: boolean;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const sharePopoverRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

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
          transform: "scale(1)",
        },
      });

      if (menuElement instanceof HTMLElement) {
        menuElement.style.display = "";
      }

      const link = document.createElement("a");
      link.download = `${stats.username}-devcard.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      return new Error((error as Error).message);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    sharePopoverRef.current?.showPopover();
  };

  const handleCopyUrl = async () => {
    const url = `${window.location.origin}/share/${stats.username}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    setShowMenu(false);
  };

  const shareUrl = `${window.location.origin}/share/${stats.username}`;
  const shareText = `Mira mi DevCard`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  const socialLinks = [
    {
      icon: <FaTwitter />,
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      color: "#1DA1F2",
    },
    {
      icon: <FaFacebookF />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "#1877F2",
    },
    {
      icon: <FaLinkedinIn />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "#0A66C2",
    },
    {
      icon: <FaWhatsapp />,
      url: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      color: "#25D366",
    },
    {
      icon: <FaThreads />,
      url: `https://threads.net/intent/post?text=${encodedText}%20${encodedUrl}`,
      color: "#000000",
    },
  ];

  const handleSocialShare = (url: string) => {
    window.open(url, "_blank", "width=600,height=400");
  };

  return (
    <div className={styles.container}>
      <Atropos
        className={styles.atroposWrapper}
        highlight={false}
        shadow={false}
      >
        <MotionArticle
          ref={cardRef}
          className={`${styles.card} ${styles[theme]}`}
        >
          <header className={styles.header}>
            <img
              src={stats.avatar}
              alt={stats.name}
              width="80"
              height="80"
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
          </header>

          <div className={styles.mainStats}>
            <div className={styles.stat}>
              <FaUsers />
              <span>Seguidores</span>
              <strong>{stats.followers}</strong>
            </div>
            <div className={styles.stat}>
              <FaCodeBranch />
              <span>Repos</span>
              <strong>{stats.repositories}</strong>
            </div>
            <div className={styles.stat}>
              <FaCode />
              <span>Lenguaje</span>
              <strong>{stats.mostUsedLanguage}</strong>
            </div>
          </div>

          <div className={styles.activityStats}>
            <h3>Pico de actividad</h3>
            <div className={styles.activityTime}>
              <div className={styles.activityItem}>
                <FaCalendar />
                <span>
                  <strong>Día:</strong> {stats.mostActiveDay}
                </span>
              </div>
              <div className={styles.activityItem}>
                <FaClock />
                <span>
                  <strong>Hora:</strong> {stats.mostActiveHour}:00
                </span>
              </div>
            </div>
          </div>

          <div className={styles.chartContainer}>
            <h3>Actividad semanal</h3>
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
              <span>PRs Cerradas</span>
              <strong>{stats.pullRequestsMerged}</strong>
            </div>
            <div className={styles.contributionItem}>
              <span>Issues Abiertos</span>
              <strong>{stats.issuesOpen}</strong>
            </div>
            <div className={styles.contributionItem}>
              <span>Issues Cerrados</span>
              <strong>{stats.issuesClosed}</strong>
            </div>
          </div>
        </MotionArticle>
      </Atropos>

      <div className={styles.floatingMenu}>
        <button
          className={styles.menuButton}
          onClick={() => setShowMenu(!showMenu)}
        >
          <FaEllipsisV />
        </button>

        <AnimatePresence>
          {showMenu && (
            <MotionDiv
              className={styles.menu}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {withMenu && (
                <>
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
                </>
              )}
              <button className={styles.menuItem} onClick={toggleTheme}>
                <FaPalette /> {theme === "dark" ? "Modo claro" : "Modo oscuro"}
              </button>
            </MotionDiv>
          )}
        </AnimatePresence>
      </div>

      <div ref={sharePopoverRef} popover="auto" className={styles.sharePopover}>
        <button
          className={styles.closeButton}
          onClick={() => sharePopoverRef.current?.hidePopover()}
        >
          <FaTimes />
        </button>
        <h3 className={styles.shareTitle}>Comparte tu DevCard</h3>
        <div className={styles.urlContainer}>
          <input
            type="text"
            readOnly
            value={shareUrl}
            className={styles.urlInput}
          />
          <button className={styles.copyButton} onClick={handleCopyUrl}>
            {copied ? <FaCheck /> : <FaCopy />}
          </button>
        </div>

        <div className={styles.socialButtons}>
          {socialLinks.map((social) => (
            <button
              key={social.color}
              className={styles.socialButton}
              onClick={() => handleSocialShare(social.url)}
              style={
                { "--social-color": social.color } as React.CSSProperties & {
                  "--social-color": string;
                }
              }
            >
              {social.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
