<?php

namespace App\Models\Referentiel;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $abrege
 * @property string $libelle
 */
class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'abrege',
        'libelle'
    ];

    protected $casts = [
        'abrege' => 'string',
        'libelle' => 'string'
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
