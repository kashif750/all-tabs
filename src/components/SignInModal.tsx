import { useState } from "react";
import { FaTimes, FaUser, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router";
import toast from "react-hot-toast";
import {jwtDecode, JwtPayload} from 'jwt-decode';

interface SignInModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: () => void;
}

import { authService } from "../services/auth.service";
import { useAuthStore, UserType } from "../store/useAuthStore";
import { isAxiosError } from "axios";

type FormDataTypes={
    username: string;
    password: string;
}
type FormDataErrorTypes={
    [Key in keyof FormDataTypes]?:string;
}
type FormDataTouchedTypes={
    [Key in keyof FormDataTypes]?:boolean;
}
interface TokenTypes extends JwtPayload{
    username: string;
    first_name: string;
    last_name: string;
}
const SignInModal = ({ isOpen, onClose, onLoginSuccess }: SignInModalProps) => {
    // console.log("--------------- SignInModal ----------------");
    const [formData, setFormData] = useState<FormDataTypes>({
        username: "",
        password: "",
    });
    const [formDataErrors, setFormDataErrors] = useState<FormDataErrorTypes>({
        username: "",
        password: "",
    });
    const [formDataTouched, setFormDataTouched] = useState<FormDataTouchedTypes>({
        username: false,
        password: false,
    });
    // console.log("formData :: ", formData);
    // console.log("formDataErrors :: ", formDataErrors);
    // console.log("formDataTouched :: ", formDataTouched);

    const validate = (key: keyof FormDataTypes, value: string)=>{
        value = value?.trim();
        if(key==="username"){
            if(!value){
                return "Username is required";
            }else{
                return "";
            }
        }else if(key==="password"){
            if(!value){
                return "Password is required";
            }else{
                return "";
            }
        }
    }
    const [showPassword, setShowPassword] = useState(false);
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // if (!formData.username.trim() || !formData.password.trim()) {
        //     toast.error("Please enter username and password");
        //     return;
        // }
        let _errors:FormDataErrorTypes = {};
        let _touched:FormDataTouchedTypes = {};
        for(const [key,value] of Object.entries(formData)){
            const _error = validate(key as keyof FormDataTypes,value);
            _errors={..._errors, [key]: _error};
            _touched={..._touched, [key]: true};
        }
        // console.log("handleSubmit:: _errors:: ", _errors);
        // console.log("handleSubmit:: _touched:: ", _touched);
        if(Object.values(_errors).filter((itm)=>itm).length>0){
            setFormDataErrors(_errors);
            setFormDataTouched(_touched);
            return;
        }

        try {
            const response = await authService.signin({username: formData.username.trim(), password: formData.password.trim()});
            const decodedToken= jwtDecode<TokenTypes>(response.access_token);
            // console.log("decodedToken:: ", decodedToken);
            const user:UserType = {
                id: parseInt(decodedToken?.sub || "0"), 
                username: decodedToken?.username,
                first_name: decodedToken?.first_name,
                last_name: decodedToken?.last_name
            };
            setAuth(user, response.access_token);
            toast.success("Successfully logged in!");
            onLoginSuccess();
            onClose();
        } catch (error) {
            if(isAxiosError(error)){
                toast.error(error?.response?.data?.message || error?.message);
            }else{
                toast.error("Invalid credentials");
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                    <FaTimes size={18} />
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Welcome Back!</h2>
                    <p className="text-slate-500 text-sm mt-1">Please sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-600 ml-1">Username</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <FaUser size={12} />
                            </span>
                            <input
                                type="text"
                                placeholder="Enter your username"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-slate-400 text-sm"
                                value={formData.username}
                                id="username"
                                onChange={(e) => {
                                    const _value = e.target.value;
                                    const _key = e.target.id;
                                    setFormData({ ...formData, [_key]: _value });
                                    const _error = validate(_value as keyof FormDataTypes, _key);
                                    setFormDataErrors((prev)=>({...prev, [_key]: _error}));
                                    setFormDataTouched((prev)=>({...prev, [_key]: true}));
                                }}
                            />
                            {(formDataTouched?.username && formDataErrors?.username) && <p className="text-xs font-semibold text-red-500">{formDataErrors.username}</p>}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-600 ml-1">Password</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <FaLock size={12} />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-slate-400 text-sm"
                                value={formData.password}
                                id="password"
                                onChange={(e) => {
                                    const _value = e.target.value;
                                    const _key = e.target.id;
                                    setFormData({ ...formData, [_key]: _value });
                                    const _error = validate(_value as keyof FormDataTypes, _key);
                                    setFormDataErrors((prev)=>({...prev, [_key]: _error}));
                                    setFormDataTouched((prev)=>({...prev, [_key]: true}));
                                }}
                            />
                            {(formDataTouched?.password && formDataErrors?.password) && <p className="text-xs font-semibold text-red-500">{formDataErrors.password}</p>}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                            </button>
                        </div>
                    </div>

                    {/* <div className="flex justify-end">
                        <Link
                            to="/forgot-password"
                            className="text-xs text-primary-content hover:text-accent font-medium transition-colors hover:underline"
                            onClick={onClose}
                        >
                            Forgot Password?
                        </Link>
                    </div> */}

                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-primary-content to-accent text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <FaSignInAlt /> Sign In
                    </button>
                </form>

                <div className="mt-6 text-center pt-4 border-t border-slate-100">
                    <span className="text-slate-500 text-sm">Don't have an account? </span>
                    <Link
                        to="/signup"
                        className="text-primary-content font-bold hover:text-accent transition-colors text-sm hover:underline"
                        onClick={onClose}
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignInModal;
