import json
import time
import pathlib
import papermill as pm

ROOT = pathlib.Path(__file__).resolve().parents[1]
NB_IN = ROOT / "figure" / "figure.ipynb"
OUTDIR = ROOT / "static" / "assets" / "svg" / "figure"
MANIFEST = OUTDIR / "manifest.json"

OUTDIR.mkdir(parents=True, exist_ok=True)

# Execute notebook in a clean kernel
executed_nb_path = OUTDIR / "viz_executed.ipynb"
pm.execute_notebook(
    input_path=str(NB_IN),
    output_path=str(executed_nb_path),
    parameters={
        "SAVE_DIR": str(OUTDIR),
    },
    kernel_name="python3",
)

# Build a manifest by scanning the folder
items = []

for p in sorted(OUTDIR.glob("*.svg")):
    title = p.stem.replace("_", " ").replace("-", " ").title()
    items.append({"file": p.name, "title": title, "type": "svg"})

for p in sorted(OUTDIR.glob("*.html")):
    title = p.stem.replace("_", " ").replace("-", " ").title()
    items.append({"file": p.name, "title": title, "type": "html"})

with open(MANIFEST, "w") as f:
    json.dump({"generated_at": int(time.time()), "items": items}, f, indent=2)

print(f"Wrote {len(items)} SVGs and manifest.")
