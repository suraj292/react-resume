<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Spatie\Browsershot\Browsershot;

class PdfExportController extends Controller
{
    /**
     * Export resume to PDF
     */
    public function export(Request $request)
    {
        try {
            $validated = $request->validate([
                'html' => 'required|string',
                'filename' => 'nullable|string',
            ]);

            $html = $validated['html'];
            $filename = $validated['filename'] ?? 'resume_' . time() . '.pdf';

            // Ensure filename ends with .pdf
            if (!str_ends_with($filename, '.pdf')) {
                $filename .= '.pdf';
            }

            // Create a temporary file for the PDF
            $tempPath = storage_path('app/temp/' . $filename);
            
            // Ensure temp directory exists
            if (!file_exists(storage_path('app/temp'))) {
                mkdir(storage_path('app/temp'), 0755, true);
            }

            // Wrap HTML in a complete document with styles
            $fullHtml = $this->wrapHtml($html);


            // Generate PDF using Browsershot
            Browsershot::html($fullHtml)
                ->setNodeBinary(trim(shell_exec('which node')))
                ->setNpmBinary(trim(shell_exec('which npm')))
                ->format('A4')
                ->margins(0, 0, 0, 0)
                ->showBackground()
                ->waitUntilNetworkIdle()
                ->setDelay(1000) // Wait 1 second for all styles to load
                ->windowSize(794, 1123) // A4 size in pixels at 96 DPI
                ->setOption('args', [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu'
                ])
                ->setOption('printBackground', true)
                ->save($tempPath);

            // Return the PDF as a download
            return response()->download($tempPath, $filename, [
                'Content-Type' => 'application/pdf',
            ])->deleteFileAfterSend(true);

        } catch (\Exception $e) {
            Log::error('PDF Export Error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to generate PDF',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Wrap HTML content in a complete document
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
        @page {
            size: A4;
            margin: 0;
        }
        
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
        
        /* Remove any shadows from resume sheet */
        #resume-sheet {
            box-shadow: none !important;
            transform: none !important;
            margin: 0 !important;
        }
        
        /* Ensure proper page breaks */
        @media print {
            html, body {
                margin: 0;
                padding: 0;
            }
        }
    </style>
</head>
<body>
    {$content}

    <script>
        document.querySelectorAll('.page-break').forEach(el => {
            el.style.paddingTop = '50px';
        });
    </script>
</body>
</html>
HTML;
    }
}
