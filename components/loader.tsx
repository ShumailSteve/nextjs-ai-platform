import Image from "next/image";

export const Loader = () => {
    return (
        <div className="f-full flex items-center justify-center">
            <div className="h-10 w-10 relative animate-spin">
                <Image
                    alt="logo"
                    src="/logo.png"
                    fill
                />
            </div>
        </div>

    )
}