<?php

namespace App\Models\Evaluation;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property Carbon $dateFormat
 * @property float $note
 */
class Evaluation extends Model
{
    protected $fillable = [
        'date',
        'note'
    ];

    protected $casts = [
        'note'=> 'float'
    ];

    public function test(): HasOne
    {
        return $this->hasOne(Test::class);
    }

    public function stagiaire(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

}
