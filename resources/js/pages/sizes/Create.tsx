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
        title: 'Sizes',
        href: '/sizes',
    },
    {
        title: 'Create',
        href: '/sizes/create',
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
        status: 'active',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('sizes.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Size" />
            <BackgroundVisuals />

            <div className="p-4 sm:p-8 space-y-6 relative">
                <div className="mb-6 flex justify-between items-center">
                    <Link
                        href={route('sizes.index')}
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-all hover:translate-x-[-4px]"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Sizes
                    </Link>
                </div>

                <Card className="shadow-2xl border-white/20 dark:border-white/10 bg-white/70 dark:bg-gray-900/40 backdrop-blur-xl overflow-hidden">
                    <CardHeader className="border-b border-white/10 pb-8 bg-gradient-to-br from-white/50 to-transparent dark:from-white/5 dark:to-transparent">
                        <CardTitle className="text-3xl font-black tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            Create Size
                        </CardTitle>
                        <CardDescription className="text-base font-medium">
                            Add a new size (e.g. XL, 42, 10-inch)
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={submit}>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Size Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Large / 44"
                                    className="focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                />
                                <InputError message={errors.name} />
                            </div>

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
                            <Link href={route('sizes.index')}>
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
                                Create Size
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
