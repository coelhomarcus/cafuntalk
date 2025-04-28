import { useMemo } from 'react';
import { IoMdClose } from 'react-icons/io';

interface StickerPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onStickerSelect: (stickerUrl: string) => void;
}

const StickerPicker = ({ isOpen, onClose, onStickerSelect }: StickerPickerProps) => {
    // Coleção de stickers/gifs - todos em uma única lista
    const allStickers = useMemo(() => [
        // Populares e recentes
        "https://media1.tenor.com/m/okxvhyfjFiIAAAAd/hi-babybeans.gif",
        "https://media1.tenor.com/m/aCZk1Smf0ekAAAAd/hello-chat-grand-blue.gif",
        "https://media1.tenor.com/m/itoZJd9WL_4AAAAd/epico.gif",
        "https://media1.tenor.com/m/Gl8Km8aoBT0AAAAd/monkey-looking-sus-sus-monkey.gif",
        "https://media.tenor.com/Q8KG0-6aTU0AAAAM/house-md-dr-house.gif",
    ], []);

    const handleStickerSelect = (url: string) => {
        // Enviar a figurinha diretamente
        onStickerSelect(url);
    };

    if (!isOpen) return null;

    return (
        <div className="absolute bottom-full mb-2 left-0 w-[95vw] md:w-[500px] max-h-[450px] bg-bgColor border border-borderColor rounded-lg overflow-hidden shadow-lg z-20">
            <div className="flex justify-between items-center p-3 border-b border-borderColor">
                <h3 className="text-textInput font-medium text-base">Figurinhas</h3>
                <button
                    onClick={onClose}
                    className="text-textInput hover:text-user transition-colors p-1"
                >
                    <IoMdClose size={22} />
                </button>
            </div>

            {/* Grid de figurinhas */}
            <div className="p-3 overflow-y-auto max-h-[380px] scrollbar-thin scrollbar-thumb-borderColor scrollbar-track-bgColor">
                <div className="grid grid-cols-3 gap-3">
                    {allStickers.map((sticker, index) => (
                        <div
                            key={index}
                            onClick={() => handleStickerSelect(sticker)}
                            className="aspect-square overflow-hidden rounded-md border border-borderColor hover:border-user cursor-pointer transition-all bg-bgColor hover:bg-inputBG flex items-center justify-center"
                        >
                            <img
                                src={sticker}
                                alt="Sticker"
                                className="max-w-full max-h-full object-contain p-1"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StickerPicker;