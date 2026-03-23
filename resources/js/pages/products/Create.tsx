import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { ArrowLeft, Plus, X } from 'lucide-react';

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

const BackgroundVisuals = () => (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] animate-pulse delay-700" />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] rounded-full bg-purple-500/10 blur-[80px] animate-bounce-slow" />
    </div>
);

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        detail: '',
        status: 'active',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('products.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product" />
            <BackgroundVisuals />

            <div className="p-4 sm:p-8 max-w-2xl mx-auto relative">
                <div className="mb-6 flex justify-between items-center">
                    <Link
                        href={route('products.index')}
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-all hover:translate-x-[-4px]"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Products
                    </Link>
                </div>

                <Card className="shadow-2xl border-white/20 dark:border-white/10 bg-white/70 dark:bg-gray-900/40 backdrop-blur-xl overflow-hidden">
                    <CardHeader className="border-b border-white/10 pb-8 bg-gradient-to-br from-white/50 to-transparent dark:from-white/5 dark:to-transparent">
                        <CardTitle className="text-3xl font-black tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            Create Product
                        </CardTitle>
                        <CardDescription className="text-base font-medium">
                            Add a fresh item
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={submit}>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Enter product name"
                                    className="focus:ring-2 focus:ring-primary/20 transition-all text-lg font-medium"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="detail">Product Details</Label>
                                <textarea
                                    id="detail"
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none"
                                    value={data.detail}
                                    onChange={(e) => setData('detail', e.target.value)}
                                    placeholder="Enter detailed description of the product..."
                                />
                                <InputError message={errors.detail} />
                            </div>

                            {/* Status is hidden as per user's preference in Create */}
                            <div className="space-y-2 hidden">
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
                            <Link href={route('products.index')}>
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
                                <Plus className="h-4 w-4" />
                                Create Product
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
