import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Category } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, ArrowLeft } from 'lucide-react';

interface Props {
    category: Category;
}

export default function Show({ category }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Categories',
            href: '/categories',
        },
        {
            title: category.name,
            href: `/categories/${category.id}`,
        },
    ];

    const { delete: destroy } = useForm();

    const deleteCategory = () => {
        if (confirm('Are you sure you want to delete this category?')) {
            destroy(route('categories.destroy', category.id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Category: ${category.name}`} />

            <div className="p-4 sm:p-8 space-y-6">
                <div className="flex justify-between items-center">
                    <Link href={route('categories.index')} className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to List
                    </Link>
                    <div className="space-x-2">
                        <Link href={route('categories.edit', category.id)}>
                            <Button variant="outline">
                                <Edit className="w-4 h-4 mr-2" /> Edit
                            </Button>
                        </Link>
                        <Button variant="destructive" onClick={deleteCategory}>
                            <Trash className="w-4 h-4 mr-2" /> Delete
                        </Button>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                    <div className="p-8 space-y-6">
                        <div>
                            <Badge variant={category.status === 'active' ? 'default' : category.status === 'deleted' ? 'destructive' : 'secondary'} className="mb-4">
                                {category.status.toUpperCase()}
                            </Badge>
                            <h2 className="text-4xl font-extrabold tracking-tight">{category.name}</h2>
                        </div>

                        <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Details</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between py-1 border-b border-dashed border-gray-100 dark:border-gray-700">
                                    <span className="text-sm text-muted-foreground">Category ID</span>
                                    <span className="text-sm font-medium">#{category.id}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-dashed border-gray-100 dark:border-gray-700">
                                    <span className="text-sm text-muted-foreground">Created At</span>
                                    <span className="text-sm font-medium">{new Date(category.created_at).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-dashed border-gray-100 dark:border-gray-700">
                                    <span className="text-sm text-muted-foreground">Updated At</span>
                                    <span className="text-sm font-medium">{new Date(category.updated_at).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
