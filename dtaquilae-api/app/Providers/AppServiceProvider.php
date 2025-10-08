<?php

namespace App\Providers;

use App\Helpers\AccessControlHelper;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProvider;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind('access_control', function () {
            return new AccessControlHelper();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
        Storage::disk('ressources')->buildTemporaryUrlsUsing(function ($path, $expiration, $options) {
            return URL::temporarySignedRoute(
                'download',
                $expiration,
                array_merge($options, ['path' => $path])
            );
        });
    }
}
