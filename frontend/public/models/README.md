# 3D models (GLB)

AutoVerse ships with a **built-in procedural 3D car** (real geometry, see `src/components/CarModel.jsx`) so it works with no downloads.

To use realistic models, drop licensed `.glb` files here using these names (they match `model_url` in the database):

porsche-911.glb, bmw-m4.glb, amg-gt.glb, lamborghini-huracan.glb, ferrari-f8.glb, tesla-model-s.glb, range-rover-sport.glb, audi-r8.glb

* Use only models whose licence allows your use (e.g. CC-BY / CC0 models on Sketchfab, Poly Pizza, or models you purchase). Keep attribution if required.
* For paint/wheel customization, mesh or material names should contain `body`/`paint` (paint) and `wheel`/`rim` (wheels); tyres should contain `tire`/`tyre`. Rename in Blender if needed.
* Compress with `npx gltf-transform optimize in.glb out.glb` to keep files small.
* Models are auto-scaled and centred. If a file is missing or fails to load, the fallback car is shown.
