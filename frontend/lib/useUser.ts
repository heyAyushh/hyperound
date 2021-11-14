import { useEffect } from "react";
import Router from "next/router";
import useSWR from "swr";
import { User } from "../pages/api/user";
import { fetcher } from "../helpers/swr";

export default function useUser({
  redirectTo = "",
  redirectIfFound = false,
} = {}) {
  const { data: user, mutate: mutateUser, error } = useSWR<User>("/api/user", fetcher,{ refreshInterval: 1000 });

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !user) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user && !error)
    ) {
      Router.push(redirectTo);
    }
  }, [user, error, redirectIfFound, redirectTo]);

  return {
    user,
    isLogggedin: user && !error,
    isLoading: !error && !user,
    isError: error,
    mutateUser
  }
}