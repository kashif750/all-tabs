import { isAxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeft, FaLock, FaUser, FaUserPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { authService } from "../services/auth.service";

type FormDataTypes={
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}
type FormDataTouchedTypes={
    [Key in keyof FormDataTypes]?:boolean;
}
type FormDataErrorTypes={
    [Key in keyof FormDataTypes]?:string;
}

const SignUp = () => {
    // console.log("---------------- SignUp --------------------");
    const navigate = useNavigate();
    const EmailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const [formData, setFormData] = useState<FormDataTypes>({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [formDataTouched, setFormDataTouched]=useState<FormDataTouchedTypes>({
        firstName:false,
        lastName:false,
        username:false,
        email:false,
        password:false,
        confirmPassword:false
    });
    const [formDataErrors, setFormDataErrors]=useState<FormDataErrorTypes>({
        firstName:"",
        lastName:"",
        username:"",
        email:"",
        password:"",
        confirmPassword:""
    });
    // console.log("formData:: ", formData);
    // console.log("formDataTouched:: ", formDataTouched);
    // console.log("formDataErrors:: ", formDataErrors);

    const validate=(key:keyof FormDataTypes, value:string)=>{
        value= value?.trim();
        if(key==="firstName"){
            if(!value){
                return "First name is required";
            }else if(value?.length>0 && value?.length<2){
                return "Minimum 2 characters required";
            }else if(value?.length>40){
                return "Maximum 40 characters allowed";
            }else{
                return "";
            }
        }else if(key==="lastName"){
            if(!value){
                return "Last name is required";
            }else if(value?.length>0 && value?.length<2){
                return "Minimum 2 characters required";
            }else if(value?.length>40){
                return "Maximum 40 characters allowed";
            }else{
                return "";
            }
        }else if(key==="username"){
            if(!value){
                return "Username is required";
            }else if(value?.length>0 && value?.length<2){
                return "Minimum 2 characters required";
            }else if(value?.length>50){
                return "Maximum 50 characters allowed";
            }else{
                return "";
            }
        }else if(key==="email"){
            if(!value){
                return "Email is required";
            }else if(!EmailPattern.test(value)){
                return "Invalid email";
            }else{
                return "";
            }
        }else if(key==="password"){
            if(!value){
                return "Password is required";
            }else if(value?.length>0 && value?.length<2){
                return "Minimum 2 characters required";
            }else if(value?.length>10){
                return "Maximum 10 characters allowed";
            }else{
                return "";
            }
        }else if(key==="confirmPassword"){
            if(!value){
                return "Password is required";
            }else if(value?.length>0 && value?.length<2){
                return "Minimum 2 characters required";
            }else if(value?.length>10){
                return "Maximum 10 characters allowed";
            }else{
                return "";
            }
        }
        return "";
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let _errors:FormDataErrorTypes = {};
        let _touched:FormDataTouchedTypes = {};
        if (formData.password !== formData.confirmPassword) {
            _errors={
                password: 'Password do not match',
                confirmPassword: 'Password do not match',
            }
            _touched={
                password: true,
                confirmPassword: true,
            }
        }
        for(const [key,value] of Object.entries(formData)){
            // console.log("key:: ", key);
            // console.log('value:: ', value);
            const _error = validate(key as keyof FormDataTypes,value);
            if(_error){
                _errors={..._errors, [key]: _error}
                _touched={..._touched, [key]: true}
            }
        }
        // console.log("_errors;: ", _errors);
        // console.log("_touched;: ", _touched);
        if(Object.values(_errors)?.filter((itm)=>itm)?.length>0){
            setFormDataErrors((prev)=>({...prev, ..._errors}));
            setFormDataTouched((prev)=>({...prev, ..._touched}));
            return;
        }

        try {
            // Mapping frontend keys to backend expectations (snake_case)
            const payload = {
                first_name: formData.firstName,
                last_name: formData.lastName,
                username: formData.username,
                email: formData.email,
                password: formData.password,
            };
            // Assuming authService is imported
            await authService.signup(payload);
            toast.success("Account created successfully!.");
            setTimeout(() => {
                navigate("/");
            }, 1500);
        } catch (error) {
            if(isAxiosError(error)){
                const message = error.response?.data?.message || "Registration failed";
                toast.error(typeof message === 'object' ? JSON.stringify(message) : message);
            }else{
                toast.error(JSON.stringify(error) || 'Something went wrong');
            }
        }
    };

    return (
        <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 animate-in fade-in zoom-in duration-300">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/20 text-primary-content rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                        <FaUserPlus />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Create Account</h1>
                    <p className="text-slate-500 text-sm">Join us today! It takes less than a minute.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600 ml-1">First Name*</label>
                            <input
                                type="text"
                                placeholder="Enter First Name"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                value={formData.firstName}
                                maxLength={40}
                                id="firstName"
                                onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
                                    const _value = e.target.value;
                                    const _id = e.target.id;
                                    setFormData({ ...formData, [_id]:_value });
                                    const _error:string = validate(_id as keyof FormDataTypes,_value);
                                    setFormDataErrors((prev)=>({...prev, [_id]: _error}));
                                    setFormDataTouched((prev)=>({...prev, [_id]: true}));
                                }}
                            />
                            {(formDataTouched?.firstName && formDataErrors?.firstName) && <p className="text-xs text-red-500 font-semibold">{formDataErrors.firstName}</p>}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600 ml-1">Last Name*</label>
                            <input
                                type="text"
                                placeholder="Enter Last Name"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                value={formData.lastName}
                                maxLength={40}
                                id="lastName"
                                onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
                                    const _value = e.target.value;
                                    const _id = e.target.id;
                                    setFormData({ ...formData, [_id]:_value });
                                    const _error:string = validate(_id as keyof FormDataTypes,_value);
                                    setFormDataErrors((prev)=>({...prev, [_id]: _error}));
                                    setFormDataTouched((prev)=>({...prev, [_id]: true}));
                                }}
                            />
                            {(formDataTouched?.lastName && formDataErrors?.lastName) && <p className="text-xs text-red-500 font-semibold">{formDataErrors.lastName}</p>}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600 ml-1">Email*</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <FaUser size={12} />
                            </span>
                            <input
                                type="email"
                                placeholder="Enter Email"
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                value={formData.email}
                                id="email"
                                onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
                                    const _value = e.target.value;
                                    const _id = e.target.id;
                                    setFormData({ ...formData, [_id]:_value });
                                    const _error:string = validate(_id as keyof FormDataTypes,_value);
                                    setFormDataErrors((prev)=>({...prev, [_id]: _error}));
                                    setFormDataTouched((prev)=>({...prev, [_id]: true}));
                                }}
                            />
                            {(formDataTouched?.email && formDataErrors?.email) && <p className="text-xs text-red-500 font-semibold">{formDataErrors.email}</p>}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600 ml-1">Username*</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <FaUser size={12} />
                            </span>
                            <input
                                type="text"
                                placeholder="Enter Username"
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                value={formData.username}
                                maxLength={50}
                                id="username"
                                onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
                                    const _value = e.target.value;
                                    const _id = e.target.id;
                                    setFormData({ ...formData, [_id]:_value });
                                    const _error:string = validate(_id as keyof FormDataTypes,_value);
                                    setFormDataErrors((prev)=>({...prev, [_id]: _error}));
                                    setFormDataTouched((prev)=>({...prev, [_id]: true}));
                                }}
                            />
                            {(formDataTouched?.username && formDataErrors?.username) && <p className="text-xs text-red-500 font-semibold">{formDataErrors.username}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600 ml-1">Password*</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <FaLock size={12} />
                                </span>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                    value={formData.password}
                                    maxLength={10}
                                    id="password"
                                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
                                        const _value = e.target.value;
                                        const _id = e.target.id;
                                        setFormData({ ...formData, [_id]:_value });
                                        const _error:string = validate(_id as keyof FormDataTypes,_value);
                                        setFormDataErrors((prev)=>({...prev, [_id]: _error}));
                                        setFormDataTouched((prev)=>({...prev, [_id]: true}));
                                    }}
                                />
                                {(formDataTouched?.password && formDataErrors?.password) && <p className="text-xs text-red-500 font-semibold">{formDataErrors.password}</p>}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600 ml-1">Confirm*</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <FaLock size={12} />
                                </span>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                    value={formData.confirmPassword}
                                    maxLength={10}
                                    id="confirmPassword"
                                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
                                        const _value = e.target.value;
                                        const _id = e.target.id;
                                        setFormData({ ...formData, [_id]:_value });
                                        const _error:string = validate(_id as keyof FormDataTypes,_value);
                                        setFormDataErrors((prev)=>({...prev, [_id]: _error}));
                                        setFormDataTouched((prev)=>({...prev, [_id]: true}));
                                    }}
                                />
                                {(formDataTouched?.confirmPassword && formDataErrors?.confirmPassword) && <p className="text-xs text-red-500 font-semibold">{formDataErrors.confirmPassword}</p>}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-primary-content to-accent text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 hover:cursor-pointer"
                    >
                        Create Account
                    </button>
                </form>

                <div className="text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm hover:underline"
                    >
                        <FaArrowLeft size={10} /> Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
