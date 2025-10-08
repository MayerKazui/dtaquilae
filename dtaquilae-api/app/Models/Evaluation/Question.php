<?php

namespace App\Models\Evaluation;

use App\Models\Formation\Cours;
use App\Models\Referentiel\NiveauTaxinomique;
use App\Models\Referentiel\Statut;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $numero_question
 * @property string $libelle
 * @property string $proposition_une
 * @property string $proposition_deux
 * @property string $proposition_trois
 * @property string $reponse
 * @property int $niveau
 * @property boolean $is_used
 * @property string $reference_documentaire
 */
class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'numero_question',
        'chapitre_id',
        'ata',
        'libelle',
        'proposition_une',
        'proposition_deux',
        'proposition_trois',
        'reponse',
        'niveau',
        'niveau_taxinomique_id',
        'auteur',
        'verificateur',
        'date_verif',
        'valideur',
        'statut_id',
        'date_validation',
        'is_used',
        'reference_documentaire',
        'actif',
        'created_at'
    ];

    protected $casts = [
        'numero_question' => 'string',
        'chapitre_id' => 'string',
        'ata' => 'string',
        'libelle' => 'string',
        'proposition_une' => 'string',
        'proposition_deux' => 'string',
        'proposition_trois' => 'string',
        'reponse' => 'string',
        'niveau' => 'int',
        'auteur' => 'string',
        'verificateur' => 'string',
        'valideur' => 'string',
        'statut_id' => 'int',
        'is_used' => 'boolean',
        'reference_documentaire' => 'string',
        'actif' => 'boolean',
    ];

    public function ressources(): BelongsToMany
    {
        return $this->belongsToMany(Ressource::class);
    }

    public function questionnaires(): BelongsToMany
    {
        return $this->belongsToMany(Questionnaire::class);
    }

    public function niveauTaxinomique(): BelongsTo
    {
        return $this->belongsTo(NiveauTaxinomique::class);
    }

    public function cours(): Collection
    {
        return Cours::whereLibelle($this->libelle_cours)->get();
    }

    public function reponses(): HasMany
    {
        return $this->hasMany(Reponse::class);
    }

    public function observations(): HasMany
    {
        return $this->hasMany(ObservationQuestion::class);
    }

    public function statut(): BelongsTo
    {
        return $this->belongsTo(Statut::class);
    }
}
