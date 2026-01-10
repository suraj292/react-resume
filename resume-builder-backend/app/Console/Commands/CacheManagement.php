<?php

namespace App\Console\Commands;

use App\Services\CacheService;
use Illuminate\Console\Command;

class CacheManagement extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cache:manage 
                            {action : The action to perform (clear|warm|stats)}
                            {--tag= : Cache tag to clear}
                            {--pattern= : Pattern to match for clearing}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Manage multi-layer cache (Laravel + Next.js + Cloudflare)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $action = $this->argument('action');

        switch ($action) {
            case 'clear':
                $this->clearCache();
                break;

            case 'warm':
                $this->warmCache();
                break;

            case 'stats':
                $this->showStats();
                break;

            default:
                $this->error("Unknown action: {$action}");
                $this->info('Available actions: clear, warm, stats');
                return 1;
        }

        return 0;
    }

    /**
     * Clear cache
     */
    private function clearCache(): void
    {
        $tag = $this->option('tag');
        $pattern = $this->option('pattern');

        if ($tag) {
            $this->info("Clearing cache for tag: {$tag}");
            $result = CacheService::clearByTag($tag);
            
            if ($result) {
                $this->info("✓ Cache cleared for tag: {$tag}");
            } else {
                $this->error("✗ Failed to clear cache for tag: {$tag}");
            }
        } elseif ($pattern) {
            $this->info("Clearing cache matching pattern: {$pattern}");
            $result = CacheService::clearByPattern($pattern);
            
            if ($result) {
                $this->info("✓ Cache cleared for pattern: {$pattern}");
            } else {
                $this->error("✗ Failed to clear cache for pattern: {$pattern}");
            }
        } else {
            if ($this->confirm('Clear ALL cache? This will affect all layers.')) {
                $this->info("Clearing all cache...");
                $result = CacheService::clearAll();
                
                if ($result) {
                    $this->info("✓ All cache cleared");
                } else {
                    $this->error("✗ Failed to clear all cache");
                }
            } else {
                $this->info('Cache clear cancelled');
            }
        }
    }

    /**
     * Warm up cache
     */
    private function warmCache(): void
    {
        $this->info("Warming up cache for critical endpoints...");
        
        $result = CacheService::warmUp();
        
        if ($result) {
            $this->info("✓ Cache warmed up successfully");
        } else {
            $this->error("✗ Failed to warm up cache");
        }
    }

    /**
     * Show cache statistics
     */
    private function showStats(): void
    {
        $stats = CacheService::getStats();

        $this->info("Cache Statistics:");
        $this->table(
            ['Metric', 'Value'],
            [
                ['Total Keys', $stats['total_keys']],
                ['Cache Driver', $stats['driver']],
                ['Available Tags', implode(', ', $stats['tags'])],
            ]
        );
    }
}
