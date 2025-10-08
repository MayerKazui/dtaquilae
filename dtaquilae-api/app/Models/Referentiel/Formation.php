<?php

namespace App\Models\Referentiel;

use App\Models\Evaluation\Questionnaire;
use App\Models\Formation\Chapitre;
use App\Models\Formation\Stage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $libelle
 * @property int|mixed $niveau
 */
class Formation extends Model
{
    use HasFactory;

    protected $fillable = [
        'libelle'
    ];

    protected $casts = [
        'libelle' => 'string',
    ];

    public function stages(): HasMany
    {
        return $this->hasMany(Stage::class);
    }

    public function chapitres(): HasMany
    {
        return $this->hasMany(Chapitre::class);
    }

    public function questionnaires(): HasMany
    {
        return $this->hasMany(Questionnaire::class);
    }
}
