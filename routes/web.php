<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ColorController;
use App\Http\Controllers\SizeController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('products/check-name', [ProductController::class, 'checkName'])->name('products.check-name');
    Route::delete('products/{id}/force', [ProductController::class, 'forceDestroy'])->name('products.force-destroy');
    Route::resource('products', ProductController::class);
    Route::patch('products/{product}/status', [ProductController::class, 'updateStatus'])->name('products.update-status');
    Route::resource('categories', CategoryController::class);
    Route::resource('colors', ColorController::class);
    Route::resource('sizes', SizeController::class);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
