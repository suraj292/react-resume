<?php

namespace App\Jobs;

use App\Models\ResumeUpload;
use App\Services\AIService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;
use Smalot\PdfParser\Parser as PdfParser;
use PhpOffice\PhpWord\IOFactory;

class ParseResumeJob implements ShouldQueue
{
    use Queueable;

    public $uploadId;
    public $tries = 3;
    public $timeout = 120;

    /**
     * Create a new job instance.
     */
    public function __construct($uploadId)
    {
        $this->uploadId = $uploadId;
    }

    /**
     * Execute the job.
     */
    public function handle(AIService $aiService): void
    {
        $upload = ResumeUpload::find($this->uploadId);

        if (!$upload) {
            \Log::error('Upload not found', ['upload_id' => $this->uploadId]);
            return;
        }

        try {
            // Update status to processing
            $upload->update([
                'status' => 'processing',
                'processing_progress' => 10,
            ]);

            // Extract text from file
            $text = $this->extractText($upload);

            $upload->update(['processing_progress' => 50]);

            // Parse with AI (OpenAI or Gemini based on config)
            $parsedData = $aiService->parseResume($text);

            $upload->update(['processing_progress' => 90]);

            // Save parsed data
            $upload->update([
                'status' => 'completed',
                'processing_progress' => 100,
                'parsed_data' => $parsedData,
                'error_message' => null,
            ]);

            \Log::info('Resume parsed successfully', ['upload_id' => $this->uploadId]);
        } catch (\Exception $e) {
            \Log::error('Resume parsing failed', [
                'upload_id' => $this->uploadId,
                'error' => $e->getMessage(),
            ]);

            $upload->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);

            throw $e; // Re-throw to trigger retry
        }
    }

    /**
     * Extract text from uploaded file
     */
    protected function extractText(ResumeUpload $upload): string
    {
        $filePath = Storage::disk('local')->path($upload->file_path);

        if (!file_exists($filePath)) {
            throw new \Exception('File not found: ' . $filePath);
        }

        $mimeType = $upload->mime_type;

        // PDF extraction
        if ($mimeType === 'application/pdf') {
            return $this->extractFromPdf($filePath);
        }

        // DOCX extraction
        if (in_array($mimeType, [
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword'
        ])) {
            return $this->extractFromDocx($filePath);
        }

        throw new \Exception('Unsupported file type: ' . $mimeType);
    }

    /**
     * Extract text from PDF
     */
    protected function extractFromPdf(string $filePath): string
    {
        try {
            $parser = new PdfParser();
            $pdf = $parser->parseFile($filePath);
            $text = $pdf->getText();

            if (empty(trim($text))) {
                throw new \Exception('No text could be extracted from PDF');
            }

            return $text;
        } catch (\Exception $e) {
            \Log::error('PDF extraction failed', ['error' => $e->getMessage()]);
            throw new \Exception('Failed to extract text from PDF: ' . $e->getMessage());
        }
    }

    /**
     * Extract text from DOCX
     */
    protected function extractFromDocx(string $filePath): string
    {
        try {
            $phpWord = IOFactory::load($filePath);
            $text = '';

            foreach ($phpWord->getSections() as $section) {
                foreach ($section->getElements() as $element) {
                    if (method_exists($element, 'getText')) {
                        $text .= $element->getText() . "\n";
                    }
                }
            }

            if (empty(trim($text))) {
                throw new \Exception('No text could be extracted from DOCX');
            }

            return $text;
        } catch (\Exception $e) {
            \Log::error('DOCX extraction failed', ['error' => $e->getMessage()]);
            throw new \Exception('Failed to extract text from DOCX: ' . $e->getMessage());
        }
    }
}
