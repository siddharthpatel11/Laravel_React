<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'products';
    protected $fillable = [
        'name',
        'detail',
        'image',
        'images',
        'size_ids',
        'color_ids',
        'category_id',
        'price',
        'status',
    ];

    protected $casts = [
        'deleted_at' => 'datetime',
        'price' => 'decimal:2',
        'size_ids' => 'array',
        'color_ids' => 'array',
        'images' => 'array',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id')->withTrashed();
    }

    public function getImageUrlAttribute()
    {
        return $this->image ? asset('storage/' . $this->image) : null;
    }

    public function getImageUrlsAttribute()
    {
        if (!$this->images || !is_array($this->images)) {
            return $this->image ? [asset('storage/' . $this->image)] : [];
        }

        return array_map(function ($img) {
            return asset('storage/' . $img);
        }, $this->images);
    }

    protected $appends = ['image_url', 'image_urls'];
}
