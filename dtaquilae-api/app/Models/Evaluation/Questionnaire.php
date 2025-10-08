<?php

namespace App\Models\Evaluation;

use App\Models\User;
use Illuminate\Support\Carbon;
use App\Models\Referentiel\Formation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property string $nom
 * @property Carbon $date
 * @property boolean $is_actif
 */
class Questionnaire extends Model
{
    protected $fillable = [
        'nom',
        'formation_id',
        'date',
        'is_actif'
    ];

    protected $casts = [
        'nom' => 'string',
        'is_actif' => 'boolean'
    ];

    public function questions(): BelongsToMany
    {
        return $this->belongsToMany(Question::class);
    }

    public function tests(): HasMany
    {
        return $this->hasMany(Test::class);
    }

    public function testsAffichageStage(): HasMany
    {
        return $this->hasMany(Test::class)
                    ->join('users', 'tests.user_id', '=', 'users.id')
                    ->orderBy('users.nom', 'asc')
                    ->select('tests.*'); // Sélectionner uniquement les colonnes de la table tests
    }

    public function formation(): BelongsTo
    {
        return $this->belongsTo(Formation::class);
    }
}
