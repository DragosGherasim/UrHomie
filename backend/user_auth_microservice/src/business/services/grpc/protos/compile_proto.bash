SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

PROTO_DIR="$SCRIPT_DIR"
OUT_DIR="$SCRIPT_DIR/../compiled_protos"

mkdir -p "$OUT_DIR"
touch "$OUT_DIR/__init__.py"

python -m grpc_tools.protoc \
    -I$PROTO_DIR \
    --python_out=$OUT_DIR \
    --grpc_python_out=$OUT_DIR \
    $PROTO_DIR/*.proto