import json
import time
import pathlib
import os
import papermill as pm

ROOT = pathlib.Path(__file__).resolve().parents[1]
NB_IN = ROOT / "figure" / "figure.ipynb"
OUTDIR = ROOT / "static" / "assets" / "svg" / "figure"
MANIFEST = OUTDIR / "manifest.json"

def execute_notebook(nb_in=NB_IN, outdir=OUTDIR):
    outdir.mkdir(parents=True, exist_ok=True)
    executed_nb_path = outdir / "viz_executed.ipynb"
    pm.execute_notebook(
        input_path=str(nb_in),
        output_path=str(executed_nb_path),
        parameters={"SAVE_DIR": str(outdir)},
        # allow override; fall back to letting papermill pick default
        kernel_name=os.environ.get("PM_KERNEL") or None,
    )

def write_manifest(outdir=OUTDIR, manifest=MANIFEST):
    items = []
    for p in sorted(outdir.glob("*.svg")):
        title = p.stem.replace("_", " ").replace("-", " ").title()
        items.append({"file": p.name, "title": title, "type": "svg"})
    for p in sorted(outdir.glob("*.html")):
        title = p.stem.replace("_", " ").replace("-", " ").title()
        items.append({"file": p.name, "title": title, "type": "html"})
    manifest.parent.mkdir(parents=True, exist_ok=True)
    with open(manifest, "w") as f:
        json.dump({"generated_at": int(time.time()), "items": items}, f, indent=2)
    print(f"Wrote {len(items)} items and manifest.")

def build_all():
    execute_notebook()
    write_manifest()

if __name__ == "__main__":
    build_all()
