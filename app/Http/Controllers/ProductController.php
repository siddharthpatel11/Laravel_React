<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Color;
use App\Models\Size;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $status = $request->input('status', 'active');
        $search = $request->input('search');
        $categoryId = $request->input('category_id');

        $query = Product::withTrashed()->with('category');

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('detail', 'like', "%{$search}%")
                    ->orWhereHas('category', function ($catQuery) use ($search) {
                        $catQuery->where('name', 'like', "%{$search}%");
                    });

                // Search in Sizes
                $sizeIds = Size::where('name', 'like', "%{$search}%")->pluck('id')->toArray();
                if (!empty($sizeIds)) {
                    foreach ($sizeIds as $id) {
                        $q->orWhereJsonContains('size_ids', (string)$id)
                            ->orWhereJsonContains('size_ids', (int)$id);
                    }
                }

                // Search in Colors
                $colorIds = Color::where('name', 'like', "%{$search}%")->pluck('id')->toArray();
                if (!empty($colorIds)) {
                    foreach ($colorIds as $id) {
                        $q->orWhereJsonContains('color_ids', (string)$id)
                            ->orWhereJsonContains('color_ids', (int)$id);
                    }
                }
            });
        }

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        $products = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();
        $categories = Category::where('status', 'active')->orderBy('name')->get();
        $colors = Color::where('status', 'active')->orderBy('name')->get();
        $sizes = Size::where('status', 'active')->orderBy('name')->get();

        // Calculate global statistics
        $stats = [
            'total' => Product::withTrashed()->count(),
            'active' => Product::withTrashed()->where('status', 'active')->count(),
            'inactive' => Product::withTrashed()->where('status', 'inactive')->count(),
            'deleted' => Product::withTrashed()->where('status', 'deleted')->count(),
        ];

        return Inertia::render('products/Index', [
            'products' => $products,
            'categories' => $categories,
            'colors' => $colors,
            'sizes' => $sizes,
            'stats' => $stats,
            'filters' => [
                'status' => $status,
                'search' => $search,
                'category_id' => $categoryId,
            ],
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('products/Create', [
            'categories' => Category::where('status', 'active')->orderBy('name')->get(),
            'colors' => Color::where('status', 'active')->orderBy('name')->get(),
            'sizes' => Size::where('status', 'active')->orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|max:255|unique:products,name',
            'detail' => 'nullable',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpg,jpeg,png,svg|max:2048',
            'size_ids' => 'nullable|array',
            'color_ids' => 'nullable|array',
            'category_id' => 'required|exists:categories,id',
            'price' => 'nullable|numeric|min:0',
            'status' => 'required|in:active,inactive,deleted',
        ]);

        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $imagePaths[] = $file->store('products', 'public');
            }
        }

        $validated['images'] = $imagePaths;
        $validated['image'] = count($imagePaths) > 0 ? $imagePaths[0] : null;

        Product::create($validated);

        return Redirect::route('products.index')
            ->with('success', 'Product created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->load('category');
        return Inertia::render('products/Show', [
            'product' => $product,
            'colors' => Color::where('status', 'active')->orderBy('name')->get(),
            'sizes' => Size::where('status', 'active')->orderBy('name')->get(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        return Inertia::render('products/Edit', [
            'product' => $product,
            'categories' => Category::where('status', 'active')->orderBy('name')->get(),
            'colors' => Color::where('status', 'active')->orderBy('name')->get(),
            'sizes' => Size::where('status', 'active')->orderBy('name')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|max:255|unique:products,name,' . $product->id,
            'detail' => 'nullable',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpg,jpeg,png,svg|max:2048',
            'existing_images' => 'nullable|array',
            'size_ids' => 'nullable|array',
            'color_ids' => 'nullable|array',
            'category_id' => 'required|exists:categories,id',
            'price' => 'nullable|numeric|min:0',
            'status' => 'required|in:active,inactive,deleted',
        ]);

        $currentImages = $product->images ?: [];
        $keepImages = $request->input('existing_images', []);

        // Delete files not in keep list
        foreach ($currentImages as $img) {
            if (!in_array($img, $keepImages)) {
                Storage::disk('public')->delete($img);
            }
        }

        $imagePaths = $keepImages;
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $imagePaths[] = $file->store('products', 'public');
            }
        }

        $validated['images'] = $imagePaths;
        $validated['image'] = count($imagePaths) > 0 ? $imagePaths[0] : null;

        $product->update($validated);

        return Redirect::route('products.index')
            ->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        // Update status to deleted before soft deleting
        $product->update(['status' => 'deleted']);

        $product->delete();

        return Redirect::route('products.index')
            ->with('success', 'Product deleted successfully.');
        // ->with('success', 'Product moved to trash successfully.');
    }


    public function forceDestroy($id)
    {
        $product = Product::withTrashed()->findOrFail($id);

        // Delete all images from storage
        if ($product->images) {
            foreach ($product->images as $image) {
                Storage::disk('public')->delete($image);
            }
        }

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->forceDelete();

        return Redirect::route('products.index')
            ->with('success', 'Product permanently deleted.');
    }

    public function updateStatus(Request $request, Product $product)
    {
        $validated = $request->validate([
            'status' => 'required|in:active,inactive,deleted',
        ]);

        $product->update($validated);

        return Redirect::back()
            ->with('success', 'Product status updated successfully.');
    }

    public function checkName(Request $request)
    {
        $name = $request->input('name');
        $id = $request->input('id');

        $query = Product::where('name', $name);

        if ($id) {
            $query->where('id', '!=', $id);
        }

        $exists = $query->exists();

        return response()->json([
            'exists' => $exists,
            'message' => $exists ? 'The name has already been taken.' : null
        ]);
    }
}
