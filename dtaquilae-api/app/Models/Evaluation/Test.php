<?php

namespace App\Models\Evaluation;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property Carbon $date
 * @property boolean $is_counter_test
 */
class Test extends Model
{
    protected $fillable = [
        'libelle',
        'date',
        'is_counter_test',
        'questionnaire_id',
        'user_id',
        'is_finish',
        'is_conforme'
    ];

    protected $casts = [
        'is_counter_test' => 'boolean',
        'libelle' => 'string',
        'is_finish' => 'boolean',
        'is_conforme' => 'boolean'
    ];

    public function questionnaire(): BelongsTo
    {
        return $this->belongsTo(Questionnaire::class);
    }

    public function stagiaire(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function reponses(): HasMany
    {
        return $this->hasMany(Reponse::class);
    }

    public function evaluation(): HasOne
    {
        return $this->hasOne(Evaluation::class);
    }
}
