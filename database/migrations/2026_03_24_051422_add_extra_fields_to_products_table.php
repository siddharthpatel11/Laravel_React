<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'image')) {
                $table->string('image')->nullable()->after('detail');
            }
            if (!Schema::hasColumn('products', 'size_id')) {
                $table->string('size_id')->nullable()->after('image');
            }
            if (!Schema::hasColumn('products', 'color_id')) {
                $table->string('color_id')->nullable()->after('size_id');
            }
            if (!Schema::hasColumn('products', 'category_id')) {
                $table->unsignedBigInteger('category_id')->nullable()->index()->after('color_id');
            } else {
                // If it exists but is NOT NULL, make it null
                $table->unsignedBigInteger('category_id')->nullable()->change();
            }
            if (!Schema::hasColumn('products', 'price')) {
                $table->decimal('price', 10, 2)->nullable()->after('category_id');
            }
        });

        // Set category_id to NULL where it is 0 to avoid FK constraint issues
        \DB::table('products')->where('category_id', 0)->update(['category_id' => null]);

        Schema::table('products', function (Blueprint $table) {
            try {
                $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
            } catch (\Exception $e) {
                // Ignore if already exists or fails for some reason
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn(['image', 'size_id', 'color_id', 'category_id', 'price']);
        });
    }
};
