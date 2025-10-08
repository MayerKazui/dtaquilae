<?php

namespace App\Facades;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Facade;

class AccessControl extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'access_control';
    }
}
