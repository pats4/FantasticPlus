#!/usr/bin/env bash
# Build FantasticPlus from source and package it as a Decky plugin zip.
#
# Needs: git, rustup (stable + the 1.81.0 toolchain from src/rust/rust-toolchain.toml),
# the x86_64-unknown-linux-musl target with musl-gcc, wasm-pack,
# wasm-bindgen-cli 0.2.87, Node.js with pnpm, python3 and zip.
set -euo pipefail
cd "$(dirname "$0")"
ROOT="$PWD"

./scripts/fetch-deps.sh

echo "== back-end (static, so it does not depend on SteamOS's glibc)"
(cd backend-rs && cargo test --release && cargo build --release --target x86_64-unknown-linux-musl)
mkdir -p bin
install -m 755 backend-rs/target/x86_64-unknown-linux-musl/release/fantastic-rs bin/backend

echo "== WASM bridge"
(cd src/rust && RUSTFLAGS="--cfg aes_compact" wasm-pack build --mode no-install --target web --features decky \
    && python3 ./scripts/generate_embedded_wasm.py)

echo "== front-end"
pnpm install --frozen-lockfile
pnpm build

echo "== package"
OUT="$ROOT/out"
rm -rf "$OUT" && mkdir -p "$OUT/FantasticPlus/bin" "$OUT/FantasticPlus/dist"
cp main.py plugin.json package.json LICENSE README.md "$OUT/FantasticPlus/"
cp dist/index.js "$OUT/FantasticPlus/dist/"
cp bin/backend "$OUT/FantasticPlus/bin/"
(cd "$OUT" && zip -qr FantasticPlus.zip FantasticPlus)
(cd "$OUT" && sha256sum FantasticPlus.zip FantasticPlus/bin/backend FantasticPlus/dist/index.js | tee SHA256SUMS)
echo "built $OUT/FantasticPlus.zip"
