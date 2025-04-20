"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type Option } from "@/components/ui/multi-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { z } from "zod";

export const searchSchema = z.object({
  query: z.string().optional(),
  genres: z.array(z.custom<Option>()).optional(),
  year: z.string().optional(),
  language: z.string().optional(),
});

export default function SearchInputs() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: searchParams.get("query") ?? "",
      genres:
        searchParams
          .get("genres")
          ?.split(",")
          .map((g) => ({ value: g, label: g })) ?? [],
      year: searchParams.get("year") ?? "",
      language: searchParams.get("language") ?? "",
    },
  });

  const [debouncedValues] = useDebounce(form.watch(), 500);

  useEffect(() => {
    const currentQuery = searchParams.get("query") ?? "";
    const currentGenres = searchParams.get("genres")?.split(",") ?? [];
    const currentYear = searchParams.get("year") ?? "";
    const currentLanguage = searchParams.get("language") ?? "";

    if (
      debouncedValues.query !== currentQuery ||
      JSON.stringify(debouncedValues.genres?.map((g) => g.value)) !==
        JSON.stringify(currentGenres) ||
      debouncedValues.year !== currentYear ||
      debouncedValues.language !== currentLanguage
    ) {
      saveInURL(debouncedValues);
    }
  }, [debouncedValues, searchParams]);

  /**
   *
   * @param values
   */
  function saveInURL(values: z.infer<typeof searchSchema>) {
    const params = new URLSearchParams();

    if (values.query) {
      params.set("query", values.query);
    } else {
      params.delete("query");
    }

    if (values.genres && values.genres.length > 0) {
      params.set("genres", values.genres.map((g) => g.value).join(","));
    } else {
      params.delete("genres");
    }

    if (values.year) {
      params.set("year", values.year);
    } else {
      params.delete("year");
    }

    if (values.language) {
      params.set("language", values.language);
    } else {
      params.delete("language");
    }

    router.replace(`/search?${params.toString()}`);
  }

  /**
   *
   * @param values
   */
  function onSubmit(values: z.infer<typeof searchSchema>) {
    saveInURL(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col items-center gap-4 p-2 md:flex-row md:justify-center"
      >
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem className="w-full md:w-1/4">
              <FormControl>
                <Input placeholder="Search a movie..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem className="w-full md:w-1/6">
              <FormControl>
                <Input type="number" placeholder="Year" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem className="w-full md:w-1/6">
              <FormControl>
                <Input
                  type="text"
                  placeholder="Language (e.g. en, fr)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}