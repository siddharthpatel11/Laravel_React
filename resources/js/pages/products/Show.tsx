import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Product } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, ArrowLeft } from 'lucide-react';

interface Props {
    product: Product;
}

export default function Show({ product }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Products',
            href: '/products',
        },
        {
            title: product.name,
            href: `/products/${product.id}`,
        },
    ];

    const { delete: destroy } = useForm();

    const deleteProduct = () => {
        if (confirm('Are you sure you want to delete this product?')) {
            destroy(route('products.destroy', product.id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Product: ${product.name}`} />

            <div className="p-4 sm:p-8 max-w-3xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <Link href={route('products.index')} className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to List
                    </Link>
                    <div className="space-x-2">
                        <Link href={route('products.edit', product.id)}>
                            <Button variant="outline">
                                <Edit className="w-4 h-4 mr-2" /> Edit
                            </Button>
                        </Link>
                        <Button variant="destructive" onClick={deleteProduct}>
                            <Trash className="w-4 h-4 mr-2" /> Delete
                        </Button>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-8 space-y-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-extrabold">{product.name}</h2>
                            <p className="text-sm text-muted-foreground mt-1">Product ID: {product.id}</p>
                        </div>
                        <Badge variant={product.status === 'active' ? 'default' : product.status === 'deleted' ? 'destructive' : 'secondary'} className="px-3 py-1">
                            {product.status}
                        </Badge>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Product Details</h3>
                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg whitespace-pre-wrap">
                            {product.detail}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div>
                            <p className="text-xs text-muted-foreground italic">Created at</p>
                            <p className="text-sm font-medium">{new Date(product.created_at).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground italic">Last updated</p>
                            <p className="text-sm font-medium">{new Date(product.updated_at).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
