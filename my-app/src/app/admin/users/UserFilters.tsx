"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

type UserFiltersProps = {
  initialRole: string;
  initialStatus: string;
  initialQuery: string;
};

export default function UserFilters({
  initialRole,
  initialStatus,
  initialQuery,
}: UserFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [role, setRole] = useState(initialRole);
  const [status, setStatus] = useState(initialStatus);
  const [query, setQuery] = useState(initialQuery);

  const pushParams = useCallback(
    (nextRole: string, nextStatus: string, nextQuery: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (nextRole && nextRole !== "ALL") {
        params.set("role", nextRole);
      } else {
        params.delete("role");
      }

      if (nextStatus && nextStatus !== "ALL") {
        params.set("status", nextStatus);
      } else {
        params.delete("status");
      }

      const trimmedQuery = nextQuery.trim();
      if (trimmedQuery.length > 0) {
        params.set("q", trimmedQuery);
      } else {
        params.delete("q");
      }

      const paramsString = params.toString();
      router.replace(paramsString ? `${pathname}?${paramsString}` : pathname);
    },
    [pathname, router, searchParams],
  );

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex w-full flex-1 flex-col gap-3 lg:flex-row lg:items-center">
        <select
          value={role}
          onChange={(event) => {
            const nextRole = event.target.value;
            setRole(nextRole);
            pushParams(nextRole, status, query);
          }}
          className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
        >
          <option value="ALL">All Users</option>
          <option value="USER">Users</option>
          <option value="ADMIN">Admin</option>
        </select>

        <select
          value={status}
          onChange={(event) => {
            const nextStatus = event.target.value;
            setStatus(nextStatus);
            pushParams(role, nextStatus, query);
          }}
          className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="DEACTIVATED">Deactivated</option>
          <option value="DELETED">Deleted</option>
        </select>
      </div>

      <div className="w-full max-w-lg">
        <input
          type="search"
          value={query}
          onChange={(event) => {
            const nextQuery = event.target.value;
            setQuery(nextQuery);
            pushParams(role, status, nextQuery);
          }}
          placeholder="Search username or email"
          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#f6a1ff] focus:ring-2 focus:ring-[#f6a1ff]/25"
        />
      </div>
    </div>
  );
}
