import { pdfAPI } from '@/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface ExportPdfRequest {
    html: string;
    filename?: string;
}

/**
 * Export resume to PDF using backend API
 */
export async function exportResumeToPdf(data: ExportPdfRequest): Promise<Blob> {
    const response = await pdfAPI.export(data);
    return response.data;
}

/**
 * Download a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

/**
 * Generate a filename for the resume PDF
 */
export function generatePdfFilename(name?: string): string {
    const baseName = name
        ? name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()
        : 'resume';
    const timestamp = new Date().toISOString().split('T')[0];
    return `${baseName}_${timestamp}.pdf`;
}
