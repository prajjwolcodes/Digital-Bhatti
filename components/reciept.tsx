"use client";

import { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Order } from "@/lib/types";

const Receipt = ({ order }: { order: Order }) => {
    const receiptRef = useRef(null); // 👈 Using useRef instead of getElementById

    const generatePDF = async () => {
        if (!receiptRef.current) return;

        const canvas = await html2canvas(receiptRef.current);
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 10, 10, 180, 100);
        pdf.save("receipt.pdf");
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-md">
            <div ref={receiptRef} className="p-4 border rounded-md">
                <h2 className="text-lg font-bold">🍽️ Food Order Receipt</h2>
                <p>Order ID: {order.id}</p>
                <p>Date: {order.status}</p>
                <ul>
                    {/* {order.items.map((item:Order, index:string) => (
                        <li key={index}>{item.status}</li>
                    ))} */}
                </ul>
                <p className="font-bold">Total: ${order.total}</p>
            </div>
            <button
                onClick={generatePDF}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
                Download PDF
            </button>
        </div>
    );
};

export default Receipt;
