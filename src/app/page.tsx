"use client";

import { motion } from "framer-motion";

import SignIn from "@/components/sign-in/sign-in";

import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.titleContainer}
        >
          <h1 className={styles.title}>
            Crea tu propia <br />
            <span className={styles.gradient}>tarjeta de desarrollador</span>
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <SignIn />
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
