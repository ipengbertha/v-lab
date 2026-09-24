<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $guarded = [];
    
public function experiment() 
    { 
        return $this->belongsTo(Experiment::class); 
    }

public function options()   
    { 
        return $this->hasMany(QuestionOption::class); 
    }
}
