import { execFileSync } from 'node:child_process';

export type GitInfo = {
  /** tên git của người tạo file (commit đầu tiên) */
  author?: string;
  /** những người khác đã sửa file, theo thứ tự commit */
  contributors: string[];
  /** ngày commit gần nhất (ISO) */
  updated?: string;
};

/**
 * Đọc tác giả + ngày cập nhật của một file từ `git log` lúc build.
 * Không có git hoặc repo clone nông (shallow) thì trả về rỗng, trang vẫn build bình thường.
 * Chỉ dùng tên (%an), không bao giờ hiển thị email.
 */
export function getGitInfo(filePath: string): GitInfo {
  try {
    const out = execFileSync('git', ['log', '--follow', '--format=%an%x09%aI', '--', filePath], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (!out) return { contributors: [] };
    const rows = out.split('\n').map((l) => l.split('\t') as [string, string]);
    const names = rows.map(([n]) => n).reverse(); // cũ → mới
    const author = names[0];
    const contributors = [...new Set(names.slice(1))].filter((n) => n !== author);
    return { author, contributors, updated: rows[0][1] };
  } catch {
    return { contributors: [] };
  }
}
