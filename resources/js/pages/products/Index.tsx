import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Product } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash, Eye } from 'lucide-react';
import Pagination from '@/components/ui/pagination';
import { PaginatedData } from '@/types';

interface Props {
    products: PaginatedData<Product>;
    success?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
];

export default function Index({ products, success }: Props) {
    const { delete: destroy } = useForm();

    const deleteProduct = (id: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            destroy(route('products.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            <div className="p-4 sm:p-8 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Products</h2>
                        <p className="text-muted-foreground">Manage your product list</p>
                    </div>
                    <Link href={route('products.create')}>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" /> Create Product
                        </Button>
                    </Link>
                </div>

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                        {success}
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {products.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500 italic">No products found.</td>
                                </tr>
                            ) : (
                                products.data.map((product, index) => (
                                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {products.from + index}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{product.detail}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant={product.status === 'active' ? 'default' : product.status === 'deleted' ? 'destructive' : 'secondary'}>
                                                {product.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(product.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <Link href={route('products.show', product.id)}>
                                                <Button size="icon" variant="ghost">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Link href={route('products.edit', product.id)}>
                                                <Button size="icon" variant="ghost" className="text-blue-600">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button size="icon" variant="ghost" className="text-red-600" onClick={() => deleteProduct(product.id)}>
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6">
                    <Pagination links={products.links} />
                </div>
            </div>
        </AppLayout>
    );
}
