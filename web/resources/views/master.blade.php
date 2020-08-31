<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <title>@section('title', '')@hasSection('title') - @endif{{ config('app.name') }}</title>
    <link href="{{ mix('css/app.css') }}" rel="stylesheet">
</head>
<body>
<div id="app">
    <App></App>
</div>
<script>
window.errors = @if($errors->any()) @json($errors->all(), JSON_PRETTY_PRINT) @else [] @endif;
window.data = @json($data);
</script>
<script src="{{ mix('js/app.js') }}" type="text/javascript"></script>
</body>
</html>
