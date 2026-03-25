import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Category, type Color, type Product, type Size } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import InputError from '@/components/input-error';
import { ArrowLeft, Save, X, Upload, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { cn } from '@/lib/utils';
import Swal from 'sweetalert2';

interface Props {
    product: Product;
    categories: Category[];
    colors: Color[];
    sizes: Size[];
}

export default function Edit({ product, categories, colors, sizes }: Props) {


    const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
        _method: 'PUT',
        name: product.name,
        detail: product.detail,
        images: [] as File[],
        existing_images: (product.images && product.images.length > 0 
            ? product.images 
            : (product.image ? [product.image] : [])
        ) as string[],
        size_ids: product.size_ids || [] as string[],
        color_ids: product.color_ids || [] as string[],
        category_id: product.category_id ? product.category_id.toString() : '',
        price: product.price,
        status: product.status,
    });

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isCheckingName, setIsCheckingName] = useState(false);

    useEffect(() => {
        if (data.name.length < 3 || data.name === product.name) {
            clearErrors('name');
            return;
        }

        const timeoutId = setTimeout(async () => {
            setIsCheckingName(true);
            try {
                const response = await axios.get(route('products.check-name'), {
                    params: { name: data.name, id: product.id }
                });

                if (response.data.exists) {
                    setError('name', response.data.message);
                } else {
                    clearErrors('name');
                }
            } catch (error) {
                console.error('Error checking name uniqueness', error);
            } finally {
                setIsCheckingName(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [data.name, product.name, product.id, setError, clearErrors]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const newImages = [...data.images, ...files];
            setData('images', newImages);

            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreviews(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeNewImage = (index: number) => {
        Swal.fire({
            title: 'Remove image?',
            text: "This will remove the newly selected image.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!',
            background: '#1F2937',
            color: '#fff'
        }).then((result) => {
            if (result.isConfirmed) {
                const newImages = data.images.filter((_, i) => i !== index);
                const newPreviews = imagePreviews.filter((_, i) => i !== index);
                setData('images', newImages);
                setImagePreviews(newPreviews);
            }
        });
    };

    const removeExistingImage = (index: number) => {
        Swal.fire({
            title: 'Remove existing image?',
            text: "This image will be removed from the gallery after you save.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, remove it!',
            background: '#1F2937',
            color: '#fff'
        }).then((result) => {
            if (result.isConfirmed) {
                const newExisting = data.existing_images.filter((_, i) => i !== index);
                setData('existing_images', newExisting);
            }
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Products', href: '/products' },
        { title: 'Edit Product', href: `/products/${product.id}/edit` },
    ];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('products.update', product.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Product: ${product.name}`} />
            
            <div className="min-h-screen bg-[#0B1120] text-white p-4 sm:p-8 font-sans transition-all">
                <div className="space-y-8">
                    <div className="flex items-center">
                        <Link href={route('products.index')} className="flex items-center text-gray-400 hover:text-white transition-colors group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">Back to Products</span>
                        </Link>
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                            Edit Product
                        </h1>
                        <p className="text-gray-400 text-lg font-medium">Refine your item details</p>
                    </div>

                    <form onSubmit={submit} className="space-y-8">
                        <div className="space-y-6 bg-[#161F31]/50 p-8 rounded-3xl border border-white/5 backdrop-blur-xl shadow-2xl">
                            <div className="space-y-3">
                                <Label htmlFor="name" className="text-gray-200 text-base font-semibold">Product Name <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={cn(
                                            "h-14 bg-[#0B1120]/80 border-white/10 text-white rounded-2xl border-2 transition-all",
                                            errors.name && "border-red-500/50 focus:ring-red-500/50"
                                        )}
                                    />
                                    {isCheckingName && (
                                        <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 animate-spin" />
                                    )}
                                </div>
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="detail" className="text-gray-200 text-base font-semibold">Product Details</Label>
                                <Textarea
                                    id="detail"
                                    value={data.detail}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('detail', e.target.value)}
                                    placeholder="Enter detailed description of the product..."
                                    className="min-h-[160px] bg-[#0B1120]/80 border-white/10 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500/50 rounded-2xl border-2 transition-all resize-none"
                                />
                                <InputError message={errors.detail} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <div className="space-y-3">
                                    <Label htmlFor="category_id" className="text-gray-200 text-base font-semibold">Category <span className="text-red-500">*</span></Label>
                                    <Select value={data.category_id} onValueChange={(v) => setData('category_id', v)}>
                                        <SelectTrigger className="h-14 bg-[#0B1120]/80 border-white/10 text-white rounded-2xl border-2">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#161F31] border-white/10 text-white">
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.category_id} />
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="price" className="text-gray-200 text-base font-semibold">Price</Label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            value={data.price}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('price', e.target.value)}
                                            className="h-14 pl-8 bg-[#0B1120]/80 border-white/10 text-white rounded-2xl border-2 transition-all font-mono"
                                        />
                                    </div>
                                    <InputError message={errors.price} />
                                </div>
                            </div>

                            {/* Image Management Section */}
                            <div className="space-y-6 pt-4 border-t border-white/5">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-gray-200 text-lg font-bold">Product Media</Label>
                                        <span className="text-xs text-gray-500 font-medium bg-white/5 px-3 py-1 rounded-full border border-white/5 font-mono">
                                            {data.existing_images.length + data.images.length} Image(s)
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-gray-500 font-medium flex items-center gap-1.5 ml-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></span>
                                        Accepted formats: <span className="text-gray-400 font-bold uppercase tracking-wider">JPG, JPEG, PNG</span> only
                                    </p>
                                </div>

                                {/* Current Gallery */}
                                {data.existing_images.length > 0 && (
                                    <div className="space-y-3">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Current Gallery</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                            {data.existing_images.map((img, index) => {
                                                // Try to find the full URL from image_urls, fallback to reconstructed path
                                                const imageUrl = product.image_urls?.find(url => url.endsWith(img)) || `/storage/${img}`;

                                                return (
                                                    <div key={`existing-${index}`} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-white/10 group bg-[#0B1120] hover:border-blue-500/30 transition-all">
                                                        <img src={imageUrl} alt={`Existing ${index}`} className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                            <button 
                                                                type="button"
                                                                onClick={() => removeExistingImage(index)}
                                                                className="p-3 bg-red-500 rounded-full hover:bg-red-600 transition-all transform hover:scale-110 shadow-lg active:scale-90"
                                                                title="Remove Image"
                                                            >
                                                                <X className="w-5 h-5 text-white" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* New Uploads */}
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Add New Media</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={`new-${index}`} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-blue-500/50 group bg-[#0B1120] shadow-[0_0_20px_rgba(37,99,235,0.1)]">
                                                <img src={preview} alt={`New Preview ${index}`} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                    <button 
                                                        type="button"
                                                        onClick={() => removeNewImage(index)}
                                                        className="p-3 bg-red-500 rounded-full hover:bg-red-600 transition-all transform hover:scale-110 shadow-lg active:scale-90"
                                                    >
                                                        <X className="w-5 h-5 text-white" />
                                                    </button>
                                                </div>
                                                <div className="absolute top-2 left-2 bg-blue-600 text-[10px] font-black px-2 py-0.5 rounded-full text-white shadow-lg tracking-tighter ring-1 ring-white/20">
                                                    NEW
                                                </div>
                                            </div>
                                        ))}

                                        <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-2xl cursor-pointer bg-[#0B1120]/40 hover:bg-[#0B1120]/60 border-white/10 hover:border-blue-500/50 transition-all group hover:shadow-[0_0_30px_rgba(37,99,235,0.1)]">
                                            <div className="flex flex-col items-center justify-center p-4 text-center">
                                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-2 group-hover:bg-blue-500/20 transition-colors">
                                                    <Upload className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                                                </div>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Upload</p>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageChange} />
                                        </label>
                                    </div>
                                </div>
                                <InputError message={errors.images as unknown as string} />
                            </div>

                            {/* Row 2: Size & Color Multi-Select */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <div className="space-y-3">
                                    <Label htmlFor="size_ids" className="text-gray-200 text-base font-semibold">Sizes</Label>
                                    <MultiSelect
                                        options={sizes.map(s => ({ label: s.name, value: s.id.toString() }))}
                                        selected={data.size_ids}
                                        onChange={(v) => setData('size_ids', v)}
                                        placeholder="Select Sizes"
                                        className="bg-[#0B1120]/80 border-white/10 text-white rounded-2xl border-2"
                                    />
                                    <InputError message={errors.size_ids} />
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="color_ids" className="text-gray-200 text-base font-semibold">Colors</Label>
                                    <MultiSelect
                                        options={colors.map(c => ({ label: c.name, value: c.id.toString() }))}
                                        selected={data.color_ids}
                                        onChange={(v) => setData('color_ids', v)}
                                        placeholder="Select Colors"
                                        className="bg-[#0B1120]/80 border-white/10 text-white rounded-2xl border-2"
                                    />
                                    <InputError message={errors.color_ids} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <div className="space-y-3">
                                    <Label htmlFor="status" className="text-gray-200 text-base font-semibold">Status</Label>
                                    <Select value={data.status} onValueChange={(v) => setData('status', v as 'active' | 'inactive' | 'deleted')}>
                                        <SelectTrigger className="h-14 bg-[#0B1120]/80 border-white/10 text-white rounded-2xl border-2">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#161F31] border-white/10 text-white">
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                            <SelectItem value="deleted">Deleted</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4">
                            <Link href={route('products.index')}>
                                <button type="button" className="flex items-center text-gray-400 hover:text-white font-bold text-xl transition-colors group px-6 py-4">
                                    <X className="w-6 h-6 mr-3 text-gray-500" />
                                    Cancel
                                </button>
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="h-16 px-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xl font-bold font-sans shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all hover:scale-[1.03] active:scale-[0.98] flex items-center disabled:opacity-50"
                            >
                                <Save className="w-6 h-6 mr-3" />
                                Update Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
