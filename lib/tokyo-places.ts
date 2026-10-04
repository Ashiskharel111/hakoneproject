/**
 * Curated Database of Tokyo Luxury Hotels, Major Stations & Key Landmarks.
 * Provides instant, zero-API-cost local search autocomplete for SK LIMO bookings.
 * Completely eliminates Google Places API quota burn and unexpected billing spikes.
 */

export interface TokyoPlace {
  id: string;
  nameEn: string;
  nameJa: string;
  district: string;
  formattedAddress: string;
  category: 'hotel' | 'station' | 'landmark' | 'area';
}

export const TOKYO_LUXURY_PLACES: TokyoPlace[] = [
  // ── Top 5-Star Luxury Hotels ──
  {
    id: 'aman-tokyo',
    nameEn: 'Aman Tokyo',
    nameJa: 'アマン東京',
    district: 'Otemachi / Chiyoda',
    formattedAddress: 'The Otemachi Tower, 1-5-6 Otemachi, Chiyoda-ku, Tokyo',
    category: 'hotel',
  },
  {
    id: 'grand-hyatt-tokyo',
    nameEn: 'Grand Hyatt Tokyo',
    nameJa: 'グランドハイアット東京',
    district: 'Roppongi Hills / Minato',
    formattedAddress: '6-10-3 Roppongi, Minato-ku, Tokyo (Roppongi Hills)',
    category: 'hotel',
  },
  {
    id: 'ritz-carlton-tokyo',
    nameEn: 'The Ritz-Carlton, Tokyo',
    nameJa: 'ザ・リッツ・カールトン東京',
    district: 'Tokyo Midtown / Akasaka',
    formattedAddress: 'Tokyo Midtown, 9-7-1 Akasaka, Minato-ku, Tokyo',
    category: 'hotel',
  },
  {
    id: 'palace-hotel-tokyo',
    nameEn: 'Palace Hotel Tokyo',
    nameJa: 'パレスホテル東京',
    district: 'Marunouchi / Chiyoda',
    formattedAddress: '1-1-1 Marunouchi, Chiyoda-ku, Tokyo',
    category: 'hotel',
  },
  {
    id: 'peninsula-tokyo',
    nameEn: 'The Peninsula Tokyo',
    nameJa: 'ザ・ペニンシュラ東京',
    district: 'Yurakucho / Ginza',
    formattedAddress: '1-8-1 Yurakucho, Chiyoda-ku, Tokyo',
    category: 'hotel',
  },
  {
    id: 'mandarin-oriental-tokyo',
    nameEn: 'Mandarin Oriental, Tokyo',
    nameJa: 'マンダリン オリエンタル 東京',
    district: 'Nihonbashi / Chuo',
    formattedAddress: '2-1-1 Nihonbashi Muromachi, Chuo-ku, Tokyo',
    category: 'hotel',
  },
  {
    id: 'four-seasons-otemachi',
    nameEn: 'Four Seasons Hotel Tokyo at Otemachi',
    nameJa: 'フォーシーズンズホテル東京大手町',
    district: 'Otemachi / Chiyoda',
    formattedAddress: '1-2-1 Otemachi, Chiyoda-ku, Tokyo',
    category: 'hotel',
  },
  {
    id: 'four-seasons-marunouchi',
    nameEn: 'Four Seasons Hotel Tokyo at Marunouchi',
    nameJa: 'フォーシーズンズホテル丸の内 東京',
    district: 'Marunouchi / Tokyo Station',
    formattedAddress: '1-11-1 Marunouchi, Chiyoda-ku, Tokyo (Pacific Century Place)',
    category: 'hotel',
  },
  {
    id: 'bulgari-hotel-tokyo',
    nameEn: 'Bulgari Hotel Tokyo',
    nameJa: 'ブルガリ ホテル 東京',
    district: 'Yaesu / Tokyo Station',
    formattedAddress: 'Tokyo Midtown Yaesu, 2-2-1 Yaesu, Chuo-ku, Tokyo',
    category: 'hotel',
  },
  {
    id: 'janu-tokyo',
    nameEn: 'Janu Tokyo (Azabudai Hills)',
    nameJa: 'ジャヌ東京（麻布台ヒルズ）',
    district: 'Azabudai Hills / Minato',
    formattedAddress: '1-2-2 Azabudai, Minato-ku, Tokyo',
    category: 'hotel',
  },
  {
    id: 'edition-toranomon',
    nameEn: 'The Tokyo EDITION, Toranomon',
    nameJa: '東京エディション虎ノ門',
    district: 'Toranomon / Minato',
    formattedAddress: '4-1-1 Toranomon, Minato-ku, Tokyo',
    category: 'hotel',
  },
  {
    id: 'edition-ginza',
    nameEn: 'The Tokyo EDITION, Ginza',
    nameJa: '東京エディション銀座',
    district: 'Ginza / Chuo',
    formattedAddress: '2-8-13 Ginza, Chuo-ku, Tokyo',
    category: 'hotel',
  },
  {
    id: 'conrad-tokyo',
    nameEn: 'Conrad Tokyo',
    nameJa: 'コンラッド東京',
    district: 'Shiodome / Minato',
    formattedAddress: '1-9-1 Higashi-Shinbashi, Minato-ku, Tokyo (Shiodome)',
    category: 'hotel',
  },
  {
    id: 'hoshinoya-tokyo',
    nameEn: 'HOSHINOYA Tokyo',
    nameJa: '星のや東京',
    district: 'Otemachi / Chiyoda',
    formattedAddress: '1-9-1 Otemachi, Chiyoda-ku, Tokyo',
    category: 'hotel',
  },
  {
    id: 'okura-tokyo',
    nameEn: 'The Okura Tokyo',
    nameJa: 'The Okura Tokyo（ホテルオークラ東京）',
    district: 'Toranomon / Minato',
    formattedAddress: '2-10-4 Toranomon, Minato-ku, Tokyo',
    category: 'hotel',
  },
  {
    id: 'imperial-hotel-tokyo',
    nameEn: 'Imperial Hotel, Tokyo',
    nameJa: '帝国ホテル 東京',
    district: 'Hibiya / Uchisaiwaicho',
    formattedAddress: '1-1-1 Uchisaiwaicho, Chiyoda-ku, Tokyo',
    category: 'hotel',
  },
  {
    id: 'park-hyatt-tokyo',
    nameEn: 'Park Hyatt Tokyo',
    nameJa: 'パークハイアット東京',
    district: 'Nishi-Shinjuku',
    formattedAddress: '3-7-1-2 Nishi-Shinjuku, Shinjuku-ku, Tokyo',
    category: 'hotel',
  },
  {
    id: 'shangri-la-tokyo',
    nameEn: 'Shangri-La Tokyo',
    nameJa: 'シャングリ・ラ 東京',
    district: 'Marunouchi / Tokyo Station',
    formattedAddress: 'Marunouchi Trust Tower Main, 1-8-3 Marunouchi, Chiyoda-ku, Tokyo',
    category: 'hotel',
  },
  {
    id: 'andaz-tokyo',
    nameEn: 'Andaz Tokyo Toranomon Hills',
    nameJa: 'アンダーズ 東京（虎ノ門ヒルズ）',
    district: 'Toranomon / Minato',
    formattedAddress: 'Toranomon Hills Mori Tower, 1-23-4 Toranomon, Minato-ku, Tokyo',
    category: 'hotel',
  },
  {
    id: 'hotel-new-otani',
    nameEn: 'Hotel New Otani Tokyo (Executive House ZEN)',
    nameJa: 'ホテルニューオータニ エグゼクティブハウス 禅',
    district: 'Kioicho / Chiyoda',
    formattedAddress: '4-1 Kioicho, Chiyoda-ku, Tokyo',
    category: 'hotel',
  },
  {
    id: 'capitol-hotel-tokyu',
    nameEn: 'The Capitol Hotel Tokyu',
    nameJa: 'ザ・キャピトルホテル 東急',
    district: 'Nagatacho / Chiyoda',
    formattedAddress: '2-10-3 Nagatacho, Chiyoda-ku, Tokyo',
    category: 'hotel',
  },
  {
    id: 'cerulean-tower-tokyu',
    nameEn: 'Cerulean Tower Tokyu Hotel',
    nameJa: 'セルリアンタワー東急ホテル',
    district: 'Shibuya',
    formattedAddress: '26-1 Sakuragaokacho, Shibuya-ku, Tokyo',
    category: 'hotel',
  },
  {
    id: 'hilton-tokyo',
    nameEn: 'Hilton Tokyo',
    nameJa: 'ヒルトン東京',
    district: 'Nishi-Shinjuku',
    formattedAddress: '6-6-2 Nishi-Shinjuku, Shinjuku-ku, Tokyo',
    category: 'hotel',
  },
  {
    id: 'bellustar-tokyo',
    nameEn: 'Bellustar Tokyo, A Pan Pacific Hotel',
    nameJa: 'BELLUSTAR TOKYO（東急歌舞伎町タワー）',
    district: 'Kabukicho / Shinjuku',
    formattedAddress: '1-29-1 Kabukicho, Shinjuku-ku, Tokyo',
    category: 'hotel',
  },
  {
    id: 'chinzanso-tokyo',
    nameEn: 'Hotel Chinzanso Tokyo',
    nameJa: 'ホテル椿山荘東京',
    district: 'Sekiguchi / Bunkyo',
    formattedAddress: '2-10-8 Sekiguchi, Bunkyo-ku, Tokyo',
    category: 'hotel',
  },
  {
    id: 'intercontinental-tokyo-bay',
    nameEn: 'InterContinental Tokyo Bay',
    nameJa: 'ホテル インターコンチネンタル 東京ベイ',
    district: 'Takeshiba / Minato',
    formattedAddress: '1-16-2 Kaigan, Minato-ku, Tokyo',
    category: 'hotel',
  },
  {
    id: 'mesm-tokyo',
    nameEn: 'mesm Tokyo, Autograph Collection',
    nameJa: 'メズム東京、オートグラフ コレクション',
    district: 'Takeshiba / Minato',
    formattedAddress: '1-10-30 Kaigan, Minato-ku, Tokyo',
    category: 'hotel',
  },
  {
    id: 'trunk-hotel-cat-street',
    nameEn: 'TRUNK(HOTEL) Cat Street',
    nameJa: 'TRUNK(HOTEL) キャットストリート',
    district: 'Jingumae / Shibuya',
    formattedAddress: '5-31 Jingumae, Shibuya-ku, Tokyo',
    category: 'hotel',
  },
  {
    id: 'prince-gallery-kioicho',
    nameEn: 'The Prince Gallery Tokyo Kioicho',
    nameJa: 'ザ・プリンスギャラリー 東京紀尾井町',
    district: 'Kioicho / Chiyoda',
    formattedAddress: '1-2 Kioicho, Chiyoda-ku, Tokyo',
    category: 'hotel',
  },

  // ── Major Transit Hubs & Districts ──
  {
    id: 'tokyo-station',
    nameEn: 'Tokyo Station (Marunouchi / Yaesu)',
    nameJa: '東京駅（丸の内・八重洲）',
    district: 'Chiyoda / Chuo',
    formattedAddress: '1-9-1 Marunouchi, Chiyoda-ku, Tokyo',
    category: 'station',
  },
  {
    id: 'shinjuku-station',
    nameEn: 'Shinjuku Station',
    nameJa: '新宿駅',
    district: 'Shinjuku / Shibuya',
    formattedAddress: '3-38-1 Shinjuku, Shinjuku-ku, Tokyo',
    category: 'station',
  },
  {
    id: 'shibuya-scramble',
    nameEn: 'Shibuya Scramble / Station',
    nameJa: '渋谷スクランブル・渋谷駅',
    district: 'Shibuya',
    formattedAddress: '2-24-12 Shibuya, Shibuya-ku, Tokyo',
    category: 'station',
  },
  {
    id: 'ginza-six',
    nameEn: 'GINZA SIX / Ginza 4-Chome',
    nameJa: '銀座シックス・銀座中央通り',
    district: 'Ginza / Chuo',
    formattedAddress: '6-10-1 Ginza, Chuo-ku, Tokyo',
    category: 'landmark',
  },
  {
    id: 'roppongi-hills',
    nameEn: 'Roppongi Hills Mori Tower',
    nameJa: '六本木ヒルズ 森タワー',
    district: 'Roppongi / Minato',
    formattedAddress: '6-10-1 Roppongi, Minato-ku, Tokyo',
    category: 'landmark',
  },
  {
    id: 'tokyo-tower',
    nameEn: 'Tokyo Tower',
    nameJa: '東京タワー',
    district: 'Shibakoen / Minato',
    formattedAddress: '4-2-8 Shibakoen, Minato-ku, Tokyo',
    category: 'landmark',
  },
  {
    id: 'tokyo-skytree',
    nameEn: 'Tokyo Skytree Town',
    nameJa: '東京スカイツリータウン',
    district: 'Oshiage / Sumida',
    formattedAddress: '1-1-2 Oshiage, Sumida-ku, Tokyo',
    category: 'landmark',
  },
  {
    id: 'asakusa-sensoji',
    nameEn: 'Asakusa Sensoji Temple',
    nameJa: '浅草 浅草寺・雷門',
    district: 'Asakusa / Taito',
    formattedAddress: '2-3-1 Asakusa, Taito-ku, Tokyo',
    category: 'landmark',
  },
  {
    id: 'tokyo-big-sight',
    nameEn: 'Tokyo Big Sight (Tokyo International Exhibition Center)',
    nameJa: '東京ビッグサイト（東京国際展示場）',
    district: 'Ariake / Koto',
    formattedAddress: '3-11-1 Ariake, Koto-ku, Tokyo',
    category: 'landmark',
  },
];

/**
 * Searches local Tokyo luxury destinations without any Google API calls.
 */
export function searchTokyoPlaces(query: string, maxResults = 6): TokyoPlace[] {
  const q = query.trim().toLowerCase();
  if (!q || q.length < 1) return [];

  return TOKYO_LUXURY_PLACES.filter((place) => {
    return (
      place.nameEn.toLowerCase().includes(q) ||
      place.nameJa.includes(q) ||
      place.district.toLowerCase().includes(q) ||
      place.formattedAddress.toLowerCase().includes(q)
    );
  }).slice(0, maxResults);
}
