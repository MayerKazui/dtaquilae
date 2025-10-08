<style>
    .noSplit {
        page-break-inside: avoid;
    }

    .pageBreak {
        page-break-before: always;
    }

    body {
        font-family: DejaVu Sans, sans-serif;
        font-size: small;
        margin: 0;
        padding: 0;
    }

    h1 {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 0px;
    }

    th,
    td {
        border: 1px solid #dddddd;
        padding: 10px;
        text-align: left;
    }

    th {
        background-color: #f2f2f2;
        font-weight: bold;
    }

    div.container {
        margin: 0;
        padding: 0;
    }

    .question-container {
        margin-top: 15px;
        margin-bottom: 20px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: #f9f9f9;
        page-break-inside: avoid;
    }

    .nombre-question {
        margin-bottom: 10px;
        margin-top: -5px;
        font-size: 1.2em;
        font-weight: bold;
        color: #333;
    }

    .image-galerie {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .image-galerie img {
        max-width: 100%;
        height: auto;
        border: 1px solid #ddd;
        border-radius: 5px;
        padding: 5px;
        background-color: #fff;
    }
        .cartouche {
        border: 1px solid #ccc;
        padding: 10px;
        margin-bottom: 20px;
    }
    .space {
        margin-top: 10px;
    }
</style>

<body>
<div>
    <div class="cartouche">
        <div class="space">Date : __________ <span style="padding-left: 22%"> Heure : __________ </span></div>
        <div class="space">Nom : _________________ <span style="padding-left: 14.5%"> Prénom : _________________ </span></div>
        <div class="space"> Numéro de stage : _________________ <span style="padding-left: 2%">Durée du test : {{ $duree_test }}</span></div>
    </div>
    <h1>Questionnaire : {{ $questionnaire->nom }}</h1>
    <table>
        <thead>
            <tr>
                <th style="width: 6%;"> </th>
                <th style="width: 40%;">Intitulé</th>
                <th style="width: 42%;">Propositions</th>
                <th style="width: 12%; padding: 5px; margin: 0;">Réponse</th>
            </tr>
        </thead>
    </table>
    @foreach ($questions as $question)
        <table id="vide" class="noSplit">
            @if ($question->proposition_une == null)
                <tr style="page-break-inside: avoid;">
                    <td rowspan="3" style="width: 6%; text-align: center;">{{ $question->compteur }}</td>
                    <td rowspan="3" style="width: 40%;">{{ $question->libelle }}</td>
                    <td colspan="2" rowspan="3" style="width: 54%; min-height: 500px; padding: 30px;"></td>
                </tr>
            @else
                <tr style="page-break-inside: avoid;">
                    <td rowspan="3" style="width: 6%; text-align: center;">{{ $question->compteur }}</td>
                    <td rowspan="3" style="width: 40%;">{{ $question->libelle }}</td>
                    <td style="width: 42%;"><strong>A</strong> : {{ $question->proposition_une }}</td>
                    <td style="width: 12%;" rowspan="3"></td>
                </tr>
                <tr>
                    <td style="width: 42%;"><strong>B</strong> : {{ $question->proposition_deux }}</td>
                </tr>
                <tr>
                    <td style="width: 42%;"><strong>C</strong> : {{ $question->proposition_trois }}</td>
                </tr>
            @endif
        </table>
    @endforeach
    @foreach ($questions as $question)
        @if (isset($question->ressources) && count($question->ressources) > 0)
            <div class="question-container noSplit">
                <h3 class="nombre-question">Question {{ $question->compteur }}</h3>
                <div class="image-galerie">
                    @foreach ($question->ressources as $image)
                        <img src="{{ storage_path('resources/' . $image->nom) }}"
                            alt="Image for question {{ $question->compteur }}">
                    @endforeach
                </div>
            </div>
        @endif
    @endforeach
    <h1 class="pageBreak">Correction du questionnaire : {{ $questionnaire->nom }} </h1>
    <table>
        <thead>
            <tr>
                <th style="width: 6%;"> </th>
                <th style="width: 40%;">Intitulé</th>
                <th style="width: 42%;">Propositions</th>
                <th style="width: 12%;padding: 5px; margin: 0;">Réponse</th>
            </tr>
        </thead>
    </table>
    @foreach ($questions as $question)
        <table class="noSplit">
            <tr style="page-break-inside: avoid;">
                <td rowspan="3" style="width: 6%; text-align: center;">{{ $question->compteur }}</td>
                <td rowspan="3" style="width: 40%;">{{ $question->libelle }}</td>
                @if ($question->proposition_une == null)
                    <td colspan="2" rowspan="3" style="width: 54%;"> {{ $question->reponse }} </td>
            </tr>
        @else
            <td style="width: 42%;"><strong>A</strong> : {{ $question->proposition_une }}</td>
            <td style="width: 12%; text-align: center; font-size: 12px; font-weight: bold;" rowspan="3">
                {{ $question->proposition_une == $question->reponse ? 'A' : '' }}
                {{ $question->proposition_deux == $question->reponse ? 'B' : '' }}
                {{ $question->proposition_trois == $question->reponse ? 'C' : '' }}
            </td>
            </tr>
            <tr>
                <td style="width: 42%;"><strong>B</strong> : {{ $question->proposition_deux }}</td>
            </tr>
            <tr>
                <td style="width: 42%;"><strong>C</strong> : {{ $question->proposition_trois }}</td>
            </tr>
    @endif

    </table>
    @endforeach
</div>
</body>
