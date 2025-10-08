<?php

namespace App\Models\Formation;

use App\Models\Referentiel\Formation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $titre
 * @property int $formation_id
 * @property int $chapitre_sup_id
 */
class Chapitre extends Model
{
    protected $fillable = [
        'id',
        'titre',
        'formation_id',
        'chapitre_sup_id'
    ];

    protected $casts = [

        'titre' => 'string',
        'formation_id' => 'int',
        'chapitre_sup_id' => 'int'
    ];

    public function cours(): HasMany
    {
        return $this->hasMany(Cours::class, 'sous_chapitre_id');
    }

    public function chapitreSuperieur(): BelongsTo
    {
        return $this->belongsTo(self::class, 'chapitre_sup_id');
    }

    public function sousChapitres(): HasMany
    {
        return $this->hasMany(self::class, 'chapitre_sup_id');
    }

    public function formation(): BelongsTo
    {
        return $this->belongsTo(Formation::class);
    }
}
