import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Category } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash, Eye } from 'lucide-react';
import Pagination from '@/components/ui/pagination';
import { PaginatedData } from '@/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Search, X } from "lucide-react";
import Swal from 'sweetalert2';

interface Props {
    categories: PaginatedData<Category>;
    filters: {
        search?: string;
        status?: string;
    };
    success?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/categories',
    },
];

export default function Index({ categories, filters, success }: Props) {
    const { delete: destroy } = useForm();
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const clearFilters = () => {
        router.get(route('categories.index'), { status: 'active' });
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== (filters.search || '') || status !== (filters.status || 'all')) {
                router.get(route('categories.index'), { search, status }, {
                    preserveState: true,
                    replace: true
                });
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search, status, filters.search, filters.status]);

    useEffect(() => {
        if (success) {
            Swal.fire({
                title: 'Success!',
                text: success,
                icon: 'success',
                background: '#1F2937',
                color: '#fff',
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false
            });
        }
    }, [success]);

    const deleteCategory = (id: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            background: '#1F2937',
            color: '#fff'
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route('categories.destroy', id), {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Category has been deleted.',
                            icon: 'success',
                            background: '#1F2937',
                            color: '#fff'
                        });
                    }
                });
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />

            <div className="p-4 sm:p-8 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold">Categories</h2>
                        <p className="text-muted-foreground">Manage your product hierarchy and settings</p>
                    </div>
                    <Link href={route('categories.create')}>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" /> Create Category
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search categories..."
                            className="pl-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="deleted">Deleted</SelectItem>
                        </SelectContent>
                    </Select>
                    <button
                        onClick={clearFilters}
                        className="h-12 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all flex items-center justify-center border border-white/5"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {categories.data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500 italic">No categories found.</td>
                                </tr>
                            ) : (
                                categories.data.map((category) => (
                                    <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">#{category.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{category.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant={category.status === 'active' ? 'default' : category.status === 'deleted' ? 'destructive' : 'secondary'}>
                                                {category.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <Link href={route('categories.show', category.id)}>
                                                <Button size="icon" variant="ghost">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Link href={route('categories.edit', category.id)}>
                                                <Button size="icon" variant="ghost" className="text-blue-600">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button size="icon" variant="ghost" className="text-red-600" onClick={() => deleteCategory(category.id)}>
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
                    <Pagination links={categories.links} />
                </div>
            </div>
        </AppLayout>
    );
}
