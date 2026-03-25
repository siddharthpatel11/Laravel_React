import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Size } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, ArrowLeft } from 'lucide-react';

interface Props {
    size: Size;
}

export default function Show({ size }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Sizes',
            href: '/sizes',
        },
        {
            title: size.name,
            href: `/sizes/${size.id}`,
        },
    ];

    const { delete: destroy } = useForm();

    const deleteSize = () => {
        if (confirm('Are you sure you want to delete this size?')) {
            destroy(route('sizes.destroy', size.id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Size: ${size.name}`} />

            <div className="p-4 sm:p-8 space-y-6">
                <div className="flex justify-between items-center">
                    <Link href={route('sizes.index')} className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to List
                    </Link>
                    <div className="space-x-2">
                        <Link href={route('sizes.edit', size.id)}>
                            <Button variant="outline">
                                <Edit className="w-4 h-4 mr-2" /> Edit
                            </Button>
                        </Link>
                        <Button variant="destructive" onClick={deleteSize}>
                            <Trash className="w-4 h-4 mr-2" /> Delete
                        </Button>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-8 space-y-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-extrabold">{size.name}</h2>
                            <p className="text-sm text-muted-foreground mt-1">Size ID: {size.id}</p>
                        </div>
                        <Badge variant={size.status === 'active' ? 'default' : size.status === 'deleted' ? 'destructive' : 'secondary'} className="px-3 py-1">
                            {size.status}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Size Name</h3>
                                <p className="text-lg font-medium mt-1">{size.name}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-muted-foreground italic">Created at</p>
                                <p className="text-sm font-medium">{new Date(size.created_at).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground italic">Last updated</p>
                                <p className="text-sm font-medium">{new Date(size.updated_at).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
