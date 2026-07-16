#!/usr/bin/env python3
"""Create a compact, local inspection pack from a brand-book PDF."""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import subprocess
from pathlib import Path


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def extract(pdf: Path, output_dir: Path) -> dict:
    try:
        from pypdf import PdfReader
    except ImportError as exc:
        raise SystemExit("pypdf is required; use the bundled workspace Python runtime or install pypdf") from exc

    output_dir.mkdir(parents=True, exist_ok=True)
    reader = PdfReader(str(pdf))
    texts = [page.extract_text() or "" for page in reader.pages]
    image_count = sum(len(getattr(page, "images", [])) for page in reader.pages)

    sections = [
        "# Brand book - extracted text",
        "",
        f"Source: `{pdf.name}`",
        f"Pages: {len(reader.pages)}",
        "",
    ]
    for index, text in enumerate(texts, start=1):
        sections.extend([f"## Page {index}", "", text.strip(), ""])
    (output_dir / "brand-book-extracted.md").write_text("\n".join(sections), encoding="utf-8")

    inventory = {
        "source": str(pdf),
        "filename": pdf.name,
        "size_bytes": pdf.stat().st_size,
        "sha256": sha256_file(pdf),
        "pages": len(reader.pages),
        "pages_with_text": sum(bool(text.strip()) for text in texts),
        "text_chars": sum(len(text) for text in texts),
        "embedded_images": image_count,
        "ocr_recommended": sum(bool(text.strip()) for text in texts) < len(reader.pages) * 0.8,
    }
    (output_dir / "inventory.json").write_text(json.dumps(inventory, indent=2) + "\n", encoding="utf-8")
    return inventory


def render_previews(pdf: Path, output_dir: Path, pdftoppm: str | None) -> None:
    executable = pdftoppm or shutil.which("pdftoppm")
    if not executable:
        print("Skipping previews: pdftoppm was not found")
        return
    preview_dir = output_dir / "page-previews"
    preview_dir.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            executable,
            "-f",
            "1",
            "-l",
            "99999",
            "-scale-to",
            "900",
            "-jpeg",
            "-jpegopt",
            "quality=65",
            str(pdf),
            str(preview_dir / "page"),
        ],
        check=True,
    )


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("pdf", type=Path)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--no-previews", action="store_true")
    parser.add_argument("--pdftoppm", help="Path to pdftoppm when it is not on PATH")
    args = parser.parse_args()

    if not args.pdf.is_file():
        raise SystemExit(f"PDF not found: {args.pdf}")
    inventory = extract(args.pdf, args.output_dir)
    if not args.no_previews:
        render_previews(args.pdf, args.output_dir, args.pdftoppm)
    print(json.dumps(inventory, indent=2))


if __name__ == "__main__":
    main()
