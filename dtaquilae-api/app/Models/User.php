<?php

namespace App\Models;

use Illuminate\Support\Facades\Log;
use App\Models\Evaluation\Test;
use App\Models\Formation\Stage;
use App\Models\Referentiel\Role;
use App\Models\Referentiel\Grade;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Evaluation\Reponse;
use App\Models\Evaluation\Evaluation;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;


/**
 * @property string $nom
 * @property string $prenom
 * @property string $email
 * @property string $password
 * @property string $login
 * @property string $matricule
 * @property boolean $actif
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nom',
        'prenom',
        'password',
        'matricule',
        'numeroAlliance',
        'login',
        'actif',
        'grade_id',
        'role_id',
        'grade_abrege',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'nom' => 'string',
        'prenom' => 'string',
        'password' => 'string',
        'matricule' => 'string',
        'numeroAlliance' => 'string',
        'login' => 'string',
        'actif' => 'boolean',
    ];

    // Relation OneToMany vers les tests qu'un stagiaire a passé
    public function tests(): HasMany
    {
        return $this->hasMany(Test::class);
    }

    // Relation OneToMany vers les réponses qu'un stagiaire à donné dans le cadre d'un test
    public function reponses(): HasMany
    {
        return $this->hasMany(Reponse::class);
    }

    // Relation OneToOne vers le stage pour lequel l'utilisateur est directeur de stage
    public function stageDirecteur(): HasMany
    {
        return $this->HasMany(Stage::class, 'directeur_id');
    }

    // Relation OneToOne vers le stage pour lequel l'utilisateur est adjoint au directeur de stage
    public function stageAdjoint(): HasMany
    {
        return $this->HasMany(Stage::class, 'adjoint_id');
    }

    // Relation ManyToOne vers le grade détenu par l'utilisateur
    public function grade(): BelongsTo
    {
        return $this->belongsTo(Grade::class);
    }

    // Relation ManyToOne vers le rôle détenu par l'utilisateur
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    // Relation ManyToMnay vers les stages auxquels participe (ou a participé) le stagiaire
    public function stages(): BelongsToMany
    {
        return $this->belongsToMany(Stage::class, 'stage_stagiaire', 'user_id', 'stage_id');
    }

    // Relation OneToMany vers les résultats du stagiaire
    public function evaluations(): HasMany
    {
        return $this->hasMany(Evaluation::class);
    }

    public function abregeGrade(): string
    {
        return Grade::find($this->grade_id)->abrege;
    }

    public function getMatricule(): string
    {
        Log::info("$this->prenom $this->nom : $this->matricule");
        if (is_null($this->matricule))
            return $this->numeroAlliance;
        return $this->matricule;
    }
}
