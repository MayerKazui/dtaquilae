<?php

namespace App\Models\Formation;

use App\Models\Evaluation\Question;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cours extends Model
{
    use HasFactory;

    protected $fillable = [
        'libelle',
        'ata',
        'niveau',
        'nombre_question',
        'sous-chapitre_id',
        'module'
    ];

    protected $casts = [
        'libelle',
        'ata',
        'niveau',
        'nombre_question',
        'sous-chapitre_id',
        'module'
    ];

    public function sousChapitre(): BelongsTo
    {
        return $this->belongsTo(Chapitre::class, 'sous_chapitre_id');
    }

    // public function questions(): Collection
    // {
    //     return Question::whereLibelleCours($this->libelle)->get();
    // }
    public function questions(): HasMany
    {
        return $this->hasMany(Question::class, 'libelle_cours', 'libelle');
    }
}
