<!DOCTYPE html>
<html>
<head>
    <style>
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #dddddd; padding: 10px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .pageBreak { page-break-before: always; }
        .noSplit { page-break-inside: avoid; }
    </style>
</head>
<body>
    @foreach ($stagiaireResultats as $index =>$resultat)
        @if ($index > 0)
            <div class="pageBreak"></div>
        @endif
        <h1>Correction du Test : {{ $test->libelle }}</h1>
        <p>Questionnaire : {{ $test->questionnaire->nom }}</p>
        <h2>Stagiaire : {{ $resultat['stagiaire'] }}</h2>
        <table>
            <thead>
                <tr>
                    <th style="width: 6%;">#</th>
                    <th style="width: 35%;">Intitulé</th>
                    <th style="width: 35%;">Propositions</th>
                    <th style="width: 12%;">Réponse correcte</th>
                    <th style="width: 12%;">Réponse stagiaire</th>
                </tr>
            </thead>
        </table>
        @foreach ($resultat['questions'] as $question)
            <table class="noSplit">
                <tr style="page-break-inside: avoid;">
                    <td rowspan="3" style="width: 6%; text-align: center;">{{ $question['compteur'] }}</td>
                    <td rowspan="3" style="width: 35%;">{{ $question['libelle'] }}</td>
                    <td style="width: 35%;"><strong>A</strong> {{ $question['proposition_une'] }}</td>
                    <td rowspan="3" style="width: 12%; text-align: center;">{{ $question['reponse_correcte'] }}</td>
                    <td rowspan="3" style="width: 12%; text-align: center;">{{ $question['reponse_stagiaire'] }}</td>
                </tr>
                <tr>
                    <td style="width: 35%;"><strong>B</strong> {{ $question['proposition_deux'] }}</td>
                </tr>
                <tr>
                    <td style="width: 35%;"><strong>C</strong> {{ $question['proposition_trois'] }}</td>
                </tr>
            </table>
        @endforeach
    @endforeach
</body>
</html>
