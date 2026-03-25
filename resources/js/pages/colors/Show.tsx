import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Color } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, ArrowLeft } from 'lucide-react';

interface Props {
    color: Color;
}

export default function Show({ color }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Colors',
            href: '/colors',
        },
        {
            title: color.name,
            href: `/colors/${color.id}`,
        },
    ];

    const { delete: destroy } = useForm();

    const deleteColor = () => {
        if (confirm('Are you sure you want to delete this color?')) {
            destroy(route('colors.destroy', color.id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Color: ${color.name}`} />

            <div className="p-4 sm:p-8 space-y-6">
                <div className="flex justify-between items-center">
                    <Link href={route('colors.index')} className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to List
                    </Link>
                    <div className="space-x-2">
                        <Link href={route('colors.edit', color.id)}>
                            <Button variant="outline">
                                <Edit className="w-4 h-4 mr-2" /> Edit
                            </Button>
                        </Link>
                        <Button variant="destructive" onClick={deleteColor}>
                            <Trash className="w-4 h-4 mr-2" /> Delete
                        </Button>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-8 space-y-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-extrabold">{color.name}</h2>
                            <p className="text-sm text-muted-foreground mt-1">Color ID: {color.id}</p>
                        </div>
                        <Badge variant={color.status === 'active' ? 'default' : color.status === 'deleted' ? 'destructive' : 'secondary'} className="px-3 py-1">
                            {color.status}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Hex Code</h3>
                                <div className="flex items-center gap-3 mt-2">
                                    <div 
                                        className="w-12 h-12 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm" 
                                        style={{ backgroundColor: color.hex_code || 'transparent' }} 
                                    />
                                    <span className="text-xl font-mono font-bold">{color.hex_code || 'N/A'}</span>
                                </div>
                            </div>

                            {/* 
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Category</h3>
                                <p className="text-lg font-medium mt-1">{color.category?.name || 'Uncategorized'}</p>
                            </div>
                            */}
                        </div>

                        <div className="space-y-4 border-l border-gray-100 dark:border-gray-700 pl-8">
                            <div>
                                <p className="text-xs text-muted-foreground italic">Created at</p>
                                <p className="text-sm font-medium">{new Date(color.created_at).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground italic">Last updated</p>
                                <p className="text-sm font-medium">{new Date(color.updated_at).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
