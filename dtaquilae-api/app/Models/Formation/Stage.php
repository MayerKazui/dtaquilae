<?php

namespace App\Models\Formation;

use App\Models\User;
use Illuminate\Support\Carbon;
use App\Models\Referentiel\Formation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 *  @property string $libelle
 *  @property Carbon $debut
 *  @property Carbon $fin
 */
class Stage extends Model
{
    use HasFactory;

    protected $fillable = [
        'libelle',
        'debut',
        'fin',
        'formation_id',
        'directeur_id',
        'adjoint_id'
    ];

    protected $casts = [
        'libelle' => 'string'
    ];

    public function formation(): BelongsTo
    {
        return $this->belongsTo(Formation::class);
    }

    public function directeur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'directeur_id', 'id');
    }

    public function adjoint(): BelongsTo
    {
        return $this->belongsTo(User::class, 'adjoint_id', 'id');
    }

    public function stagiaires(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'stage_stagiaire', 'stage_id', 'user_id')->orderBy('nom');
    }
}
