import PDFDocument from 'pdfkit';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const doc = new PDFDocument();
    let buffers: Uint8Array[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        return new NextResponse(pdfData, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="receipt.pdf"',
            },
        });
    });

    // Sample Receipt Data (Modify as needed)
    doc.fontSize(20).text('🍽️ Food Order Receipt', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text('Order ID: 12345');
    doc.text('Date: 2025-03-19');
    doc.moveDown();
    doc.fontSize(12).text('Items:');
    doc.text('1x Burger - $5.99');
    doc.text('1x Pizza - $10.99');
    doc.moveDown();
    // doc.text('Total: $16.98', { bold: true });

    doc.end();
}
