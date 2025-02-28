import { useState } from "react"
import { BsInstagram } from "react-icons/bs"
import { FaFacebook, FaJira, FaPlus } from "react-icons/fa"
import { ImNewTab } from "react-icons/im"
import { Link } from "react-router"
import { twMerge } from "tailwind-merge"

const Data = [
    {
        label: 'Facebook',
        to: 'https://www.facebook.com/',
        icon: FaFacebook,
    },
    {
        label: 'Facebook',
        to: 'https://www.facebook.com/',
        icon: FaJira,
    },
    {
        label: 'Facebook',
        to: 'https://www.facebook.com/',
        icon: BsInstagram,
    },
    {
        label: 'Facebook',
        to: 'https://www.facebook.com/',
        icon: FaPlus,
    },
    {
        label: 'Facebook',
        to: 'https://www.facebook.com/',
        icon: FaPlus,
    },
    {
        label: 'Facebook',
        to: 'https://www.facebook.com/',
        icon: FaPlus,
    },
]
const Main = () => {
    const [list, setList] = useState(Data);
    const [isOpen, setIsOpen]=useState(false);
    const [formData, setFormData]=useState({
        label: '',
        url: '',
    });
    const handleSubmit=()=>{
        setList((prev)=>([...prev, {label: formData?.label || "", to: formData?.url || "", icon: FaFacebook}]));
        setIsOpen(false);
    }
  return (
    <div className="bg-green-500">
        <h1>Office</h1>
        <div className="grid grid-cols-3 gap-2">
            {list?.map((itm:any)=>{
                const Icon = itm?.icon ?? null;
                return(
                    <Link to={itm?.to || "#"} target="_blank" className="border border-gray-500 flex gap-2 items-center">{Icon ? <Icon/>:null}{itm?.label || ""} <ImNewTab/></Link>
                )
            })}
            <button onClick={()=>{setIsOpen(true)}} className="border">Add More</button>
            <div className={twMerge("border hidden", isOpen && "block")}>
                <input id="label" type='text' placeholder="enter label" className="border" onChange={(e)=>setFormData((prev)=>({...prev, [e.target.id]:e.target.value}))}/>
                <input id="url" type="url" placeholder="enter url" className="border" onChange={(e)=>setFormData((prev)=>({...prev, [e.target.id]:e.target.value}))}/>
                <button type="submit" onClick={handleSubmit} className="border cursor-pointer">Submit</button>
            </div>
        </div>
    </div>
  )
}

export default Main;