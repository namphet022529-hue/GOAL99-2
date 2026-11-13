/**
 * GOAL99 - Football Live Score & Stats System
 * Architecture: Modular Frontend Controller, Mock WebSocket Live Engine,
 * LocalStorage Favorites, Web Audio API Sound Synthesizer, Dynamic Standings & Previews
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. MOCK DATABASE & DATA HUB (Rich matches across major leagues)
  // ==========================================================================
  const DB = {
    leagues: {
      PL: { id: 'PL', name: 'พรีเมียร์ลีก อังกฤษ', country: 'อังกฤษ', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', round: 'นัดที่ 26' },
      LL: { id: 'LL', name: 'ลาลีกา สเปน', country: 'สเปน', flag: '🇪🇸', round: 'นัดที่ 24' },
      SA: { id: 'SA', name: 'กัลโช่ เซเรีย อา', country: 'อิตาลี', flag: '🇮🇹', round: 'นัดที่ 25' },
      BL: { id: 'BL', name: 'บุนเดสลีกา เยอรมนี', country: 'เยอรมนี', flag: '🇩🇪', round: 'นัดที่ 22' },
      TL: { id: 'TL', name: 'ไทยลีก 1 รีโว่', country: 'ไทย', flag: '🇹🇭', round: 'นัดที่ 19' },
      UCL: { id: 'UCL', name: 'ยูฟ่า แชมเปียนส์ลีก', country: 'ยุโรป', flag: '🇪🇺', round: 'รอบ 16 ทีมสุดท้าย' },
      UNL: { id: 'UNL', name: 'ยูฟ่า เนชันส์ลีก / คัดเลือกฟุตบอลโลก (ตามรูปตัวอย่าง)', country: 'ยุโรป', flag: '🌍', round: 'รอบคัดเลือก' }
    },

    matches: [
      // MATCH 1: LIVE (Manchester City vs Liverpool)
      {
        id: 'M101',
        leagueId: 'PL',
        dateOffset: 0, // Today
        time: '20:30',
        midnightNote: '',
        status: 'live', // live, upcoming, finished
        minute: 72,
        home: { id: 'MCI', name: 'แมนฯ ซิตี้', nameEn: 'Manchester City', code: 'MCI', form: 'WWWDW', score: 2, redCards: 0, rank: 2, crest: '⛵' },
        away: { id: 'LIV', name: 'ลิเวอร์พูล', nameEn: 'Liverpool', code: 'LIV', form: 'WWLWW', score: 1, redCards: 0, rank: 1, crest: '🦅' },
        odds: {
          favored: 'home',
          initial: '0.5',
          current: '0.5/1',
          history: [
            { val: '0.5', dir: 'none' },
            { val: '0.5/1', dir: 'up' },
            { val: '0.5', dir: 'down' },
            { val: '0.5/1', dir: 'up' }
          ],
          overUnder: '2.5/3',
          odds1x2: { home: '2.10', draw: '3.60', away: '3.25' }
        },
        htScore: '1 - 0',
        venue: 'เอทิฮัด สเตเดี้ยม (Etihad Stadium)',
        referee: 'ไมเคิล โอลิเวอร์ (Michael Oliver)',
        broadcast: 'True Premier Football 1, True 4K',
        searchTerms: 'แมนซิตี้ แมน ซิตี้ เรือใบ แมนฯ ซิตี้ mci manchester city ลิเวอร์พูล หงส์แดง liv liverpool',
        timeline: [
          { min: "24'", type: 'goal', team: 'home', player: 'เออร์ลิง ฮาลันด์', assist: 'เควิน เดอ บรอยน์', score: '1 - 0' },
          { min: "41'", type: 'yellow', team: 'away', player: 'วาตารุ เอ็นโด', detail: 'ฟาวล์ตัดเกม' },
          { min: "58'", type: 'goal', team: 'away', player: 'โมฮาเหม็ด ซาลาห์', assist: 'เทรนต์ อเล็กซานเดอร์-อาร์โนลด์', score: '1 - 1' },
          { min: "67'", type: 'goal', team: 'home', player: 'ฟิล โฟเด้น', assist: 'แบร์นาร์โด้ ซิลวา', score: '2 - 1' },
          { min: "70'", type: 'sub', team: 'away', player: 'โคดี้ กัคโป ลงแทน ดาร์วิน นูนเญซ' }
        ],
        stats: {
          possession: [58, 42],
          totalShots: [14, 9],
          shotsOnTarget: [6, 4],
          xg: ['1.84', '1.12'],
          corners: [7, 3],
          fouls: [8, 11],
          offsides: [2, 3],
          saves: [3, 4]
        },
        lineups: {
          confirmed: true,
          homeFormation: '4-1-4-1',
          awayFormation: '4-3-3',
          homeStarters: [
            { num: 31, name: 'เอแดร์ซอน', pos: 'GK' },
            { num: 2, name: 'ไคล์ วอล์กเกอร์', pos: 'DF' },
            { num: 3, name: 'รูเบน ดิอาส', pos: 'DF' },
            { num: 25, name: 'มานูเอล อคานจี', pos: 'DF' },
            { num: 24, name: 'ยอสโก้ กวาร์ดิโอล', pos: 'DF' },
            { num: 16, name: 'โรดรี้', pos: 'MF' },
            { num: 20, name: 'แบร์นาร์โด้ ซิลวา', pos: 'MF' },
            { num: 17, name: 'เควิน เดอ บรอยน์ (C)', pos: 'MF' },
            { num: 47, name: 'ฟิล โฟเด้น', pos: 'MF' },
            { num: 11, name: 'เฌเรมี่ โดกู', pos: 'FW' },
            { num: 9, name: 'เออร์ลิง ฮาลันด์', pos: 'FW' }
          ],
          homeSubs: [
            { num: 18, name: 'สเตฟาน ออร์เตก้า' },
            { num: 5, name: 'จอห์น สโตนส์' },
            { num: 8, name: 'มาเตโอ โควาซิช' },
            { num: 10, name: 'แจ็ค กรีลิช' }
          ],
          awayStarters: [
            { num: 1, name: 'อลีสซง เบ็คเกอร์', pos: 'GK' },
            { num: 66, name: 'เทรนต์ อเล็กซานเดอร์-อาร์โนลด์', pos: 'DF' },
            { num: 5, name: 'อิบราฮิมา โกนาเต้', pos: 'DF' },
            { num: 4, name: 'เฟอร์จิล ฟาน ไดจ์ค (C)', pos: 'DF' },
            { num: 26, name: 'แอนดรูว์ โรเบิร์ตสัน', pos: 'DF' },
            { num: 3, name: 'วาตารุ เอ็นโด', pos: 'MF' },
            { num: 10, name: 'อเล็กซิส แม็ค อัลลิสเตอร์', pos: 'MF' },
            { num: 8, name: 'โดมินิค โซโบสไล', pos: 'MF' },
            { num: 11, name: 'โมฮาเหม็ด ซาลาห์', pos: 'FW' },
            { num: 9, name: 'ดาร์วิน นูนเญซ', pos: 'FW' },
            { num: 7, name: 'หลุยส์ ดิอาซ', pos: 'FW' }
          ],
          awaySubs: [
            { num: 62, name: 'ควีวิน เคลเลเฮอร์' },
            { num: 18, name: 'โคดี้ กัคโป' },
            { num: 19, name: 'ฮาร์วีย์ เอลเลียตต์' },
            { num: 21, name: 'คอสตาส ซิมิกาส' }
          ]
        },
        h2h: {
          homeWins: 11,
          draws: 8,
          awayWins: 15,
          recent: [
            { date: '10 มี.ค. 2024', home: 'LIV', away: 'MCI', score: '1 - 1' },
            { date: '25 พ.ย. 2023', home: 'MCI', away: 'LIV', score: '1 - 1' },
            { date: '01 เม.ย. 2023', home: 'MCI', away: 'LIV', score: '4 - 1' },
            { date: '22 ธ.ค. 2022', home: 'MCI', away: 'LIV', score: '3 - 2' },
            { date: '16 ต.ค. 2022', home: 'LIV', away: 'MCI', score: '1 - 0' }
          ]
        },
        preview: {
          author: 'เซียนโอ๊ต ฟุตบอลโฟกัส',
          updatedAt: '13 พ.ย. 2026, 18:00 น.',
          fact: 'แมนฯ ซิตี้ ไร้พ่ายในรังเหย้า 28 นัดติดต่อกันรวมทุกรายการ ขณะที่ลิเวอร์พูลยิงประตูติดต่อกันในลีกมาแล้ว 19 เกมเยือน',
          opinion: 'คาดว่าเจ้าถิ่นครองบอลกดดันต่อเนื่อง การคุมจังหวะของ เดอ บรอยน์ และความเฉียบคมของ ฮาลันด์ จะพาทีมเบียดคว้าชัยในเกมเปิดแลกหมัดสนุก',
          predictionScore: '2 - 1',
          accuracyRate: '78.5% (สถิติ 35 คู่ล่าสุด)'
        }
      },

      // MATCH 2: LIVE (Arsenal vs Chelsea)
      {
        id: 'M102',
        leagueId: 'PL',
        dateOffset: 0,
        time: '21:00',
        midnightNote: '',
        status: 'live',
        minute: 54,
        home: { id: 'ARS', name: 'อาร์เซน่อล', nameEn: 'Arsenal', code: 'ARS', form: 'WWWDW', score: 1, redCards: 0, rank: 3, crest: '💣' },
        away: { id: 'CHE', name: 'เชลซี', nameEn: 'Chelsea', code: 'CHE', form: 'WDWWL', score: 0, redCards: 0, rank: 4, crest: '🦁' },
        odds: {
          favored: 'home',
          initial: '0.5/1',
          current: '0.5/1',
          history: [
            { val: '0.5/1', dir: 'none' },
            { val: '0.5', dir: 'down' },
            { val: '0.5/1', dir: 'up' }
          ],
          overUnder: '2.5',
          odds1x2: { home: '1.80', draw: '3.75', away: '4.20' }
        },
        htScore: '1 - 0',
        ftScore: '1 - 0',
        tip: 'ฟันธงต่อปืนใหญ่ เบียดลอนดอนดาร์บี้',
        venue: 'เอมิเรตส์ สเตเดี้ยม',
        referee: 'แอนโธนี่ เทย์เลอร์',
        broadcast: 'True Premier Football 2',
        searchTerms: 'อาร์เซนอล ปืนใหญ่ ars arsenal เชลซี สิงห์บลูส์ che chelsea',
        timeline: [
          { min: "33'", type: 'goal', team: 'home', player: 'บูกาโย ซาก้า', assist: 'มาร์ติน โอเดการ์ด', score: '1 - 0' },
          { min: "48'", type: 'yellow', team: 'away', player: 'มอยเซส ไกเซโด้', detail: 'ตัดฟาวล์รุนแรง' }
        ],
        stats: {
          possession: [55, 45],
          totalShots: [11, 6],
          shotsOnTarget: [4, 2],
          xg: ['1.21', '0.65'],
          corners: [6, 2],
          fouls: [7, 9],
          offsides: [1, 2],
          saves: [2, 3]
        },
        lineups: {
          confirmed: true,
          homeFormation: '4-3-3',
          awayFormation: '4-2-3-1',
          homeStarters: [
            { num: 22, name: 'ดาบิด ราย่า', pos: 'GK' },
            { num: 4, name: 'เบน ไวท์', pos: 'DF' },
            { num: 2, name: 'วิลเลียม ซาลิบา', pos: 'DF' },
            { num: 6, name: 'กาเบรียล มากัลเญส', pos: 'DF' },
            { num: 17, name: 'โอเล็กซานเดอร์ ซินเชนโก้', pos: 'DF' },
            { num: 41, name: 'ดีแคลน ไรซ์', pos: 'MF' },
            { num: 8, name: 'มาร์ติน โอเดการ์ด (C)', pos: 'MF' },
            { num: 29, name: 'ไค ฮาแวร์ตซ์', pos: 'MF' },
            { num: 7, name: 'บูกาโย ซาก้า', pos: 'FW' },
            { num: 9, name: 'กาเบรียล เชซุส', pos: 'FW' },
            { num: 11, name: 'กาเบรียล มาร์ติเนลลี่', pos: 'FW' }
          ],
          homeSubs: [
            { num: 1, name: 'แอรอน แรมส์เดล' },
            { num: 19, name: 'เลอันโดร ทรอสซาร์' },
            { num: 20, name: 'จอร์จินโญ่' }
          ],
          awayStarters: [
            { num: 1, name: 'โรเบิร์ต ซานเชซ', pos: 'GK' },
            { num: 27, name: 'มาโล กุสโต้', pos: 'DF' },
            { num: 6, name: 'เลวี่ โคลวิลล์', pos: 'DF' },
            { num: 2, name: 'อักเซล ดิซาซี่', pos: 'DF' },
            { num: 3, name: 'มาร์ก กูกูเรย่า', pos: 'DF' },
            { num: 25, name: 'มอยเซส ไกเซโด้', pos: 'MF' },
            { num: 8, name: 'เอ็นโซ เฟร์นานเดซ (C)', pos: 'MF' },
            { num: 20, name: 'โคล พาลเมอร์', pos: 'MF' },
            { num: 11, name: 'โนนี่ มาดูเอเก้', pos: 'FW' },
            { num: 15, name: 'นิโคลัส แจ็คสัน', pos: 'FW' },
            { num: 7, name: 'ราฮีม สเตอร์ลิง', pos: 'FW' }
          ],
          awaySubs: [
            { num: 28, name: 'ยอร์เย เปโตรวิช' },
            { num: 18, name: 'คริสโตเฟอร์ เอ็นคุนคู' },
            { num: 10, name: 'มีคายโล มูดริค' }
          ]
        },
        h2h: {
          homeWins: 85,
          draws: 59,
          awayWins: 66,
          recent: [
            { date: '23 เม.ย. 2024', home: 'ARS', away: 'CHE', score: '5 - 0' },
            { date: '21 ต.ค. 2023', home: 'CHE', away: 'ARS', score: '2 - 2' },
            { date: '02 พ.ค. 2023', home: 'ARS', away: 'CHE', score: '3 - 1' },
            { date: '06 พ.ย. 2022', home: 'CHE', away: 'ARS', score: '0 - 1' }
          ]
        },
        preview: {
          author: 'กูรูเอก ลอนดอนดาร์บี้',
          updatedAt: '13 พ.ย. 2026, 17:30 น.',
          fact: 'อาร์เซน่อลชนะ 4 จาก 5 นัดหลังสุดที่พบเชลซีในพรีเมียร์ลีก',
          opinion: 'เกมรับที่แน่นหนาของปืนใหญ่ทำให้เชลซีเจาะลำบาก คาดว่าอาร์เซน่อลชนะแบบคลีนชีต',
          predictionScore: '2 - 0',
          accuracyRate: '82.0% (สถิติ 25 คู่ล่าสุด)'
        }
      },

      // MATCH 3: LIVE (Buriram United vs Port FC - THAI LEAGUE)
      {
        id: 'M103',
        leagueId: 'TL',
        dateOffset: 0,
        time: '19:00',
        midnightNote: '',
        status: 'live',
        minute: 88,
        home: { id: 'BRU', name: 'บุรีรัมย์ ยูไนเต็ด', nameEn: 'Buriram United', code: 'BRU', form: 'WWWWW', score: 3, redCards: 0, rank: 1, crest: '⚡' },
        away: { id: 'POR', name: 'การท่าเรือ เอฟซี', nameEn: 'Port FC', code: 'POR', form: 'WWDLW', score: 1, redCards: 1, rank: 3, crest: '🦁' },
        odds: {
          favored: 'home',
          initial: '1',
          current: '1/1.5',
          history: [
            { val: '1', dir: 'none' },
            { val: '1/1.5', dir: 'up' }
          ],
          overUnder: '3.0',
          odds1x2: { home: '1.55', draw: '4.10', away: '5.50' }
        },
        htScore: '2 - 0',
        ftScore: '3 - 1',
        tip: 'ฟันธงต่อปราสาทสายฟ้า คว้าชัยในบ้าน',
        venue: 'ช้าง อารีนา',
        referee: 'ศิวกร ภูอุดม',
        broadcast: 'AIS PLAY, PPTV HD 36, True Ball Thai 1',
        searchTerms: 'บุรีรัมย์ ยูไนเต็ด ปราสาทสายฟ้า bru buriram ท่าเรือ สิงห์เจ้าท่า por port thai league',
        timeline: [
          { min: "12'", type: 'goal', team: 'home', player: 'ศุภชัย ใจเด็ด', assist: 'ธีราทร บุญมาทัน', score: '1 - 0' },
          { min: "35'", type: 'goal', team: 'home', player: 'กิลแยร์เม่ บิสโซลี่', assist: 'ลูคัส คริสปิม', score: '2 - 0' },
          { min: "62'", type: 'red', team: 'away', player: 'เฉลิมศักดิ์ อักขี', detail: 'ใบแดงโดยตรงจากฟาวล์ตัวสุดท้าย' },
          { min: "71'", type: 'goal', team: 'away', player: 'ธีรศักดิ์ เผยพิมาย', assist: 'บดินทร์ ผาลา', score: '2 - 1' },
          { min: "84'", type: 'goal', team: 'home', player: 'ศุภชัย ใจเด็ด', assist: 'ดิออน คูลส์', score: '3 - 1' }
        ],
        stats: {
          possession: [64, 36],
          totalShots: [16, 5],
          shotsOnTarget: [7, 2],
          xg: ['2.45', '0.78'],
          corners: [8, 2],
          fouls: [9, 14],
          offsides: [2, 1],
          saves: [1, 4]
        },
        lineups: {
          confirmed: true,
          homeFormation: '3-4-1-2',
          awayFormation: '4-3-3',
          homeStarters: [
            { num: 1, name: 'ศิวรักษ์ เทศสูงเนิน', pos: 'GK' },
            { num: 3, name: 'พรรษา เหมวิบูลย์', pos: 'DF' },
            { num: 11, name: 'ดิออน คูลส์', pos: 'DF' },
            { num: 92, name: 'คิม มิน ฮยอก', pos: 'DF' },
            { num: 5, name: 'ธีราทร บุญมาทัน (C)', pos: 'DF' },
            { num: 8, name: 'รัตนากร ใหม่คามิ', pos: 'MF' },
            { num: 10, name: 'ลูคัส คริสปิม', pos: 'MF' },
            { num: 2, name: 'ศศลักษณ์ ไหประโคน', pos: 'DF' },
            { num: 7, name: 'กิลแยร์เม่ บิสโซลี่', pos: 'FW' },
            { num: 9, name: 'ศุภชัย ใจเด็ด', pos: 'FW' },
            { num: 19, name: 'สุภโชค สารชาติ', pos: 'FW' }
          ],
          homeSubs: [
            { num: 23, name: 'ยศพล เทียงดาห์' },
            { num: 20, name: 'โกรัน เคาซิช' }
          ],
          awayStarters: [
            { num: 1, name: 'สมพร ยศ', pos: 'GK' },
            { num: 4, name: 'ศุภนันท์ บุรีรัตน์', pos: 'DF' },
            { num: 16, name: 'เฉลิมศักดิ์ อักขี', pos: 'DF' },
            { num: 22, name: 'ฟรานส์ ปูโตรส', pos: 'DF' },
            { num: 23, name: 'เควิน ดีรมรัมย์', pos: 'DF' },
            { num: 8, name: 'ธนบูรณ์ เกษารัตน์ (C)', pos: 'MF' },
            { num: 6, name: 'ชาริล ชัปปุยส์', pos: 'MF' },
            { num: 10, name: 'บดินทร์ ผาลา', pos: 'MF' },
            { num: 14, name: 'ธีรศักดิ์ เผยพิมาย', pos: 'FW' },
            { num: 9, name: 'วิลเล่น โมต้า', pos: 'FW' },
            { num: 11, name: 'ทาร์เดลี่ เรส', pos: 'FW' }
          ],
          awaySubs: [
            { num: 36, name: 'วรวุฒิ ศรีสุภา' },
            { num: 7, name: 'ปกรณ์ เปรมภักดิ์' }
          ]
        },
        h2h: {
          homeWins: 18,
          draws: 6,
          awayWins: 5,
          recent: [
            { date: '12 พ.ค. 2024', home: 'BRU', away: 'POR', score: '1 - 1' },
            { date: '17 ธ.ค. 2023', home: 'POR', away: 'BRU', score: '4 - 1' },
            { date: '30 เม.ย. 2023', home: 'BRU', away: 'POR', score: '2 - 3' }
          ]
        },
        preview: {
          author: 'โต้ง บอลไทยสายลึก',
          updatedAt: '13 พ.ย. 2026, 16:00 น.',
          fact: 'บุรีรัมย์ชนะในบ้าน 8 นัดติด ยิงเฉลี่ย 3.2 ประตูต่อนัด',
          opinion: 'ความพร้อมและฟอร์มของ ศุภชัย-บิสโซลี่ เหนือกว่าแนวรับท่าเรือที่เสียประตูบ่อย',
          predictionScore: '3 - 1',
          accuracyRate: '86.4% (สถิติ 22 คู่ล่าสุด)'
        }
      },

      // MATCH 4: UPCOMING (Midnight match example with Thailand Date Clarity)
      {
        id: 'M104',
        leagueId: 'PL',
        dateOffset: 0,
        time: '01:00',
        midnightNote: 'พุธ 11 พ.ย. 01:00 น. (คืนวันอังคาร)',
        status: 'upcoming',
        minute: null,
        home: { id: 'MUN', name: 'แมนฯ ยูไนเต็ด', nameEn: 'Manchester United', code: 'MUN', form: 'WLWDW', score: 0, redCards: 0, rank: 6, crest: '👹' },
        away: { id: 'TOT', name: 'ท็อตแน่ม ฮ็อทสเปอร์', nameEn: 'Tottenham Hotspur', code: 'TOT', form: 'WWDLW', score: 0, redCards: 0, rank: 7, crest: '🐓' },
        odds: {
          favored: 'home',
          initial: 'เสมอ',
          current: '0/0.5',
          history: [
            { val: 'เสมอ', dir: 'none' },
            { val: '0/0.5', dir: 'up' }
          ],
          overUnder: '3.0/3.5',
          odds1x2: { home: '2.35', draw: '3.70', away: '2.80' }
        },
        htScore: '? - ?',
        ftScore: '? - ?',
        tip: 'ฟันธงวางผีแดง แรงใจเกินร้อย',
        venue: 'โอลด์ แทรฟฟอร์ด (Old Trafford)',
        referee: 'สต๊วร์ต แอตต์เวลล์',
        broadcast: 'True Premier Football 1, Monomax',
        searchTerms: 'แมนยู ผีแดง ปีศาจแดง mun manchester united สเปอร์ส ไก่เดือยทอง tot tottenham',
        timeline: [],
        stats: {
          possession: [50, 50],
          totalShots: [0, 0],
          shotsOnTarget: [0, 0],
          xg: ['0.00', '0.00'],
          corners: [0, 0],
          fouls: [0, 0],
          offsides: [0, 0],
          saves: [0, 0]
        },
        lineups: {
          confirmed: false, // คาดการณ์
          homeFormation: '4-2-3-1 (คาดการณ์)',
          awayFormation: '4-3-3 (คาดการณ์)',
          homeStarters: [
            { num: 24, name: 'อ็องเดร โอนาน่า', pos: 'GK' },
            { num: 20, name: 'ดิโอโก้ ดาโลต์', pos: 'DF' },
            { num: 5, name: 'แฮร์รี่ แม็กไกวร์', pos: 'DF' },
            { num: 6, name: 'ลิซานโดร มาร์ติเนซ', pos: 'DF' },
            { num: 3, name: 'นูสแซร์ มาซราอุย', pos: 'DF' },
            { num: 37, name: 'ค็อบบี้ ไมนู', pos: 'MF' },
            { num: 18, name: 'กาเซมีโร่', pos: 'MF' },
            { num: 10, name: 'มาร์คัส แรชฟอร์ด', pos: 'FW' },
            { num: 8, name: 'บรูโน่ แฟร์นันเดส (C)', pos: 'MF' },
            { num: 17, name: 'อเลฮานโดร การ์นาโช่', pos: 'FW' },
            { num: 11, name: 'ราสมุส ฮอยลุนด์', pos: 'FW' }
          ],
          homeSubs: [
            { num: 1, name: 'อัลทาย บายินดีร์' },
            { num: 7, name: 'เมสัน เมาท์' },
            { num: 21, name: 'อันโตนี่' }
          ],
          awayStarters: [
            { num: 1, name: 'กูเยลโม วิคาริโอ', pos: 'GK' },
            { num: 23, name: 'เปโดร ปอร์โร่', pos: 'DF' },
            { num: 17, name: 'คริสเตียน โรเมโร่', pos: 'DF' },
            { num: 37, name: 'มิคกี้ ฟาน เดอ เฟน', pos: 'DF' },
            { num: 38, name: 'เดสตินี่ อูโดกี้', pos: 'DF' },
            { num: 29, name: 'ปาเป้ มาตาร์ ซาร์', pos: 'MF' },
            { num: 8, name: 'อีฟส์ บิสซูม่า', pos: 'MF' },
            { num: 10, name: 'เจมส์ แมดดิสัน', pos: 'MF' },
            { num: 22, name: 'เบรนแนน จอห์นสัน', pos: 'FW' },
            { num: 19, name: 'โดมินิค โซลันกี้', pos: 'FW' },
            { num: 7, name: 'ซน ฮึง-มิน (C)', pos: 'FW' }
          ],
          awaySubs: [
            { num: 20, name: 'เฟรเซอร์ ฟอร์สเตอร์' },
            { num: 9, name: 'ริชาร์ลิซอน' },
            { num: 21, name: 'เดยาน คูลูเซฟสกี้' }
          ]
        },
        h2h: {
          homeWins: 95,
          draws: 54,
          awayWins: 54,
          recent: [
            { date: '14 ม.ค. 2024', home: 'MUN', away: 'TOT', score: '2 - 2' },
            { date: '19 ส.ค. 2023', home: 'TOT', away: 'MUN', score: '2 - 0' },
            { date: '27 เม.ย. 2023', home: 'TOT', away: 'MUN', score: '2 - 2' }
          ]
        },
        preview: {
          author: 'เซียนผีแดง พันธุ์แท้',
          updatedAt: '13 พ.ย. 2026, 19:30 น.',
          fact: 'สเปอร์สยังไม่แพ้ แมนฯ ยูไนเต็ด ใน 3 เกมลีกหลังสุด (ชนะ 1 เสมอ 2)',
          opinion: 'แมนฯ ยูไนเต็ด ได้เล่นในบ้านและแนวรุกเริ่มเข้าฟอร์ม เชื่อว่า บรูโน่ จะสร้างจังหวะชี้ขาดคว้าชัยหวุดหวิด',
          predictionScore: '2 - 1',
          accuracyRate: '75.0% (สถิติ 28 คู่ล่าสุด)'
        }
      },

      // MATCH 5: UPCOMING (Real Madrid vs Barcelona - EL CLASICO)
      {
        id: 'M105',
        leagueId: 'LL',
        dateOffset: 0,
        time: '03:00',
        midnightNote: 'พุธ 11 พ.ย. 03:00 น. (คืนวันอังคาร)',
        status: 'upcoming',
        minute: null,
        home: { id: 'RMA', name: 'เรอัล มาดริด', nameEn: 'Real Madrid', code: 'RMA', form: 'WWWWW', score: 0, redCards: 0, rank: 1, crest: '👑' },
        away: { id: 'BAR', name: 'บาร์เซโลน่า', nameEn: 'Barcelona', code: 'BAR', form: 'WWWLW', score: 0, redCards: 0, rank: 2, crest: '🛡️' },
        odds: {
          favored: 'home',
          initial: '0/0.5',
          current: '0.5',
          history: [
            { val: '0/0.5', dir: 'none' },
            { val: '0.5', dir: 'up' }
          ],
          overUnder: '3.5',
          odds1x2: { home: '2.05', draw: '3.80', away: '3.20' }
        },
        htScore: '? - ?',
        ftScore: '? - ?',
        tip: 'ฟันธงต่อราชัน ฟันขาดเอลกลาซิโก้',
        venue: 'ซานติอาโก้ เบร์นาเบว',
        referee: 'โฆเซ่ มาเรีย ซานเชซ มาร์ติเนซ',
        broadcast: 'beIN SPORTS 1',
        searchTerms: 'เรอัล มาดริด ราชันชุดขาว rma real madrid บาร์เซโลน่า เจ้าบุญทุ่ม bar barcelona เอล กลาซิโก้ el clasico',
        timeline: [],
        stats: {
          possession: [50, 50],
          totalShots: [0, 0],
          shotsOnTarget: [0, 0],
          xg: ['0.00', '0.00'],
          corners: [0, 0],
          fouls: [0, 0],
          offsides: [0, 0],
          saves: [0, 0]
        },
        lineups: {
          confirmed: false,
          homeFormation: '4-3-1-2 (คาดการณ์)',
          awayFormation: '4-2-3-1 (คาดการณ์)',
          homeStarters: [
            { num: 1, name: 'ติโบต์ กูร์กตัวส์', pos: 'GK' },
            { num: 17, name: 'ลูกัส บาสเกซ', pos: 'DF' },
            { num: 3, name: 'เอแดร์ มิลิเตา', pos: 'DF' },
            { num: 22, name: 'อันโตนิโอ รูดิเกอร์', pos: 'DF' },
            { num: 23, name: 'แฟร์ล็องด์ เมนดี้', pos: 'DF' },
            { num: 14, name: 'โอเรเลียง ชูอาเมนี่', pos: 'MF' },
            { num: 8, name: 'เฟเดริโก้ วัลเวร์เด้', pos: 'MF' },
            { num: 6, name: 'เอดูอาร์โด้ กามาวินก้า', pos: 'MF' },
            { num: 5, name: 'จู๊ด เบลลิงแฮม', pos: 'MF' },
            { num: 7, name: 'วินิซิอุส จูเนียร์', pos: 'FW' },
            { num: 9, name: 'คีเลียน เอ็มบัปเป้', pos: 'FW' }
          ],
          homeSubs: [
            { num: 13, name: 'อันเดร ลูนิน' },
            { num: 10, name: 'ลูก้า โมดริช' },
            { num: 11, name: 'โรดรีโก้' }
          ],
          awayStarters: [
            { num: 1, name: 'มาร์ค-อันเดร แทร์ ชเตเก้น', pos: 'GK' },
            { num: 23, name: 'ฌูลส์ กุนเด้', pos: 'DF' },
            { num: 2, name: 'เปา กูบาร์ซี่', pos: 'DF' },
            { num: 5, name: 'อินญิโก้ มาร์ติเนซ', pos: 'DF' },
            { num: 3, name: 'อเลฆานโดร บัลเด้', pos: 'DF' },
            { num: 17, name: 'มาร์ก กาซาโด้', pos: 'MF' },
            { num: 8, name: 'เปดรี้', pos: 'MF' },
            { num: 19, name: 'ลามีน ยามาล', pos: 'FW' },
            { num: 20, name: 'ดานี่ โอลโม่', pos: 'MF' },
            { num: 11, name: 'ราฟินญ่า', pos: 'FW' },
            { num: 9, name: 'โรเบิร์ต เลวานดอฟสกี้', pos: 'FW' }
          ],
          awaySubs: [
            { num: 13, name: 'อินญากี้ เปนญ่า' },
            { num: 6, name: 'กาบี' },
            { num: 7, name: 'เฟร์ราน ตอร์เรส' }
          ]
        },
        h2h: {
          homeWins: 105,
          draws: 52,
          awayWins: 100,
          recent: [
            { date: '21 เม.ย. 2024', home: 'RMA', away: 'BAR', score: '3 - 2' },
            { date: '14 ม.ค. 2024', home: 'RMA', away: 'BAR', score: '4 - 1' },
            { date: '28 ต.ค. 2023', home: 'BAR', away: 'RMA', score: '1 - 2' }
          ]
        },
        preview: {
          author: 'มาดริดิสต้า & บาร์ซ่า อินไซด์',
          updatedAt: '13 พ.ย. 2026, 20:00 น.',
          fact: 'เรอัล มาดริด ชนะ บาร์เซโลน่า 4 นัดติดต่อกันในศึกเอล กลาซิโก้ ทุกรายการ',
          opinion: 'ความเร็วของ วินิซิอุส และ เอ็มบัปเป้ จะเล่นงานแนวรับดันสูงของบาร์ซ่า คาดว่าราชันชุดขาวเฉือนชนะ',
          predictionScore: '3 - 2',
          accuracyRate: '88.0% (สถิติ 18 นัดบิ๊กแมตช์)'
        }
      },

      // MATCH 6: FINISHED (Bayern Munich vs Dortmund)
      {
        id: 'M106',
        leagueId: 'BL',
        dateOffset: -1, // Yesterday
        time: '23:30',
        midnightNote: '',
        status: 'finished',
        minute: 'FT',
        home: { id: 'BAY', name: 'บาเยิร์น มิวนิค', nameEn: 'Bayern Munich', code: 'BAY', form: 'WWWDW', score: 3, redCards: 0, rank: 1, crest: '🔴' },
        away: { id: 'DOR', name: 'ดอร์ทมุนด์', nameEn: 'Borussia Dortmund', code: 'DOR', form: 'WLDWW', score: 1, redCards: 0, rank: 5, crest: '🐝' },
        odds: {
          favored: 'home',
          initial: '1/1.5',
          current: '1.5',
          history: [
            { val: '1/1.5', dir: 'none' },
            { val: '1.5', dir: 'up' }
          ],
          overUnder: '3.5',
          odds1x2: { home: '1.50', draw: '4.80', away: '5.25' }
        },
        htScore: '1 - 1',
        ftScore: '3 - 1',
        tip: 'ฟันธงต่อเสือใต้ ใส่สกอร์ขาด',
        venue: 'อัลลิอันซ์ อารีน่า',
        referee: 'เฟลิกซ์ ซวาเยอร์',
        broadcast: 'beIN SPORTS 3, PPTV HD 36',
        searchTerms: 'บาเยิร์น เสือใต้ bayern ดอร์ทมุนด์ เสือเหลือง dortmund แดร์ คลาสสิเคอร์ der klassiker',
        timeline: [
          { min: "18'", type: 'goal', team: 'home', player: 'แฮร์รี่ เคน', assist: 'จามาล มูเซียล่า', score: '1 - 0' },
          { min: "39'", type: 'goal', team: 'away', player: 'แซร์อู กีราสซี่', assist: 'ยูเลียน บรันด์ท', score: '1 - 1' },
          { min: "64'", type: 'goal', team: 'home', player: 'ไมเคิล โอลิเซ่', assist: 'โยชัว คิมมิช', score: '2 - 1' },
          { min: "85'", type: 'goal', team: 'home', player: 'แฮร์รี่ เคน (จุดโทษ)', detail: 'แฮนด์บอลในเขตโทษ', score: '3 - 1' }
        ],
        stats: {
          possession: [62, 38],
          totalShots: [18, 8],
          shotsOnTarget: [8, 3],
          xg: ['2.65', '1.05'],
          corners: [9, 3],
          fouls: [10, 12],
          offsides: [3, 1],
          saves: [2, 5]
        },
        lineups: {
          confirmed: true,
          homeFormation: '4-2-3-1',
          awayFormation: '4-3-3',
          homeStarters: [
            { num: 1, name: 'มานูเอล นอยเออร์ (C)', pos: 'GK' },
            { num: 27, name: 'คอนราด ไลเมอร์', pos: 'DF' },
            { num: 2, name: 'ดาโยต์ อูปาเมกาโน่', pos: 'DF' },
            { num: 3, name: 'คิม มิน แจ', pos: 'DF' },
            { num: 19, name: 'อัลฟอนโซ่ เดวีส์', pos: 'DF' },
            { num: 6, name: 'โยชัว คิมมิช', pos: 'MF' },
            { num: 16, name: 'ชูเอา ปาลินญ่า', pos: 'MF' },
            { num: 17, name: 'ไมเคิล โอลิเซ่', pos: 'MF' },
            { num: 42, name: 'จามาล มูเซียล่า', pos: 'MF' },
            { num: 10, name: 'ลีรอย ซาเน่', pos: 'MF' },
            { num: 9, name: 'แฮร์รี่ เคน', pos: 'FW' }
          ],
          homeSubs: [
            { num: 18, name: 'ดาเนียล เปเรตซ์' },
            { num: 7, name: 'แซร์จ กนาบรี้' },
            { num: 25, name: 'โธมัส มุลเลอร์' }
          ],
          awayStarters: [
            { num: 1, name: 'เกรกอร์ โคเบล', pos: 'GK' },
            { num: 26, name: 'ยูเลียน ไรเยอร์สัน', pos: 'DF' },
            { num: 3, name: 'วาลเดอมาร์ อันทอน', pos: 'DF' },
            { num: 4, name: 'นิโค ชล็อตเทอร์เบ็ค', pos: 'DF' },
            { num: 5, name: 'รามี เบนเซไบนี่', pos: 'DF' },
            { num: 23, name: 'เอ็มเร ชาน (C)', pos: 'MF' },
            { num: 13, name: 'ปาสกาล กรอสส์', pos: 'MF' },
            { num: 19, name: 'ยูเลียน บรันด์ท', pos: 'MF' },
            { num: 27, name: 'คาริม อเดเยมี่', pos: 'FW' },
            { num: 9, name: 'แซร์อู กีราสซี่', pos: 'FW' },
            { num: 43, name: 'เจมี่ กิทเทนส์', pos: 'FW' }
          ],
          awaySubs: [
            { num: 33, name: 'อเล็กซานเดอร์ เมเยอร์' },
            { num: 20, name: 'มาร์เซล ซาบิตเซอร์' },
            { num: 14, name: 'มักซีมีเลียน ไบเออร์' }
          ]
        },
        h2h: {
          homeWins: 67,
          draws: 35,
          awayWins: 34,
          recent: [
            { date: '30 มี.ค. 2024', home: 'BAY', away: 'DOR', score: '0 - 2' },
            { date: '04 พ.ย. 2023', home: 'DOR', away: 'BAY', score: '0 - 4' },
            { date: '01 เม.ย. 2023', home: 'BAY', away: 'DOR', score: '4 - 2' }
          ]
        },
        preview: {
          author: 'อินทรีเหล็ก บุนเดสลีกา',
          updatedAt: '12 พ.ย. 2026, 21:00 น.',
          fact: 'แฮร์รี่ เคน ทำไปแล้ว 28 ประตูจากการลงสนาม 22 นัดในลีกฤดูกาลนี้',
          opinion: 'บาเยิร์นคืนฟอร์มเก่งในรังเหย้า เกมรุกหลากหลายกว่าดอร์ทมุนด์',
          predictionScore: '3 - 1',
          accuracyRate: '80.0% (ผลทายถูกตรงสกอร์)'
        }
      },

      // MATCH 7: UPCOMING (Inter Milan vs Juventus - DERBY D'ITALIA)
      {
        id: 'M107',
        leagueId: 'SA',
        dateOffset: 1, // Tomorrow
        time: '02:45',
        midnightNote: 'พฤหัส 12 พ.ย. 02:45 น. (คืนวันพุธ)',
        status: 'upcoming',
        minute: null,
        home: { id: 'INT', name: 'อินเตอร์ มิลาน', nameEn: 'Inter Milan', code: 'INT', form: 'WWWDW', score: 0, redCards: 0, rank: 2, crest: '🐍' },
        away: { id: 'JUV', name: 'ยูเวนตุส', nameEn: 'Juventus', code: 'JUV', form: 'WDDWW', score: 0, redCards: 0, rank: 3, crest: '🦓' },
        odds: {
          favored: 'home',
          initial: '0.5',
          current: '0.5',
          history: [
            { val: '0.5', dir: 'none' }
          ],
          overUnder: '2/2.5',
          odds1x2: { home: '1.95', draw: '3.30', away: '4.00' }
        },
        htScore: '? - ?',
        ftScore: '? - ?',
        tip: 'ฟันธงรองม้าลาย มีแต้มกลับบ้าน',
        venue: 'จูเซปเป้ เมอัซซ่า (ซาน ซิโร่)',
        referee: 'มาร์โก กุยด้า',
        broadcast: 'beIN SPORTS 1',
        searchTerms: 'อินเตอร์ งูใหญ่ inter juventus ม้าลาย ยูเว่ ยูเวนตุส derbi d italia',
        timeline: [],
        stats: {
          possession: [50, 50],
          totalShots: [0, 0],
          shotsOnTarget: [0, 0],
          xg: ['0.00', '0.00'],
          corners: [0, 0],
          fouls: [0, 0],
          offsides: [0, 0],
          saves: [0, 0]
        },
        lineups: {
          confirmed: false,
          homeFormation: '3-5-2 (คาดการณ์)',
          awayFormation: '4-2-3-1 (คาดการณ์)',
          homeStarters: [
            { num: 1, name: 'ยานน์ ซอมเมอร์', pos: 'GK' },
            { num: 28, name: 'แบ็งฌาแม็ง ปาวาร์', pos: 'DF' },
            { num: 15, name: 'ฟรานเชสโก้ อแซร์บี', pos: 'DF' },
            { num: 95, name: 'อเลสซานโดร บาสโตนี่', pos: 'DF' },
            { num: 2, name: 'เดนเซล ดุมฟรีส์', pos: 'MF' },
            { num: 23, name: 'นิโคโล่ บาเรลล่า', pos: 'MF' },
            { num: 20, name: 'ฮาคาน ชัลฮาโนกลู', pos: 'MF' },
            { num: 22, name: 'เฮนริค มคิทาร์ยาน', pos: 'MF' },
            { num: 32, name: 'เฟเดริโก้ ดิมาร์โก', pos: 'MF' },
            { num: 9, name: 'มาร์คุส ตูราม', pos: 'FW' },
            { num: 10, name: 'เลาตาโร่ มาร์ติเนซ (C)', pos: 'FW' }
          ],
          homeSubs: [
            { num: 13, name: 'โฆเซป มาร์ติเนซ' },
            { num: 16, name: 'ดาวิเด้ ฟรัตเตซี่' }
          ],
          awayStarters: [
            { num: 29, name: 'มิเคเล่ ดิ เกรโกริโอ', pos: 'GK' },
            { num: 15, name: 'ปิแอร์ คาลูลู', pos: 'DF' },
            { num: 4, name: 'เฟเดริโก้ กัตติ', pos: 'DF' },
            { num: 6, name: 'ดานิโล่ (C)', pos: 'DF' },
            { num: 27, name: 'อันเดรีย คัมเบียโซ่', pos: 'DF' },
            { num: 5, name: 'มานูเอล โลคาเตลลี่', pos: 'MF' },
            { num: 19, name: 'เคเฟรน ตูราม', pos: 'MF' },
            { num: 7, name: 'ฟรานซิสโก้ คอนไซเซา', pos: 'FW' },
            { num: 8, name: 'เติน คูปไมเนอร์ส', pos: 'MF' },
            { num: 10, name: 'เคนาน ยิลดิซ', pos: 'FW' },
            { num: 9, name: 'ดูซาน วลาโฮวิช', pos: 'FW' }
          ],
          awaySubs: [
            { num: 1, name: 'มัตเตีย เปริน' },
            { num: 26, name: 'ดักลาส ลุยซ์' }
          ]
        },
        h2h: {
          homeWins: 77,
          draws: 62,
          awayWins: 112,
          recent: [
            { date: '04 ก.พ. 2024', home: 'INT', away: 'JUV', score: '1 - 0' },
            { date: '26 พ.ย. 2023', home: 'JUV', away: 'INT', score: '1 - 1' },
            { date: '26 เม.ย. 2023', home: 'INT', away: 'JUV', score: '1 - 0' }
          ]
        },
        preview: {
          author: 'มัคคาโรนี เซเรีย อา',
          updatedAt: '13 พ.ย. 2026, 15:30 น.',
          fact: 'อินเตอร์ เสียประตูน้อยที่สุดในลีกในรอบ 15 นัดที่ผ่านมา',
          opinion: 'เกมนี้เน้นแท็กติกเหนียวแน่นทั้งคู่ โอกาสเสมอสูง หรืออินเตอร์เฉือน 1 ลูก',
          predictionScore: '1 - 0',
          accuracyRate: '79.2% (สถิติลีกอิตาลี)'
        }
      },

      // ======================================================================
      // MATCHES FROM USER'S REFERENCE IMAGE (ยูฟ่า เนชันส์ลีก / คัดเลือกบอลโลก)
      // ======================================================================
      // 1. [158]มอลโดว่า (ต่อ) vs คาซัคสถาน[117] | เสมอ -> ▲ 0/0.5 -> ▼ เสมอ -> ▲ 0/0.5
      {
        id: 'M201',
        leagueId: 'UNL',
        dateOffset: 0,
        time: '00:00',
        midnightNote: '',
        status: 'live',
        minute: 68,
        home: { id: 'MDA', name: 'มอลโดว่า', nameEn: 'Moldova', code: 'MDA', form: 'DWLLW', score: 1, redCards: 0, rank: 158, crest: '🇲🇩' },
        away: { id: 'KAZ', name: 'คาซัคสถาน', nameEn: 'Kazakhstan', code: 'KAZ', form: 'LLDWL', score: 0, redCards: 0, rank: 117, crest: '🇰🇿' },
        htScore: '? - ?',
        ftScore: '? - ?',
        tip: 'ฟันธงต่อมอลโดว่า กล้ายิง',
        venue: 'ซิมบรู สเตเดี้ยม',
        referee: 'ดอน โรเบิร์ตสัน',
        broadcast: 'UEFA.tv',
        searchTerms: 'มอลโดว่า คาซัคสถาน moldova kazakhstan',
        odds: {
          favored: 'home',
          initial: 'เสมอ',
          current: '0/0.5',
          history: [
            { val: 'เสมอ', dir: 'none' },
            { val: '0/0.5', dir: 'up' },
            { val: 'เสมอ', dir: 'down' },
            { val: '0/0.5', dir: 'up' }
          ],
          overUnder: '2.0',
          odds1x2: { home: '2.60', draw: '3.10', away: '2.85' }
        },
        timeline: [
          { min: "34'", type: 'goal', team: 'home', player: 'ไอออน นิโคลาเอสคู', assist: 'วาดิม ราต้า', score: '1 - 0' }
        ],
        stats: { possession: [48, 52], totalShots: [7, 6], shotsOnTarget: [3, 2], xg: ['0.85', '0.55'], corners: [4, 5], fouls: [12, 14], offsides: [1, 2], saves: [2, 2] }
      },

      // 2. [44]เซอร์เบีย vs เยอรมนี[13] (ต่อ) | 1.5/2 -> ▼ 1.5 -> ▲ 1.5/2 -> ▼ 1.5 -> ▲ 1.5/2
      {
        id: 'M202',
        leagueId: 'UNL',
        dateOffset: 0,
        time: '02:45',
        midnightNote: '',
        status: 'live',
        minute: 74,
        home: { id: 'SRB', name: 'เซอร์เบีย', nameEn: 'Serbia', code: 'SRB', form: 'WLDLD', score: 1, redCards: 0, rank: 44, crest: '🇷🇸' },
        away: { id: 'GER', name: 'เยอรมนี', nameEn: 'Germany', code: 'GER', form: 'WWWDW', score: 3, redCards: 0, rank: 13, crest: '🇩🇪' },
        htScore: '? - ?',
        ftScore: '? - ?',
        tip: 'ฟันธงไม่น่าถึงสอง ขอรองเซอร์เบีย',
        venue: 'สตาดิโอน ราจโก้ มิติช',
        referee: 'สเตฟาน โควัคส์',
        broadcast: 'UEFA.tv, beIN SPORTS 3',
        searchTerms: 'เซอร์เบีย เยอรมนี serbia germany',
        odds: {
          favored: 'away',
          initial: '1.5/2',
          current: '1.5/2',
          history: [
            { val: '1.5/2', dir: 'none' },
            { val: '1.5', dir: 'down' },
            { val: '1.5/2', dir: 'up' },
            { val: '1.5', dir: 'down' },
            { val: '1.5/2', dir: 'up' }
          ],
          overUnder: '3.0/3.5',
          odds1x2: { home: '7.50', draw: '4.80', away: '1.38' }
        },
        timeline: [
          { min: "19'", type: 'goal', team: 'away', player: 'ไค ฮาแวร์ตซ์', score: '0 - 1' },
          { min: "42'", type: 'goal', team: 'away', player: 'จามาล มูเซียล่า', score: '0 - 2' },
          { min: "58'", type: 'goal', team: 'home', player: 'อเล็กซานดาร์ มิโตรวิช', score: '1 - 2' },
          { min: "69'", type: 'goal', team: 'away', player: 'เดนิซ อุนดาฟ', score: '1 - 3' }
        ],
        stats: { possession: [36, 64], totalShots: [6, 15], shotsOnTarget: [2, 7], xg: ['0.72', '2.34'], corners: [3, 8], fouls: [15, 9], offsides: [2, 1], saves: [4, 1] }
      },

      // 3. [9]เนเธอร์แลนด์ (ต่อ) vs กรีซ[41] | 1/1.5 -> ▼ 1 -> ▼ 0.5/1 -> ▲ 1
      {
        id: 'M203',
        leagueId: 'UNL',
        dateOffset: 0,
        time: '02:45',
        midnightNote: '',
        status: 'finished',
        minute: 'FT',
        home: { id: 'NED', name: 'เนเธอร์แลนด์', nameEn: 'Netherlands', code: 'NED', form: 'WWDLW', score: 3, redCards: 0, rank: 9, crest: '🇳🇱' },
        away: { id: 'GRE', name: 'กรีซ', nameEn: 'Greece', code: 'GRE', form: 'WWLWL', score: 0, redCards: 0, rank: 41, crest: '🇬🇷' },
        htScore: '? - ?',
        ftScore: '? - ?',
        tip: 'ฟันธงรองกรีซ ไม่คิดมาก',
        venue: 'ฟิลิปส์ สเตเดี้ยม',
        referee: 'ไมเคิล โอลิเวอร์',
        broadcast: 'UEFA.tv',
        searchTerms: 'เนเธอร์แลนด์ ฮอลแลนด์ กรีซ netherlands greece',
        odds: {
          favored: 'home',
          initial: '1/1.5',
          current: '1',
          history: [
            { val: '1/1.5', dir: 'none' },
            { val: '1', dir: 'down' },
            { val: '0.5/1', dir: 'down' },
            { val: '1', dir: 'up' }
          ],
          overUnder: '2.5',
          odds1x2: { home: '1.45', draw: '4.50', away: '6.50' }
        },
        timeline: [
          { min: "17'", type: 'goal', team: 'home', player: 'มาร์เตน เดอ รูน', score: '1 - 0' },
          { min: "31'", type: 'goal', team: 'home', player: 'โคดี้ กัคโป', score: '2 - 0' },
          { min: "39'", type: 'goal', team: 'home', player: 'เวาต์ เว็กฮอร์สต์', score: '3 - 0' }
        ],
        stats: { possession: [60, 40], totalShots: [14, 6], shotsOnTarget: [6, 1], xg: ['2.10', '0.42'], corners: [6, 2], fouls: [10, 11], offsides: [1, 0], saves: [1, 3] }
      },

      // 4. [52]สโลวีเนีย vs สวิตเซอร์แลนด์[12] (ต่อ) | 0.5/1 -> ▼ 0.5 -> ▲ 0.5/1
      {
        id: 'M204',
        leagueId: 'UNL',
        dateOffset: 0,
        time: '02:45',
        midnightNote: '',
        status: 'live',
        minute: 59,
        home: { id: 'SVN', name: 'สโลวีเนีย', nameEn: 'Slovenia', code: 'SVN', form: 'DDDDW', score: 0, redCards: 0, rank: 52, crest: '🇸🇮' },
        away: { id: 'SUI', name: 'สวิตเซอร์แลนด์', nameEn: 'Switzerland', code: 'SUI', form: 'WLDDW', score: 1, redCards: 0, rank: 12, crest: '🇨🇭' },
        htScore: '? - ?',
        ftScore: '? - ?',
        tip: 'ฟันธงรองสโลวีเนีย เชียร์สนุก',
        venue: 'สตาดิโอน สโตซิเซ่',
        referee: 'ดาเนียล ซีเบิร์ต',
        broadcast: 'UEFA.tv',
        searchTerms: 'สโลวีเนีย สวิตเซอร์แลนด์ slovenia switzerland',
        odds: {
          favored: 'away',
          initial: '0.5/1',
          current: '0.5/1',
          history: [
            { val: '0.5/1', dir: 'none' },
            { val: '0.5', dir: 'down' },
            { val: '0.5/1', dir: 'up' }
          ],
          overUnder: '2/2.5',
          odds1x2: { home: '4.20', draw: '3.40', away: '1.85' }
        },
        timeline: [
          { min: "28'", type: 'goal', team: 'away', player: 'บรีล เอ็มโบโล่', score: '0 - 1' }
        ],
        stats: { possession: [42, 58], totalShots: [5, 9], shotsOnTarget: [1, 4], xg: ['0.48', '1.15'], corners: [2, 5], fouls: [11, 8], offsides: [1, 1], saves: [3, 1] }
      },

      // 5. [43]สก็อตแลนด์ (ต่อ) vs มาซิโดเนีย[71] | 1.5 -> ▲ 1.5/2 -> ▲ 2
      {
        id: 'M205',
        leagueId: 'UNL',
        dateOffset: 0,
        time: '02:45',
        midnightNote: '',
        status: 'upcoming',
        minute: null,
        home: { id: 'SCO', name: 'สก็อตแลนด์', nameEn: 'Scotland', code: 'SCO', form: 'LLLDW', score: 0, redCards: 0, rank: 43, crest: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
        away: { id: 'MKD', name: 'มาซิโดเนีย', nameEn: 'North Macedonia', code: 'MKD', form: 'DWWDD', score: 0, redCards: 0, rank: 71, crest: '🇲🇰' },
        htScore: '? - ?',
        ftScore: '? - ?',
        tip: 'ฟันธงต่อสก็อตแลนด์ ดินแดนศิวิไล',
        venue: 'แฮมป์เดน พาร์ค',
        referee: 'เกล็นน์ นีเบิร์ก',
        broadcast: 'UEFA.tv',
        searchTerms: 'สก็อตแลนด์ มาซิโดเนีย scotland macedonia',
        odds: {
          favored: 'home',
          initial: '1.5',
          current: '2',
          history: [
            { val: '1.5', dir: 'none' },
            { val: '1.5/2', dir: 'up' },
            { val: '2', dir: 'up' }
          ],
          overUnder: '2.5/3',
          odds1x2: { home: '1.30', draw: '5.00', away: '9.50' }
        },
        timeline: [],
        stats: { possession: [50, 50], totalShots: [0, 0], shotsOnTarget: [0, 0], xg: ['0.00', '0.00'], corners: [0, 0], fouls: [0, 0], offsides: [0, 0], saves: [0, 0] }
      },

      // 6. [90]บัลแกเรีย vs ไอซ์แลนด์[73] (ต่อ) | 0/0.5 -> ▲ 0.5 -> ▲ 0.5/1 -> ▼ 0.5 -> ▲ 0.5/1
      {
        id: 'M206',
        leagueId: 'UNL',
        dateOffset: 0,
        time: '02:45',
        midnightNote: '',
        status: 'upcoming',
        minute: null,
        home: { id: 'BUL', name: 'บัลแกเรีย', nameEn: 'Bulgaria', code: 'BUL', form: 'WDDWL', score: 0, redCards: 0, rank: 90, crest: '🇧🇬' },
        away: { id: 'ISL', name: 'ไอซ์แลนด์', nameEn: 'Iceland', code: 'ISL', form: 'LWLDW', score: 0, redCards: 0, rank: 73, crest: '🇮🇸' },
        htScore: '? - ?',
        ftScore: '? - ?',
        tip: 'ฟันธงต่อไอซ์แลนด์ ยิงแซง',
        venue: 'ฮริสโต โบเตฟ สเตเดี้ยม',
        referee: 'ราดู เปเตรสคู',
        broadcast: 'UEFA.tv',
        searchTerms: 'บัลแกเรีย ไอซ์แลนด์ bulgaria iceland',
        odds: {
          favored: 'away',
          initial: '0/0.5',
          current: '0.5/1',
          history: [
            { val: '0/0.5', dir: 'none' },
            { val: '0.5', dir: 'up' },
            { val: '0.5/1', dir: 'up' },
            { val: '0.5', dir: 'down' },
            { val: '0.5/1', dir: 'up' }
          ],
          overUnder: '2/2.5',
          odds1x2: { home: '3.60', draw: '3.25', away: '2.05' }
        },
        timeline: [],
        stats: { possession: [50, 50], totalShots: [0, 0], shotsOnTarget: [0, 0], xg: ['0.00', '0.00'], corners: [0, 0], fouls: [0, 0], offsides: [0, 0], saves: [0, 0] }
      },

      // 7. [45]สโลวาเกีย (ต่อ) vs หมู่เกาะแฟโร[126] | 1.5 -> ▼ 1/1.5 -> ▲ 1.5 -> ▼ 1/1.5
      {
        id: 'M207',
        leagueId: 'UNL',
        dateOffset: 0,
        time: '02:45',
        midnightNote: '',
        status: 'upcoming',
        minute: null,
        home: { id: 'SVK', name: 'สโลวาเกีย', nameEn: 'Slovakia', code: 'SVK', form: 'WWDWL', score: 0, redCards: 0, rank: 45, crest: '🇸🇰' },
        away: { id: 'FRO', name: 'หมู่เกาะแฟโร', nameEn: 'Faroe Islands', code: 'FRO', form: 'LDDDL', score: 0, redCards: 0, rank: 126, crest: '🇫🇴' },
        htScore: '? - ?',
        ftScore: '? - ?',
        tip: 'ฟันธงรองหมู่เกาะแฟโร ยันโชว์',
        venue: 'เทเฮลเน่ โพเล่',
        referee: 'ทามาส บ็อกนาร์',
        broadcast: 'UEFA.tv',
        searchTerms: 'สโลวาเกีย หมู่เกาะแฟโร slovakia faroe islands',
        odds: {
          favored: 'home',
          initial: '1.5',
          current: '1/1.5',
          history: [
            { val: '1.5', dir: 'none' },
            { val: '1/1.5', dir: 'down' },
            { val: '1.5', dir: 'up' },
            { val: '1/1.5', dir: 'down' }
          ],
          overUnder: '2.5',
          odds1x2: { home: '1.33', draw: '4.80', away: '9.00' }
        },
        timeline: [],
        stats: { possession: [50, 50], totalShots: [0, 0], shotsOnTarget: [0, 0], xg: ['0.00', '0.00'], corners: [0, 0], fouls: [0, 0], offsides: [0, 0], saves: [0, 0] }
      },

      // 8. [101]ลักเซมเบิร์ก (ต่อ) vs เอสโตเนีย[122] | 0.5 -> ▼ 0/0.5 -> ▼ เสมอ -> ▲ 0/0.5 -> ▼ เสมอ
      {
        id: 'M208',
        leagueId: 'UNL',
        dateOffset: 0,
        time: '02:45',
        midnightNote: '',
        status: 'upcoming',
        minute: null,
        home: { id: 'LUX', name: 'ลักเซมเบิร์ก', nameEn: 'Luxembourg', code: 'LUX', form: 'LLDDW', score: 0, redCards: 0, rank: 101, crest: '🇱🇺' },
        away: { id: 'EST', name: 'เอสโตเนีย', nameEn: 'Estonia', code: 'EST', form: 'LWLLD', score: 0, redCards: 0, rank: 122, crest: '🇪🇪' },
        htScore: '? - ?',
        ftScore: '? - ?',
        tip: 'ฟันธงวางเอสโตเนีย ไม่เสียใจ',
        venue: 'สตาด เดอ ลักเซมเบิร์ก',
        referee: 'อันเดรีย ชูร์แมน',
        broadcast: 'UEFA.tv',
        searchTerms: 'ลักเซมเบิร์ก เอสโตเนีย luxembourg estonia',
        odds: {
          favored: 'home',
          initial: '0.5',
          current: 'เสมอ',
          history: [
            { val: '0.5', dir: 'none' },
            { val: '0/0.5', dir: 'down' },
            { val: 'เสมอ', dir: 'down' },
            { val: '0/0.5', dir: 'up' },
            { val: 'เสมอ', dir: 'down' }
          ],
          overUnder: '2.0',
          odds1x2: { home: '2.40', draw: '3.10', away: '2.95' }
        },
        timeline: [],
        stats: { possession: [50, 50], totalShots: [0, 0], shotsOnTarget: [0, 0], xg: ['0.00', '0.00'], corners: [0, 0], fouls: [0, 0], offsides: [0, 0], saves: [0, 0] }
      },

      // 9. [207]ลิกเตนสไตน์ vs อาเซอร์ไบจาน[127] (ต่อ) | 1.5 -> ▼ 1/1.5 -> ▲ 1.5 -> ▲ 1.5/2
      {
        id: 'M209',
        leagueId: 'UNL',
        dateOffset: 0,
        time: '02:45',
        midnightNote: '',
        status: 'upcoming',
        minute: null,
        home: { id: 'LIE', name: 'ลิกเตนสไตน์', nameEn: 'Liechtenstein', code: 'LIE', form: 'DDLLL', score: 0, redCards: 0, rank: 207, crest: '🇱🇮' },
        away: { id: 'AZE', name: 'อาเซอร์ไบจาน', nameEn: 'Azerbaijan', code: 'AZE', form: 'LLLDW', score: 0, redCards: 0, rank: 127, crest: '🇦🇿' },
        htScore: '? - ?',
        ftScore: '? - ?',
        tip: 'ฟันธงรองลิกเตนสไตน์ ใส่ได้',
        venue: 'ไรน์พาร์ค สตาดิโอน',
        referee: 'วิลลี่ เดอลาโฮด์',
        broadcast: 'UEFA.tv',
        searchTerms: 'ลิกเตนสไตน์ อาเซอร์ไบจาน liechtenstein azerbaijan',
        odds: {
          favored: 'away',
          initial: '1.5',
          current: '1.5/2',
          history: [
            { val: '1.5', dir: 'none' },
            { val: '1/1.5', dir: 'down' },
            { val: '1.5', dir: 'up' },
            { val: '1.5/2', dir: 'up' }
          ],
          overUnder: '2.5',
          odds1x2: { home: '10.0', draw: '5.20', away: '1.28' }
        },
        timeline: [],
        stats: { possession: [50, 50], totalShots: [0, 0], shotsOnTarget: [0, 0], xg: ['0.00', '0.00'], corners: [0, 0], fouls: [0, 0], offsides: [0, 0], saves: [0, 0] }
      },

      // 10. [175]อันดอร์ร่า (ต่อ) vs ยิบรอลตาร์[201] | 0.5 -> ▲ 0.5/1
      {
        id: 'M210',
        leagueId: 'UNL',
        dateOffset: 0,
        time: '02:45',
        midnightNote: '',
        status: 'upcoming',
        minute: null,
        home: { id: 'AND', name: 'อันดอร์ร่า', nameEn: 'Andorra', code: 'AND', form: 'WLLLD', score: 0, redCards: 0, rank: 175, crest: '🇦🇩' },
        away: { id: 'GIB', name: 'ยิบรอลตาร์', nameEn: 'Gibraltar', code: 'GIB', form: 'DDDDL', score: 0, redCards: 0, rank: 201, crest: '🇬🇮' },
        htScore: '? - ?',
        ftScore: '? - ?',
        tip: 'ฟันธงต่ออันดอร์ร่า ซ่าในบ้าน',
        venue: 'เอสตาดิ นาซิออนนาล',
        referee: 'ฟิลิป โกลวา',
        broadcast: 'UEFA.tv',
        searchTerms: 'อันดอร์ร่า ยิบรอลตาร์ andorra gibraltar',
        odds: {
          favored: 'home',
          initial: '0.5',
          current: '0.5/1',
          history: [
            { val: '0.5', dir: 'none' },
            { val: '0.5/1', dir: 'up' }
          ],
          overUnder: '2.0',
          odds1x2: { home: '1.80', draw: '3.20', away: '4.80' }
        },
        timeline: [],
        stats: { possession: [50, 50], totalShots: [0, 0], shotsOnTarget: [0, 0], xg: ['0.00', '0.00'], corners: [0, 0], fouls: [0, 0], offsides: [0, 0], saves: [0, 0] }
      }
    ],

    // STANDINGS DATA (Clean, verified tables)
    standings: {
      PL: [
        { rank: 1, team: 'ลิเวอร์พูล', played: 26, win: 18, draw: 6, loss: 2, gf: 58, ga: 22, gd: 36, pts: 60, form: ['W','W','W','D','W'], zone: 'ucl' },
        { rank: 2, team: 'แมนฯ ซิตี้', played: 26, win: 18, draw: 5, loss: 3, gf: 61, ga: 26, gd: 35, pts: 59, form: ['W','W','W','D','W'], zone: 'ucl' },
        { rank: 3, team: 'อาร์เซน่อล', played: 26, win: 16, draw: 6, loss: 4, gf: 54, ga: 21, gd: 33, pts: 54, form: ['W','W','W','D','W'], zone: 'ucl' },
        { rank: 4, team: 'เชลซี', played: 26, win: 14, draw: 6, loss: 6, gf: 49, ga: 33, gd: 16, pts: 48, form: ['W','D','W','W','L'], zone: 'ucl' },
        { rank: 5, team: 'น็อตติ้งแฮม ฟอเรสต์', played: 26, win: 14, draw: 5, loss: 7, gf: 38, ga: 28, gd: 10, pts: 47, form: ['W','W','L','W','W'], zone: 'uel' },
        { rank: 6, team: 'แมนฯ ยูไนเต็ด', played: 25, win: 12, draw: 6, loss: 7, gf: 40, ga: 32, gd: 8, pts: 42, form: ['W','L','W','D','W'], zone: 'none' },
        { rank: 7, team: 'ท็อตแน่ม ฮ็อทสเปอร์', played: 25, win: 12, draw: 4, loss: 9, gf: 51, ga: 37, gd: 14, pts: 40, form: ['W','W','D','L','W'], zone: 'none' },
        { rank: 8, team: 'นิวคาสเซิ่ล', played: 26, win: 11, draw: 6, loss: 9, gf: 42, ga: 35, gd: 7, pts: 39, form: ['D','W','L','W','D'], zone: 'none' },
        { rank: 18, team: 'อิปสวิช ทาวน์', played: 26, win: 3, draw: 8, loss: 15, gf: 24, ga: 52, gd: -28, pts: 17, form: ['L','L','D','L','L'], zone: 'rel' },
        { rank: 19, team: 'เลสเตอร์ ซิตี้', played: 26, win: 3, draw: 8, loss: 15, gf: 28, ga: 58, gd: -30, pts: 17, form: ['L','D','L','L','D'], zone: 'rel' },
        { rank: 20, team: 'เซาธ์แฮมป์ตัน', played: 26, win: 2, draw: 4, loss: 20, gf: 18, ga: 60, gd: -42, pts: 10, form: ['L','L','L','L','L'], zone: 'rel' }
      ],
      LL: [
        { rank: 1, team: 'เรอัล มาดริด', played: 24, win: 18, draw: 4, loss: 2, gf: 52, ga: 18, gd: 34, pts: 58, form: ['W','W','W','W','W'], zone: 'ucl' },
        { rank: 2, team: 'บาร์เซโลน่า', played: 24, win: 17, draw: 3, loss: 4, gf: 63, ga: 24, gd: 39, pts: 54, form: ['W','W','W','L','W'], zone: 'ucl' },
        { rank: 3, team: 'แอตเลติโก มาดริด', played: 24, win: 15, draw: 6, loss: 3, gf: 41, ga: 16, gd: 25, pts: 51, form: ['W','W','D','W','W'], zone: 'ucl' },
        { rank: 4, team: 'แอธเลติก บิลเบา', played: 24, win: 13, draw: 6, loss: 5, gf: 38, ga: 22, gd: 16, pts: 45, form: ['W','D','W','W','D'], zone: 'ucl' },
        { rank: 18, team: 'บาเลนเซีย', played: 24, win: 4, draw: 7, loss: 13, gf: 21, ga: 39, gd: -18, pts: 19, form: ['D','L','W','L','L'], zone: 'rel' },
        { rank: 19, team: 'เอสปันญ่อล', played: 24, win: 4, draw: 4, loss: 16, gf: 20, ga: 44, gd: -24, pts: 16, form: ['L','L','L','D','L'], zone: 'rel' },
        { rank: 20, team: 'เรอัล บายาโดลิด', played: 24, win: 3, draw: 3, loss: 18, gf: 15, ga: 51, gd: -36, pts: 12, form: ['L','L','L','L','L'], zone: 'rel' }
      ],
      TL: [
        { rank: 1, team: 'บุรีรัมย์ ยูไนเต็ด', played: 19, win: 15, draw: 4, loss: 0, gf: 54, ga: 12, gd: 42, pts: 49, form: ['W','W','W','W','W'], zone: 'ucl' },
        { rank: 2, team: 'ทรู แบงค็อก ยูไนเต็ด', played: 19, win: 13, draw: 4, loss: 2, gf: 38, ga: 17, gd: 21, pts: 43, form: ['W','W','D','W','W'], zone: 'ucl' },
        { rank: 3, team: 'การท่าเรือ เอฟซี', played: 19, win: 10, draw: 6, loss: 3, gf: 39, ga: 22, gd: 17, pts: 36, form: ['W','W','D','L','W'], zone: 'uel' },
        { rank: 4, team: 'บีจี ปทุม ยูไนเต็ด', played: 19, win: 9, draw: 6, loss: 4, gf: 32, ga: 20, gd: 12, pts: 33, form: ['D','W','W','D','L'], zone: 'none' },
        { rank: 5, team: 'เมืองทอง ยูไนเต็ด', played: 19, win: 8, draw: 5, loss: 6, gf: 30, ga: 26, gd: 4, pts: 29, form: ['W','L','W','D','W'], zone: 'none' },
        { rank: 14, team: 'ขอนแก่น ยูไนเต็ด', played: 19, win: 3, draw: 4, loss: 12, gf: 14, ga: 37, gd: -23, pts: 13, form: ['L','L','D','L','L'], zone: 'rel' },
        { rank: 15, team: 'นครปฐม ยูไนเต็ด', played: 19, win: 2, draw: 4, loss: 13, gf: 16, ga: 41, gd: -25, pts: 10, form: ['L','D','L','L','D'], zone: 'rel' },
        { rank: 16, team: 'เชียงราย ยูไนเต็ด', played: 19, win: 2, draw: 3, loss: 14, gf: 12, ga: 45, gd: -33, pts: 9, form: ['L','L','L','L','L'], zone: 'rel' }
      ]
    }
  };

  // ==========================================================================
  // 2. STATE MANAGEMENT & STORAGE
  // ==========================================================================
  const State = {
    activePage: 'live', // live, schedule, standings, analysis, favorites
    selectedDateOffset: 0,
    selectedStatus: 'all', // all, live, upcoming, finished, favorites
    selectedLeague: 'all',
    searchQuery: '',
    favorites: JSON.parse(localStorage.getItem('goal99_favorites') || '["M101", "M103"]'),
    soundEnabled: localStorage.getItem('goal99_sound') !== 'false',
    simulationRunning: true,
    collapsedLeagues: {},
    activeModalMatchId: null,
    activeModalTab: 'timeline',
    showOddsColumn: localStorage.getItem('goal99_show_odds') !== 'false'
  };

  function saveFavorites() {
    localStorage.setItem('goal99_favorites', JSON.stringify(State.favorites));
    updateHeaderCounts();
  }

  // ==========================================================================
  // 3. SOUND SYNTHESIZER (Web Audio API - Crisp chime for goal notification)
  // ==========================================================================
  function playGoalChime() {
    if (!State.soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      // Chime melody: G5 -> C6
      osc1.frequency.setValueAtTime(783.99, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.15);

      osc2.frequency.setValueAtTime(392.00, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(523.25, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.6);
      osc2.stop(ctx.currentTime + 0.6);
    } catch (e) {
      console.warn('Audio synthesis failed or blocked by browser auto-play policy', e);
    }
  }

  // ==========================================================================
  // 4. TOAST NOTIFICATION SYSTEM
  // ==========================================================================
  function showToast(title, message, isGoal = false) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${isGoal ? 'toast-goal' : ''}`;
    toast.innerHTML = `
      <span class="toast-icon">${isGoal ? '⚽' : '🔔'}</span>
      <div class="toast-text">
        <strong>${title}</strong>
        <div>${message}</div>
      </div>
    `;

    container.appendChild(toast);

    if (isGoal) {
      playGoalChime();
    }

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  // ==========================================================================
  // 5. CLOCK & THAI TIMEZONE DISPLAY (UTC+7 with real-time seconds)
  // ==========================================================================
  function updateThaiClock() {
    const clockEl = document.getElementById('thaiClock');
    if (!clockEl) return;
    const now = new Date();
    // Thailand timezone format
    const timeStr = now.toLocaleTimeString('th-TH', { hour12: false });
    clockEl.textContent = `เวลาประเทศไทย (GMT+7): ${timeStr} น.`;
  }

  function setupDateBarDates() {
    const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    const now = new Date();

    const offsets = [-2, -1, 0, 1, 2];
    const ids = ['dateMinus2', 'dateMinus1', 'dateToday', 'datePlus1', 'datePlus2'];

    offsets.forEach((offset, idx) => {
      const d = new Date(now);
      d.setDate(now.getDate() + offset);
      const el = document.getElementById(ids[idx]);
      if (el) {
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        el.textContent = `${dd}/${mm}`;
      }
    });
  }

  // ==========================================================================
  // 6. FILTERING & SEARCH ENGINE (Thai, English, Nicknames, Acronyms)
  // ==========================================================================
  function getFilteredMatches() {
    return DB.matches.filter(m => {
      // 1. Search Query Filter
      if (State.searchQuery.trim() !== '') {
        const q = State.searchQuery.toLowerCase().trim();
        const league = DB.leagues[m.leagueId] || {};
        const matchText = [
          m.home.name, m.home.nameEn, m.home.code,
          m.away.name, m.away.nameEn, m.away.code,
          league.name, league.country, m.searchTerms || ''
        ].join(' ').toLowerCase();

        if (!matchText.includes(q)) {
          return false;
        }
      }

      // 2. Date Filter (Only apply if user is NOT explicitly on "Live" or searching)
      if (State.searchQuery.trim() === '' && State.selectedStatus !== 'live' && State.selectedStatus !== 'favorites') {
        if (m.dateOffset !== State.selectedDateOffset) {
          return false;
        }
      }

      // 3. Status Filter
      if (State.selectedStatus === 'live' && m.status !== 'live') return false;
      if (State.selectedStatus === 'upcoming' && m.status !== 'upcoming') return false;
      if (State.selectedStatus === 'finished' && m.status !== 'finished') return false;
      if (State.selectedStatus === 'favorites') {
        if (!State.favorites.includes(m.id)) return false;
      }

      // 4. League Filter
      if (State.selectedLeague !== 'all' && m.leagueId !== State.selectedLeague) {
        return false;
      }

      return true;
    });
  }

  // Update counts for status badges
  function updateHeaderCounts() {
    const liveCount = DB.matches.filter(m => m.status === 'live').length;
    const favCount = State.favorites.length;

    const hLive = document.getElementById('headerLiveCount');
    const hFav = document.getElementById('headerFavCount');
    if (hLive) hLive.textContent = liveCount;
    if (hFav) hFav.textContent = favCount;

    // Filter bar counts
    const todayMatches = DB.matches.filter(m => m.dateOffset === State.selectedDateOffset);
    const countAll = document.getElementById('countAll');
    const countLive = document.getElementById('countLive');
    const countUpcoming = document.getElementById('countUpcoming');
    const countFinished = document.getElementById('countFinished');
    const countFavorites = document.getElementById('countFavorites');

    if (countAll) countAll.textContent = todayMatches.length;
    if (countLive) countLive.textContent = DB.matches.filter(m => m.status === 'live').length;
    if (countUpcoming) countUpcoming.textContent = todayMatches.filter(m => m.status === 'upcoming').length;
    if (countFinished) countFinished.textContent = todayMatches.filter(m => m.status === 'finished').length;
    if (countFavorites) countFavorites.textContent = State.favorites.length;
  }

  // ==========================================================================
  // 7. RENDER MATCH LIST (Mobile-first, clean rows, no horizontal scroll)
  // ==========================================================================
  function renderMatchList() {
    const container = document.getElementById('matchGroupsContainer');
    const emptyState = document.getElementById('emptyState');
    const countSummary = document.getElementById('filteredMatchCount');
    if (!container) return;

    const filtered = getFilteredMatches();

    if (countSummary) {
      countSummary.textContent = `พบ ${filtered.length} คู่แข่งขัน`;
    }

    if (filtered.length === 0) {
      container.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    } else {
      emptyState.style.display = 'none';
    }

    // Group matches by league
    const grouped = {};
    filtered.forEach(m => {
      if (!grouped[m.leagueId]) grouped[m.leagueId] = [];
      grouped[m.leagueId].push(m);
    });

    let html = '';

    for (const [leagueId, matches] of Object.entries(grouped)) {
      const league = DB.leagues[leagueId] || { name: leagueId, flag: '⚽', round: '' };
      const isCollapsed = !!State.collapsedLeagues[leagueId];

      let subheadHtml = '';
      if (State.showOddsColumn) {
        subheadHtml = `
          <div class="league-subhead">
            <span class="subhead-time">เวลา</span>
            <span class="subhead-flag">ธง</span>
            <span class="subhead-live">สด</span>
            <span class="subhead-home">เจ้าบ้าน</span>
            <span class="subhead-odds">ราคาบอล</span>
            <span class="subhead-away">ทีมเยือน</span>
            <span class="subhead-ht">ครึ่งแรก</span>
            <span class="subhead-ft">ผลบอล</span>
            <span class="subhead-tip">ทรรศนะฟุตบอลวันนี้/ทีเด็ดบอลคืนนี้</span>
          </div>
        `;
      }

      html += `
        <div class="league-group ${isCollapsed ? 'collapsed' : ''}" data-league-id="${leagueId}">
          <div class="league-header" role="button" aria-expanded="${!isCollapsed}" tabindex="0">
            <div class="league-title-box">
              <span class="league-flag">${league.flag}</span>
              <span class="league-name">${league.name}</span>
              <span class="league-round">(${league.round})</span>
            </div>
            <span class="league-chevron">▼</span>
          </div>
          <div class="table-scroll-wrap">
            ${subheadHtml}
            <div class="match-items">
              ${matches.map(m => renderMatchRow(m)).join('')}
            </div>
          </div>
        </div>
      `;
    }

    container.innerHTML = html;
    attachMatchRowListeners(container);
  }

  function renderMatchRow(m) {
    const isFav = State.favorites.includes(m.id);
    const league = DB.leagues[m.leagueId] || { flag: '⚽' };
    let timeStatusHtml = '';

    if (m.status === 'live') {
      timeStatusHtml = `
        <span class="match-status-badge status-live">สด</span>
        <span class="match-minute">${m.minute}'</span>
      `;
    } else if (m.status === 'finished') {
      timeStatusHtml = `
        <span class="match-status-badge status-finished">จบ</span>
        <span class="match-minute" style="color:var(--text-muted)">FT</span>
      `;
    } else {
      timeStatusHtml = `
        <span class="match-status-badge status-upcoming">${m.time}</span>
        ${m.midnightNote ? `<span class="match-midnight-tag" title="${m.midnightNote}">คืนนี้</span>` : ''}
      `;
    }

    const homeScore = m.status !== 'upcoming' ? m.home.score : '-';
    const awayScore = m.status !== 'upcoming' ? m.away.score : '-';
    const htScoreDisplay = m.htScore || (m.status === 'upcoming' ? '? - ?' : '1 - 0');
    const ftScoreDisplay = m.ftScore || (m.status === 'upcoming' ? '? - ?' : `${homeScore} - ${awayScore}`);

    // RENDER WITH FULL COLUMNS: ODDS, CREST BADGES, HT/FT & PREDICTION (Matching user's reference screenshot 1)
    if (State.showOddsColumn) {
      const isHomeFav = m.odds && m.odds.favored === 'home';
      const isAwayFav = m.odds && m.odds.favored === 'away';

      const homeRankStr = m.home.rank ? `[${m.home.rank}]` : '';
      const awayRankStr = m.away.rank ? `[${m.away.rank}]` : '';

      let oddsBoxHtml = '<div class="odds-box"><span class="odds-line text-muted">-</span></div>';
      if (m.odds && m.odds.history && m.odds.history.length > 0) {
        const linesHtml = m.odds.history.map(item => {
          if (item.dir === 'up') {
            return `<div class="odds-line flow-up"><span class="arrow">▲</span>${item.val}</div>`;
          } else if (item.dir === 'down') {
            return `<div class="odds-line flow-down"><span class="arrow">▼</span>${item.val}</div>`;
          } else {
            return `<div class="odds-line">${item.val}</div>`;
          }
        }).join('');
        oddsBoxHtml = `<div class="odds-box" title="ราคาเปิด: ${m.odds.initial || '-'} | ล่าสุด: ${m.odds.current || '-'} (คลิกเพื่อดูราคาไหลเชิงลึก)">${linesHtml}</div>`;
      }

      return `
        <div class="match-item with-odds" data-match-id="${m.id}" role="button" tabindex="0" aria-label="${m.home.name} พบ ${m.away.name}">
          <!-- 1. เวลา -->
          <div class="match-time-col">
            ${timeStatusHtml}
          </div>

          <!-- 2. ธง / ลีก -->
          <div class="match-flag-col" title="${league.name || 'ฟุตบอล'}">
            <span class="match-flag-badge">${league.flag || '⚽'}</span>
          </div>

          <!-- 3. สด / ช่องถ่ายทอด -->
          <div class="match-live-icon-col" title="${m.broadcast || 'ถ่ายทอดสด'}">
            <span class="live-tv-icon ${m.status === 'live' ? 'is-live' : ''}">📺</span>
          </div>

          <!-- 4. เจ้าบ้าน (อันดับ + ชื่อ + ตราสโมสรในช่องเล็กๆ, แดงถ้าต่อ) -->
          <div class="match-home-col ${isHomeFav ? 'team-favored' : 'team-underdog'}">
            ${homeRankStr ? `<span class="team-rank">${homeRankStr}</span>` : ''}
            <span class="team-name ${m.status === 'finished' && m.home.score > m.away.score ? 'winner' : ''}">${m.home.name}</span>
            <span class="team-crest-box" title="${m.home.name}">${m.home.crest || m.home.code}</span>
            ${m.home.redCards > 0 ? `<span class="team-red-card" title="ใบแดง"></span>` : ''}
          </div>

          <!-- 5. ราคาบอล (กล่องราคาไหล) -->
          <div class="match-odds-col">
            ${oddsBoxHtml}
          </div>

          <!-- 6. ทีมเยือน (ตราสโมสรในช่องเล็กๆ + ชื่อ + อันดับ, แดงถ้าต่อ) -->
          <div class="match-away-col ${isAwayFav ? 'team-favored' : 'team-underdog'}">
            <span class="team-crest-box" title="${m.away.name}">${m.away.crest || m.away.code}</span>
            <span class="team-name ${m.status === 'finished' && m.away.score > m.home.score ? 'winner' : ''}">${m.away.name}</span>
            ${awayRankStr ? `<span class="team-rank">${awayRankStr}</span>` : ''}
            ${m.away.redCards > 0 ? `<span class="team-red-card" title="ใบแดง"></span>` : ''}
          </div>

          <!-- 7. ครึ่งแรก -->
          <div class="match-ht-col" title="สกอร์ครึ่งแรก">
            <span class="score-ht">${htScoreDisplay}</span>
          </div>

          <!-- 8. ผลบอล (สกอร์เต็มเวลา) -->
          <div class="match-ft-col" title="ผลบอลสด / เต็มเวลา">
            <span class="score-ft ${m.status === 'live' ? 'live' : ''}">${ftScoreDisplay}</span>
          </div>

          <!-- 9. ทรรศนะฟุตบอลวันนี้/ทีเด็ดบอลคืนนี้ (สีฟ้าเด่นชัดตามรูปตัวอย่าง) -->
          <div class="match-tip-col" title="ทรรศนะฟุตบอลวันนี้">
            <span class="tip-text">${m.tip || 'ฟันธงบอลเด็ดวันนี้'}</span>
          </div>
        </div>
      `;
    }

    return `
      <div class="match-item" data-match-id="${m.id}" role="button" tabindex="0" aria-label="${m.home.name} พบ ${m.away.name}">
        <!-- Time/Status Col -->
        <div class="match-time-col">
          ${timeStatusHtml}
        </div>

        <!-- Teams Col (Strictly stacked, fits 390px mobile screens) -->
        <div class="match-teams-col">
          <div class="team-line">
            <span class="team-crest-box">${m.home.crest || m.home.code}</span>
            <span class="team-name ${m.status === 'finished' && m.home.score > m.away.score ? 'winner' : ''}">${m.home.name}</span>
            ${m.home.redCards > 0 ? `<span class="team-red-card" title="ใบแดง"></span>` : ''}
          </div>
          <div class="team-line">
            <span class="team-crest-box">${m.away.crest || m.away.code}</span>
            <span class="team-name ${m.status === 'finished' && m.away.score > m.home.score ? 'winner' : ''}">${m.away.name}</span>
            ${m.away.redCards > 0 ? `<span class="team-red-card" title="ใบแดง"></span>` : ''}
          </div>
        </div>

        <!-- Score Col -->
        <div class="match-score-col">
          <span class="score-num ${m.status === 'live' ? 'live' : ''} ${m.status === 'finished' && m.home.score > m.away.score ? 'winner' : ''}">${homeScore}</span>
          <span class="score-num ${m.status === 'live' ? 'live' : ''} ${m.status === 'finished' && m.away.score > m.home.score ? 'winner' : ''}">${awayScore}</span>
        </div>

        <!-- Action / Favorite Col -->
        <div class="match-action-col">
          <button type="button" class="btn-star-fav ${isFav ? 'favorited' : ''}" data-match-id="${m.id}" aria-label="ติดตามคู่นี้" title="${isFav ? 'นำออกจากรายการโปรด' : 'เพิ่มเป็นคู่โปรด'}">
            ★
          </button>
        </div>
      </div>
    `;
  }

  function attachMatchRowListeners(container) {
    // League Header Collapse Toggle
    container.querySelectorAll('.league-header').forEach(header => {
      header.addEventListener('click', () => {
        const group = header.closest('.league-group');
        const leagueId = group.dataset.leagueId;
        group.classList.toggle('collapsed');
        State.collapsedLeagues[leagueId] = group.classList.contains('collapsed');
      });
    });

    // Match Row Click -> Open Match Detail Modal
    container.querySelectorAll('.match-item').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('.btn-star-fav')) return;
        const matchId = row.dataset.matchId;
        openMatchModal(matchId);
      });
    });

    // Favorite Star Click
    container.querySelectorAll('.btn-star-fav').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const matchId = btn.dataset.matchId;
        toggleFavorite(matchId);
      });
    });
  }

  function toggleFavorite(matchId) {
    const idx = State.favorites.indexOf(matchId);
    if (idx > -1) {
      State.favorites.splice(idx, 1);
      showToast('รายการโปรด', 'นำคู่นี้ออกจากรายการโปรดแล้ว');
    } else {
      State.favorites.push(matchId);
      showToast('รายการโปรด', 'เพิ่มลงในรายการโปรดเรียบร้อย ⭐');
    }
    saveFavorites();
    renderMatchList();
    if (State.activePage === 'favorites') {
      renderFavoritesView();
    }
  }

  // ==========================================================================
  // 8. MATCH DETAIL MODAL CONTROLLER (The centerpiece of the football hub)
  // ==========================================================================
  function openMatchModal(matchId) {
    const m = DB.matches.find(item => item.id === matchId);
    if (!m) return;
    State.activeModalMatchId = matchId;

    const modal = document.getElementById('matchModal');
    const league = DB.leagues[m.leagueId] || { name: m.leagueId };

    // Set Meta
    document.getElementById('modalLeagueBadge').textContent = `${league.flag || ''} ${league.name} (${league.round || ''})`;
    document.getElementById('modalVenue').textContent = `สนาม: ${m.venue || 'ไม่ระบุ'}`;
    document.getElementById('modalReferee').textContent = `ผู้ตัดสิน: ${m.referee || 'ไม่ระบุ'}`;
    document.getElementById('modalMatchId').textContent = m.id;

    // Set Scoreboard
    document.getElementById('modalHomeLogo').textContent = m.home.code;
    document.getElementById('modalHomeName').textContent = m.home.name;
    document.getElementById('modalHomeForm').textContent = `ฟอร์ม: ${m.home.form}`;

    document.getElementById('modalAwayLogo').textContent = m.away.code;
    document.getElementById('modalAwayName').textContent = m.away.name;
    document.getElementById('modalAwayForm').textContent = `ฟอร์ม: ${m.away.form}`;

    const statusBadge = document.getElementById('modalStatusBadge');
    if (m.status === 'live') {
      statusBadge.textContent = `กำลังแข่ง ${m.minute}'`;
      statusBadge.style.backgroundColor = 'var(--red-primary)';
    } else if (m.status === 'finished') {
      statusBadge.textContent = 'จบการแข่งขัน (FT)';
      statusBadge.style.backgroundColor = '#272f3d';
    } else {
      statusBadge.textContent = `เวลาแข่งขัน: ${m.time} น.`;
      statusBadge.style.backgroundColor = '#1f2937';
    }

    document.getElementById('modalHomeScore').textContent = m.status === 'upcoming' ? '0' : m.home.score;
    document.getElementById('modalAwayScore').textContent = m.status === 'upcoming' ? '0' : m.away.score;
    document.getElementById('modalHtScore').textContent = m.htScore ? `สกอร์ครึ่งแรก: (${m.htScore})` : (m.midnightNote || 'เวลาประเทศไทย GMT+7');
    document.getElementById('modalBroadcast').textContent = `📺 ถ่ายทอดสด: ${m.broadcast || 'ไม่มีถ่ายทอดสดในไทย'}`;

    // Favorite button inside modal
    const modalFavBtn = document.getElementById('modalFavBtn');
    const isFav = State.favorites.includes(m.id);
    modalFavBtn.classList.toggle('favorited', isFav);
    document.getElementById('modalFavLabel').textContent = isFav ? 'อยู่ในรายการโปรดแล้ว' : 'ติดตามคู่นี้';

    // Populate Tab Contents
    renderModalTimeline(m);
    renderModalStats(m);
    renderModalLineups(m);
    renderModalH2H(m);
    renderModalOdds(m);
    renderModalPreview(m);

    // Show active tab
    switchModalTab(State.activeModalTab);

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeMatchModal() {
    const modal = document.getElementById('matchModal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
    State.activeModalMatchId = null;
  }

  function switchModalTab(tabName) {
    State.activeModalTab = tabName;
    document.querySelectorAll('.modal-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tabName);
    });

    const panels = {
      timeline: 'tabPanelTimeline',
      stats: 'tabPanelStats',
      lineups: 'tabPanelLineups',
      h2h: 'tabPanelH2H',
      odds: 'tabPanelOdds',
      preview: 'tabPanelPreview'
    };

    Object.entries(panels).forEach(([k, panelId]) => {
      const el = document.getElementById(panelId);
      if (el) el.classList.toggle('active', k === tabName);
    });
  }

  function renderModalTimeline(m) {
    const list = document.getElementById('modalTimelineList');
    if (!list) return;

    if (!m.timeline || m.timeline.length === 0) {
      list.innerHTML = `<div class="text-muted text-center py-4">ยังไม่มีเหตุการณ์ในการแข่งขัน (จะเริ่มอัปเดตสดเมื่อเริ่มเตะ)</div>`;
      return;
    }

    list.innerHTML = m.timeline.map(e => {
      let icon = '⚽';
      if (e.type === 'yellow') icon = '🟨';
      if (e.type === 'red') icon = '🟥';
      if (e.type === 'sub') icon = '🔄';

      return `
        <div class="timeline-item">
          <span class="tl-min">${e.min}</span>
          <span class="tl-icon">${icon}</span>
          <div class="tl-desc">
            <strong>${e.player}</strong>
            ${e.assist ? `<span class="text-muted">(แอสซิสต์: ${e.assist})</span>` : ''}
            ${e.detail ? `<span class="text-muted">(${e.detail})</span>` : ''}
          </div>
          ${e.score ? `<span class="tl-score">${e.score}</span>` : ''}
        </div>
      `;
    }).join('');
  }

  function renderModalStats(m) {
    const list = document.getElementById('modalStatsList');
    if (!list) return;

    const statsConfig = [
      { key: 'possession', name: 'การครองบอล (%)', suffix: '%' },
      { key: 'totalShots', name: 'โอกาสยิงทั้งหมด', suffix: '' },
      { key: 'shotsOnTarget', name: 'ยิงตรงกรอบ', suffix: '' },
      { key: 'xg', name: 'ค่าความน่าจะเป็นประตู (xG)', suffix: '' },
      { key: 'corners', name: 'เตะมุม', suffix: '' },
      { key: 'fouls', name: 'ทำฟาวล์', suffix: '' },
      { key: 'offsides', name: 'ล้ำหน้า', suffix: '' },
      { key: 'saves', name: 'การเซฟของประตู', suffix: '' }
    ];

    list.innerHTML = statsConfig.map(s => {
      const val = m.stats[s.key] || [0, 0];
      const hVal = parseFloat(val[0]);
      const aVal = parseFloat(val[1]);
      const total = (hVal + aVal) || 1;
      const hPercent = Math.round((hVal / total) * 100);
      const aPercent = 100 - hPercent;

      return `
        <div class="stat-row">
          <div class="stat-label-row">
            <span class="stat-val-home">${val[0]}${s.suffix}</span>
            <span class="stat-name">${s.name}</span>
            <span class="stat-val-away">${val[1]}${s.suffix}</span>
          </div>
          <div class="stat-bars-container">
            <div class="bar-home" style="width: ${hPercent}%"></div>
            <div class="bar-away" style="width: ${aPercent}%"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderModalLineups(m) {
    const badge = document.getElementById('lineupStatusBadge');
    const formationText = document.getElementById('formationText');
    const homeXi = document.getElementById('homeStartingXi');
    const awayXi = document.getElementById('awayStartingXi');
    const homeSubs = document.getElementById('homeSubs');
    const awaySubs = document.getElementById('awaySubs');

    if (!m.lineups) return;

    if (m.lineups.confirmed) {
      badge.textContent = '✓ ยืนยันรายชื่อทางการแล้ว';
      badge.className = 'badge-verified';
    } else {
      badge.textContent = '⚠️ คาดการณ์รายชื่อ (ยังไม่ยืนยัน)';
      badge.className = 'badge-league';
    }

    formationText.textContent = `${m.home.name} (${m.lineups.homeFormation}) vs ${m.away.name} (${m.lineups.awayFormation})`;
    document.getElementById('lineupHomeTitle').textContent = `11 ตัวจริง ${m.home.name}`;
    document.getElementById('lineupAwayTitle').textContent = `11 ตัวจริง ${m.away.name}`;

    homeXi.innerHTML = m.lineups.homeStarters.map(p => `
      <li class="player-item">
        <span class="p-num">${p.num}</span>
        <span class="p-pos">${p.pos}</span>
        <span>${p.name}</span>
      </li>
    `).join('');

    awayXi.innerHTML = m.lineups.awayStarters.map(p => `
      <li class="player-item">
        <span class="p-num">${p.num}</span>
        <span class="p-pos">${p.pos}</span>
        <span>${p.name}</span>
      </li>
    `).join('');

    homeSubs.innerHTML = m.lineups.homeSubs.map(p => `
      <li class="player-item">
        <span class="p-num">${p.num}</span>
        <span>${p.name}</span>
      </li>
    `).join('');

    awaySubs.innerHTML = m.lineups.awaySubs.map(p => `
      <li class="player-item">
        <span class="p-num">${p.num}</span>
        <span>${p.name}</span>
      </li>
    `).join('');
  }

  function renderModalH2H(m) {
    const summary = document.getElementById('modalH2hSummary');
    const list = document.getElementById('modalH2hList');

    if (!m.h2h) return;

    summary.innerHTML = `
      <div>
        <div class="h2h-stat-num">${m.h2h.homeWins}</div>
        <div class="h2h-stat-text">${m.home.name} ชนะ</div>
      </div>
      <div>
        <div class="h2h-stat-num">${m.h2h.draws}</div>
        <div class="h2h-stat-text">เสมอ</div>
      </div>
      <div>
        <div class="h2h-stat-num">${m.h2h.awayWins}</div>
        <div class="h2h-stat-text">${m.away.name} ชนะ</div>
      </div>
    `;

    list.innerHTML = m.h2h.recent.map(r => `
      <div class="h2h-item">
        <span class="text-muted">${r.date}</span>
        <span><strong>${r.home}</strong> vs <strong>${r.away}</strong></span>
        <span class="badge-league">${r.score}</span>
      </div>
    `).join('');
  }

  function renderModalOdds(m) {
    const container = document.getElementById('modalOddsContent');
    if (!container) return;

    if (!m.odds) {
      container.innerHTML = `<div class="text-muted text-center py-4">ไม่มีข้อมูลราคาบอลสำหรับคู่นี้</div>`;
      return;
    }

    const isHomeFav = m.odds.favored === 'home';
    const isAwayFav = m.odds.favored === 'away';
    const favoredTeamName = isHomeFav ? m.home.name : (isAwayFav ? m.away.name : 'ราคาเสมอ (ไม่มีทีมต่อ)');

    const historyItems = (m.odds.history || []).map((h, idx) => {
      let badge = '';
      if (h.dir === 'up') badge = '<span style="color:#22c55e;font-weight:700">▲ ไหลขึ้น (กระแสเททีมต่อ)</span>';
      else if (h.dir === 'down') badge = '<span style="color:#ef4444;font-weight:700">▼ ไหลลง (กระแสเททีมรอง)</span>';
      else badge = '<span style="color:#94a3b8">ราคาเปิด (คงที่)</span>';

      return `
        <tr>
          <td>ช่วงที่ ${idx + 1}</td>
          <td style="font-weight:800;font-size:0.95rem">${h.val}</td>
          <td>${badge}</td>
        </tr>
      `;
    }).join('');

    container.innerHTML = `
      <div class="odds-market-card">
        <div class="odds-market-title">
          <span>🏆 แฮนดิแคปเอเชีย (Asian Handicap)</span>
          <span class="badge-league" style="color:#ef4444;font-weight:700">ทีมต่อ: ${favoredTeamName}</span>
        </div>
        <table class="odds-table">
          <thead>
            <tr>
              <th>ราคาเปิด</th>
              <th>ราคาปัจจุบัน</th>
              <th>อัตราต่อรอง 1X2</th>
              <th>สูง/ต่ำ (O/U)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>${m.odds.initial || '-'}</strong></td>
              <td style="color:#fbbf24;font-weight:800;font-size:1.1rem">${m.odds.current || '-'}</td>
              <td>1: ${m.odds.odds1x2?.home || '-'} | X: ${m.odds.odds1x2?.draw || '-'} | 2: ${m.odds.odds1x2?.away || '-'}</td>
              <td>${m.odds.overUnder || '2.5'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="odds-market-card">
        <div class="odds-market-title">
          <span>📈 ประวัติราคาไหล (Odds Movement Flow)</span>
        </div>
        <table class="odds-table">
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>ราคาบอล</th>
              <th>ทิศทางกระแส</th>
            </tr>
          </thead>
          <tbody>
            ${historyItems}
          </tbody>
        </table>
      </div>

      <div class="odds-guide-box">
        <strong>💡 คู่มือการอ่านราคาบอล GOAL99 ตามรูปมาตรฐาน:</strong>
        <p>• <strong>ทีมตัวหนังสือสีแดงและมีขีดเส้นใต้:</strong> คือ "ทีมต่อ" (เช่น <code>[158]มอลโดว่า</code> หรือ <code>เยอรมนี[13]</code>)</p>
        <p>• <strong>ตัวเลขในวงเล็บ [ ]:</strong> คืออันดับโลกฟีฟ่า หรืออันดับตารางคะแนนของทีม</p>
        <p>• <strong>ลูกศรสีเขียว ▲:</strong> ราคาไหลขึ้น หมายถึง กระแสความเชื่อมั่นไหลเข้าฝั่งทีมต่อ</p>
        <p>• <strong>ลูกศรสีแดง ▼:</strong> ราคาไหลลง หมายถึง กระแสเทไปฝั่งทีมรอง</p>
        <p>• <strong>ศัพท์ราคาบอลไทย:</strong> เสมอ (0) | 0/0.5 (เสมอควบครึ่ง / ปป.) | 0.5 (ครึ่งลูก) | 0.5/1 (ครึ่งควบลูก) | 1 (หนึ่งลูก) | 1/1.5 (ลูกควบลูกครึ่ง) | 1.5 (ลูกครึ่ง) | 1.5/2 (ลูกครึ่งควบสอง) | 2 (สองลูก)</p>
      </div>
    `;
  }

  function renderModalPreview(m) {
    const container = document.getElementById('modalPreviewContent');
    if (!m.preview) {
      container.innerHTML = `<p class="text-muted">ยังไม่มีบทวิเคราะห์สำหรับคู่นี้</p>`;
      return;
    }

    container.innerHTML = `
      <div class="card-top" style="margin-bottom:8px">
        <div class="author-info">
          <span>✍️ <strong>${m.preview.author}</strong></span>
          <span class="text-muted">(${m.preview.updatedAt})</span>
        </div>
        <span class="badge-verified">ความแม่นยำ: ${m.preview.accuracyRate}</span>
      </div>

      <div class="fact-stat-tag">
        <strong>📌 ข้อมูลสถิติจริง (Fact):</strong> ${m.preview.fact}
      </div>

      <div class="prediction-tag">
        <strong>💡 ทรรศนะและความเห็น (Opinion):</strong> ${m.preview.opinion}
      </div>

      <div style="background-color:#1c222e; padding:10px; border-radius:6px; font-weight:700; text-align:center;">
        สกอร์ที่คาด: <span style="color:#ff8b94; font-size:1.1rem">${m.preview.predictionScore}</span>
      </div>
    `;
  }

  // ==========================================================================
  // 9. STANDINGS VIEW CONTROLLER
  // ==========================================================================
  function renderStandingsView(leagueKey = 'PL') {
    const tbody = document.getElementById('standingsTableBody');
    if (!tbody) return;

    const list = DB.standings[leagueKey] || DB.standings['PL'];

    tbody.innerHTML = list.map(row => {
      let rankClass = '';
      if (row.zone === 'ucl') rankClass = 'rank-ucl';
      if (row.zone === 'uel') rankClass = 'rank-uel';
      if (row.zone === 'rel') rankClass = 'rank-rel';

      const formDots = row.form.map(f => {
        let cls = 'form-w';
        if (f === 'D') cls = 'form-d';
        if (f === 'L') cls = 'form-l';
        return `<span class="form-dot ${cls}">${f}</span>`;
      }).join('');

      return `
        <tr>
          <td class="td-rank ${rankClass}">${row.rank}</td>
          <td class="td-team">
            <span>${row.team}</span>
          </td>
          <td class="td-num">${row.played}</td>
          <td class="td-num">${row.win}</td>
          <td class="td-num">${row.draw}</td>
          <td class="td-num">${row.loss}</td>
          <td class="td-num d-desktop">${row.gf}</td>
          <td class="td-num d-desktop">${row.ga}</td>
          <td class="td-num" style="color: ${row.gd > 0 ? '#10b981' : row.gd < 0 ? '#ef4444' : '#9ca3af'}">${row.gd > 0 ? '+' : ''}${row.gd}</td>
          <td class="td-pts">${row.pts}</td>
          <td class="th-form d-desktop">
            <div class="form-dots">${formDots}</div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // ==========================================================================
  // 10. ANALYSIS CARDS (Transparent Fact vs Opinion, Win-rate tracking)
  // ==========================================================================
  function renderAnalysisCards() {
    const homeGrid = document.getElementById('homeAnalysisGrid');
    const fullGrid = document.getElementById('fullAnalysisGrid');

    const analysisMatches = DB.matches.filter(m => m.preview);

    const cardsHtml = analysisMatches.map(m => `
      <div class="analysis-card" data-match-id="${m.id}" role="button" tabindex="0">
        <div class="card-top">
          <span class="badge-league">${DB.leagues[m.leagueId]?.name || m.leagueId}</span>
          <span class="badge-verified">✓ ตรวจสอบสถิติแล้ว</span>
        </div>
        <h3 class="analysis-title">${m.home.name} vs ${m.away.name}</h3>
        
        <div class="fact-stat-tag">
          <strong>สถิติจริง:</strong> ${m.preview.fact}
        </div>

        <div class="prediction-tag">
          <strong>ทรรศนะ:</strong> ${m.preview.opinion}
        </div>

        <div class="card-footer">
          <div class="author-info">
            <span>✍️ ${m.preview.author}</span>
          </div>
          <span class="win-rate-pill">แม่นยำ ${m.preview.accuracyRate}</span>
        </div>
      </div>
    `).join('');

    if (homeGrid) homeGrid.innerHTML = cardsHtml;
    if (fullGrid) fullGrid.innerHTML = cardsHtml;

    // Attach click to open modal
    document.querySelectorAll('.analysis-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.matchId;
        State.activeModalTab = 'preview';
        openMatchModal(id);
      });
    });
  }

  // ==========================================================================
  // 11. FAVORITES VIEW CONTROLLER
  // ==========================================================================
  function renderFavoritesView() {
    const container = document.getElementById('favoriteMatchesContainer');
    const emptyState = document.getElementById('emptyFavoritesState');
    if (!container) return;

    const favMatches = DB.matches.filter(m => State.favorites.includes(m.id));

    if (favMatches.length === 0) {
      container.innerHTML = '';
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
      let subheadHtml = '';
      if (State.showOddsColumn) {
        subheadHtml = `
          <div class="league-subhead">
            <span class="subhead-time">เวลา</span>
            <span class="subhead-home">เจ้าบ้าน</span>
            <span class="subhead-odds">ราคาบอล</span>
            <span class="subhead-away">ทีมเยือน</span>
            <span class="subhead-score">สกอร์</span>
            <span class="subhead-act"></span>
          </div>
        `;
      }
      container.innerHTML = `
        <div class="league-group">
          <div class="league-header">
            <div class="league-title-box">
              <span class="league-flag">⭐</span>
              <span class="league-name">คู่แข่งขันที่คุณกำลังติดตาม (${favMatches.length} คู่)</span>
            </div>
          </div>
          ${subheadHtml}
          <div class="match-items">
            ${favMatches.map(m => renderMatchRow(m)).join('')}
          </div>
        </div>
      `;
      attachMatchRowListeners(container);
    }
  }

  // ==========================================================================
  // 12. REAL-TIME LIVE SIMULATION ENGINE
  // ==========================================================================
  let simInterval = null;

  function runLiveSimulation() {
    if (!State.simulationRunning) return;

    const liveMatches = DB.matches.filter(m => m.status === 'live');
    if (liveMatches.length === 0) return;

    // Increment minutes
    liveMatches.forEach(m => {
      if (typeof m.minute === 'number') {
        m.minute += 1;
        if (m.minute > 90) {
          m.minute = '90+3';
        }
      }
    });

    // Random goal event simulation (15% chance per tick)
    if (Math.random() < 0.25) {
      const luckyMatch = liveMatches[Math.floor(Math.random() * liveMatches.length)];
      const isHome = Math.random() > 0.5;
      const teamScored = isHome ? luckyMatch.home : luckyMatch.away;
      teamScored.score += 1;

      const newScore = `${luckyMatch.home.score} - ${luckyMatch.away.score}`;
      luckyMatch.timeline.push({
        min: `${luckyMatch.minute}'`,
        type: 'goal',
        team: isHome ? 'home' : 'away',
        player: isHome ? luckyMatch.home.name + ' ยิงเข้า!' : luckyMatch.away.name + ' ยิงเข้า!',
        score: newScore
      });

      // Trigger Alert & Sound
      showToast('⚽ GOAAAL! มีประตูเกิดขึ้น!', `${teamScored.name} ทำประตูขึ้นนำ/ตีไข่แตก! สกอร์ ${newScore}`, true);

      // If this match is open in modal, refresh modal live!
      if (State.activeModalMatchId === luckyMatch.id) {
        document.getElementById('modalHomeScore').textContent = luckyMatch.home.score;
        document.getElementById('modalAwayScore').textContent = luckyMatch.away.score;
        renderModalTimeline(luckyMatch);
      }
    }

    // Refresh UI
    renderMatchList();
    if (State.activePage === 'favorites') {
      renderFavoritesView();
    }
    updateHeaderCounts();

    // Update last sync text
    const now = new Date();
    document.getElementById('lastUpdatedTime').textContent = `อัปเดต: ${now.toLocaleTimeString('th-TH')}`;
  }

  function startSimulation() {
    if (simInterval) clearInterval(simInterval);
    simInterval = setInterval(runLiveSimulation, 9000); // Ticks every 9 seconds
  }

  function stopSimulation() {
    if (simInterval) clearInterval(simInterval);
    simInterval = null;
  }

  // ==========================================================================
  // 13. APP NAVIGATION CONTROLLER (SPA View Switcher)
  // ==========================================================================
  function switchPage(pageName) {
    State.activePage = pageName;

    // Update nav link active states
    document.querySelectorAll('.nav-link, .mob-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.page === pageName);
    });

    // Hide all views
    document.querySelectorAll('.app-view').forEach(view => {
      view.classList.remove('active');
    });

    // Show selected view
    if (pageName === 'live') {
      document.getElementById('viewDashboard').classList.add('active');
      State.selectedStatus = 'live';
      updateFilterButtons();
      renderMatchList();
    } else if (pageName === 'schedule') {
      document.getElementById('viewDashboard').classList.add('active');
      State.selectedStatus = 'all';
      updateFilterButtons();
      renderMatchList();
    } else if (pageName === 'standings') {
      document.getElementById('viewStandings').classList.add('active');
      renderStandingsView(document.getElementById('standingsLeagueSelect')?.value || 'PL');
    } else if (pageName === 'analysis') {
      document.getElementById('viewAnalysis').classList.add('active');
      renderAnalysisCards();
    } else if (pageName === 'favorites') {
      document.getElementById('viewFavorites').classList.add('active');
      renderFavoritesView();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateFilterButtons() {
    document.querySelectorAll('.status-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.status === State.selectedStatus);
    });
  }

  // ==========================================================================
  // 14. EVENT HANDLERS & INITIALIZATION
  // ==========================================================================
  function initEventListeners() {
    // Nav Click handlers
    document.querySelectorAll('[data-page]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const p = el.dataset.page;
        switchPage(p);
      });
    });

    // Date bar click
    document.querySelectorAll('.date-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        State.selectedDateOffset = parseInt(btn.dataset.dateOffset, 10);
        renderMatchList();
      });
    });

    // Status filter buttons
    document.querySelectorAll('.status-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        State.selectedStatus = btn.dataset.status;
        updateFilterButtons();
        renderMatchList();
      });
    });

    // League chip filters
    document.querySelectorAll('.league-chips .chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.league-chips .chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        State.selectedLeague = chip.dataset.league;
        renderMatchList();
      });
    });

    // Search input
    const searchInput = document.getElementById('teamSearchInput');
    const searchClear = document.getElementById('searchClearBtn');

    searchInput.addEventListener('input', (e) => {
      State.searchQuery = e.target.value;
      searchClear.style.display = State.searchQuery ? 'block' : 'none';
      renderMatchList();
    });

    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      State.searchQuery = '';
      searchClear.style.display = 'none';
      renderMatchList();
      searchInput.focus();
    });

    // Quick tag pills
    document.querySelectorAll('.tag-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        searchInput.value = pill.dataset.query;
        State.searchQuery = pill.dataset.query;
        searchClear.style.display = 'block';
        renderMatchList();
      });
    });

    // Reset filters button in empty state
    document.getElementById('btnResetFilters')?.addEventListener('click', () => {
      searchInput.value = '';
      State.searchQuery = '';
      State.selectedStatus = 'all';
      State.selectedLeague = 'all';
      State.selectedDateOffset = 0;
      updateFilterButtons();
      document.querySelectorAll('.date-btn').forEach(b => b.classList.toggle('active', b.dataset.dateOffset === '0'));
      document.querySelectorAll('.league-chips .chip').forEach(c => c.classList.toggle('active', c.dataset.league === 'all'));
      renderMatchList();
    });

    // Toggle Odds Column (เปิด/ปิด ช่องราคาบอล)
    const toggleOddsBtn = document.getElementById('btnToggleOdds');
    if (toggleOddsBtn) {
      toggleOddsBtn.classList.toggle('active', State.showOddsColumn);
      const label = document.getElementById('toggleOddsText');
      if (label) label.textContent = `ราคาบอล: ${State.showOddsColumn ? 'เปิด' : 'ปิด'}`;

      toggleOddsBtn.addEventListener('click', () => {
        State.showOddsColumn = !State.showOddsColumn;
        localStorage.setItem('goal99_show_odds', State.showOddsColumn);
        toggleOddsBtn.classList.toggle('active', State.showOddsColumn);
        if (label) label.textContent = `ราคาบอล: ${State.showOddsColumn ? 'เปิด' : 'ปิด'}`;
        renderMatchList();
        showToast('ช่องราคาบอล', State.showOddsColumn ? 'เปิดการแสดงช่องราคาบอลและราคาไหลแล้ว 💰' : 'ปิดการแสดงช่องราคาบอล');
      });
    }

    // Toggle All Leagues Expand/Collapse
    const toggleLeaguesBtn = document.getElementById('btnToggleAllLeagues');
    let allCollapsed = false;
    toggleLeaguesBtn?.addEventListener('click', () => {
      allCollapsed = !allCollapsed;
      document.querySelectorAll('.league-group').forEach(grp => {
        grp.classList.toggle('collapsed', allCollapsed);
        const lId = grp.dataset.leagueId;
        State.collapsedLeagues[lId] = allCollapsed;
      });
      document.getElementById('toggleLeaguesText').textContent = allCollapsed ? 'ขยายทุกลีก' : 'ย่อทุกลีก';
    });

    // Sound toggle
    const toggleSoundBtn = document.getElementById('toggleSoundBtn');
    toggleSoundBtn?.addEventListener('click', () => {
      State.soundEnabled = !State.soundEnabled;
      localStorage.setItem('goal99_sound', State.soundEnabled);
      document.getElementById('soundIcon').textContent = State.soundEnabled ? '🔔' : '🔕';
      document.getElementById('soundLabel').textContent = `เสียงเตือน: ${State.soundEnabled ? 'เปิด' : 'ปิด'}`;
      if (State.soundEnabled) playGoalChime();
    });

    // Simulation toggle
    const toggleSimBtn = document.getElementById('toggleSimBtn');
    toggleSimBtn?.addEventListener('click', () => {
      State.simulationRunning = !State.simulationRunning;
      document.getElementById('simLabel').textContent = `จำลองแข่งสด: ${State.simulationRunning ? 'ON' : 'OFF'}`;
      if (State.simulationRunning) {
        startSimulation();
        showToast('ระบบจำลองสกอร์สด', 'เปิดการจำลองเหตุการณ์สดอัตโนมัติแล้ว');
      } else {
        stopSimulation();
        showToast('ระบบจำลองสกอร์สด', 'หยุดการจำลองแล้ว');
      }
    });

    // Modal tabs
    document.querySelectorAll('.modal-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        switchModalTab(tab.dataset.tab);
      });
    });

    // Modal close
    document.getElementById('btnCloseModal')?.addEventListener('click', closeMatchModal);
    document.getElementById('matchModal')?.addEventListener('click', (e) => {
      if (e.target.id === 'matchModal') closeMatchModal();
    });

    // Modal favorite button
    document.getElementById('modalFavBtn')?.addEventListener('click', () => {
      if (State.activeModalMatchId) {
        toggleFavorite(State.activeModalMatchId);
        const isFav = State.favorites.includes(State.activeModalMatchId);
        document.getElementById('modalFavBtn').classList.toggle('favorited', isFav);
        document.getElementById('modalFavLabel').textContent = isFav ? 'อยู่ในรายการโปรดแล้ว' : 'ติดตามคู่นี้';
      }
    });

    // Report data error button
    document.getElementById('btnReportData')?.addEventListener('click', () => {
      showToast('ขอบคุณสำหรับการแจ้งข้อมูล', 'ทีมงาน GOAL99 ได้รับรายงานแล้ว และจะตรวจสอบกับผู้ให้บริการข้อมูลโดยด่วน');
    });

    // About modal
    const aboutModal = document.getElementById('aboutModal');
    const openAbout = () => { aboutModal.style.display = 'flex'; };
    const closeAbout = () => { aboutModal.style.display = 'none'; };

    document.getElementById('btnOpenAbout')?.addEventListener('click', openAbout);
    document.getElementById('footerAboutLink')?.addEventListener('click', (e) => { e.preventDefault(); openAbout(); });
    document.getElementById('footerContactLink')?.addEventListener('click', (e) => { e.preventDefault(); openAbout(); });
    document.getElementById('footerTermsLink')?.addEventListener('click', (e) => { e.preventDefault(); openAbout(); });
    document.getElementById('footerReportLink')?.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('แจ้งปัญหา', 'ท่านสามารถแจ้งผ่าน support@goal99.live หรือ LINE: @GOAL99_Official');
    });
    document.getElementById('btnCloseAboutModal')?.addEventListener('click', closeAbout);
    aboutModal?.addEventListener('click', (e) => {
      if (e.target.id === 'aboutModal') closeAbout();
    });

    // Standings select change
    document.getElementById('standingsLeagueSelect')?.addEventListener('change', (e) => {
      renderStandingsView(e.target.value);
    });

    // View All Analysis button
    document.getElementById('btnViewAllAnalysis')?.addEventListener('click', () => {
      switchPage('analysis');
    });

    // Manual Refresh
    document.getElementById('manualRefreshBtn')?.addEventListener('click', () => {
      showToast('ซิงค์ข้อมูล', 'กำลังดึงข้อมูลล่าสุดจาก GOAL99 Data Hub...');
      setTimeout(() => {
        renderMatchList();
        showToast('ซิงค์สำเร็จ', 'ข้อมูลสดใหม่ตรงกับเซิร์ฟเวอร์เรียบร้อย');
      }, 500);
    });

    // Keyboard ESC to close modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMatchModal();
        closeAbout();
      }
    });
  }

  // ==========================================================================
  // 15. INITIALIZE APP
  // ==========================================================================
  function init() {
    setupDateBarDates();
    updateThaiClock();
    setInterval(updateThaiClock, 1000);

    initEventListeners();
    updateHeaderCounts();
    renderMatchList();
    renderAnalysisCards();
    renderStandingsView('PL');

    // Start Real-time Simulation
    startSimulation();

    console.log('%c GOAL99 %c Football Live Score Hub initialized with Dark Gray/Red/White Theme ',
      'background: #e50914; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 3px;',
      'background: #141720; color: #e4e7eb; padding: 2px 6px;'
    );
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
