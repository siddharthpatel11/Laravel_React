<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Color extends Model
{
    use SoftDeletes;

    protected $table = 'colors';
    protected $fillable = [
        'name',
        'hex_code',
        // 'category_id',
        'status',
    ];

    /*
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
    */
}
