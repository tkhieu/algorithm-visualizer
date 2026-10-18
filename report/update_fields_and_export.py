#!/usr/bin/env python3
"""Opens bao-cao.docx in a headless LibreOffice, updates the TOC field so the
docx (and the PDF exported from it) both show a filled table of contents, then
exports report/bao-cao.pdf. Must run with the SYSTEM python3 (the one that
ships uno.py/unohelper.py next to LibreOffice), not the project venv.
"""
import subprocess
import sys
import tempfile
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCX_PATH = ROOT / "report" / "bao-cao.docx"
PDF_PATH = ROOT / "report" / "bao-cao.pdf"
PORT = 2002


def wait_for_port(port, timeout=30):
    import socket

    deadline = time.time() + timeout
    while time.time() < deadline:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(("localhost", port)) == 0:
                return True
        time.sleep(0.5)
    return False


def main():
    import uno
    from com.sun.star.beans import PropertyValue

    tmp_root = ROOT / "report" / ".lo-tmp"
    tmp_root.mkdir(exist_ok=True)
    profile_dir = tempfile.mkdtemp(prefix="lo-profile-", dir=str(tmp_root))
    proc = subprocess.Popen(
        [
            "soffice",
            "--headless",
            "--invisible",
            "--nocrashreport",
            "--nodefault",
            "--norestore",
            "--nologo",
            "--nofirststartwizard",
            f"-env:UserInstallation=file://{profile_dir}",
            f"--accept=socket,host=localhost,port={PORT};urp;",
        ]
    )
    try:
        if not wait_for_port(PORT):
            raise RuntimeError("soffice did not open the UNO socket in time")
        time.sleep(1.5)

        local_ctx = uno.getComponentContext()
        resolver = local_ctx.ServiceManager.createInstanceWithContext(
            "com.sun.star.bridge.UnoUrlResolver", local_ctx
        )
        ctx = None
        last_err = None
        for _ in range(20):
            try:
                ctx = resolver.resolve(
                    f"uno:socket,host=localhost,port={PORT};urp;StarOffice.ComponentContext"
                )
                break
            except Exception as e:  # noqa: BLE001
                last_err = e
                time.sleep(0.5)
        if ctx is None:
            raise RuntimeError(f"could not connect to soffice: {last_err}")

        smgr = ctx.ServiceManager
        desktop = smgr.createInstanceWithContext("com.sun.star.frame.Desktop", ctx)

        def make_prop(name, value):
            p = PropertyValue()
            p.Name = name
            p.Value = value
            return p

        in_url = "file://" + str(DOCX_PATH)
        doc = desktop.loadComponentFromURL(
            in_url, "_blank", 0, (make_prop("Hidden", True),)
        )

        indexes = doc.getDocumentIndexes()
        for idx in range(indexes.getCount()):
            indexes.getByIndex(idx).update()

        doc.store()  # save back as .docx with the TOC field now filled in

        out_url = "file://" + str(PDF_PATH)
        doc.storeToURL(out_url, (make_prop("FilterName", "writer_pdf_Export"),))

        doc.close(False)
        print(f"Updated TOC in {DOCX_PATH}")
        print(f"Wrote {PDF_PATH}")
    finally:
        try:
            desktop.terminate()
        except Exception:  # noqa: BLE001
            pass
        proc.terminate()
        try:
            proc.wait(timeout=10)
        except Exception:  # noqa: BLE001
            proc.kill()


if __name__ == "__main__":
    main()
