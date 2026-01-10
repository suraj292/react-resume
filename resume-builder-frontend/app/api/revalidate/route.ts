import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * On-Demand Revalidation API Route
 * 
 * Usage:
 * POST /api/revalidate
 * Body: { path: '/pricing' } or { tag: 'pricing' }
 * Headers: Authorization: Bearer <REVALIDATE_SECRET>
 */
export async function POST(request: NextRequest) {
    try {
        // Check authorization
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (token !== process.env.REVALIDATE_SECRET) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Revalidate by path
        if (body.path) {
            revalidatePath(body.path, 'page');
            console.log(`[ISR] Revalidated path: ${body.path}`);

            return NextResponse.json({
                success: true,
                message: `Revalidated path: ${body.path}`,
                timestamp: new Date().toISOString(),
            });
        }

        // Revalidate by tag
        if (body.tag) {
            await revalidateTag(body.tag, {});
            console.log(`[ISR] Revalidated tag: ${body.tag}`);

            return NextResponse.json({
                success: true,
                message: `Revalidated tag: ${body.tag}`,
                timestamp: new Date().toISOString(),
            });
        }

        // Revalidate multiple paths
        if (body.paths && Array.isArray(body.paths)) {
            body.paths.forEach((path: string) => {
                revalidatePath(path, 'page');
                console.log(`[ISR] Revalidated path: ${path}`);
            });

            return NextResponse.json({
                success: true,
                message: `Revalidated ${body.paths.length} paths`,
                paths: body.paths,
                timestamp: new Date().toISOString(),
            });
        }

        // Revalidate multiple tags
        if (body.tags && Array.isArray(body.tags)) {
            await Promise.all(
                body.tags.map(async (tag: string) => {
                    await revalidateTag(tag, {});
                    console.log(`[ISR] Revalidated tag: ${tag}`);
                })
            );

            return NextResponse.json({
                success: true,
                message: `Revalidated ${body.tags.length} tags`,
                tags: body.tags,
                timestamp: new Date().toISOString(),
            });
        }

        return NextResponse.json(
            { error: 'Missing path or tag parameter' },
            { status: 400 }
        );

    } catch (error) {
        console.error('[ISR] Revalidation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * GET endpoint for health check
 */
export async function GET() {
    return NextResponse.json({
        status: 'ok',
        message: 'Revalidation API is running',
        timestamp: new Date().toISOString(),
    });
}
