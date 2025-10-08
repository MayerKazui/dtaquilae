<?php

namespace App\Models\Referentiel;

use App\Models\Evaluation\Question;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $libelle
 */
class Statut extends Model
{
    use HasFactory;

    protected $fillable = [
        'libelle'
    ];

    protected $casts = [
        'libelle' => 'string'
    ];

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }
}
