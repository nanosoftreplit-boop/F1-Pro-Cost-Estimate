/**
 * Dự toán F1 Pro - Bộ Kiểm Tra & Sửa Lỗi Chính Tả Chuyên Ngành Xây Dựng
 * Hỗ trợ nhận diện các từ ngữ sai chính tả, thiếu dấu tiếng Việt, nhầm lẫn âm vần,
 * sai thuật ngữ kỹ thuật theo tiêu chuẩn TCVN và định mức Bộ Xây dựng.
 */

export interface SpellCheckIssue {
  id: string;
  itemId: string;
  field: 'name' | 'subCalcName' | 'subCalcExpr';
  subCalcId?: string;
  originalText: string;
  misspelledWord: string;
  startIndex: number;
  endIndex: number;
  suggestions: string[];
  reason: string;
}

// Từ điển cặp lỗi sai phổ biến -> từ chuẩn chuyên ngành xây dựng
export const CONSTRUCTION_TYPO_MAP: Record<string, string[]> = {
  // Bê tông & vữa
  'be tong': ['bê tông'],
  'bê tong': ['bê tông'],
  'be tông': ['bê tông'],
  'bêtông': ['bê tông'],
  'betong': ['bê tông'],
  'btct': ['bê tông cốt thép'],
  'vua': ['vữa'],
  'vua xi mang': ['vữa xi măng'],
  'vữa xi mang': ['vữa xi măng'],
  'xi mang': ['xi măng'],
  'ximang': ['xi măng'],
  'mac': ['mác'],
  'mac 200': ['mác 200', 'M200'],
  'mac 250': ['mác 250', 'M250'],
  'mac 300': ['mác 300', 'M300'],
  'mac 150': ['mác 150', 'M150'],

  // Cốt thép & kim khí
  'cot thep': ['cốt thép'],
  'côt thep': ['cốt thép'],
  'cốt thep': ['cốt thép'],
  'thep': ['thép'],
  'thep phi': ['thép Ø'],
  'thep tròn': ['thép tròn'],
  'xà go': ['xà gồ'],
  'xa go': ['xà gồ'],
  'bu long': ['bu lông'],
  'bulong': ['bu lông'],
  'bù lon': ['bu lông'],
  'ban ma': ['bản mã'],
  'ban ma thep': ['bản mã thép'],

  // Ván khuôn & giàn giáo
  'van khuon': ['ván khuôn'],
  'ván khuon': ['ván khuôn'],
  'van khuôn': ['ván khuôn'],
  'gian giao': ['giàn giáo'],
  'giang giao': ['giàn giáo'],
  'dàn giáo': ['giàn giáo'],
  'chong tang': ['chống tăng'],
  'cay chong': ['cây chống'],

  // Đất, móng, cọc
  'dao mong': ['đào móng'],
  'đao mong': ['đào móng'],
  'dao móng': ['đào móng'],
  'dap dat': ['đắp đất'],
  'đap dat': ['đắp đất'],
  'đắp đat': ['đắp đất'],
  'ho mong': ['hố móng'],
  'hố mong': ['hố móng'],
  'coc khoan nhoi': ['cọc khoan nhồi'],
  'cọc khoan nhoi': ['cọc khoan nhồi'],
  'coc btct': ['cọc BTCT'],
  'dong coc': ['đóng cọc'],
  'ep coc': ['ép cọc'],
  'giang mong': ['giằng móng'],
  'giằng mong': ['giằng móng'],
  'dầm mong': ['dầm móng'],
  'dam mong': ['dầm móng'],
  'lop dem': ['lớp đệm'],
  'da dam': ['đá dăm'],
  'đa dam': ['đá dăm'],
  'cat vang': ['cát vàng'],
  'cat den': ['cát đen'],

  // Xây, trát, ốp, lát, sơn
  'xay gach': ['xây gạch'],
  'xay tuong': ['xây tường'],
  'xây tuong': ['xây tường'],
  'trat tuong': ['trát tường'],
  'trát tuong': ['trát tường'],
  'trat ngoai': ['trát ngoài'],
  'trat trong': ['trát trong'],
  'lat gach': ['lát gạch'],
  'lát gach': ['lát gạch'],
  'op gach': ['ốp gạch'],
  'ốp gach': ['ốp gạch'],
  'son nuoc': ['sơn nước'],
  'sơn nuoc': ['sơn nước'],
  'son lot': ['sơn lót'],
  'son phu': ['sơn phủ'],
  'chong tham': ['chống thấm'],
  'chông thấm': ['chống thấm'],
  'màng kho': ['màng khò'],
  'mang kho': ['màng khò'],

  // Kết cấu & cấu kiện
  'san be tong': ['sàn bê tông'],
  'san mai': ['sàn mái'],
  'sàn mai': ['sàn mái'],
  'cau thang': ['cầu thang'],
  'câu thang': ['cầu thang'],
  'cot': ['cột'],
  'lan can': ['lan can'],
  'sê nô': ['sê-nô', 'máng xối'],
  'se no': ['sê-nô'],
  'lam gio': ['lam gió'],
  'tam đan': ['tấm đan'],
  'tam dan': ['tấm đan'],

  // Điện nước M&E
  'ong nhua': ['ống nhựa'],
  'ong pvc': ['ống PVC'],
  'ong ppr': ['ống PPR'],
  'day cap': ['dây cáp'],
  'cap ngam': ['cáp ngầm'],
  'ap to mat': ['áp-tô-mát', 'aptomat'],
  'o cam': ['ổ cắm'],
  'cong tac': ['công tác', 'công tắc'],
  'den led': ['đèn LED'],

  // Diễn giải khối lượng
  'khoi luong': ['khối lượng'],
  'khôi lượng': ['khối lượng'],
  'thiet ke': ['thiết kế'],
  'thiêt kế': ['thiết kế'],
  'cau kien': ['cấu kiện'],
  'kich thuoc': ['kích thước'],
  'chieu dai': ['chiều dài'],
  'chieu rong': ['chiều rộng'],
  'chieu cao': ['chiều cao'],
};

// Danh mục từ vựng chuyên ngành xây dựng chuẩn (TCVN)
export const CONSTRUCTION_STANDARD_LEXICON = new Set([
  'bê tông', 'cốt thép', 'ván khuôn', 'giàn giáo', 'đào móng', 'đắp đất',
  'hố móng', 'cọc khoan nhồi', 'cọc btct', 'đóng cọc', 'ép cọc', 'giằng móng',
  'dầm móng', 'lớp đệm', 'đá dăm', 'cát vàng', 'cát đen', 'xi măng', 'vữa xi măng',
  'mác 200', 'mác 250', 'mác 300', 'thép hình', 'thép tấm', 'xà gồ', 'bu lông',
  'bản mã', 'xây gạch', 'trát tường', 'lát gạch', 'ốp gạch', 'sơn nước', 'chống thấm',
  'cột', 'dầm', 'sàn', 'mái', 'cầu thang', 'lan can', 'sê-nô', 'lanh tô', 'ô văng',
  'ống pvc', 'dây cáp', 'đèn led', 'thiết kế', 'khối lượng', 'cấu kiện', 'chiều dài',
  'chiều rộng', 'chiều cao', 'diện tích', 'thể tích', 'đơn giá', 'định mức'
]);

/**
 * Kiểm tra chuỗi văn bản và tìm các lỗi chính tả hoặc từ ngữ không chuẩn
 */
export function checkTextSpelling(
  text: string,
  itemId: string,
  field: 'name' | 'subCalcName' | 'subCalcExpr',
  subCalcId?: string
): SpellCheckIssue[] {
  if (!text || text.trim() === '') return [];

  const issues: SpellCheckIssue[] = [];
  const lower = text.toLowerCase();
  const occupiedRanges: [number, number][] = [];

  // Sắp xếp các cụm từ sai theo độ dài giảm dần để ưu tiên khớp cụm từ dài trước
  // Ví dụ: "vua xi mang" sẽ khớp trước "vua" hoặc "xi mang"
  const sortedTypoEntries = Object.entries(CONSTRUCTION_TYPO_MAP).sort(
    (a, b) => b[0].length - a[0].length
  );

  for (const [typo, suggestions] of sortedTypoEntries) {
    let searchStart = 0;
    while (searchStart < lower.length) {
      const idx = lower.indexOf(typo, searchStart);
      if (idx === -1) break;

      const nextCharIdx = idx + typo.length;

      // Kiểm tra ranh giới từ (word boundary)
      const isStartWord = idx === 0 || /[\s,.;:()\-+/]/.test(lower[idx - 1]);
      const isEndWord = nextCharIdx >= lower.length || /[\s,.;:()\-+/]/.test(lower[nextCharIdx]);

      if (isStartWord && isEndWord) {
        // Kiểm tra xem khoảng ký tự này đã được cụm từ dài hơn bao phủ chưa
        const isOverlapping = occupiedRanges.some(
          ([start, end]) => Math.max(start, idx) < Math.min(end, nextCharIdx)
        );

        if (!isOverlapping) {
          const matchedRaw = text.substring(idx, nextCharIdx);
          // Nếu đã viết đúng dấu rồi thì bỏ qua
          const isAlreadyCorrect = suggestions.some(s => s.toLowerCase() === matchedRaw.toLowerCase());
          if (!isAlreadyCorrect) {
            occupiedRanges.push([idx, nextCharIdx]);
            const slugTypo = typo.replace(/[^a-zA-Z0-9]/g, '_');
            const subPart = subCalcId ? `_${subCalcId}` : '';
            issues.push({
              id: `issue_${itemId}_${field}${subPart}_${idx}_${nextCharIdx}_${slugTypo}`,
              itemId,
              field,
              subCalcId,
              originalText: text,
              misspelledWord: matchedRaw,
              startIndex: idx,
              endIndex: nextCharIdx,
              suggestions,
              reason: `Thuật ngữ chuyên ngành xây dựng chưa chuẩn: "${matchedRaw}"`
            });
          }
        }
      }

      searchStart = idx + 1;
    }
  }

  // Sắp xếp các lỗi theo vị trí xuất hiện trong câu
  return issues.sort((a, b) => a.startIndex - b.startIndex);
}

/**
 * Thay thế từ sai chính tả bằng gợi ý đã chọn
 */
export function applySpellCorrection(
  text: string,
  startIndex: number,
  endIndex: number,
  replacement: string
): string {
  return text.substring(0, startIndex) + replacement + text.substring(endIndex);
}

/**
 * Tự động sửa tất cả các từ sai có trong chuỗi dựa trên gợi ý ưu tiên số 1
 */
export function autoCorrectText(text: string): string {
  let result = text;
  // Sắp xếp các cụm từ theo độ dài giảm dần để sửa cụm từ dài trước
  const sortedTypos = Object.keys(CONSTRUCTION_TYPO_MAP).sort((a, b) => b.length - a.length);

  for (const typo of sortedTypos) {
    const replacement = CONSTRUCTION_TYPO_MAP[typo][0];
    const regex = new RegExp(`(?<=^|[\\s,.;:()\\-+/])${typo}(?=$|[\\s,.;:()\\-+/])`, 'gi');
    result = result.replace(regex, (match) => {
      // Giữ nguyên viết hoa chữ cái đầu nếu từ gốc viết hoa
      if (match[0] === match[0].toUpperCase()) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }
      return replacement;
    });
  }

  return result;
}
