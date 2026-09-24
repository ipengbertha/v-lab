<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExperimentResult extends Model
{
    protected $guarded = [];
    protected $casts = ['is_correct' => 'boolean'];

public function attempt()  
    { 
        return $this->belongsTo(Attempt::class); 
    }

}
