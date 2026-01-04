<?php

namespace App\Console\Commands;

use App\Jobs\ParseResumeJob;
use App\Models\ResumeUpload;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class TestPDFUpload extends Command
{
    protected $signature = 'test:pdf {file}';
    protected $description = 'Test PDF upload and parsing';

    public function handle()
    {
        $filePath = $this->argument('file');
        
        if (!file_exists($filePath)) {
            $this->error("File not found: {$filePath}");
            return Command::FAILURE;
        }

        $this->info("Testing PDF upload: {$filePath}");
        
        // Copy file to storage
        $fileName = basename($filePath);
        $storagePath = 'resumes/' . time() . '_' . $fileName;
        Storage::put($storagePath, file_get_contents($filePath));
        
        // Create upload record
        $upload = ResumeUpload::create([
            'user_id' => 1, // Test user
            'original_name' => $fileName,
            'file_path' => $storagePath,
            'file_name' => $fileName,
            'file_size' => filesize($filePath),
            'mime_type' => 'application/pdf',
            'status' => 'pending',
        ]);

        $this->info("Created upload record: ID {$upload->id}");
        
        // Dispatch job synchronously for testing
        $this->info("Parsing resume...");
        ParseResumeJob::dispatchSync($upload->id);
        
        // Reload upload to see results
        $upload->refresh();
        
        $this->newLine();
        if ($upload->status === 'completed') {
            $this->info("✅ SUCCESS!");
            $this->newLine();
            $this->info("Parsed Data:");
            $this->line(json_encode($upload->parsed_data, JSON_PRETTY_PRINT));
        } else {
            $this->error("❌ FAILED!");
            $this->error("Error: " . $upload->error_message);
        }
        
        return Command::SUCCESS;
    }
}
