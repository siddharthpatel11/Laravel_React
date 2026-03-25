import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
export interface Product {
    id: number;
    name: string;
    detail: string;
    image: string | null;
    image_url: string | null;
    images: string[] | null;
    image_urls: string[] | null;
    size_ids: string[] | null;
    color_ids: string[] | null;
    category_id: number | null;
    price: string;
    status: 'active' | 'inactive' | 'deleted';
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    category?: Category;
}

export interface Category {
    id: number;
    name: string;
    status: 'active' | 'inactive' | 'deleted';
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface Color {
    id: number;
    name: string;
    hex_code: string | null;
    category_id: number;
    status: 'active' | 'inactive' | 'deleted';
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    category?: Category;
}

export interface Size {
    id: number;
    name: string;
    status: 'active' | 'inactive' | 'deleted';
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedData<T> {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}
