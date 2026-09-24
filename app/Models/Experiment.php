<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Experiment extends Model
{
    protected $guarded = [];
    protected $casts = ['is_active' => 'boolean'];

public function category()   
    { 
        return $this->belongsTo(Category::class); 
    }

public function parameters() 
    { 
        return $this->hasMany(ExperimentParameter::class)->orderBy('sort_order'); 
    }

public function materials()  
    { 
        return $this->hasMany(Material::class)->orderBy('sort_order'); 
    }

public function questions()  
    { 
        return $this->hasMany(Question::class); 
    }

public function attempts()   
    { 
        return $this->hasMany(Attempt::class); 
    }
    
}
