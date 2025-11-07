import React from 'react';

interface InputPanelProps {
    text: string;
    setText: (text: string) => void;
    onAnalyze: () => void;
    onShowLocation: () => void;
    isLoading: boolean;
    error: string | null;
}

const InputPanel: React.FC<InputPanelProps> = ({ text, setText, onAnalyze, onShowLocation, isLoading, error }) => {
    return (
        <div className="bg-gray-800 p-4 pb-8 md:p-4 flex flex-col h-full text-gray-200">
            <h1 className="text-xl md:text-2xl font-bold mb-4 text-center text-white">Київ Карта Патрулів</h1>
            <p className="mb-4 text-sm text-gray-400">Вставте текст повідомлення, щоб знайти локації на карті.</p>
            
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Вставте повідомлення. На карту потраплять тільки рядки, що починаються з ❗&#10;&#10;Приклад:&#10;❗ Оболонь, біля метро - патруль.&#10;🌞 Святошино чисто."
                className="w-full flex-grow p-3 bg-gray-900 border border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 transition-colors mb-4"
            />
            
            {error && <div className="bg-red-900 border border-red-700 text-red-200 p-3 rounded-lg my-2 text-center text-sm">{error}</div>}

            <div className="mt-auto space-y-3">
                <button
                    onClick={onAnalyze}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-blue-500/50"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Аналіз...
                        </>
                    ) : 'Показати на мапі'}
                </button>
                <button
                    onClick={onShowLocation}
                    disabled={isLoading}
                    className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-gray-500/50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Моє місцезнаходження
                </button>
            </div>
        </div>
    );
};

export default InputPanel;