import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { Octokit } from "@octokit/rest";
import dayjs from "dayjs";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

import "dayjs/locale/es";

export async function GET() {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const octokit = new Octokit({
    auth: session.accessToken,
  });

  try {
    const lastYear = dayjs().startOf("year").format("YYYY-MM-DD");

    const [user, repos] = await Promise.all([
      octokit.users.getAuthenticated(),
      octokit.repos.listForAuthenticatedUser(),
    ]);

    const [prs, issues] = await Promise.all([
      octokit.search.issuesAndPullRequests({
        q: `author:${user?.data?.login} type:pr is:merged created:>=${lastYear}`,
      }),
      octokit.search.issuesAndPullRequests({
        q: `author:${user?.data?.login} type:issue created:>=${lastYear}`,
      }),
    ]);

    const mostUsedLanguage = repos.data.reduce(
      (acc, repo) => {
        if (repo.language) {
          acc[repo.language] = (acc[repo.language] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    const mostUsedLanguageName = Object.keys(mostUsedLanguage).reduce((a, b) =>
      mostUsedLanguage[a] > mostUsedLanguage[b] ? a : b
    );

    const contributionTimes = [...prs.data.items, ...issues.data.items].reduce(
      (acc, item) => {
        const date = dayjs(item.created_at);
        const dayOfWeek = date.locale("es").format("dddd");
        const hour = date.hour();

        acc.days[dayOfWeek] = (acc.days[dayOfWeek] || 0) + 1;
        acc.hours[hour] = (acc.hours[hour] || 0) + 1;

        return acc;
      },
      {
        days: {} as Record<string, number>,
        hours: {} as Record<number, number>,
      }
    );

    const daysOrder = [
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
      "domingo",
    ];

    const contributionsByDay = daysOrder.reduce(
      (acc, day) => {
        acc[day] = contributionTimes.days[day] || 0;
        return acc;
      },
      {} as Record<string, number>
    );

    const mostActiveDay = Object.entries(contributionsByDay).sort(
      ([, a], [, b]) => b - a
    )[0][0];

    const mostActiveHour = Object.entries(contributionTimes.hours).sort(
      ([, a], [, b]) => b - a
    )[0][0];

    const totalContributions =
      prs.data.total_count + issues.data.total_count + repos.data.length;
    const rating = Math.min(5, (totalContributions / 100) * 5).toFixed(2);

    const statsData = {
      name: user.data.name,
      username: user.data.login,
      avatar: user.data.avatar_url,
      bio: user.data.bio,
      location: user.data.location,
      followers: user.data.followers,
      repositories: repos.data.length,
      rating,
      mostUsedLanguage: mostUsedLanguageName,
      mostActiveDay,
      mostActiveHour,
      contributionsByDay,
      contributionsByHour: contributionTimes.hours,
      pullRequestsMerged: prs.data.items.length,
      issuesOpen: issues.data.items.filter((issue) => issue.state === "open")
        .length,
      issuesClosed: issues.data.items.filter(
        (issue) => issue.state === "closed"
      ).length,
      updatedAt: new Date().toISOString(),
    };

    // Guarda los datos en Firestore
    await setDoc(
      doc(db, "githubStats", statsData.username as string),
      statsData,
      {
        merge: true, // Esto actualizará los datos existentes o creará un nuevo documento si no existe
      }
    );

    return NextResponse.json(statsData);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
