from PyPDF2 import PdfWriter, PdfReader


def merge_pdfs(pdf_list, output_file):
    writer = PdfWriter()

    for pdf in pdf_list:
        reader = PdfReader(pdf)
        for page in reader.pages:
            writer.add_page(page)

    with open(output_file, "wb") as f:
        writer.write(f)
