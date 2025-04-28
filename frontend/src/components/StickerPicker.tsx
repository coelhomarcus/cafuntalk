import { IoMdClose } from 'react-icons/io';
import GifPicker, { TenorImage, Theme } from 'gif-picker-react';
import '../styles/GifPicker.css';

interface StickerPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onStickerSelect: (stickerUrl: string) => void;
}

const StickerPicker = ({ isOpen, onClose, onStickerSelect }: StickerPickerProps) => {
    const TENOR_API_KEY = 'AIzaSyAGIN-k-h-VISPSGO2hcuSxyK2_db9Vp48';

    const handleGifClick = (tenorImage: TenorImage) => {
        onStickerSelect(tenorImage.url);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="absolute bottom-full mb-2 left-0 w-[95vw] md:w-[500px] max-h-[450px] bg-bgColor border border-borderColor rounded-lg overflow-hidden shadow-lg z-20">
            <div className="flex justify-between items-center p-3 border-b border-borderColor">
                <h3 className="text-textInput font-medium text-base">GIFs</h3>
                <button
                    onClick={onClose}
                    className="text-textInput hover:text-user transition-colors p-1"
                >
                    <IoMdClose size={22} />
                </button>
            </div>

            <div className="p-3 overflow-y-auto max-h-[380px] scrollbar-thin scrollbar-thumb-borderColor scrollbar-track-bgColor">
                <GifPicker
                    tenorApiKey={TENOR_API_KEY}
                    onGifClick={handleGifClick}
                    width="100%"
                    height={330}
                    theme={Theme.DARK}
                />
            </div>
        </div>
    );
};

export default StickerPicker;