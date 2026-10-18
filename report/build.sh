#!/usr/bin/env bash
# Rebuilds report/bao-cao.docx and report/bao-cao.pdf from docs/bao-cao.md.
#
# Usage: report/build.sh
#
# Requires: python3 (for a local venv with python-docx) and a system
# LibreOffice install (`soffice`) whose bundled python (used only to update
# the Word TOC field and export the PDF) ships uno.py/unohelper.py.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
VENV_DIR="$SCRIPT_DIR/.venv"

if [ ! -d "$VENV_DIR" ]; then
  python3 -m venv "$VENV_DIR"
fi
# shellcheck disable=SC1091
source "$VENV_DIR/bin/activate"
pip install --disable-pip-version-check -q -r "$SCRIPT_DIR/requirements.txt"

echo "==> Building $SCRIPT_DIR/bao-cao.docx from docs/bao-cao.md"
python "$SCRIPT_DIR/build_docx.py"
deactivate

# Find a system python that can `import uno` (ships next to LibreOffice).
SYSTEM_PY=""
for candidate in /usr/bin/python3 python3; do
  if "$candidate" -c "import uno" >/dev/null 2>&1; then
    SYSTEM_PY="$candidate"
    break
  fi
done
if [ -z "$SYSTEM_PY" ]; then
  echo "WARNING: no python with the LibreOffice 'uno' module found." >&2
  echo "The .docx was built, but the TOC field is still empty and no PDF was exported." >&2
  echo "Open bao-cao.docx in Word/LibreOffice, update the Mục lục field (F9), then export to PDF." >&2
  exit 1
fi

echo "==> Updating the Mục lục field and exporting bao-cao.pdf via LibreOffice"
"$SYSTEM_PY" "$SCRIPT_DIR/update_fields_and_export.py"

rm -rf "$SCRIPT_DIR/.lo-tmp"
echo "==> Done: $SCRIPT_DIR/bao-cao.docx and $SCRIPT_DIR/bao-cao.pdf"
