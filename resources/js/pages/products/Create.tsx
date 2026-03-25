import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Category, type Color, type Size } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import InputError from '@/components/input-error';
import { cn } from '@/lib/utils';
import { ArrowLeft, Plus, X, Upload, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Props {
    categories: Category[];
    colors: Color[];
    sizes: Size[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
    {
        title: 'Create',
        href: '/products/create',
    },
];

export default function Create({ categories, colors, sizes }: Props) {
    // We now use imagePreviews array


    const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
        name: '',
        detail: '',
        images: [] as File[],
        size_ids: [] as string[],
        color_ids: [] as string[],
        category_id: '',
        price: '',
        status: 'active',
    });

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isCheckingName, setIsCheckingName] = useState(false);

    useEffect(() => {
        if (data.name.length < 3) {
            clearErrors('name');
            return;
        }

        const timeoutId = setTimeout(async () => {
            setIsCheckingName(true);
            try {
                const response = await axios.get(route('products.check-name'), {
                    params: { name: data.name }
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
    }, [data.name, setError, clearErrors]);

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

    const removeImage = (index: number) => {
        const newImages = data.images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setData('images', newImages);
        setImagePreviews(newPreviews);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('products.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product" />

            <div className="min-h-screen bg-[#0B1120] text-white p-4 sm:p-8 font-sans transition-all">
                <div className="space-y-8">
                    {/* Header Link */}
                    <div className="flex items-center">
                        <Link
                            href={route('products.index')}
                            className="flex items-center text-gray-400 hover:text-white transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">Back to Products</span>
                        </Link>
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                            Create Product
                        </h1>
                        <p className="text-gray-400 text-lg font-medium">Add a fresh item</p>
                    </div>

                    <form onSubmit={submit} className="space-y-8">
                        <div className="space-y-6 bg-[#161F31]/50 p-8 rounded-3xl border border-white/5 backdrop-blur-xl shadow-2xl">
                            {/* Product Name */}
                            <div className="space-y-3">
                                <Label htmlFor="name" className="text-gray-200 text-base font-semibold">Product Name <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Enter product name"
                                        className={cn(
                                            "h-14 bg-[#0B1120]/80 border-white/10 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500/50 rounded-2xl border-2 transition-all",
                                            errors.name && "border-red-500/50 focus:ring-red-500/50"
                                        )}
                                    />
                                    {isCheckingName && (
                                        <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 animate-spin" />
                                    )}
                                </div>
                                <InputError message={errors.name} className="text-red-400" />
                            </div>

                            {/* Product Details */}
                            <div className="space-y-3">
                                <Label htmlFor="detail" className="text-gray-200 text-base font-semibold">Product Details</Label>
                                <Textarea
                                    id="detail"
                                    value={data.detail}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('detail', e.target.value)}
                                    placeholder="Enter detailed description of the product..."
                                    className="min-h-[160px] bg-[#0B1120]/80 border-white/10 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500/50 rounded-2xl border-2 transition-all resize-none"
                                />
                                <InputError message={errors.detail} className="text-red-400" />
                            </div>

                            {/* Additional Fields Row 1: Category & Price */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <div className="space-y-3">
                                    <Label htmlFor="category_id" className="text-gray-200 text-base font-semibold">Category <span className="text-red-500">*</span></Label>
                                    <Select value={data.category_id} onValueChange={(v) => setData('category_id', v)}>
                                        <SelectTrigger className="h-14 bg-[#0B1120]/80 border-white/10 text-white rounded-2xl border-2 focus:ring-2 focus:ring-blue-500/50">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#161F31] border-white/10 text-white rounded-xl">
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
                                            onChange={(e) => setData('price', e.target.value)}
                                            placeholder="0.00"
                                            className="h-14 pl-8 bg-[#0B1120]/80 border-white/10 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500/50 rounded-2xl border-2 transition-all font-mono"
                                        />
                                    </div>
                                    <InputError message={errors.price} />
                                </div>
                            </div>

                            {/* Image Upload Section */}
                            <div className="space-y-6 pt-4 border-t border-white/5">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-gray-200 text-lg font-bold">Product Media</Label>
                                        <span className="text-xs text-gray-500 font-medium bg-white/5 px-3 py-1 rounded-full border border-white/5 font-mono">
                                            {data.images.length} Image(s)
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-gray-500 font-medium flex items-center gap-1.5 ml-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></span>
                                        Accepted formats: <span className="text-gray-400 font-bold uppercase tracking-wider">JPG, JPEG, PNG</span> only
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-white/10 group bg-[#0B1120] hover:border-blue-500/30 transition-all">
                                            <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="p-3 bg-red-500 rounded-full hover:bg-red-600 transition-all transform hover:scale-110 shadow-lg active:scale-90"
                                                >
                                                    <X className="w-5 h-5 text-white" />
                                                </button>
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
                                <InputError message={errors.images as unknown as string} />
                            </div>
                            {/* Row 2: Size & Color */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex items-center justify-between pt-4">
                            <Link href={route('products.index')}>
                                <button type="button" className="flex items-center text-gray-400 hover:text-white font-bold text-xl transition-colors group px-6 py-4">
                                    <X className="w-6 h-6 mr-3 text-gray-500 group-hover:rotate-90 transition-transform" />
                                    Cancel
                                </button>
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="h-16 px-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xl font-bold font-sans shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all hover:scale-[1.03] active:scale-[0.98] flex items-center disabled:opacity-50 disabled:scale-100"
                            >
                                <Plus className="w-6 h-6 mr-3" />
                                Create Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
