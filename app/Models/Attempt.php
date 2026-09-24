<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attempt extends Model
{
    protected $guarded = [];
protected $casts = ['started_at' => 'datetime', 'finished_at' => 'datetime'];

public function user()      
    { 
        return $this->belongsTo(User::class); 
    }
        
public function experiment() 
    { 
        return $this->belongsTo(Experiment::class); 
    }

public function answers()    
    { 
        return $this->hasMany(AttemptAnswer::class); 
    }

public function results()    
    { 
        return $this->hasMany(ExperimentResult::class); 
    }
}
