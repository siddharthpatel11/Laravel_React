import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { PaginationLink } from '@/types';

interface Props {
    links: PaginationLink[];
    className?: string;
}

export default function Pagination({ links, className }: Props) {
    if (links.length <= 3) return null;

    return (
        <div className={cn("flex flex-wrap justify-center gap-1", className)}>
            {links.map((link, key) => (
                link.url === null ? (
                    <div
                        key={key}
                        className="px-4 py-2 text-sm text-gray-400 border rounded bg-white dark:bg-gray-800 dark:border-gray-700"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <Link
                        key={key}
                        href={link.url}
                        className={cn(
                            "px-4 py-2 text-sm border rounded transition-colors",
                            link.active 
                                ? "bg-primary text-primary-foreground border-primary" 
                                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700",
                        )}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                )
            ))}
        </div>
    );
}
