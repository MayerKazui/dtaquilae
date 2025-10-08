<?php

namespace App\Http\Controllers\Api\Common;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FileController extends Controller
{
    public function getUrl(string $fileName): string
    {
        $storage = Storage::disk('ressources');
        return $storage->temporaryUrl($fileName, now()->addMinutes(10));
    }

    public function download(Request $request): StreamedResponse
    {
        abort_if(!$request->hasValidSignature(), 404);
        $storage = Storage::disk('ressources');
        $retour = null;
        try {
            $retour = $storage->download($request->query('path'));
        } catch (\Exception $e) {
            abort(404, 'Aucun fichier n\'existe avec ce nom');
        }
        return $retour;
    }
}
