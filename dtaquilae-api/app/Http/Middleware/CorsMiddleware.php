<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Autoriser les requêtes 'preflight'
        if ($request->isMethod('OPTIONS')) {
            return response()->json('ok', 200)
                ->header('Access-Control-Allow-Origin', 'http://localhost:3000')
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-TOKEN, X-Requested-With, Authorization, Origin, Accept')
                ->header('Access-Control-Allow-Credentials', 'true');
        }

        // Gérer les autres requêtes
        return $next($request)
            ->header('Access-Control-Allow-Origin', 'http://localhost:3000')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-TOKEN, X-Requested-With, Authorization, Origin, Accept')
            ->header('Access-Control-Allow-Credentials', 'true');
    }
}
