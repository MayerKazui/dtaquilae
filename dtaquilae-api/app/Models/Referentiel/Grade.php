<?php

namespace App\Models\Referentiel;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $libelle
 * @property string $abrege
 */
class Grade extends Model
{
    use HasFactory;

    protected $fillable = [
        'libelle',
        'abrege',
    ];

    protected $casts = [
        'abrege' => 'string',
        'libelle' => 'string'
    ];

    // Relation OneToMany vers les utilisateurs ayant ce grade
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
