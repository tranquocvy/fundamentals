import { tokenizer } from 'zbsearch/components';

/** Bỏ dấu tiếng Việt: "bộ nhớ" → "bo nho", "đ" → "d". */
export function foldVietnamese(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{M}/gu, '') // ký tự dấu kết hợp sau khi tách NFD
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

const base = tokenizer.createTokenizer({ language: 'english' });

/**
 * Tokenizer dùng chung cho index (server) và truy vấn (client): bỏ dấu trước khi tách từ,
 * nên gõ "bo nho" hay "bộ nhớ" đều khớp. Nội dung hiển thị trong kết quả vẫn giữ dấu.
 */
export const searchTokenizer = {
  language: base.language,
  normalizationCache: base.normalizationCache,
  tokenize: (raw: string, language?: string, prop?: string, withCache?: boolean) =>
    base.tokenize(foldVietnamese(raw), language, prop, withCache),
};
