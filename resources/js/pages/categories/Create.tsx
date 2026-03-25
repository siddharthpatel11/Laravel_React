import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { ArrowLeft, Save, X } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/categories',
    },
    {
        title: 'Create',
        href: '/categories/create',
    },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        status: 'active',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('categories.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Category" />

            <div className="p-4 sm:p-8 space-y-6">
                <div className="mb-6">
                    <Link
                        href={route('categories.index')}
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-all"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Categories
                    </Link>
                </div>

                <Card className="shadow-lg border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Create Category</CardTitle>
                        <CardDescription>
                            Add a new category to organize your products.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={submit}>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Category Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Electronics"
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

                        <CardFooter className="flex items-center justify-end space-x-4 border-t border-gray-100 dark:border-gray-800 pt-6">
                            <Link href={route('categories.index')}>
                                <Button variant="ghost" type="button" className="gap-2">
                                    <X className="h-4 w-4" />
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="gap-2 px-8"
                            >
                                <Save className="h-4 w-4" />
                                Save Category
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
