from django.shortcuts import render
from django.http import HttpResponse
from .forms import pdf_merge_form
from .utils import merge_pdfs
import os


def merge_view(request):
    if request.method == "POST":
        form = pdf_merge_form(
            request.POST,
            request.FILES,
        )

        if form.is_valid():
            pdf_files = request.FILES.getlist("files")

            MAX_FILE_BYTES = 20 * 1024 * 1024
            MAX_TOTAL_BYTES = 50 * 1024 * 1024
            for f in pdf_files:
                if f.size > MAX_FILE_BYTES:
                    r = HttpResponse(f"File '{f.name}' exceeds the 20 MB per-file limit.", status=400)
                    r["X-Merge-Error"] = "1"
                    return r
            total = sum(f.size for f in pdf_files)
            if total > MAX_TOTAL_BYTES:
                r = HttpResponse("Total file size exceeds the 50 MB limit.", status=400)
                r["X-Merge-Error"] = "1"
                return r

            files = pdf_files

            if len(files) >= 2:
                file_paths = []

                try:
                    for file in files:
                        file_path = f"/tmp/{file.name}"
                        file_paths.append(file_path)
                        with open(file_path, "wb+") as f:
                            for chunk in file.chunks():
                                f.write(chunk)

                    output_path = "/tmp/merged.pdf"
                    merge_pdfs(file_paths, output_path)

                    with open(output_path, "rb") as merged_file:
                        response = HttpResponse(
                            merged_file.read(), content_type="application/pdf"
                        )
                        response["Content-Disposition"] = (
                            'attachment; filename="merged.pdf"'
                        )
                        response.set_cookie(
                            "merge_complete", "1", max_age=60, samesite="Lax", path="/"
                        )

                    return response

                finally:
                    for path in file_paths:
                        if os.path.exists(path):
                            os.remove(path)
                    if os.path.exists(output_path):
                        os.remove(output_path)

            else:
                r = HttpResponse("Upload at least two PDF files.", status=400)
                r["X-Merge-Error"] = "1"
                return r
    else:
        form = pdf_merge_form()

    return render(
        request,
        "pdfmerger_app/merge_form.html",
        {"form": form},
    )
