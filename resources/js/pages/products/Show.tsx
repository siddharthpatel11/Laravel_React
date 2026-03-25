import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Color, type Product, type Size } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, ArrowLeft, Image as ImageIcon, Calendar, Layers, Maximize, Palette } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
    product: Product;
    colors: Color[];
    sizes: Size[];
}

export default function Show({ product, colors, sizes }: Props) {
    const [activeImage, setActiveImage] = useState(product.image_url);
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Products', href: '/products' },
        { title: product.name, href: `/products/${product.id}` },
    ];

    const { delete: destroy } = useForm();

    const deleteProduct = () => {
        if (confirm('Are you sure you want to delete this product?')) {
            destroy(route('products.destroy', product.id));
        }
    };

    // Helper to get names from IDs
    const getNames = (ids: string[] | null, collection: { id: number; name: string }[]) => {
        if (!ids || ids.length === 0) return [];
        return collection
            .filter(item => ids.includes(item.id.toString()))
            .map(item => item.name);
    };

    const selectedSizes = getNames(product.size_ids, sizes);
    const selectedColors = getNames(product.color_ids, colors);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Product: ${product.name}`} />

            <div className="min-h-screen bg-[#0B1120] text-gray-100 p-4 sm:p-8 font-sans">
                <div className="space-y-8">
                    {/* Header Controls */}
                    <div className="flex justify-between items-center">
                        <Link href={route('products.index')} className="flex items-center text-gray-400 hover:text-white font-bold transition-all group">
                            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Inventory
                        </Link>
                        <div className="flex gap-4">
                            <Link href={route('products.edit', product.id)}>
                                <button className="h-12 px-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white hover:text-black font-bold transition-all">
                                    <Edit className="w-4 h-4 mr-2 inline" /> Edit Product
                                </button>
                            </Link>
                            <button onClick={deleteProduct} className="h-12 px-6 rounded-xl bg-red-600/10 border border-red-600/20 text-red-500 hover:bg-red-600 hover:text-white font-bold transition-all">
                                <Trash className="w-4 h-4 mr-2 inline" /> Delete
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Image Section */}
                        <div className="space-y-6">
                            <div className="aspect-square rounded-[3rem] overflow-hidden ring-1 ring-white/10 shadow-[0_0_80px_rgba(0,0,0,0.4)] bg-[#161F31] relative group">
                                {activeImage ? (
                                    <>
                                        {/* Blurred background for "filling" the space */}
                                        <img
                                            src={activeImage}
                                            alt=""
                                            className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-20 scale-110"
                                        />
                                        {/* Sharp foreground image */}
                                        <div className="absolute inset-0 flex items-center justify-center p-6">
                                            <img
                                                src={activeImage}
                                                alt={product.name}
                                                className="max-w-full max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-700">
                                        <ImageIcon className="w-24 h-24 mb-4" />
                                        <span className="text-xl font-bold uppercase tracking-[0.2em]">No Image</span>
                                    </div>
                                )}
                            </div>

                            {/* Image Selection / Gallery */}
                            {product.image_urls && product.image_urls.length > 1 && (
                                <div className="flex flex-wrap gap-4 pt-2">
                                    {product.image_urls.map((url, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveImage(url)}
                                            className={cn(
                                                "w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all hover:scale-105 active:scale-95 bg-[#161F31]",
                                                activeImage === url ? "border-blue-500 ring-4 ring-blue-500/20" : "border-white/5 hover:border-white/20"
                                            )}
                                        >
                                            <img src={url} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-4">
                                <div className="flex-1 bg-[#161F31]/50 p-6 rounded-3xl border border-white/5 flex items-center justify-between">
                                    <span className="text-gray-500 font-black text-xs uppercase tracking-widest">Base Price</span>
                                    <div className="flex items-center text-3xl font-black text-indigo-400 font-mono">
                                        <span className="mr-1">₹</span>
                                        {product.price}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="space-y-10 py-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Badge className="bg-blue-600 font-bold px-4 py-1.5 rounded-full text-xs tracking-widest">
                                        {product.status.toUpperCase()}
                                    </Badge>
                                    <span className="h-1 w-1 bg-gray-600 rounded-full"></span>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center">
                                        <Layers className="w-3 h-3 mr-1" />
                                        {product.category?.name || 'General Product'}
                                    </span>
                                </div>
                                <h1 className="text-6xl font-black tracking-tighter text-white leading-[1.1]">
                                    {product.name}
                                </h1>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-[0.3em]">Overview</h3>
                                <p className="text-xl text-gray-400 leading-relaxed italic font-medium">
                                    {product.detail}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="bg-[#161F31]/30 p-6 rounded-3xl border border-white/5 group hover:bg-[#161F31]/50 transition-all">
                                    <Maximize className="w-5 h-5 text-blue-400 mb-3" />
                                    <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">Available Sizes</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedSizes.length > 0 ? (
                                            selectedSizes.map(size => (
                                                <Badge key={size} variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 py-1">
                                                    {size}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-gray-500 italic">No specific sizes</span>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-[#161F31]/30 p-6 rounded-3xl border border-white/5 group hover:bg-[#161F31]/50 transition-all">
                                    <Palette className="w-5 h-5 text-indigo-400 mb-3" />
                                    <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">Color Options</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedColors.length > 0 ? (
                                            selectedColors.map(color => (
                                                <Badge key={color} variant="secondary" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-3 py-1">
                                                    {color}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-gray-500 italic">No specific colors</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/5 flex gap-8">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2 flex items-center">
                                        <Calendar className="w-3 h-3 mr-1" /> Records
                                    </span>
                                    <span className="text-sm font-mono text-gray-400">Created {new Date(product.created_at).toLocaleDateString()}</span>
                                    <span className="text-sm font-mono text-gray-400">Modified {new Date(product.updated_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
