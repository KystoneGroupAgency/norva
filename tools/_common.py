"""Utilitários compartilhados pelas ferramentas de desenvolvimento da Norva.

Nada aqui é carregado pelo site publicado (veja .vercelignore).
"""
import contextlib
import functools
import http.server
import os
import shutil
import socket
import subprocess
import tempfile
import threading

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOOLS = os.path.join(REPO, "tools")
BASELINE = os.path.join(TOOLS, "baseline")
PAGES = ["index.html", "portal.html"]

# Estado de consentimento "recusado" pré-gravado: esconde o banner de cookies
# nas capturas e nos checks de texto (o banner é testado à parte).
CONSENT_DECLINED = (
    "try{localStorage.setItem('norva_cookie_consent',"
    "JSON.stringify({value:'declined',version:1,timestamp:'2026-01-01T00:00:00Z'}))}catch(e){}"
)


def free_port():
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


class _QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


@contextlib.contextmanager
def serve(root):
    """Serve `root` por HTTP local numa porta livre; devolve a URL base."""
    port = free_port()
    handler = functools.partial(_QuietHandler, directory=root)
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", port), handler)
    t = threading.Thread(target=httpd.serve_forever, daemon=True)
    t.start()
    try:
        yield f"http://127.0.0.1:{port}/"
    finally:
        httpd.shutdown()
        httpd.server_close()


@contextlib.contextmanager
def site_root(ref=None):
    """Devolve um diretório com o site: a árvore de trabalho (ref=None) ou um
    commit exportado com `git archive` para um diretório temporário."""
    if not ref:
        yield REPO
        return
    tmp = tempfile.mkdtemp(prefix="norva-ref-")
    try:
        archive = subprocess.run(["git", "-C", REPO, "archive", ref], check=True, capture_output=True).stdout
        subprocess.run(["tar", "-x", "-C", tmp], input=archive, check=True)
        yield tmp
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def git_rev(ref="HEAD"):
    try:
        return subprocess.run(["git", "-C", REPO, "rev-parse", "--short", ref], check=True,
                              capture_output=True, text=True).stdout.strip()
    except Exception:
        return "?"


def worktree_dirty():
    out = subprocess.run(["git", "-C", REPO, "status", "--porcelain", "--", ":!tools"],
                         capture_output=True, text=True).stdout.strip()
    return bool(out)
