<?php

namespace App\Models\Referentiel;

use App\Models\Evaluation\Question;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $niveau
 */
class NiveauTaxinomique extends Model
{
    use HasFactory;

    protected $fillable = [
        'niveau'
    ];

    protected $casts = [
        'niveau' => 'string'
    ];

    protected $table = 'niveaux_taxinomique';

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }
}
