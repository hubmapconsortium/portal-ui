import json
import time
import pathlib
import os
import papermill as pm

FILE = pathlib.Path(__file__).resolve()
APP_DIR = FILE.parent.parent
NB_IN = (APP_DIR / 'figure' / 'figure.ipynb').resolve()
OUTDIR = (APP_DIR / 'static' / 'assets' / 'svg' / 'figure').resolve()
MANIFEST = (OUTDIR / 'manifest.json').resolve()


def execute_notebook(nb_in: pathlib.Path = NB_IN, outdir: pathlib.Path = OUTDIR):
    outdir = pathlib.Path(outdir).resolve()
    outdir.mkdir(parents=True, exist_ok=True)
    executed_nb_path = outdir / 'viz_executed.ipynb'

    pm.execute_notebook(
        input_path=str(nb_in),
        output_path=str(executed_nb_path),
        parameters={'SAVE_DIR': str(outdir)},
        kernel_name=os.environ.get('PM_KERNEL') or None,
    )


def write_manifest(outdir: pathlib.Path = OUTDIR, manifest: pathlib.Path = MANIFEST):
    outdir = pathlib.Path(outdir).resolve()
    items = []
    for p in sorted(outdir.glob('*.svg')):
        title = p.stem.replace('_', ' ').replace('-', ' ').title()
        items.append({'file': p.name, 'title': title, 'type': 'svg'})
    for p in sorted(outdir.glob('*.html')):
        title = p.stem.replace('_', ' ').replace('-', ' ').title()
        items.append({'file': p.name, 'title': title, 'type': 'html'})
    manifest.parent.mkdir(parents=True, exist_ok=True)
    with open(manifest, 'w') as f:
        json.dump({'generated_at': int(time.time()), 'items': items}, f, indent=2)
    print(f'[build_figure] SAVE_DIR={outdir}')
    print(f'[build_figure] Wrote {len(items)} items -> {manifest}')


def build_all():
    execute_notebook()
    write_manifest()


if __name__ == '__main__':
    build_all()
