<?php

namespace App\Models\Evaluation;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ObservationQuestion extends Model
{

    protected $fillable = [
        'question_id',
        'user',
        'observation',
        'created_at'
    ];

    protected $casts = [
        'user' => 'string',
        'observation' => 'string',
        'created_at' => 'datetime'
    ];

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }
}
