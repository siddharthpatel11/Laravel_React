<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::query();

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        return Inertia::render('categories/Index', [
            'categories' => $query->orderBy('name', 'asc')->paginate(10)->withQueryString(),
            'filters' => $request->only(['search', 'status']),
            'success' => session('success'),
        ]);
    }

    public function create()
    {
        return Inertia::render('categories/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|max:255|unique:categories,name',
            'status' => 'required|in:active,inactive,deleted',
        ]);

        Category::create($validated);

        return Redirect::route('categories.index')
            ->with('success', 'Category created successfully.');
    }

    public function show(Category $category)
    {
        return Inertia::render('categories/Show', [
            'category' => $category
        ]);
    }

    public function edit(Category $category)
    {
        return Inertia::render('categories/Edit', [
            'category' => $category,
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|max:255|unique:categories,name,' . $category->id,
            'status' => 'required|in:active,inactive,deleted',
        ]);

        $category->update($validated);

        return Redirect::route('categories.index')
            ->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category)
    {
        $category->delete();
        return Redirect::route('categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}
