<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Helpers\AccessControlHelper;
use Symfony\Component\HttpFoundation\Response;

class AccessControlMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next,...$permissions): Response
    {
        $access = AccessControlHelper::check(...$permissions);
        $retour = $access->allowed() ? $next($request) : $access->authorize();
        return $retour;
    }
}
