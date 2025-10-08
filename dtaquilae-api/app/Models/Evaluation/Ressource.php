<?php

namespace App\Models\Evaluation;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property string $nom
 */
class Ressource extends Model
{
    protected $fillable = [
        'nom'
    ];

    protected $casts = [
        'nom' => 'string'
    ];

    public function questions(): BelongsToMany
    {
        return $this->belongsToMany(Question::class);
    }
}
