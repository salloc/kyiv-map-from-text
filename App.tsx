import React, { useState, useCallback } from 'react';
import MapComponent from './components/MapComponent';
import InputPanel from './components/InputPanel';
import { analyzeTextForLocations } from './services/geminiService';
import type { MarkerData, UserLocation } from './types';

// Simple unique ID generator to avoid external dependencies.
const uuidv4 = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

function App() {
    const [text, setText] = useState(
`❗ На Оболоні біля метро о 14:30 роздають листівки.
🌞 Борщагівка чисто.
❗ Також будьте обережні на Лаврській, бачив патруль.
❓ А що на Позняках?
Це повідомлення з @some_channel або t.me/some_link
Повідомлення`
    );
    const [markers, setMarkers] = useState<MarkerData[]>([]);
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyzeText = useCallback(async () => {
        // Step 1: Filter the text based on the rules
        const lines = text.split('\n');
        const discardTokens = ['🌞', '☀️', '❓', 'Відправити прогноз', '@', 't.me/'];

        const filteredLines = lines.filter(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return false; // Remove empty lines
            if (trimmedLine === 'Повідомлення') return false;

            // Must start with ❗ and not contain any discard tokens
            return trimmedLine.startsWith('❗') && !discardTokens.some(token => trimmedLine.includes(token));
        });

        const filteredText = filteredLines.join('\n');

        if (!filteredText.trim()) {
            setError("Не знайдено повідомлень для аналізу. На карту потрапляють тільки рядки, що починаються з '❗' і не містять символів фільтрації (🌞, ❓, посилання).");
            setMarkers([]); // Clear previous markers if any
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setMarkers([]);
        setUserLocation(null); // Clear user location to focus on new markers

        try {
            // Step 2: Analyze only the filtered text
            const locations = await analyzeTextForLocations(filteredText);
            const newMarkers: MarkerData[] = locations.map(loc => ({
                ...loc,
                id: uuidv4(),
            }));
            setMarkers(newMarkers);
            if (newMarkers.length === 0) {
                setError("Не знайдено жодних локацій у відфільтрованому тексті.");
            }
        } catch (e) {
            const err = e as Error;
            setError(err.message || "Сталася невідома помилка.");
        } finally {
            setIsLoading(false);
        }
    }, [text]);

    const handleShowMyLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setError("Геолокація не підтримується вашим браузером.");
            return;
        }
        setIsLoading(true);
        setError(null);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                setIsLoading(false);
            },
            () => {
                setError("Не вдалося отримати ваше місцезнаходження. Перевірте дозволи.");
                setIsLoading(false);
            },
            { enableHighAccuracy: true }
        );
    }, []);

    return (
        <main className="h-screen w-screen flex flex-col-reverse md:flex-row bg-gray-900 antialiased">
            <div className="w-full md:w-1/3 lg:w-1/4 h-2/5 md:h-full overflow-y-auto shadow-2xl z-10">
                <InputPanel
                    text={text}
                    setText={setText}
                    onAnalyze={handleAnalyzeText}
                    onShowLocation={handleShowMyLocation}
                    isLoading={isLoading}
                    error={error}
                />
            </div>
            <div className="w-full h-3/5 md:h-full">
                <MapComponent markers={markers} userLocation={userLocation} />
            </div>
        </main>
    );
}

export default App;