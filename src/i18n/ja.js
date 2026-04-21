export default {
  // Header
  appName: 'MarketPulse',
  subtitle: 'グローバル金融インテリジェンス',

  // Controls
  collectData: 'データ取得',
  todaySnapshot: '本日のスナップショット',
  weeklyOverview: '週間概要',
  autoRefresh: '自動更新',
  exportPNG: 'PNG出力',
  exportJSON: 'JSON出力',

  // Timestamp
  lastUpdated: '最終更新',

  // Card titles
  stockIndices: '株価指数',
  forexRates: '為替レート',
  cryptoMarket: '暗号資産市場',
  fearGreedIndex: '恐怖・貪欲指数',
  goldMarket: '金市場',
  oilMarket: '原油市場',
  btcSparkline: 'BTC 7日間チャート',

  // Card badges
  badgeLive: 'ライブ',
  badgeFx: 'FX',
  badgeTop10: 'TOP 10',
  badgeSentiment: '心理指標',
  badgeXau: 'XAU',
  badgeCrude: '原油',
  badgeChart: 'チャート',

  // Stock card
  colIndex: '指数',
  colPrice: '価格',
  col24h: '24時間',
  col7d: '7日間',

  // Forex card
  colPair: '通貨ペア',
  colRate: 'レート',
  colChange: '変動',

  // Crypto card
  colCoin: 'コイン',
  colMarketCap: '時価総額',
  totalMarketCap: '市場全体の時価総額',
  btcDominance: 'BTC占有率',

  // Fear & Greed
  fngExtremeFear: '極度の恐怖',
  fngFear: '恐怖',
  fngNeutral: '中立',
  fngGreed: '貪欲',
  fngExtremeGreed: '極度の貪欲',
  fngPrev: '前回',
  fngScale: '恐怖',
  fngScaleGreed: '貪欲',

  // Gold
  xauPerOz: 'XAU/USD トロイオンスあたり',
  change24h: '24時間変動',
  change7d: '7日間変動',
  prevClose: '前日終値',
  goldVnd: 'ベトナムドン建て金価格（1テール推定）',
  source: 'データソース',

  // Oil
  colType: '種類',

  // BTC Chart
  btc7dChange: '7日',

  // Empty states
  emptyStocks: '「データ取得」をクリックして市場データを取得',
  emptyForex: '「データ取得」をクリックしてレートを取得',
  emptyCrypto: '「データ取得」をクリックして暗号資産データを取得',
  emptyFearGreed: '「データ取得」をクリックしてセンチメントを取得',
  emptyGold: '「データ取得」をクリックして金価格を取得',
  emptyOil: '「データ取得」をクリックして原油価格を取得',
  emptyBtcChart: '「データ取得」をクリックしてチャートを読み込む',
  failedStocks: '株価データの読み込みに失敗しました',
  failedForex: '為替データの読み込みに失敗しました',
  failedCrypto: '暗号資産データの読み込みに失敗しました',
  failedFearGreed: 'センチメントデータの読み込みに失敗しました',
  failedGold: '金価格データの読み込みに失敗しました',
  failedOil: '原油データの読み込みに失敗しました',
  failedBtcChart: 'チャートデータの読み込みに失敗しました',

  // Analysis section
  marketAnalysis: '市場分析',
  analysisSubtitle: '現在の市場シグナルに基づくデータ主導の見通し',
  analysisBadge: '分析',
  shortTermOutlook: '短期見通し（1〜7日）',
  longTermOutlook: '長期見通し（1〜6ヶ月）',
  crossMarketSignals: '🔗 クロスマーケットシグナル',
  analysisDisclaimer: '⚠️ この分析はアルゴリズムに基づいており、公開データを使用しています。投資助言ではありません。投資判断はご自身の責任で行ってください。',
  emptyAnalysis: '「データ取得」をクリックして市場分析を生成',
  gaugeLabel: { bearish: '弱気', neutral: '中立', bullish: '強気' },

  // Analysis signals
  signalStrongBull: '強い強気',
  signalBull: '強気',
  signalNeutral: '中立',
  signalBear: '弱気',
  signalStrongBear: '強い弱気',

  // Analysis outlooks
  outlookRiskOnRally: 'リスクオン・ラリー',
  outlookRiskOnDesc: '市場全体で強い強気モメンタム。短期トレンドは継続する可能性が高い。買われすぎに注意。',
  outlookCautiousBull: '慎重な強気',
  outlookCautiousBullDesc: '一部の逆風を伴うポジティブなモメンタム。リスク管理を徹底しつつ株式と暗号資産を推奨。',
  outlookRangeBound: 'レンジ相場・混合',
  outlookRangeBoundDesc: '明確な方向性なし。横ばいが続く可能性あり。大きなポジションを取る前に明確なシグナルを待つ。',
  outlookCautiousBear: '慎重な弱気',
  outlookCautiousBearDesc: '弱気モメンタムが形成中。ディフェンシブなポジションを検討。リスクエクスポージャーを削減し、現金比率を増加。',
  outlookRiskOff: 'リスクオフ・ディフェンシブ',
  outlookRiskOffDesc: '強い弱気シグナル。資本保全を最優先。ゴールド、債券、ステーブルコインなどの安全資産を検討。',

  // News section
  marketIntelFeed: 'マーケットインテリジェンス',
  newsSubtitle: '将来の価格に影響を与える可能性のあるニュースとシグナル',
  newsBadgeLive: 'ライブ',
  newsBadgeAI: 'AI分析',
  newsBadgeNews: 'ニュース',
  newsEmpty: '「データ取得」をクリックしてニュースを取得',
  newsNoArticles: 'このカテゴリの最近のニュースが見つかりません',
  newsFooter: 'ソース：Google News、Reddit • 自動集約。投資助言ではありません',

  // Footer
  footerDataFrom: 'MarketPulse Dashboard — データソース',
  footerDisclaimer: 'すべてのデータは遅延があり、情報提供のみを目的としています。投資助言ではありません。',

  // Language selector
  language: '言語',
};
