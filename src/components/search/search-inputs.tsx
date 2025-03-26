'use client'

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type Option } from "@/components/ui/multi-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { z } from 'zod';

export const searchSchema = z.object({
    query: z.string().optional(),
    genres: z.array(z.custom<Option>()).optional()
});

export default function SearchInputs() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const form = useForm<z.infer<typeof searchSchema>>({
        resolver: zodResolver(searchSchema),
        defaultValues: {
            query: searchParams.get("query") ?? "",
            genres: searchParams.get("genres")?.split(',').map(g => ({value: g, label: g})) ?? []
        }
    })
    
    const [debouncedValues] = useDebounce(form.watch(), 500);
    
    useEffect(() => {
        const currentQuery = searchParams.get("query") ?? "";
        const currentGenres = searchParams.get("genres")?.split(',') ?? [];
        
        if (
            debouncedValues.query !== currentQuery ||
            JSON.stringify(debouncedValues.genres?.map(g => g.value)) !== JSON.stringify(currentGenres)
        ) {
            saveInURL(debouncedValues);
        }
    }, [debouncedValues, searchParams]);
    
    function saveInURL(values: z.infer<typeof searchSchema>) {
        const params = new URLSearchParams();
        
        if (values.query) {
            params.set('query', values.query);
        } else {
            params.delete('query');
        }
        
        if (values.genres && values.genres.length > 0) {
            params.set('genres', values.genres.map(g => g.value).join(','));
        } else {
            params.delete('genres');
        }
        
        router.replace(`/search?${ params.toString() }`);
    }
    
    function onSubmit(values: z.infer<typeof searchSchema>) {
        saveInURL(values);
    }
    
    return (
        <Form  { ...form }>
            <form onSubmit={ form.handleSubmit(onSubmit) } className="flex flex-col w-full justify-center items-center">
                <FormField
                    control={ form.control }
                    name="query"
                    render={ ({field}) => (
                        <FormItem className="w-1/2">
                            <FormControl>
                                <Input
                                    autoFocus
                                    placeholder="Flushed away" { ...field } />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    ) }
                />
            </form>
        </Form>
    )
}