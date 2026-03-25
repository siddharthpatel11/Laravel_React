import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Product, type Category, type Color, type Size } from '@/types';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useEffect } from 'react';
import { Plus, Edit, Trash, Eye, Box, Layers, ChevronDown } from 'lucide-react';
import Pagination from '@/components/ui/pagination';
import { PaginatedData } from '@/types';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";
import Swal from 'sweetalert2';

interface Props {
    products: PaginatedData<Product>;
    categories: Category[];
    colors: Color[];
    sizes: Size[];
    stats: {
        total: number;
        active: number;
        inactive: number;
        deleted: number;
    };
    filters: {
        search: string | null;
        category_id: string | null;
        status: string | null;
    };
    success?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Products', href: '/products' },
];

export default function Index({ products, categories, colors, sizes, stats, filters, success }: Props) {
    const { delete: destroy } = useForm();

    const onFilterChange = (key: string, value: string | null) => {
        const newFilters = { ...filters, [key]: value };
        // Reset category_id if it's 'all'
        if (key === 'category_id' && value === 'all') newFilters.category_id = null;

        router.get(route('products.index'), newFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        router.get(route('products.index'), { status: 'active' });
    };

    const handleStatusChange = (id: number, status: string) => {
        router.patch(route('products.update-status', id), { status });
    };

    const deleteProduct = (id: number) => {
        Swal.fire({
            title: 'Move to Trash?',
            text: "This product will be archived but can be restored later.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#fbbf24',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, trash it!',
            background: '#1F2937',
            color: '#fff'
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route('products.destroy', id), {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Trashed!',
                            text: 'Product has been moved to deleted status.',
                            icon: 'success',
                            background: '#1F2937',
                            color: '#fff'
                        });
                    }
                });
            }
        });
    };

    const forceDeleteProduct = (id: number) => {
        Swal.fire({
            title: 'PERMANENT DELETE?',
            text: "Warning: This will permanently remove the product and all its images. This action CANNOT be undone!",
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'YES, PURGE IT!',
            background: '#111827',
            color: '#fff',
            customClass: {
                confirmButton: 'font-black uppercase tracking-tighter shadow-[0_0_20px_rgba(239,68,68,0.5)]',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('products.force-destroy', id), {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Purged!',
                            text: 'Product and media have been permanently removed.',
                            icon: 'success',
                            background: '#1F2937',
                            color: '#fff'
                        });
                    }
                });
            }
        });
    };

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            <div className="p-4 sm:p-8 space-y-8 bg-background/50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-foreground">Inventory</h2>
                        <p className="text-muted-foreground font-medium">Manage and track your product catalog</p>
                    </div>
                    <Link href={route('products.create')}>
                        <button className="h-12 px-6 rounded-xl bg-primary text-primary-foreground font-bold flex items-center hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-95">
                            <Plus className="w-5 h-5 mr-2" /> Add New Product
                        </button>
                    </Link>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { id: 'all', label: 'Total Products', value: stats.total, icon: Box, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                        { id: 'active', label: 'Active', value: stats.active, icon: Layers, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                        { id: 'inactive', label: 'Inactive', value: stats.inactive, icon: Eye, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                        { id: 'deleted', label: 'Deleted', value: stats.deleted, icon: Trash, color: 'text-red-500', bg: 'bg-red-500/10' },
                    ].map((stat, i) => (
                        <button 
                            key={i} 
                            onClick={() => onFilterChange('status', stat.id)}
                            className={cn(
                                "bg-card border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all text-left flex flex-col group active:scale-[0.98]",
                                filters.status === stat.id ? "border-primary ring-1 ring-primary/20" : "border-border/50"
                            )}
                        >
                            <div className="flex justify-between items-start w-full">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{stat.label}</p>
                                    <h3 className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</h3>
                                </div>
                                <div className={cn("p-2 rounded-xl transition-all group-hover:scale-110", stat.bg)}>
                                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 bg-card border border-border/50 p-4 rounded-2xl shadow-sm">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, size, or color..."
                            className="pl-10 bg-muted/30 border-border/50 h-11 rounded-xl focus-visible:ring-primary/20"
                            defaultValue={filters.search || ''}
                            onChange={(e) => onFilterChange('search', e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="w-40">
                            <Select
                                value={filters.category_id || 'all'}
                                onValueChange={(val) => onFilterChange('category_id', val)}
                            >
                                <SelectTrigger className="h-11 bg-muted/30 border-border/50 rounded-xl">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-40">
                            <Select
                                value={filters.status || 'active'}
                                onValueChange={(val) => onFilterChange('status', val)}
                            >
                                <SelectTrigger className="h-11 bg-muted/30 border-border/50 rounded-xl uppercase font-bold text-[10px] tracking-widest">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="deleted">Deleted</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <button
                            onClick={clearFilters}
                            className="h-11 w-11 flex items-center justify-center rounded-xl bg-muted/30 hover:bg-muted/50 border border-border/50 text-muted-foreground transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-card border border-border/50 rounded-[2rem] overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border/50 bg-muted/20">
                                    <th className="px-6 py-5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider w-12">#</th>
                                    <th className="px-6 py-5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Sizes</th>
                                    <th className="px-6 py-5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Colors</th>
                                    <th className="px-6 py-5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {products.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-20 text-center">
                                            <Box className="w-12 h-12 mx-auto mb-4 text-muted/30" />
                                            <p className="text-muted-foreground text-lg font-medium">No results found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    products.data.map((product, index) => (
                                        <tr key={product.id} className="group hover:bg-muted/30 transition-all duration-200">
                                            <td className="px-6 py-5 text-sm font-medium text-muted-foreground/50">
                                                {(products.from ?? 0) + index}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border/50">
                                                        {product.image_url ? (
                                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Box className="w-5 h-5 text-muted/50" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-base font-bold text-foreground truncate group-hover:text-primary transition-colors">
                                                            {product.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground truncate italic">
                                                            {product.detail || 'No details...'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm">
                                                <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                                                    <Layers className="w-3.5 h-3.5 opacity-40" />
                                                    {product.category?.name || 'General'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-wrap gap-1 max-w-[120px]">
                                                    {product.size_ids?.map(id => {
                                                        const size = sizes.find(s => s.id.toString() === id.toString());
                                                        return (
                                                            <span key={id} className="px-1.5 py-0.5 rounded-md bg-muted text-[10px] font-bold border border-border/50 text-muted-foreground">
                                                                {size?.name || id}
                                                            </span>
                                                        );
                                                    })}
                                                    {(!product.size_ids || product.size_ids.length === 0) && (
                                                        <span className="text-muted-foreground/30 text-[10px]">--</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-wrap gap-1 max-w-[120px]">
                                                    {product.color_ids?.map(id => {
                                                        const color = colors.find(c => c.id.toString() === id.toString());
                                                        return (
                                                            <div key={id} className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-muted text-[10px] font-bold border border-border/50 text-muted-foreground">
                                                                {color?.hex_code && (
                                                                    <span className="w-2 h-2 rounded-full border border-border/50" style={{ backgroundColor: color.hex_code }} />
                                                                )}
                                                                {color?.name || id}
                                                            </div>
                                                        );
                                                    })}
                                                    {(!product.color_ids || product.color_ids.length === 0) && (
                                                        <span className="text-muted-foreground/30 text-[10px]">--</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-base font-black text-foreground">
                                                    ₹{parseFloat(product.price).toLocaleString('en-IN')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button
                                                            className={cn(
                                                                "px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border flex items-center gap-1.5 transition-all",
                                                                product.status === 'active' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                                                                    product.status === 'inactive' ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                                                                        "bg-red-500/10 text-red-600 border-red-500/20"
                                                            )}
                                                        >
                                                            {product.status}
                                                            <ChevronDown className="w-3 h-3 opacity-40" />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-32">
                                                        <DropdownMenuItem onClick={() => handleStatusChange(product.id, 'active')} className="text-emerald-600 focus:text-emerald-600">Active</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatusChange(product.id, 'inactive')} className="text-amber-600 focus:text-amber-600">Inactive</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatusChange(product.id, 'deleted')} className="text-red-600 focus:text-red-600">Deleted</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-1.5">
                                                    <Link href={route('products.show', product.id)}>
                                                        <button className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    </Link>
                                                    <Link href={route('products.edit', product.id)}>
                                                        <button className="p-2 text-blue-600 hover:bg-blue-500/10 rounded-lg transition-colors">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                    </Link>
                                                    {product.status === 'deleted' ? (
                                                        <button
                                                            onClick={() => forceDeleteProduct(product.id)}
                                                            className="p-2 text-red-600 hover:bg-red-500/10 rounded-lg transition-colors group relative"
                                                            title="Permanent Delete"
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm border border-border">Purge</span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => deleteProduct(product.id)}
                                                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors group relative"
                                                            title="Move to Trash"
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm border border-border">Trash</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex justify-center pt-4">
                    <Pagination links={products.links} />
                </div>
            </div>
        </AppLayout>
    );
}

