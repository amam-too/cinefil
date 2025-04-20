"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { z } from "zod";

export const searchSchema = z.object({
  query: z.string().optional(),
  year: z
    .string()
    .optional()
    .refine((val) => !val || (parseInt(val) >= 1900 && parseInt(val) <= 2025), {
      message: "Year must be between 1900 and 2025",
    }),
});

export default function SearchInputs() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: searchParams.get("query") ?? "",
      year: searchParams.get("year") ?? "",
    },
  });

  const [debouncedValues] = useDebounce(form.watch(), 500);

  useEffect(() => {
    const currentQuery = searchParams.get("query") ?? "";
    const currentYear = searchParams.get("year") ?? "";

    if (
      debouncedValues.query !== currentQuery ||
      debouncedValues.year !== currentYear
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

    if (values.year) {
      params.set("year", values.year);
    } else {
      params.delete("year");
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
                <Input
                  type="number"
                  placeholder="Year"
                  min={1900}
                  max={2025}
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