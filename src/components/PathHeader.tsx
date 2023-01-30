import React from "react";
import { FaAngleRight } from "react-icons/fa"
import { useAppSelector } from "../redux/hook";
import { selectDocManager } from "../redux/docManagerSlice";


type Props = {
    onClickPath: (path: string) => void
}   

export default function PathHeader({
    onClickPath
}: Props) {
    const currentKey: string = useAppSelector(selectDocManager);

    const pathList = React.useMemo(() => {
        return currentKey.split("/")
    }, [currentKey])

    return (
        <div className="flex my-4">
            { pathList.map((path: string, index: number) => (
                    <>
                        { index !== 0 &&
                            <FaAngleRight 
                                className="mx-3 text-gray-500"
                            /> 
                        }
                        <NavButton title={path} onClickPath={onClickPath} /> 
                    </>
                )
            )}
        </div>
    )
}

type PropsNav = {
    title: string,
    onClickPath: (path: string) => void
}

function NavButton({title, onClickPath}: PropsNav) {
    const name = title ? title : "My Drive";
    return (
        <button 
            className="bg-white hover:bg-gray-300 text-gray-800 font-bold py-2 px-3 rounded-sm inline-flex items-center"
            onClick={() => onClickPath(title)}
        >
            <span>{name}</span>
        </button>
    )
}