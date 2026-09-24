<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExperimentParameter extends Model
{
    protected $guarded = [];

public function experiment() 
    { 
        return $this->belongsTo(Experiment::class); 
    }
}
