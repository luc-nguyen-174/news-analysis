import html2canvas from 'html2canvas';

/**
 * Export the dashboard as a PNG image.
 * @param {object} allData - The full data object (to check if data exists)
 * @param {Function} showToast - Toast notification function
 */
export async function exportAsImage(allData, showToast) {
  if (!allData.fetchedAt) {
    showToast('No data to export. Collect data first.');
    return;
  }
  try {
    const appEl = document.querySelector('.app-container');
    const canvas = await html2canvas(appEl, {
      backgroundColor: '#0a0a0f',
      scale: 2,
      useCORS: true,
      logging: false,
    });
    const a = document.createElement('a');
    a.download = `marketpulse-${new Date().toISOString().slice(0, 10)}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  } catch (e) {
    showToast('Export failed: ' + e.message);
  }
}

/**
 * Export the data as a JSON file.
 * @param {object} allData - The full data object
 * @param {Function} showToast - Toast notification function
 */
export function exportAsJSON(allData, showToast) {
  if (!allData.fetchedAt) {
    showToast('No data to export. Collect data first.');
    return;
  }
  const a = document.createElement('a');
  a.download = `marketpulse-${new Date().toISOString().slice(0, 10)}.json`;
  a.href = URL.createObjectURL(
    new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' })
  );
  a.click();
}
