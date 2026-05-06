import puppeteer from "puppeteer";
import { connectionRepository } from "../repositories/connection.repository";
import { stationRepository } from "../repositories/station.repository";

interface Stop {
  name: string;
  hours: string[];
}

function addMinutesToTime(time: string, minutesToAdd: number): string {
  const [hours, minutes] = time.split(':').map(Number);

  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes + minutesToAdd);

  const finalHours = date.getHours();
  const finalMinutes = date.getMinutes();

  const pad = (n: number) => n.toString().padStart(2, '0');

  return `${pad(finalHours)}:${pad(finalMinutes)}`;
}

export class ScheduleService {
  private generateHtml(stationName: string, stops: Stop[]): string {
    const now = new Date().toLocaleString('pl-PL', { 
        dateStyle: 'long', 
        timeStyle: 'short' 
    });

    const routesHtml = stops.map(stop => `
    <div class="route-block">
        <div class="route-block-header">
            <span>${stop.name}</span>
        </div>
        <div class="route-body">
            <div class="hours-grid">
                ${stop.hours.map(hour => `<div class="hour-chip">${hour}</div>`).join('')}
            </div>
        </div>
    </div>
    `).join('');

    return `
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Mono:wght@400;500&family=Lato:wght@300;400;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'Lato', sans-serif;
            background: #f7f3ec;
            color: #1c1c1c;
            padding: 2.5rem 2rem;
        }

        .doc-header {
            background: #1a2744;
            border-bottom: 4px solid #c9a84c;
            padding: 1.5rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 2rem;
            border-radius: 6px 6px 0 0;
            -webkit-print-color-adjust: exact;
        }

        .doc-header-left h1 {
            font-family: 'Playfair Display', serif;
            font-size: 1.5rem;
            color: #e8c96a;
            letter-spacing: 0.5px;
            line-height: 1.2;
        }

        .doc-header-left p {
            font-size: 0.75rem;
            color: rgba(232,201,106,0.55);
            letter-spacing: 3px;
            text-transform: uppercase;
            margin-top: 0.3rem;
            font-weight: 300;
        }

        .doc-header-right {
            text-align: right;
            color: rgba(232,201,106,0.6);
            font-size: 0.72rem;
            letter-spacing: 1px;
            text-transform: uppercase;
            line-height: 1.8;
        }

        .station-title {
            text-align: center;
            margin-bottom: 2rem;
            padding-bottom: 1.25rem;
            border-bottom: 1px solid rgba(201,168,76,0.3);
        }

        .station-title h2 {
            font-family: 'Playfair Display', serif;
            font-size: 2rem;
            color: #1a2744;
            letter-spacing: 0.5px;
        }

        .station-title p {
            font-size: 0.72rem;
            color: #888;
            letter-spacing: 2.5px;
            text-transform: uppercase;
            margin-top: 0.35rem;
        }

        .route-block {
            background: #fff;
            border: 1.5px solid rgba(201,168,76,0.35);
            border-radius: 6px;
            margin-bottom: 1.25rem;
            overflow: hidden;
            page-break-inside: avoid;
        }

        .route-block-header {
            background: #1a2744;
            padding: 0.65rem 1.25rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            border-bottom: 2px solid #c9a84c;
            -webkit-print-color-adjust: exact;
        }

        .route-block-header span {
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #e8c96a;
        }

        .route-body {
            padding: 1rem 1.25rem;
        }

        .hours-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .hour-chip {
            font-family: 'DM Mono', monospace;
            font-size: 1rem;
            font-weight: 500;
            color: #1a2744;
            background: #f7f3ec;
            border: 1.5px solid rgba(201,168,76,0.4);
            border-radius: 4px;
            padding: 0.35rem 0.75rem;
            letter-spacing: 1px;
            -webkit-print-color-adjust: exact;
        }

        .doc-footer {
            margin-top: 2.5rem;
            padding-top: 1rem;
            border-top: 1px solid rgba(201,168,76,0.3);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.7rem;
            color: #aaa;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .doc-footer strong {
            color: #c9a84c;
            font-family: 'DM Mono', monospace;
            font-size: 0.65rem;
        }

        @media print {
            body { padding: 1rem; background: #fff; }
        }
    </style>
</head>
<body>
    <div class="doc-header">
        <div class="doc-header-left">
            <h1>Rozkład Jazdy</h1>
            <p>Koleje Polskie · Rozkład Obowiązujący</p>
        </div>
        <div class="doc-header-right">
            <div>Data wydruku: ${now}</div>
            <div>Stacja: ${stationName}</div>
        </div>
    </div>

    <div class="station-title">
        <h2>${stationName}</h2>
        <p>Wszystkie połączenia · Odjazdy</p>
    </div>

    <div class="routes-container">
        ${routesHtml}
    </div>

    <div class="doc-footer">
        <span>Koleje Polskie S.A.</span>
        <span>Wygenerowano automatycznie · <strong>${now}</strong></span>
    </div>
</body>
</html>`;
  }

  async getSchedule(targetId: string): Promise<Buffer> {
    const allConnections = await connectionRepository.getAll();

    const filtered = allConnections.filter((conn) => {
      const isStart = conn.start._id.toString() === targetId;
      const isStop = conn.stops.some(s => s.station._id.toString() === targetId);
      return isStart || isStop;
    });

    let stops: Stop[] = [];

    filtered.forEach((conn) => {
      let currentTimes = [...conn.departureTimes];
      
      const destinationName = (conn.stops[conn.stops.length - 1].station as any).name;
      const fullName = `TRASA: OD ${(conn.start as any).name} DO ${destinationName}`;

      if (conn.start._id.toString() === targetId) {
        stops.push({
          name: fullName,
          hours: currentTimes
        });
      } 
      else {
        for (const stop of conn.stops) {
          currentTimes = currentTimes.map(t => addMinutesToTime(t, stop.travelTime));

          if (stop.station._id.toString() === targetId) {
            stops.push({
              name: fullName,
              hours: currentTimes
            });
            break;
          }
        }
      }
    });

    stops.forEach(s => {
      s.hours.sort((a, b) => a.localeCompare(b));
    });

    let getStation = await stationRepository.getById(targetId);
    let stationName = getStation?.name;
    const html = this.generateHtml(stationName as string, stops);

    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox']
    });
    
    const page = await browser.newPage();
    
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });

    await browser.close();
    return Buffer.from(pdfBuffer);
  }
}

export const scheduleService = new ScheduleService();