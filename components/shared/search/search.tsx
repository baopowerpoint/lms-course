"use client";
import React, { Suspense, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn, formUrlQuery, removeKeysFromUrlQuery } from "@/lib/utils";
import { Loader2, Search as SearchIcon } from "lucide-react";
interface Props {
  route: string;

  placeholder: string;
  otherClasses?: string;
}
const Search = ({ route, placeholder, otherClasses }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: searchQuery,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromUrlQuery({
            params: searchParams.toString(),
            keysToRemove: ["query"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, router, route, searchParams, pathname]);
  return (
    <div
      className={cn(
        "bg-slate-100 flex min-h-[32px] grow w-full md:ml-auto md:max-w-[240px] items-center gap-0.5 rounded-[12px] px-4",
        otherClasses
      )}
    >
      <SearchIcon size={20} className="text_secondary" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="normal_medium shad-no-focus text_secondary border-none shadow-none outline-none ring-0 focus:ring-0! focus:outline-none! placeholder:text-slate-600 bg-transparent"
      />
    </div>
  );
};
const LocalSearch = (props: Props) => {
  return (
    <Suspense fallback={<Loader2 className="animate-spin w-5" />}>
      <Search {...props} />
    </Suspense>
  );
};
export default LocalSearch;
