import { useState, useCallback, useRef, useEffect } from 'react';
import Header from './components/Header';
import ControlsBar from './components/ControlsBar';
import Timestamp from './components/Timestamp';
import Footer from './components/Footer';
import Toast from './components/Toast';
import NewsSection from './components/NewsSection';
import AnalysisSection from './components/AnalysisSection';
import StocksCard from './components/cards/StocksCard';
import ForexCard from './components/cards/ForexCard';
import CryptoCard from './components/cards/CryptoCard';
import FearGreedCard from './components/cards/FearGreedCard';
import GoldCard from './components/cards/GoldCard';
import OilCard from './components/cards/OilCard';
import BTCChartCard from './components/cards/BTCChartCard';
import { useToast } from './hooks/useToast';
import { exportAsImage, exportAsJSON } from './utils/export';
import {
  fetchStocks,
  fetchForex,
  fetchCrypto,
  fetchCryptoGlobal,
  fetchFearGreed,
  fetchGold,
  fetchOil,
  fetchBTCSparkline,
} from './api/marketApi';
import { fetchAllNews } from './api/newsApi';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState('daily');
  const [autoRefreshOn, setAutoRefreshOn] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [allData, setAllData] = useState({
    stocks: undefined,
    forex: undefined,
    crypto: undefined,
    cryptoGlobal: undefined,
    fng: undefined,
    gold: undefined,
    oil: undefined,
    btcSparkline: undefined,
    news: undefined,
  });

  const { toasts, showToast } = useToast();
  const autoRefreshRef = useRef(null);

  // Auto-refresh management
  useEffect(() => {
    if (autoRefreshOn) {
      autoRefreshRef.current = setInterval(collectAllData, 5 * 60 * 1000);
    } else {
      if (autoRefreshRef.current) {
        clearInterval(autoRefreshRef.current);
        autoRefreshRef.current = null;
      }
    }
    return () => {
      if (autoRefreshRef.current) clearInterval(autoRefreshRef.current);
    };
  }, [autoRefreshOn]);

  const collectAllData = useCallback(async () => {
    setLoading(true);

    const results = await Promise.allSettled([
      fetchStocks(showToast),
      fetchForex(showToast),
      fetchCrypto(showToast),
      fetchCryptoGlobal(showToast),
      fetchFearGreed(showToast),
      fetchGold(showToast),
      fetchOil(showToast),
      fetchBTCSparkline(showToast),
      fetchAllNews(showToast),
    ]);

    const [stocks, forex, crypto, cryptoGlobal, fng, gold, oil, btcSparkline, news] = results;

    const newData = {
      stocks: stocks.status === 'fulfilled' ? stocks.value : null,
      forex: forex.status === 'fulfilled' ? forex.value : null,
      crypto: crypto.status === 'fulfilled' ? crypto.value : null,
      cryptoGlobal: cryptoGlobal.status === 'fulfilled' ? cryptoGlobal.value : null,
      fng: fng.status === 'fulfilled' ? fng.value : null,
      gold: gold.status === 'fulfilled' ? gold.value : null,
      oil: oil.status === 'fulfilled' ? oil.value : null,
      btcSparkline: btcSparkline.status === 'fulfilled' ? btcSparkline.value : null,
      news: news.status === 'fulfilled' ? news.value : null,
      fetchedAt: new Date().toISOString(),
    };

    setAllData(newData);

    const now = new Date();
    setLastUpdated(
      now.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
    );

    setLoading(false);
  }, [showToast]);

  const handleExportPNG = useCallback(() => {
    exportAsImage(allData, showToast);
  }, [allData, showToast]);

  const handleExportJSON = useCallback(() => {
    exportAsJSON(allData, showToast);
  }, [allData, showToast]);

  return (
    <>
      <div className="app-container" id="app">
        <Header />

        <ControlsBar
          loading={loading}
          currentView={currentView}
          autoRefreshOn={autoRefreshOn}
          onCollect={collectAllData}
          onSetView={setCurrentView}
          onToggleAutoRefresh={() => setAutoRefreshOn((prev) => !prev)}
          onExportPNG={handleExportPNG}
          onExportJSON={handleExportJSON}
        />

        <Timestamp lastUpdated={lastUpdated} />

        <div className="dashboard-grid" id="dashboardGrid">
          <StocksCard
            data={allData.stocks}
            loading={loading}
            currentView={currentView}
          />
          <ForexCard
            data={allData.forex}
            loading={loading}
            currentView={currentView}
          />
          <CryptoCard
            data={allData.crypto}
            globalData={allData.cryptoGlobal}
            loading={loading}
            currentView={currentView}
          />
          <FearGreedCard data={allData.fng} loading={loading} />
          <GoldCard
            data={allData.gold}
            loading={loading}
            currentView={currentView}
          />
          <OilCard
            data={allData.oil}
            loading={loading}
            currentView={currentView}
          />
          <BTCChartCard sparkline={allData.btcSparkline} loading={loading} />
        </div>

        <AnalysisSection allData={allData} loading={loading} />

        <NewsSection newsData={allData.news} loading={loading} />

        <Footer />
      </div>

      <Toast toasts={toasts} />
    </>
  );
}
