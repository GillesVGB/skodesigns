export async function boundedBytes(request: Request, maximum: number) {
  if (Number(request.headers.get("Content-Length")) > maximum)
    throw new Error("tooLarge");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("invalid");
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > maximum) {
      await reader.cancel();
      throw new Error("tooLarge");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return bytes;
}
export function imageInfo(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const ascii = (start: number, end: number) =>
    String.fromCharCode(...bytes.slice(start, end));
  let width = 0,
    height = 0,
    extension = "",
    mime = "";
  if (
    bytes.length > 24 &&
    bytes[0] === 137 &&
    ascii(1, 4) === "PNG" &&
    bytes[4] === 13 &&
    bytes[5] === 10 &&
    bytes[6] === 26 &&
    bytes[7] === 10 &&
    ascii(12, 16) === "IHDR"
  ) {
    width = view.getUint32(16);
    height = view.getUint32(20);
    extension = "png";
    mime = "image/png";
  } else if (
    bytes.length > 30 &&
    ascii(0, 4) === "RIFF" &&
    ascii(8, 12) === "WEBP"
  ) {
    const type = ascii(12, 16);
    extension = "webp";
    mime = "image/webp";
    if (type === "VP8X") {
      if (bytes[20] & 2) throw new Error("invalidImage");
      width = 1 + bytes[24] + (bytes[25] << 8) + (bytes[26] << 16);
      height = 1 + bytes[27] + (bytes[28] << 8) + (bytes[29] << 16);
    } else if (
      type === "VP8 " &&
      bytes[23] === 157 &&
      bytes[24] === 1 &&
      bytes[25] === 42
    ) {
      width = view.getUint16(26, true) & 0x3fff;
      height = view.getUint16(28, true) & 0x3fff;
    } else if (type === "VP8L" && bytes[20] === 47) {
      width = 1 + bytes[21] + ((bytes[22] & 63) << 8);
      height =
        1 + (bytes[22] >> 6) + (bytes[23] << 2) + ((bytes[24] & 15) << 10);
    }
  } else if (
    bytes.length > 4 &&
    bytes[0] === 255 &&
    bytes[1] === 216 &&
    bytes[2] === 255
  ) {
    extension = "jpg";
    mime = "image/jpeg";
    let cursor = 2;
    while (cursor + 8 < bytes.length) {
      if (bytes[cursor] !== 255) break;
      const marker = bytes[cursor + 1];
      cursor += 2;
      if (marker === 217 || marker === 218) break;
      if (marker === 216 || marker === 1 || (marker >= 208 && marker <= 215))
        continue;
      const length = view.getUint16(cursor);
      if (length < 2 || cursor + length > bytes.length) break;
      if (
        [
          192, 193, 194, 195, 197, 198, 199, 201, 202, 203, 205, 206, 207,
        ].includes(marker)
      ) {
        height = view.getUint16(cursor + 3);
        width = view.getUint16(cursor + 5);
        break;
      }
      cursor += length;
    }
  }
  if (
    !width ||
    !height ||
    width > 8192 ||
    height > 8192 ||
    width * height > 40_000_000
  )
    throw new Error("invalidImage");
  return { width, height, extension, mime };
}
