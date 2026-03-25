import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Size } from '@/types';
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
    sizes: PaginatedData<Size>;
    filters: {
        search?: string;
        status?: string;
    };
    success?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sizes',
        href: '/sizes',
    },
];

export default function Index({ sizes, filters, success }: Props) {
    const { delete: destroy } = useForm();
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const clearFilters = () => {
        router.get(route('sizes.index'), { status: 'active' });
    };


    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== (filters.search || '') || status !== (filters.status || 'all')) {
                router.get(route('sizes.index'), { search, status }, {
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

    const deleteSize = (id: number) => {
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
                destroy(route('sizes.destroy', id), {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Size has been deleted.',
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
            <Head title="Sizes" />

            <div className="p-4 sm:p-8 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold">Sizes</h2>
                        <p className="text-muted-foreground">Manage your product sizes</p>
                    </div>
                    <Link href={route('sizes.create')}>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" /> Create Size
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search sizes..."
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

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
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
                            {sizes.data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500 italic">No sizes found.</td>
                                </tr>
                            ) : (
                                sizes.data.map((size, index) => (
                                    <tr key={size.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {sizes.from + index}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{size.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant={size.status === 'active' ? 'default' : size.status === 'deleted' ? 'destructive' : 'secondary'}>
                                                {size.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <Link href={route('sizes.show', size.id)}>
                                                <Button size="icon" variant="ghost">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Link href={route('sizes.edit', size.id)}>
                                                <Button size="icon" variant="ghost" className="text-blue-600">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button size="icon" variant="ghost" className="text-red-600" onClick={() => deleteSize(size.id)}>
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
                    <Pagination links={sizes.links} />
                </div>
            </div>
        </AppLayout>
    );
}
