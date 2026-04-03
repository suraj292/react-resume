<?php

namespace App\Traits;

use App\Models\AiRequest;
use App\Models\Download;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

trait TracksUsage
{
    /**
     * Record a PDF/DOCX download and log the event.
     */
    protected function trackDownload(
        int $userId,
        ?int $resumeId,
        string $format,
        ?string $filePath = null,
        ?int $fileSize = null,
        ?Request $request = null
    ): Download {
        $record = Download::create([
            'user_id'    => $userId,
            'resume_id'  => $resumeId,
            'format'     => $format,
            'file_path'  => $filePath,
            'file_size'  => $fileSize,
            'ip_address' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
        ]);

        Log::info('usage.download', [
            'user_id'   => $userId,
            'resume_id' => $resumeId,
            'format'    => $format,
        ]);

        return $record;
    }

    /**
     * Record an AI request (ATS, resume parsing, job desc parsing) and log it.
     */
    protected function trackAIRequest(
        int $userId,
        string $type,
        ?int $resumeId = null,
        ?string $requestData = null,
        ?string $responseData = null,
        ?int $tokensUsed = null,
        string $status = 'success',
        ?string $errorMessage = null
    ): AiRequest {
        $record = AiRequest::create([
            'user_id'       => $userId,
            'type'          => $type,
            'resume_id'     => $resumeId,
            'request_data'  => $requestData,
            'response_data' => $responseData,
            'tokens_used'   => $tokensUsed,
            'status'        => $status,
            'error_message' => $errorMessage,
        ]);

        Log::info('usage.ai_request', [
            'user_id'     => $userId,
            'type'        => $type,
            'tokens_used' => $tokensUsed,
            'status'      => $status,
        ]);

        return $record;
    }
}
