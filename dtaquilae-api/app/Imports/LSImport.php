<?php

namespace App\Imports;

use App\Imports\Sheets\Be1_3Import;
use App\Imports\Sheets\Be2Import;
use App\Imports\Sheets\BeArmImport;
use App\Imports\Sheets\CeImport;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class LSImport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            '342Be1.3' => new Be1_3Import(),
            '342Be2' => new Be2Import(),
            '342BeARM' => new BeArmImport(),
            '342Ce' => new CeImport(),

        ];
    }
}
