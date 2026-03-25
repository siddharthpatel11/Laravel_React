import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Color } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { ArrowLeft, Save, X } from 'lucide-react';

/*
interface Props {
    color: Color;
    categories: Category[];
}
*/
interface Props {
    color: Color;
}

const BackgroundVisuals = () => (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] animate-pulse delay-700" />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] rounded-full bg-purple-500/10 blur-[80px] animate-bounce-slow" />
    </div>
);

export default function Edit({ color /*, categories */ }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Colors',
            href: '/colors',
        },
        {
            title: 'Edit Color',
            href: `/colors/${color.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: color.name,
        hex_code: color.hex_code || '#000000',
        // category_id: color.category_id ? color.category_id.toString() : '',
        status: color.status,
    });

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const fetchColorName = async () => {
            if (data.hex_code && data.hex_code.startsWith('#')) {
                try {
                    const response = await fetch(`https://www.thecolorapi.com/id?hex=${data.hex_code.substring(1)}`);
                    const result = await response.json();
                    if (result.name && result.name.value) {
                        setData('name', result.name.value);
                    }
                } catch (error) {
                    console.error('Error fetching color name:', error);
                }
            }
        };

        const timeoutId = setTimeout(fetchColorName, 500);
        return () => clearTimeout(timeoutId);
    }, [data.hex_code, setData]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('colors.update', color.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Color: ${color.name}`} />
            <BackgroundVisuals />

            <div className="p-4 sm:p-8 space-y-6 relative">
                <div className="mb-6 flex justify-between items-center">
                    <Link
                        href={route('colors.index')}
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-all hover:translate-x-[-4px]"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Colors
                    </Link>
                </div>

                <Card className="shadow-2xl border-white/20 dark:border-white/10 bg-white/70 dark:bg-gray-900/40 backdrop-blur-xl overflow-hidden">
                    <CardHeader className="border-b border-white/10 pb-8 bg-gradient-to-br from-white/50 to-transparent dark:from-white/5 dark:to-transparent">
                        <CardTitle className="text-3xl font-black tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            Edit Color
                        </CardTitle>
                    </CardHeader>
                    <form onSubmit={submit}>
                        <CardContent className="space-y-6 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Color Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g. Midnight Blue"
                                        className="focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="hex_code">Hex Code</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="hex_code"
                                            type="color"
                                            value={data.hex_code}
                                            onChange={(e) => setData('hex_code', e.target.value)}
                                            className="w-12 p-1 h-10 cursor-pointer"
                                        />
                                        <Input
                                            value={data.hex_code}
                                            onChange={(e) => setData('hex_code', e.target.value)}
                                            placeholder="#000000"
                                            className="flex-1 font-mono"
                                        />
                                    </div>
                                    <InputError message={errors.hex_code} />
                                </div>
                            </div>

                            {/*
                            <div className="space-y-2">
                                <Label htmlFor="category_id">Category</Label>
                                <Select
                                    value={data.category_id}
                                    onValueChange={(value) => setData('category_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.category_id} />
                            </div>
                            */}

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(value) => setData('status', value as 'active' | 'inactive' | 'deleted')}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="deleted">Deleted</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.status} />
                            </div>
                        </CardContent>

                        <CardFooter className="flex items-center justify-end space-x-4 border-t border-white/10 pt-6 bg-white/30 dark:bg-black/20">
                            <Link href={route('colors.index')}>
                                <Button variant="ghost" type="button" className="gap-2 hover:bg-white/20">
                                    <X className="h-4 w-4" />
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="gap-2 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Save className="h-4 w-4" />
                                Save Changes
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
