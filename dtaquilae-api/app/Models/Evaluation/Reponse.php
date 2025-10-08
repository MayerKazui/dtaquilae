<?php

namespace App\Models\Evaluation;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $reponse
 * @property boolean $is_good_answer
 */
class Reponse extends Model
{
    protected $fillable = [
        'id',
        'test_id',
        'user_id',
        'question_id',
        'reponse',
        'is_good_answer'
    ];

    protected $casts = [
        'reponse' => 'string',
        'is_good_answer' => 'boolean'
    ];

    protected $guarded = [];

    public function __construct(array $attributes = array())
    {
        parent::__construct($attributes);
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }

    public function stagiaire(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function test(): BelongsTo
    {
        return $this->belongsTo(Test::class);
    }
}
