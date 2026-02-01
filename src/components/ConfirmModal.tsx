import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDangerous?: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmModal = ({
    isOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDangerous = false,
    onClose,
    onConfirm
}: ConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <FaTimes size={18} />
                </button>

                <div className="flex flex-col items-center text-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 ${isDangerous ? 'bg-red-100 text-red-500' : 'bg-amber-100 text-amber-500'}`}>
                        <FaExclamationTriangle />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">{title}</h2>
                        <p className="text-slate-500 text-sm leading-relaxed">{message}</p>
                    </div>

                    <div className="flex gap-3 w-full mt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-semibold rounded-lg hover:bg-slate-200 transition-colors text-sm"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`flex-1 py-2.5 text-white font-semibold rounded-lg shadow-md transition-all text-sm ${isDangerous
                                    ? 'bg-red-500 hover:bg-red-600 hover:shadow-red-500/30'
                                    : 'bg-primary hover:bg-primary-focus'
                                }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
