<?php

namespace App\Traits;

use App\Models\Download;
use App\Models\AiRequest;
use Illuminate\Http\Request;

trait TracksUsage
{
    /**
     * Track a download
     */
    protected function trackDownload(
        int $userId,
        ?int $resumeId,
        string $format,
        ?string $filePath = null,
        ?int $fileSize = null,
        ?Request $request = null
    ): Download {
        return Download::create([
            'user_id' => $userId,
            'resume_id' => $resumeId,
            'format' => $format,
            'file_path' => $filePath,
            'file_size' => $fileSize,
            'ip_address' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
        ]);
    }

    /**
     * Track an AI request
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
        return AiRequest::create([
            'user_id' => $userId,
            'type' => $type,
            'resume_id' => $resumeId,
            'request_data' => $requestData,
            'response_data' => $responseData,
            'tokens_used' => $tokensUsed,
            'status' => $status,
            'error_message' => $errorMessage,
        ]);
    }
}
