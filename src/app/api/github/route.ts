import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { Octokit } from "@octokit/rest";
import dayjs from "dayjs";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

import "dayjs/locale/es";

interface PullRequestOrIssue {
  created_at: string;
}

interface Commit {
  commit: {
    author: {
      date?: string;
    } | null;
  };
}

type ContributionItem = PullRequestOrIssue | Commit;

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
      octokit.paginate(octokit.repos.listForAuthenticatedUser, {
        visibility: "all",
        per_page: 100,
      }),
    ]);

    const commitsPromises = repos.map((repo) =>
      octokit
        .paginate(octokit.repos.listCommits, {
          owner: repo.owner.login,
          repo: repo.name,
          author: user.data.login,
          since: lastYear,
          per_page: 100,
        })
        .catch(() => [])
    );

    const [prsItems, issuesItems, ...repoCommits] = await Promise.all([
      octokit.paginate(octokit.search.issuesAndPullRequests, {
        q: `author:${user?.data?.login} type:pr is:merged created:>=${lastYear}`,
        per_page: 100,
      }),
      octokit.paginate(octokit.search.issuesAndPullRequests, {
        q: `author:${user?.data?.login} type:issue created:>=${lastYear}`,
        per_page: 100,
      }),
      ...commitsPromises,
    ]);

    // Aplanar el array de commits
    const allCommits = repoCommits.flat();

    const mostUsedLanguage = repos.reduce(
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

    // Actualizar contributionTimes para incluir commits
    const contributionTimes = [
      ...prsItems,
      ...issuesItems,
      ...allCommits,
    ].reduce(
      (acc, item) => {
        const getDate = (item: ContributionItem) => {
          if ("created_at" in item) return item.created_at;
          if ("commit" in item) return item.commit?.author?.date;
          return null;
        };

        const date = dayjs(getDate(item));
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
      prsItems.length + issuesItems.length + repos.length + allCommits.length;
    const rating = Math.min(5, (totalContributions / 100) * 5).toFixed(2);

    const statsData = {
      name: user.data.name,
      username: user.data.login,
      avatar: user.data.avatar_url,
      bio: user.data.bio,
      location: user.data.location,
      followers: user.data.followers,
      repositories: repos.length,
      rating,
      mostUsedLanguage: mostUsedLanguageName,
      mostActiveDay,
      mostActiveHour,
      contributionsByDay,
      contributionsByHour: contributionTimes.hours,
      pullRequestsMerged: prsItems.length,
      issuesOpen: issuesItems.filter((issue) => issue.state === "open").length,
      issuesClosed: issuesItems.filter((issue) => issue.state === "closed")
        .length,
      totalCommits: allCommits.length,
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
