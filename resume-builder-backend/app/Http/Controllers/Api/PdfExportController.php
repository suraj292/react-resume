<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\TracksUsage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Spatie\Browsershot\Browsershot;

class PdfExportController extends Controller
{
    use TracksUsage;

    /**
     * Export resume to PDF.
     * Binary paths are read from config, never from per-request shell_exec.
     */
    public function export(Request $request)
    {
        $validated = $request->validate([
            'html'      => 'required|string|max:2000000', // 2 MB safety cap
            'filename'  => 'nullable|string|max:100|regex:/^[a-zA-Z0-9_\-\.]+$/',
            'resume_id' => 'nullable|integer|exists:resumes,id',
        ]);

        $user     = $request->user();
        $filename = $validated['filename'] ?? 'resume_' . time() . '.pdf';

        if (!str_ends_with($filename, '.pdf')) {
            $filename .= '.pdf';
        }

        $tempDir  = storage_path('app/temp');
        $tempPath = $tempDir . '/' . $filename;

        if (!is_dir($tempDir)) {
            mkdir($tempDir, 0755, true);
        }

        try {
            $fullHtml = $this->wrapHtml($validated['html']);

            $shot = Browsershot::html($fullHtml)
                ->format('A4')
                ->margins(0, 0, 0, 0)
                ->showBackground()
                ->waitUntilNetworkIdle()
                ->setDelay(800)
                ->windowSize(794, 1123)
                ->setOption('args', [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                ])
                ->setOption('printBackground', true);

            // Use configured binaries instead of per-request shell_exec
            $nodeBinary = config('services.browsershot.node_binary');
            $npmBinary  = config('services.browsershot.npm_binary');

            if ($nodeBinary) {
                $shot->setNodeBinary($nodeBinary);
            }
            if ($npmBinary) {
                $shot->setNpmBinary($npmBinary);
            }

            $shot->save($tempPath);

            // Track download usage
            $this->trackDownload(
                $user->id,
                $validated['resume_id'] ?? null,
                'pdf',
                null,
                filesize($tempPath),
                $request
            );

            return response()->download($tempPath, $filename, [
                'Content-Type' => 'application/pdf',
            ])->deleteFileAfterSend(true);

        } catch (\Exception $e) {
            Log::error('pdf.export_failed', [
                'user_id'   => $user->id,
                'error'     => $e->getMessage(),
            ]);

            return response()->json([
                'error'   => 'Failed to generate PDF',
                'message' => 'An error occurred while generating the PDF. Please try again.',
            ], 500);
        }
    }

    /**
     * Wrap HTML content in a safe, complete document.
     * The injected $content is rendered as-is into the PDF template.
     * Callers are responsible for sanitising user-generated HTML before
     * passing it here (e.g. via HTMLPurifier in the resume build pipeline).
     */
    private function wrapHtml(string $content): string
    {
        return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @page { size: A4; margin: 0; }

        * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
        }

        html, body {
            margin: 0;
            padding: 0;
            font-family: Arial, Helvetica, sans-serif;
            width: 100%;
            height: 100%;
        }

        #resume-sheet {
            box-shadow: none !important;
            transform: none !important;
            margin: 0 !important;
        }

        @media print {
            html, body { margin: 0; padding: 0; }
        }
    </style>
</head>
<body>
    {$content}

    <script>
        document.querySelectorAll('.page-break').forEach(function(el) {
            el.style.paddingTop = '50px';
        });
    </script>
</body>
</html>
HTML;
    }
}
