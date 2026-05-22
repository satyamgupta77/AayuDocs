from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def generate_invoice():
    pdf_filename = "Invoice_Fixed.pdf"
    doc = SimpleDocTemplate(pdf_filename, pagesize=A4, rightMargin=30, leftMargin=30, topMargin=30, bottomMargin=30)
    
    elements = []
    styles = getSampleStyleSheet()
    title_style = styles['Heading1']
    normal_style = styles['Normal']
    
    # Header
    elements.append(Paragraph("<b>Infiniti Retail Limited Trading as Croma</b>", title_style))
    elements.append(Paragraph("<b>Tax Invoice</b>", styles['Heading2']))
    elements.append(Paragraph("Ludhiana-Sector 32A Ludhiana-141010", normal_style))
    elements.append(Paragraph("Phone Number : 18005727662/ 040-46517910", normal_style))
    elements.append(Paragraph("GST No: 03AACCV1726H2ZN", normal_style))
    elements.append(Spacer(1, 0.2*inch))
    
    # Invoice Details
    details_data = [
        ["Till No: 1005", "Order Number: SOA344380541795"],
        ["Created By: Dilveer Singh", "Date & Time: 13/05/2026 21:23"]
    ]
    t = Table(details_data, colWidths=[3*inch, 3*inch])
    t.setStyle(TableStyle([
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 0.2*inch))
    
    # Bill To
    elements.append(Paragraph("<b>Bill to address:</b>", normal_style))
    elements.append(Paragraph("Mr Rajeev Sharma", normal_style))
    elements.append(Paragraph("St.no.12/4 Radha swami road chet singh nagar Ludhiana Punjab-03 141003", normal_style))
    elements.append(Paragraph("9369768270 | rajusharma768270@gmail.com", normal_style))
    elements.append(Paragraph("Place of Supply: Punjab03", normal_style))
    elements.append(Spacer(1, 0.2*inch))
    
    # Items
    elements.append(Paragraph("------------- SELFPICKUP --------------", normal_style))
    elements.append(Paragraph("Invoice No: SLA344380541795", normal_style))
    elements.append(Spacer(1, 0.1*inch))
    
    item_data = [
        ["Item Description", "Item Code", "Tax", "Qty", "Price", "Total Amt"],
        ["ZPLU - Vivo X200FE(12+256)GB\nAmber Yellow Demo\nHSN: 85171300\nIMEI: 866549079740139", "316894", "8D/8H", "1/EA", "54999.00", "27499.50"],
        ["Item Manual Discount: 50% OfINR", "", "", "", "", "-27499.50"]
    ]
    t_item = Table(item_data, colWidths=[2.5*inch, 0.8*inch, 0.8*inch, 0.6*inch, 1*inch, 1.2*inch])
    t_item.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.grey),
        ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 10),
        ('BOTTOMPADDING', (0,0), (-1,0), 10),
        ('GRID', (0,0), (-1,-1), 1, colors.black),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (0,1), (0,-1), 'LEFT'),
    ]))
    elements.append(t_item)
    elements.append(Spacer(1, 0.1*inch))
    
    elements.append(Paragraph("<b>TOTAL: INR 27499.50</b>", styles['Heading3']))
    elements.append(Spacer(1, 0.2*inch))
    
    # Payment Details
    elements.append(Paragraph("<b>Payment Details</b>", normal_style))
    elements.append(Paragraph("HDFC EDC Tender INR 25437.04 (Last 4: 4107, Ref: 7036058905)", normal_style))
    elements.append(Paragraph("Plutus Factry Instant Cashba INR 2062.46 (Last 4: 4107, Ref: 062039)", normal_style))
    elements.append(Spacer(1, 0.2*inch))
    
    # Tax Summary
    elements.append(Paragraph("<b>Tax Summary</b>", normal_style))
    tax_data = [
        ["Type", "Code", "Rate", "Total Amt", "Tax Amt"],
        ["CGST", "8D", "9.0000", "27499.50", "2097.42"],
        ["SGST", "8H", "9.0000", "27499.50", "2097.42"],
    ]
    t_tax = Table(tax_data, colWidths=[1.5*inch, 1*inch, 1*inch, 1.5*inch, 1.5*inch])
    t_tax.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.lightgrey),
        ('GRID', (0,0), (-1,-1), 1, colors.black),
    ]))
    elements.append(t_tax)
    elements.append(Spacer(1, 0.1*inch))
    elements.append(Paragraph("PRICES INCLUSIVE OF ALL TAXES", normal_style))
    elements.append(Spacer(1, 0.2*inch))
    
    # Footer
    elements.append(Paragraph("CIN : U31900MH2005PLC158120", normal_style))
    elements.append(Paragraph("Regd. Office - Unit No. 701 & 702, 7th Floor, Kaledonia, Sahar Road, Andheri East, Mumbai 400069, India", normal_style))
    elements.append(Paragraph("Thank you for shopping with us. Buy yourself an electronics life, shop at www.croma.com", normal_style))
    elements.append(Paragraph("Email: customersupport@croma.com", normal_style))
    elements.append(Spacer(1, 0.2*inch))
    
    # Terms
    elements.append(Paragraph("<b>Exchange Policy / Terms and Conditions</b>", normal_style))
    terms = [
        "1. Products that require Home Delivery like LED TVs, Home Theatres, Air Conditioners, Washing Machines, Refrigerators etc will only be exchanged by Croma in case of inherent manufacturing or transit defects which are found before, during or at the time of demo/installation. Warranty period for the product will start from the date mentioned on the Invoice.",
        "2. The product to be exchanged must be returned without any scratches, dents, tears or holes and with all the accessories and manuals in the original manufacturer's undamaged & saleable box/packaging.",
        "3. Any defects arising in the product post-delivery and installation, will be serviced by the manufacturer/brand service center as per the manufacturer's brand warranty policy.",
        "4. Personal Care products will not be exchanged for hygiene reasons.",
        "5. Free Gifts will not be exchanged/replaced or covered under any kind of warranty.",
        "6. Wherever applicable, GST is levied at applicable rate on the value determined as per Rule 32(5) of the CGST Rules.",
        "7. Whether tax payable on reverse charge : No."
    ]
    for term in terms:
        elements.append(Paragraph(term, normal_style))
        elements.append(Spacer(1, 0.05*inch))
    
    doc.build(elements)
    print(f"Successfully generated {pdf_filename}")

if __name__ == '__main__':
    generate_invoice()
