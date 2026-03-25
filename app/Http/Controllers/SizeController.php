<?php

namespace App\Http\Controllers;

use App\Models\Size;
use Illuminate\Http\Request;

use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class SizeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Size::query();

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        return Inertia::render('sizes/Index', [
            'sizes' => $query->orderBy('name', 'asc')->paginate(10)->withQueryString(),
            'filters' => $request->only(['search', 'status']),
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('sizes/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|max:255|unique:sizes,name',
            'status' => 'required|in:active,inactive,deleted',
        ]);

        Size::create($validated);

        return Redirect::route('sizes.index')
            ->with('success', 'Size created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Size $size)
    {
        return Inertia::render('sizes/Show', [
            'size' => $size
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Size $size)
    {
        return Inertia::render('sizes/Edit', [
            'size' => $size
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Size $size)
    {
        $validated = $request->validate([
            'name' => 'required|max:255|unique:sizes,name,' . $size->id,
            'status' => 'required|in:active,inactive,deleted',
        ]);

        $size->update($validated);

        return Redirect::route('sizes.index')
            ->with('success', 'Size updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Size $size)
    {
        $size->delete();

        return Redirect::route('sizes.index')
            ->with('success', 'Size deleted successfully.');
    }
}
