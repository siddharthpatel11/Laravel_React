<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Drop existing columns if they exist (to transform them to JSON)
            // Rename is also an option, but changing type to JSON is safer by dropping and re-adding if they have data that isn't JSON.
            // However, we can also just rename and then change type if using standard SQL.
            // In Laravel, change() on string to JSON might be tricky depending on the DB driver.
            
            if (Schema::hasColumn('products', 'size_id')) {
                $table->dropColumn('size_id');
            }
            if (Schema::hasColumn('products', 'color_id')) {
                $table->dropColumn('color_id');
            }
            
            $table->json('size_ids')->nullable()->after('image');
            $table->json('color_ids')->nullable()->after('size_ids');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['size_ids', 'color_ids']);
            $table->string('size_id')->nullable()->after('image');
            $table->string('color_id')->nullable()->after('size_id');
        });
    }
};
