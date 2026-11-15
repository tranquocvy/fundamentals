// Next 16 (output: 'export') ghi file prefetch theo segment dạng thư mục lồng nhau:
//   out/docs/__next.docs/$oc$slug/__PAGE__.txt
// nhưng client lại request tên phẳng nối bằng dấu chấm:
//   /docs/__next.docs.$oc$slug.__PAGE__.txt
// Host tĩnh trả 404 → mất prefetch. Script này tạo bản sao tên phẳng cạnh thư mục gốc.
import { copyFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'out';
let count = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (!statSync(p).isDirectory()) continue;
    if (name.startsWith('__next.')) flatten(p, dir, name);
    else walk(p);
  }
}

// Sao chép mọi file trong thư mục __next.* lên thư mục cha với tên nối bằng dấu chấm.
function flatten(segDir, parent, prefix) {
  for (const name of readdirSync(segDir)) {
    const p = join(segDir, name);
    const flat = `${prefix}.${name}`;
    if (statSync(p).isDirectory()) flatten(p, parent, flat);
    else {
      copyFileSync(p, join(parent, flat));
      count++;
    }
  }
}

walk(OUT);
console.log(`[fix-prefetch] đã tạo ${count} file prefetch tên phẳng trong ${OUT}/`);
