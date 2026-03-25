<?php

namespace App\Http\Controllers;

use App\Models\Color;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class ColorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Color::query();

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        return Inertia::render('colors/Index', [
            'colors' => $query->orderBy('name', 'asc')->paginate(10)->withQueryString(),
            'filters' => $request->only(['search', 'status']),
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('colors/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|max:255|unique:colors,name',
            'hex_code' => 'nullable|max:255',
            'status' => 'required|in:active,inactive,deleted',
        ]);

        Color::create($validated);

        return Redirect::route('colors.index')
            ->with('success', 'Color created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Color $color)
    {
        return Inertia::render('colors/Show', [
            'color' => $color
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Color $color)
    {
        return Inertia::render('colors/Edit', [
            'color' => $color,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Color $color)
    {
        $validated = $request->validate([
            'name' => 'required|max:255|unique:colors,name,' . $color->id,
            'hex_code' => 'nullable|max:255',
            'status' => 'required|in:active,inactive,deleted',
        ]);

        $color->update($validated);

        return Redirect::route('colors.index')
            ->with('success', 'Color updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Color $color)
    {
        $color->delete();

        return Redirect::route('colors.index')
            ->with('success', 'Color deleted successfully.');
    }
}
